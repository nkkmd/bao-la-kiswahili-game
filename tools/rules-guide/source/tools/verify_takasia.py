"""Verify E30 from K.I.B.A. §4.5; not a complete Bao game engine.

Physical columns are left-to-right from South. Each player's sowing ring
is front columns 1..8 followed by back columns 8..1. Thus North front
index 4 is a4, facing South A5. Both houses are unowned in this fixture.
Run from the repository root: python3 tools/verify_takasia.py
"""

import json


def ring(front, back):
    return front + list(reversed(back))


def captures(board, opponent_front):
    """List first-sow captures, with the adopted 2..15 starting limit."""
    result = []
    for start, count in enumerate(board):
        if 2 <= count <= 15:
            for direction in (-1, 1):
                end = (start + direction * count) % 16
                if end < 8 and board[end] > 0 and opponent_front[end] > 0:
                    result.append((start, direction, end))
    return result


def takata(board, start, direction, blocked=None):
    """Sow without captures; stop only at an empty endpoint or blocked pit."""
    board = list(board)
    trace = []
    seen = set()
    while True:
        state = (tuple(board), start, direction)
        if state in seen:
            raise RuntimeError("Non-terminating move in fixture")
        seen.add(state)
        count, board[start] = board[start], 0
        assert count > 0 and start != blocked
        end = start
        for _ in range(count):
            end = (end + direction) % 16
            board[end] += 1
        trace.append((start, count, end))
        if end == blocked or board[end] == 1:
            return board, trace
        start = end


def block_target(attacker, defender, owned_house_index=None):
    """Evaluate a post-takata board, not a lookahead over defender replies."""
    if captures(defender, attacker[:8]):
        return None
    targets = {move[2] for move in captures(attacker, defender[:8])}
    if len(targets) != 1:
        return None
    target = next(iter(targets))
    front = defender[:8]
    if front[target] < 2 or target == owned_house_index:
        return None
    if sum(n > 0 for n in front) == 1 or sum(n > 1 for n in front) == 1:
        return None
    return target


def verify():
    north = ring([10, 0, 0, 10, 2, 1, 0, 1], [0, 1, 2, 1, 4, 8, 2, 2])
    south = ring([0, 2, 0, 0, 1, 1, 0, 0], [0, 0, 2, 2, 0, 2, 6, 4])
    assert sum(south) + sum(north) == 64

    # Constructed predecessor, not a source-recorded game position.
    before = ring([0, 2, 0, 0, 0, 0, 2, 0], [0, 0, 2, 2, 0, 2, 6, 4])
    assert not captures(before, north[:8])
    after, trace = takata(before, 6, -1)
    assert after == south and trace == [(6, 2, 4)]

    assert captures(north, south[:8]) == []
    assert captures(south, north[:8]) == [(8, -1, 4)]
    assert block_target(south, north) == 4

    # Front-row priority; blocked a4 cannot be selected to start a move.
    starts = [i for i in range(8) if north[i] >= 2 and i != 4]
    assert starts == [0, 3]
    expected = [(1, 6, 2), (5, 4, 5), (2, 6, 2), (10, 5, 6)]
    responses = []
    for start in starts:
        for direction in (-1, 1):
            result, trace = takata(north, start, direction, blocked=4)
            assert sum(result) + sum(south) == 64
            assert captures(south, result[:8]) == [(8, -1, 4)]
            observed = (len(trace), trace[-1][2], result[4])
            assert observed == expected[len(responses)]
            if start == 0 and direction == 1:
                assert trace == [(0, 10, 10), (10, 9, 3), (3, 12, 15),
                                 (15, 2, 1), (1, 3, 4)]
            responses.append({"start": f"a{8 - start}",
                              "front_direction": "left" if direction < 0 else "right",
                              "sowings": len(trace), "last_pit": f"a{8 - trace[-1][2]}",
                              "a4_count": result[4]})

    # Published counterexample has 56 seeds: a local illustration only.
    north_ex = ring([0, 1, 0, 0, 10, 0, 0, 0], [7, 4, 2, 4, 1, 3, 2, 0])
    south_ex = ring([0, 0, 1, 0, 1, 1, 1, 3], [0, 4, 2, 0, 2, 2, 5, 0])
    assert sum(north_ex) + sum(south_ex) == 56
    assert not captures(north_ex, south_ex[:8])
    assert {move[2] for move in captures(south_ex, north_ex[:8])} == {4}
    assert block_target(south_ex, north_ex) is None
    return {"status": "PASS", "seed_total": 64, "target": "a4",
            "responses": responses, "partial_counterexample_total": 56}


if __name__ == "__main__":
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
