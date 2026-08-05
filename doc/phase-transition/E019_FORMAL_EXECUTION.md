# E-019 固定ローカル正式実行手順

更新日: 2026-08-05  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: **Formal complete / `not-confirmed`**

> この文書はE-019の固定実行手順と、その完了状態を併記する。formal executionは完了済みであり、以下のpreflight / authorization / lock / run手順は再実行指示ではなく、実際に適用した実行契約の記録として保持する。

## 0. 完了状態

E-019はE-019固有formal開始承認後、fixed-local execution lockの下で26000局を生成し、`analyze → verify → evaluate`まで完了した。

- locked source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
- preregistration: `config/experiments/phase-transition-search-profile-generalization-v2.json`
- preregistration SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- locked execution policy SHA-256: `47d8b0df17eaa7fb9e878117d973bba91aba6963bbd65cecb8e0bcb0a939495c`
- execution lock status: `prepared-approved`
- formal corpus: `26000 / 26000`
- formal integrity: `mode=formal / valid=true / errors=[]`
- component decisions: D1 `pass`, D3 `fail`, V2 `pass`
- global IUT decision: **`not-confirmed`**
- final archive SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`

完了記録:

- `doc/phase-transition/checkpoints/2026-08-05-e019-formal-completion.md`
- `doc/phase-transition/checkpoints/2026-08-05-e019-final-bundle-audit.md`
- `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

Execution policy JSONはexecution lockでSHA-256固定されたformal inputである。**formal完了後の状態表示のためにpolicy JSONを事後編集しない。** 現在の科学的実行状態はexecution lock、formal integrity、evaluation result、completion checkpointを正本とする。

## 1. 固定済み科学条件

正本となる事前登録:

- `config/experiments/phase-transition-search-profile-generalization-v2.json`

v1は履歴として保持する。v2はformal data生成前に、sample-size planningの参考Nだけを訂正した版であり、選択sample size、seed、endpoint、decision ruleは変更していない。

Formal strata:

| stratum | evaluator | depth | comparison | paired seeds | games |
|---|---|---:|---|---:|---:|
| D1 | `bao` | 1 | `phase2` vs `legacy` | 6500 | 13000 |
| D3 | `bao` | 3 | `phase2` vs `legacy` | 4500 | 9000 |
| V2 | `bao-v2` | 2 | `phase2` vs `legacy` | 2000 | 4000 |
| total |  |  |  | 13000 | 26000 |

Formal seed block:

- D1: `20268001–20274500`
- D3: `20268001–20272500`
- V2: `20268001–20270000`

各stratum内でphase2/legacyはsame seed / same random-opening boundaryを要求する。strata間のseed overlapはnested-prefix designとして事前登録済みで、primary inferenceは各stratum内pairに限定する。

Primary:

- population: `pliesRemaining >= 9`
- unit: paired shared-seed game within stratum
- endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上存在するか
- test: two-sided exact McNemar
- component alpha: `0.05`
- minimum discordant pairs: `20 / stratum`
- direction: `phase2-only > legacy-only`
- global: D1/D3/V2すべて`pass`を要求するintersection-union test
- standalone stratum claim: Holm-Bonferroni, family alpha `0.05`

Structural trajectory-ply analysisはpreregistered secondaryのみで、paired game-level condition decisionまたはglobal IUT decisionを変更しない。

## 2. 実行状態の履歴

Execution policy:

- `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`

実際の遷移:

1. infrastructure validation完了時は`formalExecutionAllowed=false`で停止した。
2. fixed-local preflight成功後、E-019固有の明示的formal開始承認を受領した。
3. policyを`approved-awaiting-local-lock / formalExecutionAllowed=true`へ遷移した。
4. fixed-localでE-019専用execution lockを生成した。
5. locked source・runtime・preregistration・policyを変更せず26000局を完了した。
6. formal verify `valid=true`後にのみevaluateした。
7. final bundleをrepository外へ固定した。

E-011/E-017/E-018の承認・execution lockはE-019へ流用していない。GitHub Actions formal runは禁止のまま維持した。

## 3. 固定ローカル環境

実際にlockされたrepository:

```text
/home/oruorane/github/bao-la-kiswahili-game
```

固定環境:

- branch: `research/forced-capture-regime-analysis`
- locked source: `73ccd513218d7afa96fa637b366c3af2abca6323`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- architecture: x64
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`

venv名にE-011を含むが、E-011の科学条件・承認・execution lockを流用したものではない。E-019自身のlockでruntimeを再検証して固定した。

## 4. Formal authorization前local preflight契約

E-019固有formal承認の前には環境確認だけを許可した。実際に使用した確認手順:

```bash
cd /home/oruorane/github/bao-la-kiswahili-game

source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/forced-capture-regime-analysis
git pull --ff-only origin research/forced-capture-regime-analysis

