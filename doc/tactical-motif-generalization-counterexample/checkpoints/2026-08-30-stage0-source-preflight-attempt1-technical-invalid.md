# 2026-08-30 — Stage 0 source preflight第1試行のtechnical-invalid execution

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## executionの識別情報

- workflow run: `33285427882`
- source commit: `0ac764e94408b4d286cb42ca031d5a54484848b2`
- frozen technical seeds: `8090001..8090128`

## 判断

**`TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`**

GitHub Actionsのworkflow結論は`success`だったが、job log監査でrunner本体が`ReferenceError: projected256GameShardWallSeconds is not defined`によりresult JSON生成前にexit 1していたことを検出した。shell pipelineが`tee`のexit codeを返したため、workflowが誤ってsuccessとして扱われた。

したがってattempt 1から`SOURCE-PREFLIGHT-PASS`または`SOURCE-PREFLIGHT-FAIL`を宣言しない。Stage 0 terminal dispositionも変更しない。

## 許可する修正範囲

scientific outcomeは生成しておらず、Stage 1 / Stage 2 scientific seedsも未消費である。technical seed block、technical population、8 strata、eligibility rule、diversity gates、resource gatesは一切変更しない。

修正は以下の純粋なtechnical defectsに限定する。

1. result object内の未定義variable名を、すでに計算済みの`projectedShardWallSeconds` / `projectedShardCompactGzipBytes`へ正しくbindingする。
2. workflowに`set -o pipefail`を追加し、runner failureをCI successとして隠さない。

同一のfrozen technical seeds `8090001..8090128`でexact rerunする。seed追加、gate緩和、source-policy変更は行わない。
