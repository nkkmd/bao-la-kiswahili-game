# 固定codeの初回取得と封印image全体の外部保存

## 今回閉じる条件

停止診断だけの保存から進み、固定コミット`484e3f659480a21fec2009fd4a355f9323191c17`のtools全体とpublic直下JSを有限image内で初回取得し、code・input・取得記録・既知技術workを含むimage全体を封印してGitHubへ保存する。取得対象は[CODE_MANIFEST.json](CODE_MANIFEST.json)の1,266 file・11,746,870 byteで、各fileのGit blob・SHA-256・size・実行bitを照合する。

科学source関連4モジュールは読み込みだけを確認し、未固定の科学gateが拒否することを検査する。新規科学source・seed・lease・候補・閉包は生成しない。この取得集合は現在の候補runtime codeの範囲であり、最終科学input/認可/履歴データ一式の確定を意味しない。

## 上限と封印

親1 GiB・swap無効、全体20分・終了予約180秒・全保存256 MiB・終了容量予約16 MiBの既存上限を維持する。fixtureのbacking imageは192 MiB、圧縮archiveは16 MiB以下とする。image、sidecar、圧縮archiveとremote archive byteを同じ台帳へ合算する。圧縮出力は上限前で止め、原imageを変更しない。

imageをunmountしてからgzip化し、raw imageとgzipのhashを計算する。原image全体とmanifestを新規技術refへ保存し、通常caseはref・commit・archive・manifestを読み戻して一致後にACKとする。ACK抑止caseはref作成後に応答を抑止し、保存完了へ昇格しない。通信retry・force更新・旧ref削除をしない。

実行に使ったbootstrap codeもimage内へコピーし、取得code・manifest・モジュール読込検査・封印prefixとともに保存する。認証情報をfileやjournalへ保存しない。code取得のGitは認証情報のない公開URLだけを使う。

## 維持する未完条件

外側bootstrapの最初のロード・Actions初回checkout/Node準備/systemd起動はまだscope外である。封印後の送信journalと最終ACK観測は封印image自身には入らず、別の証拠として保存する。Actionsのartifact uploadもscope外である。従って`wholeLifecycleOsProven: false`と科学未認可を維持し、今回の取得集合を最終科学input集合へ昇格しない。

今回閉じるのは、指定したruntime codeのscope内取得と、封印した原image全体の外部保存・復元照合である。外側処理と封印後の制御記録を含む全実行条件、科学reference API・初期状態・途中closure/microstate証拠、最終事前固定は引き続き必要である。

## 検証と品質

```bash
node --test test/g5-befcs-capsule.test.cjs
```

分類/branch/retry拒否、ACK抑止、通信失敗、圧縮上限、manifestとsource改変、読戻し不一致を6検査で確認する。実OS・GitHubの取得/保存は専用push・attempt1のActionsで確認し、原artifactとremote archiveから独立検算する。結果を先取りしない。

人間向け本文・見出しは日本語で、field・ID・path・command・hashは機械定義例外である。旧input・原証拠・認可状態を変更せず、BEFCSと正式関係は未登録・未実行、科学seed消費0を維持する。
