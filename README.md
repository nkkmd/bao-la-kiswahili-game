# Bao la Kiswahili

Bao la Kiswahili is a static browser implementation of Bao with local two-player play and computer opponents. It runs from plain files, has no build step, and keeps all game logic in the browser.

The computer player has four levels:

| Level | Method |
| --- | --- |
| やさしい | Random legal move |
| ふつう | Random choice from the top evaluated one-ply moves |
| むずかしい | Iterative deepening with Minimax and Alpha-Beta pruning |
| ムタアラム | Longer search budget tuned by device tier |

All computer moves are generated and validated through the same rule engine used for human play.

## Features

- Static browser game under `public/`
- Local two-player mode
- South/North selection for computer games
- Bao rule engine with namua, mtaji, relay sowing, nyumba, captures, and win/loss checks
- Web Worker based AI search so the UI remains responsive during longer thinking
- PWA files for offline-capable deployment
- Node.js test suite for rules, AI, search, workers, tuning, and benchmark tools
- Reproducible AI benchmarks with seeds, paired openings, tactical regression tests, and saved artifacts

## Rule Basis

This implementation follows the `bao-la-kiswahili-ja` v0.1.0-draft R-002 rule basis. It implements capture obligations, namua, mtaji, relay sowing, nyumba, and win/loss detection.

`takasia` is not applied because complete source positions for validation are not yet confirmed. Relay sowing has a safety limit to prevent non-terminating play.

## Running Locally

Serve the `public/` directory with any static HTTP server and open `index.html`.

Example:

```sh
cd public
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Opening `public/index.html` through `file://` also works for most gameplay, but Service Worker features require HTTP(S).

## Deployment

For Cloudflare Pages or another static host, set the publish directory to:

```text
public/
```

## Tests

Run an individual test:

```sh
node test/engine.test.js
```

Run the full test suite:

```sh
for f in test/*.test.js; do node "$f" || exit 1; done
```

## AI Benchmarking

Run a reproducible fixed-depth benchmark:

```sh
node tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal --time-limit 0 --max-depth 2
```

Run tactical regression tests:

```sh
node test/tactical.test.js
```

Diagnostic tactical output:

```sh
BAO_TACTICAL_DIAG=1 node test/tactical.test.js
```

Detailed benchmark conditions and baseline results are documented in [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md).

## Project Layout

| Path | Purpose |
| --- | --- |
| `public/` | Static game files for deployment |
| `public/engine.js` | Board state, legal move generation, and move application |
| `public/ai.js` | Computer move selection, evaluation, and search |
| `public/ai-weights.js` | Default evaluation weights |
| `public/ai-worker.js` | Background AI search worker |
| `public/ai-config.js` | Device-tier search settings |
| `tools/` | Benchmarks, tuning scripts, and experiment runners |
| `test/` | Regression tests |
| `artifacts/` | Saved benchmark and tuning outputs |
| `doc/` | Roadmaps, benchmark notes, development logs, and technical report |

## Documentation

- [`doc/BAO_AI_TECHNICAL_REPORT.md`](doc/BAO_AI_TECHNICAL_REPORT.md): public-facing Bao AI technical report
- [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md): benchmark commands and baseline results
- [`doc/AI_DEVELOPMENT_LOG.md`](doc/AI_DEVELOPMENT_LOG.md): design decisions, failed trials, and limitations
- [`doc/AI_ROADMAP.md`](doc/AI_ROADMAP.md): completed Phase 0-5 AI roadmap
- [`doc/AI_ADVANCED_ROADMAP.md`](doc/AI_ADVANCED_ROADMAP.md): Phase 6+ roadmap and future improvement notes
- [`doc/SYSTEM_DESIGN.md`](doc/SYSTEM_DESIGN.md): system structure and responsibilities

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
