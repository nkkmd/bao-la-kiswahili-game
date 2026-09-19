from pathlib import Path


def replace_exact(path, old, new):
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one match, found {count}: {old[:100]!r}")
    p.write_text(text.replace(old, new), encoding="utf-8")


# Research index.
replace_exact("doc/RESEARCH_INDEX.md", "更新日: 2026-09-18", "更新日: 2026-09-20")
replace_exact(
    "doc/RESEARCH_INDEX.md",
    "現在の状態: **Research Generation 2・3は完了済み。Research Generation 4はG4-01完了、G4-02 authorization reviewはPREREQUISITE-REQUIRED**",
    "現在の状態: **Research Generation 2・3は完了済み。Research Generation 4はG4-01完了、G4-02はCLOSED / NO SCIENTIFIC DECISION**",
)
replace_exact(
    "doc/RESEARCH_INDEX.md",
    "| G4-01の正式結果 | [`local-game-tree-geometry-transfer-compatibility-instrument/README.md`](local-game-tree-geometry-transfer-compatibility-instrument/README.md) |",
    "| G4-01の正式結果 | [`local-game-tree-geometry-transfer-compatibility-instrument/README.md`](local-game-tree-geometry-transfer-compatibility-instrument/README.md) |\n| G4-02の正式状態 | [`structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) |",
)
replace_exact(
    "doc/RESEARCH_INDEX.md",
    "| `G4-02` | corridor / tree-graph transfer | `PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED` |",
    "| `G4-02` | corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION` |",
)
replace_exact(
    "doc/RESEARCH_INDEX.md",
    "G4-02は2026-09-18にpost-G4-01 current-state authorization reviewを実施し、`PREREQUISITE-REQUIRED`となりました。G4-01保存記録ではformal heldoutに必要なopening-prefix identity分離を完全には監査できないため、旧seedを再読せずにこのprerequisiteを解消した後、authorization reviewを再実施します。G4-03/G4-04は引き続き個別authorization reviewが必要です。G4-01完了によって自動的にscientific executionが承認されることはありません。",
    "G4-02はprerequisite解消後にStudy 1〜4をprospectiveに実施しました。Study 4ではStage 1が`FORMAL-PREPARATION-ELIGIBLE`となりましたが、Stage 2 canonical one-shot executionがformal measurement前のmandatory `bundle-source`工程で停止したため、最終裁定は`TECHNICAL-INVALID`です。8-cell formal decision vectorは生成されず、G4-02は`CLOSED / NO SCIENTIFIC DECISION`で終了しました。これはC1/C6の一般化失敗やcounterexampleを示すnegative scientific evidenceではありません。G4-03/G4-04は引き続き個別authorization reviewが必要です。",
)

