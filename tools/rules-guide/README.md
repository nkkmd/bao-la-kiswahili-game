# ルール解説の生成と検証

ゲームのルール解説を、入口の簡易版と詳細版に分ける。

- `public/rules.html`：日英の簡易版。対局中の補足リンクが参照する既存の見出しIDを保持する。
- `public/rules/complete.html`：日英の図解と、日本語ガイドの本文・補助教材を収録する生成物。
- `template.html`：詳細版の図解、操作説明、ゲーム実装との差異、クレジットを編集する原稿。
- `source/`：日本語ガイド v0.2.0 の固定原稿と図版。準拠コミットは `aad9fda3ffb12c2ca785509951c71ce8a42bef5a`。
- `source-manifest.json`：固定原稿のSHA-256。元資料を無断で更新しないための照合に使う。

詳細版の後半は日本語だけで収録する。英語表示時にもその旨を案内し、本文には `lang="ja"` を付ける。第11章は構成案として保持し、正式ルールとして確定していないことを冒頭と原稿内で明示する。

## 再生成

Python 3.13で次を実行する。公開ページは生成済みの静的HTMLで、閲覧時の通信やMarkdown変換は不要。

```powershell
python -m pip install -r tools/rules-guide/requirements.txt
python tools/rules-guide/build.py
python tools/rules-guide/build.py --check
python tools/rules-guide/check.py
```

`build.py --check` は固定原稿の全ファイルとハッシュ、生成HTML、配信用図版の一致を検査する。`check.py` はページ内・ページ間リンク、ローカル資産、見出しID、16章、用語40項目、FAQ50問、局面32例を検査する。

`node tools/test-rules-browser.cjs chromium` は日英表示、簡易版から詳細版への移動、画面幅320〜1280px、図の拡大、対局の維持、JavaScript無効時、オフラインと旧キャッシュからの更新を確認する。Playwrightと対応ブラウザが必要。CIではChromium・Firefox・WebKitで実行する。

## 原稿とライセンス

[原典の固定版](https://github.com/nkkmd/bao-la-kiswahili-ja/tree/aad9fda3ffb12c2ca785509951c71ce8a42bef5a)の文章と自作図版は、bao-la-kiswahili-ja contributors（2026）によるCC BY-SA 4.0。詳細版ではHTML化、内部リンク変換、見出し階層の調整、画像の拡大リンクを追加した。外部資料は同ライセンスの対象に含まれない。

`source/` は原典を保持する資料である。英語の原文、識別子、表記、数値、未確定の記述を翻訳・改変しない。生成物に残る専門語は日本語の説明とともに掲載する。原典の運営資料へのリンクは固定コミットのGitHubに向ける。

元ガイドは検証版で、外部レビュー未実施、5個のnyumbaから始める境界などの未解決事項がある。ゲーム独自の512回の安全上限、nyumbaの開始条件、旧棋譜の採用規則は詳細版の図解部分で区別する。

## 検証記録

2026年11月5日、再生成一致・固定原稿照合・リンク354件・図版12点のエンジン照合、関連23件のテスト、Chromiumのブラウザ確認が通過した。実機確認は未実施。Firefoxはローカル環境でブラウザプロセスが起動できず、WebKitは解説ページの検査通過後に既存の対局アニメーション待機が時間切れとなった。両者の全工程の合格は主張しない。CIでも3ブラウザを検査する。

日本語文書品質ゲートの対象はこの説明文書と追加した案内文。英語だけの説明見出し0件、英語だけの通常説明文0件。固定原稿と既存の日英UIは原文保持・多言語表示として扱う。原典の識別子・数値・ハッシュ・未解決事項に意図した変更はない。

歴史的なtakasiaの検証記録は保持する。`check-current-assets.cjs` はルール解説とService Workerを当時のバイト列との照合から分離し、その他のエンジン・AI・対局資産は従来どおり照合する。現行の解説・キャッシュは生成検査とブラウザテストで確認する。