which python3
python3 --version
python3 -c "import numpy, pandas; print('numpy', numpy.__version__, 'pandas', pandas.__version__)"
node --version
git rev-parse HEAD
git status --porcelain=v1
git check-ignore -q artifacts/phase-transition/search-profile-generalization-v2/.e019-ignore-probe && echo "corpus root ignored: yes"
```

確認された値:

- `which python3`: `/home/oruorane/.venvs/bao-phase-transition-e011/bin/python3`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- Node.js: `v24.6.0`
- branch: `research/forced-capture-regime-analysis`
- worktree: clean
- corpus root ignored: `yes`

承認前にはlock生成およびformal runを許可しなかった。

## 5. E-019固有formal開始承認契約

E-019 formal 26000局の開始には、過去experimentと分離した明示的ユーザー承認を要求した。

承認によって変更可能としたのはexecution policyの実行状態だけであり、次は変更しなかった。

- D1/D3/V2の条件
- paired sample sizes
- seed ranges
- candidate/regime thresholds
- `pliesRemaining >= 9`
- primary unit / endpoint
- exact McNemar
- component alpha
- minimum discordant pairs
- direction rule
- IUT global contract
- Holm standalone contract
- primary/secondary boundary

## 6. E-019専用execution lock

承認後、固定ローカルで次を実行してE-019専用lockを生成した。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game
source ~/.venvs/bao-phase-transition-e011/bin/activate

node tools/experiments/prepare-phase-transition-search-profile-generalization-execution.js
```

生成先:

```text
artifacts/phase-transition/search-profile-generalization-v2/execution-lock.json
```

実際のlock:

- `status: prepared-approved`
- `errors: []`
- `githubActions: false`
- source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
- clean worktree
- Node.js / Python / numpy / pandas一致
- `corpusRootIgnored: true`
- preregistration SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- execution-policy SHA-256: `47d8b0df17eaa7fb9e878117d973bba91aba6963bbd65cecb8e0bcb0a939495c`

lock後はformal completionまでpackage install/upgrade、`git pull`、source変更、branch変更を行わなかった。

## 7. Formal status契約

lock生成後、次でplanned countsを確認した。

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase status
```

Planned / completed:

- D1-P2: 6500 / 6500
- D1-LG: 6500 / 6500
- D3-P2: 4500 / 4500
- D3-LG: 4500 / 4500
- V2-P2: 2000 / 2000
- V2-LG: 2000 / 2000

## 8. Formal corpus生成契約

承認・lock・status確認後のみ、次を使用した。

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase run \
  --approval-token E-019-FORMAL-APPROVED
```

26000局を固定条件で完了した。

## 9. Formal analysis / verify / evaluate

全26000局完了後、次の順序を維持した。

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase analyze

node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase verify

node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase evaluate
```

`verify`結果:

- `mode: formal`
- `valid: true`
- `errors: []`
- all conditions present: true
- common source / source matches lock: true
- within-stratum seed pairing: true
- paired opening hashes: true
- nested seed prefixes: true
- condition identity clean: true
- artifact verification: true

Condition-level decision contract:

- `pass`: exact pair count + integrity + discordants >=20 + p<=0.05 + phase2-only>legacy-only
- `fail`: exact pair count + integrity + discordants >=20、ただしsignificance/direction不通過
- `insufficient`: integrity/pairing成功だがdiscordants <20
- `inconclusive`: corpus/source/hash/opening/pairing/output construction等のtechnical failure

Observed:

- D1: `pass`
- D3: `fail`
- V2: `pass`

Global contract:

- `confirmed`: D1/D3/V2すべて`pass`
- `not-confirmed`: 1 stratum以上が`fail`
- `inconclusive`: `fail`はないが1 stratum以上が`insufficient`またはtechnical `inconclusive`

したがってglobal formal decisionは**`not-confirmed`**。

D3では`phase2-only=13`、`legacy-only=140`、discordants=153、exact McNemar p=`4.614222568073049e-28`。availability不足ではなく事前登録方向の逆転による`fail`であり、結果後にdirection ruleを反転しない。

Holm-adjusted pはstandalone stratum claims用であり、D1/V2のstandalone confirmationでglobal IUTを救済しない。

## 10. Final export

final bundleは既存の恒久保管規則に従い、repository外へ固定した。

```text
/home/oruorane/bao-e019-exports/
```

保管ファイル:

```text
e019-final-formal-evaluation.tar.gz
e019-final-formal-evaluation.tar.gz.sha256
```

監査値:

- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- `sha256sum -c`: OK
- archive member count: `26120`
- unsafe path member: `0`
- reported archive size: `321M`

保管台帳:

- `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

## 11. 停止条件（実行時契約）

formal実行時は次の場合に停止する契約だった。

- E-019固有formal承認がない
- E-019専用execution lockがない / invalid
- worktreeがdirty
- branch / source commitがlockと不一致
- Node/Python/package version不一致
- GitHub Actions環境
- preregistration / policy hash不一致
- formal seed sequence不一致
- within-stratum opening hash不一致
- condition identity混在
- required output construction失敗

停止時に閾値、N、seed、direction、decision ruleを変更して継続しない。

## 12. 完了後の解釈境界

- E-019 formal global decisionは**`not-confirmed`**として固定する。
- D1とV2はphase2 > legacyのcomponent `pass`であり、Holm standaloneもconfirmed。
- D3は事前登録P2>LG方向が`fail`し、legacy > phase2の強い逆方向観測が得られた。
- D3逆転をE-019内で新しいconfirmatory claimへ事後変換しない。
- E-018 `confirmed`は固定`hard / bao / depth2`の範囲で維持し、E-019によって遡及変更しない。
- depth依存の非単調性やD3逆転機構を検証する場合は、新規仮説・新規事前登録・新規seed blockとする。
