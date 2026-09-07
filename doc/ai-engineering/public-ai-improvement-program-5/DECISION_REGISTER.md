# PBAI-P5 — 判断・公開台帳

## 開始前の準備判断（履歴）

ユーザー指示により独立した再検証の準備を実施した。同一候補C011-v1とbaselineを固定し、新規seed・旧データ除外・同じ主要gate・連続4時間監視を定めた。人工監視試験はPASS。新しい対局・性能・正確性系列は未実行であり、改善についての判断はない。

## 候補と過去結果

候補はPBAI-C011-v1の1件、追加候補は0件。旧候補を改名した成功扱いにはしない。P4はSTRENGTH-NON-ESTIMABLE / HOLDのまま。P1〜P3、C001〜C010の正式結果と未実行状態も維持する。

## 公開境界

公開判断はNO-RELEASE / KEEP-AI-GEN2。main統合・公開配備・default切替・世代昇格は未認可。P5の検証が成功しても公開変更を自動実行しない。AI-GEN3は予約名であり、Research Generation 4とは別である。

## 開始前の外部実行準備（履歴）

ユーザーの追加依頼に基づき、外部runner・途中保存・遠隔claim・読み取り専用の状態照会を追加した。科学的測定の前に実行環境の追補を固定し、従来のPROTOCOLと履歴は保持する。人工試験のみを実施し、正式seedは消費していない。

## 最終判断

全stageのgateと独立検算が成立し、EQUIVALENT-COMPUTATION-SPEEDUPおよびSTRENGTH-IMPROVED-IN-FROZEN-DOMAINと判断した。最終512局、256cluster、勝点率0.640625、cluster bootstrap 95％区間[0.611328125, 0.669921875]。全体2,417.183秒で資源条件も成立した。数値条件の事後変更はない。公開判断はNO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTIONのままである。[最終報告](PROGRAM_FINAL_REPORT.md)を正本とする。

## 結果確認後の公開認可

2026年9月6日、ユーザーは結果確認後に、PRレビュー、main統合、公開AIへの反映を進めるよう明示した。これにより`AWAITING-USER-INSTRUCTION`は解消し、`PUBLIC-INTEGRATION-AUTHORIZED / STAGED-ACTIVATION-AUTHORIZED`へ進む。事前固定した科学的判断や数値を変更する認可ではない。

`AI-GEN3`への正式昇格は別判断として未認可である。公開defaultへの反映後も、配信assetとブラウザー動作を確認し、正式な`ADOPT`および世代昇格を先取りしない。詳細は[main統合前の追加監査](INTEGRATION_READINESS_AUDIT.md)を参照する。

## 段階的公開後の判断

PR #107、#108、#109をmainへ統合し、2026年9月7日にmain `650b4312ed9cd318d9981523533dd692bdce6125`の公開assetと実サイトのbyte一致、Chrome相当経路のhard AI着手完了、サイト由来console errorなしを確認した。状態を`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`とする。

これは認可済みの段階的公開を完了した記録であり、正式な`ADOPT`、release ID発行、`AI-GEN3`昇格の判断ではない。公開AI系統は`AI-GEN2`を維持する。科学的判断、P4のHOLD、P1〜P3およびC001〜C010の既存結果は変更しない。[公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md)を公開後確認の正本とする。

## 正式採用とAI-GEN3昇格

2026年9月7日、ユーザーは正式`ADOPT`、release ID発行、`AI-GEN3`昇格を明示的に指示した。命名規則の9条件を再確認し、すべて成立したため、`PBAI-C011-v1`を正式に`ADOPT`し、`AI-GEN3-RELEASE-001`を発行し、公開AI系統を`AI-GEN2`から`AI-GEN3`へ昇格する。

この後続判断は、上記の履歴時点における未認可・保留状態を書き換えない。段階的公開と配信確認が完了した後に、新しい明示的認可として追加したものである。詳細な条件、適用範囲、一般化しない事項は[AI-GEN3正式昇格判断](PROMOTION_DECISION.md)を正本とする。
