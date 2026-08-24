# VOCABULARY — Symmetry / Isomorphic Positions Study 1

- **raw rule state**: stable representation of `pits,reserve,houseOwned,player,phase,winner,pending` without symmetry reduction.
- **exact move**: one top-level move variant identified by `type,phase,row,index,direction,side,houseChoice,houseTwo`.
- **rule-semantic transform**: a state/player/move mapping tested against rule transitions, not visual appearance.
- **graph isomorphism**: exact state/edge bijection with transition commutation and terminal/winner equivariance over an explicit domain.
- **bounded local graph**: all exact legal edges expanded from frozen roots up to a frozen finite depth; not a complete phase or game graph.
- **complete forward closure**: all exact successors recursively included until normative terminals or certified recurrence; the prior exact oracle uses this stronger construct.
- **historically reachable**: reachable from the fixed repository standard initial state by a replayable exact move witness.
- **transformed-initial replay**: witness replay from `T(initialState)`; this does not by itself prove reachability from the fixed raw standard initial state.
- **seat swap**: numeric player permutation `0 <-> 1` plus exchange of player-indexed arrays.
- **local left/right reflection**: within each player's row, index `i -> 7-i`, with left/right direction and side flipped.
- **validated transformation set**: transforms individually validated in a common frozen scope.
- **symmetry group**: reserved for a transform set with explicit identity, closure, inverse and composition verification. Individual passing candidates are not automatically called a group.
- **canonicalization**: deterministic representative selection from an orbit generated only by validated transforms.
- **administrative cutoff**: runtime/resource safeguard that is not a Bao terminal rule.
