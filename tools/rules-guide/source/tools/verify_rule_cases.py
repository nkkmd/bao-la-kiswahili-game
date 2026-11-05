"""Independent calculations for the limited cases documented in validation-cases.md.

Not a full Bao engine: no general legal-move search, game replay or player procedure.
Physical columns run left-to-right from South. R-004 recurrence is an open discrepancy.
"""

import json


def ring(front, back):
    return list(front) + list(reversed(back))


def sow(board, start, count, direction, capture=False):
    """Captures include the kichwa itself; a lifted pit's sowing skips that pit."""
    end = start - direction if capture else start
    for _ in range(count):
        end = (end + direction) % 16
        board[end] += 1
    return end


def relay(board, start, direction, house=None):
    trace = []
    seen = set()
    while True:
        state = (tuple(board), start, direction)
        if state in seen:
            raise ValueError("Unexpected infinite relay in a finite teaching case")
        seen.add(state)
        count, board[start] = board[start], 0
        assert count > 0
        end = sow(board, start, count, direction)
        trace.append([start, count, end])
        if board[end] == 1 or (end == house and board[end] >= 6):
            return trace
        start = end


def recurrence(extra, batched=False):
    board = ring([1, 6, 3, 1, 0, 5, 4, 0], [2, 1, 0, 5, 0, 3, 0, 1])
    board[2] += extra
    start, seen = 2, {}
    while True:
        state = (tuple(board), start)
        if state in seen:
            return len(seen) - seen[state]
        seen[state] = len(seen)
        count, board[start] = board[start], 0
        if batched:
            laps, remaining = divmod(count, 16)
            board = [n + laps for n in board]
            end = start
            for offset in range(1, remaining + 1):
                end = (start - offset) % 16
                board[end] += 1
        else:
            end = sow(board, start, count, -1)
        if board[end] == 1:
            return None
        start = end


def verify():
    # V01: 64-seed constructed mtaji board; A4 is the only possible start.
    south = ring([1, 0, 0, 16, 0, 0, 0, 0], [0] * 8)
    north = ring([1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 46])
    assert sum(south) + sum(north) == 64
    assert [i for i, n in enumerate(south) if 2 <= n <= 15] == []
    for direction in (-1, 1):
        result = south.copy()
        assert relay(result, 3, direction) == [[3, 16, 3]]
        assert result == [2] + [1] * 15
        assert sum(result) + sum(north) == 64

    # V02: actual opening pair, R-001 p.151: A7L, a5R.
    south = ring([0, 0, 0, 0, 6, 2, 2, 0], [0] * 8)
    north = ring([0, 2, 2, 6, 0, 0, 0, 0], [0] * 8)
    assert not any(a and b for a, b in zip(south[:8], north[:8]))
    south[6] += 1
    assert relay(south, 6, -1, house=4) == [[6, 3, 3]]
    assert south[:8] == [0, 0, 0, 1, 7, 3, 0, 0]
    assert sum(south) + sum(north) + 21 + 22 == 64
    north[3] += 1
    count, south[3] = south[3], 0
    assert count == 1
    assert sow(north, 0, count, 1, capture=True) == 0
    assert north[:8] == [1, 2, 2, 7, 0, 0, 0, 0]
    assert south[:8] == [0, 0, 0, 0, 7, 3, 0, 0]
    assert sum(south) + sum(north) + 21 + 21 == 64

    # V03: constructed namua capture reaches an owned house with 5 or 6 seeds.
    results = []
    for house_before in (4, 5):
        south = ring([0, 0, 2, 0, house_before, 0, 0, 0], [0] * 8)
        north = ring([1, 0, 5, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 0, 0, 54 - house_before])
        assert sum(south) + sum(north) + 1 + 1 == 64
        south[2] += 1
        captured, north[2] = north[2], 0
        assert sow(south, 0, captured, 1, capture=True) == 4
        assert north[4] == 0 and south[4] == house_before + 1
        may_stop = south[4] >= 6
        continued = south.copy()
        trace = relay(continued, 4, 1)
        expected = [1, 1, 4, 1, 0, 1, 1, 1] + [1] * (house_before - 2) + [0] * (10 - house_before)
        assert continued == expected
        assert trace == [[4, house_before + 1, house_before + 5]]
        assert sum(continued) + sum(north) + 1 == 64
        assert sum(south) + sum(north) + 1 == 64
        results.append({"arrival_count": south[4], "may_stop": may_stop,
                        "continued_endpoint_ring_index": trace[-1][2]})

    # V03 supplement: a six-seed owned house is the only occupied front pit.
    for direction in (-1, 1):
        south = ring([0, 0, 0, 0, 6, 0, 0, 0], [0] * 8)
        north = ring([1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 55])
        assert sum(south) + sum(north) + 1 + 1 == 64
        south[4] += 1
        south[4] -= 2
        assert sow(south, 4, 2, direction) == 4 + 2 * direction
        assert south[4] == 5 and sum(south) + sum(north) + 1 == 64

    # V04: leftward approach to left kimbi, then rightward sowing from A1.
    south = ring([0, 1, 0, 2, 0, 0, 0, 1], [0] * 8)
    north = ring([0, 1, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 58])
    assert sum(south) + sum(north) == 64
    count, south[3] = south[3], 0
    assert sow(south, 3, count, -1) == 1 and south[1] == 2
    captured, north[1] = north[1], 0
    assert captured == 1
    assert sow(south, 0, captured, 1, capture=True) == 0 and south[0] == 1
    assert south == [1, 2, 1, 0, 0, 0, 0, 1] + [0] * 8
    assert sum(south) + sum(north) == 64

    # V05: distinguish a measured cycle from the paper's reported period of 218.
    assert recurrence(1) == recurrence(1, batched=True) == 228
    assert recurrence(0) is None
    return {"status": "PASS", "scope": "V01–V04 calculations and V05 discrepancy reproduction",
            "V01_directions": 2, "V02_recorded_plies": 2, "V03": results,
            "V05_observed_cycle": 228, "V05_published_period": 218,
            "V05_resolution": "OPEN; not a verified teaching example"}


if __name__ == "__main__":
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
