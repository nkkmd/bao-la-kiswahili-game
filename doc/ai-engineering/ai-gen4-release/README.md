# AI-GEN4の正式昇格と表示配信

本書の配信証拠は2026年9月11日の評価器・世代表示更新時点を対象とします。22ファイルの照合一覧とキャッシュv36・v37は当時の固定記録です。その後の難易度名変更・図解ルール追加で公開ファイル構成とキャッシュ番号が更新されているため、現在の配信対象は[ルートREADME](../../../README.md#デプロイ)と`public/`全体を参照してください。過去のmanifestを現行ツリーへ合わせて書き換えません。

## 現在の判断

2026年9月11日、正式release IDを`AI-GEN4-RELEASE-001`として発行し、公開AIをAI-GEN4へ正式昇格した。ユーザーの明示指示、hard・expertの正式採用、両難易度を既定有効にした本番配信と全22ファイルの照合を根拠とする。採用済み候補の配信を確認してから昇格する既存規則に従う。

本番の評価器は配信内容確認済みである。**AI-GEN4の画面表示更新もmain統合・本番配信・配信内容確認が完了した。** アプリのバージョンタグは発行・変更しない。

## 世代の適用範囲

AI-GEN4は「hard・expertに論理ゲート型評価器PBAI-C015-v1を正式採用した公開AI世代」と定義する。探索、ルール、軽量局面遷移はAI-GEN3を継承する。評価器という主要機構の更新であり、単なる表示修正を理由とする昇格ではない。

| 難易度・条件 | 評価構成 |
| --- | --- |
| hard・expertの既定bao／phase2 | PBAI-C015-v1 |
| easy・normal | 従来構成を維持。論理ゲート型評価器の棋力改善を主張しない |
| 明示的な別profile・独自重み・補正 | 候補の適用対象外 |
| hard・expertの候補取得失敗・切戻し | AI-GEN3基準へ復帰 |

通常の画面表示は`AI-GEN4 / 難易度`とする。hard・expertの基準構成への復帰時は`AI-GEN3`を示し、実際の使用構成を区別する。採用判断IDはhardが`PBAI-C015-HARD-ADOPTION-001`、expertが`PBAI-C015-EXPERT-ADOPTION-001`であり、世代release IDと別の項目として保持する。

## 棋力・運用の根拠と限界

hardの正式採用は[P8・P9と実機確認に基づく採用判断](../pbai-c015-adoption-review/ADOPTION.md)、expertは[P11の独立再試験と実機確認に基づく採用判断](../public-ai-improvement-program-11/ADOPTION.md)を引き継ぐ。expertの低・標準・高設定は各256局、勝敗は146対110、146対110、141対115で、事前に固定した各条件と独立検算を通過した。P8・P9の結果をexpertの試験結果へ加算しない。

実機はmoto g52j 5G、Android 12、Chrome 152.0.7977.75、実機用サイトで約20分、ユーザーから全項目問題なしと報告された。本番用コードは3ブラウザ各10項目で確認済みである。これらと本番配信ファイル照合を区別する。本番配信後の再対局、実機ピークメモリ、実機オフライン操作は未確認である。P6・P7・P10のHOLDや技術的無効、凍結結果・seed・モデル・hashは保持する。

## 本番配信の証拠

ユーザーがmain `2078f4c93c18c56e013ef525d4d84b35746c7437`を配信したとの連絡後、2026年9月11日04:27 UTCに照合を完了した。公開22ファイルのうち19ファイルは完全一致した。index.htmlとprivacy.htmlはCloudflareのchallenge script挿入、robots.txtはCloudflare管理ブロックの先頭追加だけで、元の全byteが順序どおり保持されることを確認した。

[照合結果](../../../artifacts/pbai-c015-expert-production/deployment/verification.json)に取得hash・元hash・追加位置と追加部分のhashを記録する。異なる3ファイルの取得内容は同じディレクトリに保存した。これは配信時の原文証拠であり、英語のCloudflare付加文や機械的scriptを翻訳しない。配信状態は`DEPLOYED-ASSETS-VERIFIED`である。

## 表示更新の検証と完了状態

AI-GEN3の正式5資産とそのhash検証を保持し、公開アダプターにAI-GEN4の世代定数と採用判断IDを分けて追加した。画面初期表示と動的表示を更新し、キャッシュをv37へ更新する。探索条件や候補内部のコードは変更しない。Node21試験は合格した。画面表示を検査する既存試験のみ新しい世代名へ更新し、固定AI資産の検証は弱めていない。

検証commitは`718d83c22b08e76651ab5427ccaefa8f8b4c5a74`。[3ブラウザ確認](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34562679198)と[AI-GEN3正式資産検証](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34562679219)は成功した。Chromium 151.0.7922.34、Firefox 153.0、WebKit 26.5の各10項目が合格し、[取得した結果](../../../artifacts/ai-gen4-release/)を保存した。表示確認と運用確認であり、新しい棋力試験や実機試験ではない。

[PR #132](https://github.com/nkkmd/bao-la-kiswahili-game/pull/132)で、main `1a8135fa2ef9dc951fbb73599269bbb1b92bba9f`へ統合した。ユーザーが後続main `82241a05932b14c8e0383a3e1ff61155da8f8965`のpublic全22ファイルを本番へ再配信し、[表示更新用照合一覧](PUBLIC_MANIFEST.json)との照合が完了した。キャッシュは`bao-la-kiswahili-v37`。正式判断は[release記録](AI-GEN4-RELEASE-001.json)を参照する。2026年9月11日04:45 UTCの確認でも19ファイルが完全一致、3ファイルはCloudflareの追加のみだった。[再配信の照合結果](../../../artifacts/ai-gen4-release/deployment/verification.json)と差分対象3ファイルの原文を保存した。

取得した配信JavaScriptをNodeの隔離コンテキストで評価し、全難易度のAI-GEN4正式ID、hard・expertだけの候補有効化、採用判断IDを確認した。HTML初期表示とキャッシュv37も確認した。[表示識別の確認結果](../../../artifacts/ai-gen4-release/deployment/identity-verification.json)に方法を記録する。これは本番ブラウザの描画・再対局を実施した記録ではない。

今回依頼された正式採用から表示配信確認までの工程は完了した。追加の配信操作は不要である。今後、本番での再対局・実機確認を行った場合は、その報告を別途記録する。

## 切戻し

expertだけを戻すときは`PBAI_C015_EXPERT_ENABLED`をfalseにする。hardの設定は維持する。両方を戻す場合はhardの`PBAI_C015_ENABLED`もfalseにする。いずれも未使用の新しいキャッシュ番号を用い、public一式を配信する。候補を戻した難易度はAI-GEN3基準表示となる。正式な採用・昇格の履歴は削除せず、切戻し状態を別途記録する。

## 日本語品質監査

対象は本書、世代命名規則、ルートREADME、中央索引、本番組込みREADMEの変更箇所である。通常説明と見出しは日本語で、英語のみの通常説明・説明見出し、相対リンク切れ、意図しない凍結情報・コードブロック変更は0件。過去のProgram記録は当時の判断として保持し、現在の正式状態を本書と中央入口から案内する。機械可読の識別子、保存した配信原文、過去の凍結情報は例外として保持する。