# Future agenda.
replace_exact("doc/FUTURE_RESEARCH_AGENDA.md", "Version: 5.2.0", "Version: 5.3.0")
replace_exact("doc/FUTURE_RESEARCH_AGENDA.md", "更新日: 2026-09-18", "更新日: 2026-09-20")
replace_exact(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "Research Generation 4: **Program plan frozen / G4-01 complete / G4-02 SFCDFT-STUDY1 Stage 1 technical-invalid (2026-09-18)**（G4-01完了・G4-02 Stage 1は技術的不成立）",
    "Research Generation 4: **Program plan frozen / G4-01 complete / G4-02 closed without scientific decision (2026-09-20)**（G4-01完了・G4-02は科学的判定なしで終了）",
)
replace_exact(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "G4-02 = SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION\nG4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED",
    "G4-02 = CLOSED / NO SCIENTIFIC DECISION\nG4-02 final Stage 2 = TECHNICAL-INVALID / FORMAL MEASUREMENT NOT STARTED",
)
replace_exact(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION` |",
    "| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION` |",
)
old_future = """G4-02では、initial authorization reviewの`PREREQUISITE-REQUIRED`を、旧G4-01 seedを再読・rerunせずにlegacy limitationを明示したmethodology amendmentとidentity-only firewallで解消しました。authorization review V2で正式Study `SFCDFT-STUDY1`のprospective設計が承認され、Stage 0は`PASS`しました。

その後、別のpre-access binding / execution authorizationを通してStage 1 fresh compatibility populationを一度だけ実行しました。primary 384 slotsのうち375件はsealed sourceとなりましたが、9件がmandatory first-16 opening-prefix serializer invariantを満たせずdeterministic failureとなりました。frozen protocolのdecision mappingを適用し、Stage 1を`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`として閉じました。

375件を用いたseed-free recovery、primary rerun、failed-slot repair、paired reserveによる置換は行っていません。Stage 2も未認可・未アクセスで、seed readsは0です。したがってG4-02からgeneralization / counterexampleについてpositive/negativeいずれの科学的updateも得ていません。"""
new_future = """G4-02では、prerequisite解消後にStudy 1〜4をそれぞれprospective boundaryとして実施しました。Study 1・2はStage 1 technical failureでfail-closed、Study 3はStage 1を通過したもののStage 2 `bundle-source`でtechnical-invalidとなりました。Study 4ではfresh access前のend-to-end artifact-pipeline validationを追加し、Stage 0をPASS、Stage 1を`FORMAL-PREPARATION-ELIGIBLE`として通過しました。

Study 4 Stage 2 canonical one-shot run `35450625402` は768/768 primary source acquisitionと`classify-final ready=true`まで到達しましたが、mandatory `bundle-source`工程が`source identity mismatch`で停止し、formal measurementとaggregateは開始されませんでした。sealed canonical artifactsだけを調べるidentity-only auditではtop-level identity mismatchを再現できませんでしたが、no-rerun/no-rescue規則に従ってformal resultの救済生成は行っていません。

したがってG4-02の最終状態は`CLOSED / NO SCIENTIFIC DECISION`です。C1/C6のgeneralization、counterexample、NOT-CONFIRMED、NON-ESTIMABLEのいずれもformalには判定していません。このtechnical closureをnegative scientific evidenceへ読み替えません。"""
replace_exact("doc/FUTURE_RESEARCH_AGENDA.md", old_future, new_future)
replace_exact(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "G4-02では`SFCDFT-STUDY1`をprospectiveに開始しましたが、Stage 1 serializer integrity violationによって`TECHNICAL-INVALID / NO-DECISION`で閉じました。このtechnical failureをC1/C6の一般化失敗や反例として扱ってはいけません。\n\nG4-02の同じ科学課題を再検証する場合は`SFCDFT-STUDY1`をrepair/reopenせず、今回のfailureをtechnical development informationとして扱います。新しいStudy / Stage identity、新しいfresh seed namespace、short trajectoryを明示的に扱うserializer contract、prior G4-02 populationを除外するfreshness firewallを結果前に固定し、新しいauthorization reviewから開始します。",
    "G4-02はStudy 1〜4をprospectiveに実施した結果、最終Stage 2がformal measurement前のtechnical failureで停止し、`CLOSED / NO SCIENTIFIC DECISION`となりました。このclosureをC1/C6の一般化失敗、反例、effect不在として扱ってはいけません。\n\n同じ科学課題を将来再検討する場合はG4-02をrepair/reopenせず、別Agendaまたは新しいprospective Study identityとしてauthorizationから開始します。G4-02のclosed scientific executionやseedを救済目的で再利用しません。",
)

# Root README.
replace_exact(
    "README.md",
    "この結果はcompatibility/readinessのみを示し、G3由来claimのfresh-domain一般化、effect direction・effect size、counterexampleの成立／不成立を確認したものではありません。G4-02はeligibility gate通過後のauthorization reviewで`PREREQUISITE-REQUIRED`となり、scientific executionは未承認です。G4-03、G4-04もeligibility gateを満たしていますが未承認です。各Studyは個別のauthorization reviewを必要とし、G4-10のdepth 11も引き続き未承認・未アクセスです。",
    "この結果はcompatibility/readinessのみを示し、G3由来claimのfresh-domain一般化、effect direction・effect size、counterexampleの成立／不成立を確認したものではありません。G4-02はその後Study 1〜4をprospectiveに実施しましたが、最終Study 4のStage 2がformal measurement前のmandatory artifact工程で`TECHNICAL-INVALID`となり、**`CLOSED / NO SCIENTIFIC DECISION`**で終了しました。これはC1/C6の一般化失敗や反例を示すnegative scientific evidenceではありません。G4-03、G4-04はeligibility gateを満たしていますが未承認です。各Studyは個別のauthorization reviewを必要とし、G4-10のdepth 11も引き続き未承認・未アクセスです。",
)
replace_exact(
    "README.md",
    "- [G4-01 / LGTTCI-STUDY1](doc/local-game-tree-geometry-transfer-compatibility-instrument/README.md)",
    "- [G4-01 / LGTTCI-STUDY1](doc/local-game-tree-geometry-transfer-compatibility-instrument/README.md)\n- [G4-02 / corridor・tree/graph transfer 最終状態](doc/structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)",
)
