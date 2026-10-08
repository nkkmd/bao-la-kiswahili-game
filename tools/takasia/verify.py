"""限定されたtakasia検証。公開エンジンは読み込まない。"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def linear(pits):
    return pits[0] + pits[1][::-1]


def capture_options(state, player):
    own = linear(state['pits'][player])
    other = state['pits'][1 - player][0]
    result = []
    for start, count in enumerate(own):
        if not 2 <= count <= 15:
            continue
        for step in (-1, 1):
            end = (start + count * step) % 16
            if end < 8 and own[end] and other[7 - end]:
                result.append((start, step, 7 - end))
    return result


def target(state, attacker, move):
    if state['winner'] is not None or state['phase'] != 'mtaji':
        return None
    if move['phase'] != 'mtaji' or move['type'] != 'takata':
        return None
    defender = 1 - attacker
    if capture_options(state, defender):
        return None
    targets = {item[2] for item in capture_options(state, attacker)}
    if len(targets) != 1:
        return None
    index = targets.pop()
    front = state['pits'][defender][0]
    if front[index] < 2 or sum(bool(n) for n in front) == 1:
        return None
    if sum(n >= 2 for n in front) == 1:
        return None
    if index == 4 and state['houseOwned'][defender]:
        return None
    return {'player': defender, 'index': index}


def takata_rows(state, start, step, blocked):
    """全周を商で配る。JavaScript側の1個ずつの計算と照合する。"""
    board = linear(state['pits'][state['player']])
    seen = set()
    trace = []
    while True:
        key = (tuple(board), start)
        if key in seen:
            raise ValueError('Non-terminating fixture')
        seen.add(key)
        assert start != blocked
        count, board[start] = board[start], 0
        quotient, remainder = divmod(count, 16)
        board = [value + quotient for value in board]
        for offset in range(1, remainder + 1):
            board[(start + offset * step) % 16] += 1
        end = (start + count * step) % 16
        trace.append({'start': start, 'count': count, 'end': end})
        if end == blocked or board[end] == 1:
            return [board[:8], board[8:][::-1]], trace
        start = end


def verify():
    fixture = json.loads((ROOT / 'tools/takasia/fixtures.json').read_text())
    for case in fixture['detectionCases']:
        state = case['state']
        total = sum(sum(row) for side in state['pits'] for row in side)
        total += sum(state['reserve']) + sum(state['pending'])
        assert total == 64, case['id']
        assert target(state, case['attacker'], case['previousMove']) == case['expected'], case['id']
    e30 = fixture['e30']
    for response in e30['responses']:
        result, trace = takata_rows(e30['post'], response['start'], response['step'], 3)
        assert result == response['pits'], response
        assert len(trace) == response['sowings'], response
        assert trace[-1]['end'] == response['end'], response
        assert result[0][3] == response['targetCount'], response
        other = e30['post']['pits'][1 - e30['post']['player']]
        assert sum(map(sum, result)) + sum(map(sum, other)) == 64
    for case in fixture['sowingCases']:
        result, trace = takata_rows(case['state'], case['start'], case['step'], 3)
        assert result == case['expectedPits']
        assert len(trace) == case['sowings'] and trace[-1]['end'] == case['end']
    return {'status': 'PASS', 'detectionCases': len(fixture['detectionCases']),
            'e30Responses': len(e30['responses']), 'seedTotal': 64,
            'additionalSowingCases': len(fixture['sowingCases']),
            'scope': 'fixture-only; not a full independent Bao engine'}


if __name__ == '__main__':
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
