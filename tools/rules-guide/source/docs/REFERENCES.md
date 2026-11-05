# 参考文献

Bao la Kiswahili（ザンジバル版）のルール、用語、地域差を検証するための資料を記録する。

## 採用方針

資料は、おおむね次の順で優先する。

1. 競技団体などが公表する規則
2. 競技者・伝承者への聞き取りを記録した一次資料
3. 査読済み論文、学術書、博物館等の資料
4. 出典を明記した専門的な解説
5. その他のWeb情報

資料の新しさだけで優先順位を決めず、対象地域、採録方法、版、記述の具体性を確認する。

## 記録項目

各資料には、可能な範囲で次を記録する。

- 著者・編者
- タイトル
- 出版者または掲載元
- 出版年・更新日
- URL、DOI、ISBN等
- Web資料の確認日
- 対象地域・ルールの系統
- 本プロジェクトで確認した項目
- 資料の位置づけと注意点

## 参考文献一覧

### R-001: de Voogt (1995)

- 著者: Alex de Voogt
- タイトル: *Limits of the Mind: Towards a Characterisation of Bao Mastership*
- 出版者: CNWS Publications, Leiden
- 出版年: 1995
- ISBN: 90-73782-50-3
- URL: https://www.researchgate.net/publication/280132772_Limits_of_the_Mind_towards_a_characterisation_of_Bao_mastership
- 全文の補足資料: https://www.researchgate.net/publication/318912497_Limits_of_the_Mind_full_text
- 確認日: 2026-06-28、2026-10-08（全文182ページを取得）
- 対象: ザンジバルの Bao と Bao 名人
- 確認項目: 書誌情報、ザンジバルの名人に基づく調査、ルール章pp. 35–44の主要規則26項目、p. 151の実戦冒頭2手番とtakasiaの適用記録
- 位置づけ: 本プロジェクトの中心資料。全文の取得、takasiaと主要規則の項目別照合を完了した。5個のnyumbaからの開始境界、本全体の通読、実戦棋譜の全対局再生、現行運用の外部確認は未完了。通常の書誌ページから取得できた46ページの抜粋は、ルール章後半を含まないため全文と区別する。
- 採用記録: [takasiaの正式採用](drafts/takasia-adoption-20261008.md)。取得版のSHA-256と頁対応も記録する。
- 追加照合: [正式版の検証記録](drafts/v1-validation-20261008.md)。R-002・R-003との主要規則比較、資料差、未解決事項を記録する。

### R-002: Donkers (2003)

- 著者: H. H. L. M. Donkers
- タイトル: *Nosce Hostem: Searching with Opponent Models*
- 種別: Maastricht University 博士論文
- 出版者: Universitaire Pers Maastricht
- 出版年: 2003
- ISBN: 90-5278-390-X
- DOI: https://doi.org/10.26481/dis.20031205hd
- PDF: https://project.dke.maastrichtuniversity.nl/games/files/phd/Donkers_thesis.pdf
- 確認日: 2026-06-28
- 対象: Appendix C, “Zanzibar Bao Rules for the Computer”, pp. 163–168
- 再確認日: 2026-10-08（全文PDFからAppendix Cを再照合）
- 確認項目: ボード、初期配置、namua、mtaji、捕獲、endelea、nyumba、takasa、takasia、終局、棋譜表記
- 位置づけ: R-001をもとに計算機向けに形式化した比較資料。無限手の扱いなど、競技規則そのものではない追加規則を含むため、R-001より優先しない。

### R-003: de Voogt (2000–2001)

- 著者: Alex de Voogt
- タイトル: “Strategy in Bao: An Introduction” および “Strategy in Bao: Notation and the House”
- 掲載誌: *Abstract Games*, Issue 4（Winter 2000）, pp. 21–22、およびIssue 5（Spring 2001）, pp. 22–23
- Issue 4: https://www.abstractgames.org/uploads/1/1/6/4/116462923/abstract_games_issue_4.pdf
- Issue 5: https://www.abstractgames.org/uploads/1/1/6/4/116462923/abstract_games_issue_5.pdf
- 確認日: 2026-06-28
- 対象: Baoの基本ルール、nyumba、棋譜、基本手
- 再確認日: 2026-10-08（両記事を再照合し、Issue 5の5個時の追加説明と地域差を補足）
- 位置づけ: R-001の著者自身による入門的解説。Issue 5にIssue 4の記述を訂正する箇所があるため、単独号だけを根拠にしない。

### R-004: Kronenburg, Donkers and de Voogt (2006)

- 著者: Tom Kronenburg, H. H. L. M. Donkers, Alex J. de Voogt
- タイトル: “Never-Ending Moves in Bao”
- 掲載誌: *ICGA Journal*, 29(2)
- 出版年: 2006
- DOI: https://doi.org/10.3233/ICG-2006-29204
- 確認日: 2026-06-28
- 対象: 終わらない連続蒔き
- 位置づけ: 特殊局面の検証資料。通常のルール全体を定める資料としては使用しない。
- 著者全文: https://www.researchgate.net/publication/220174528_NEVER-ENDING_MOVES_IN_BAO
- 再確認日: 2026-10-08（全文PDF pp. 74–78を照合。Figure 3の掲載周期218と再計算228の差は未解決。教材へ転用しない）

### R-005: BaoルールのWeb上の統合解説

- タイトル: “Bao la Kiswahili”
- 掲載元: Mancala World Wiki
- URL: https://mancala.fandom.com/wiki/Bao_la_Kiswahili
- 確認日: 2026-06-28
- 確認項目: `takata`、`marker`、`taxation` に相当する説明、nyumbaの地域差
- 位置づけ: 出典階層の低い補助資料。R-001〜R-004にない英語圏の用語用例を確認するためだけに使い、正式ルールの根拠にはしない。

### R-006: de Voogt (2001), “The Beauty Is in Complexity”

- 著者: Alex de Voogt
- タイトル: “Strategy in Bao: The Beauty Is in Complexity”
- 掲載誌: *Abstract Games*, Issue 7（Autumn 2001）, pp. 24–25
- URL: https://www.abstractgames.org/uploads/1/1/6/4/116462923/abstract_games_issue_7.pdf
- 確認日: 2026-06-29、2026-10-08（p. 25のtakasiaを再照合）
- 対象: 捕獲手とtakasaの候補探索、初心者の選択肢、namua・mtajiのtakasa規則、takasiaの成立・停止・例外、mtaji初期の所有中nyumba
- 位置づけ: R-003に続く同著者の解説。takasiaについて、R-001の後年の補足として「1個だけの穴は対象外」を採用する。戦術上の一般則や定跡を網羅する資料ではない。

### R-007: Donkers and Uiterwijk (2002), “Programming Bao”

- 著者: Jeroen Donkers、Jos W. H. M. Uiterwijk
- タイトル: “Programming Bao”
- 掲載: 7th Computer Olympiad Workshop
- 出版年: 2002
- PDF: https://citeseerx.ist.psu.edu/document?doi=72b58f060694a7c83feb0a237b0804f4610c3bea&repid=rep1&type=pdf
- 著者公開ページ: https://www.researchgate.net/publication/242392324_Programming_Bao
- 確認日: 2026-06-29
- 言語: 英語
- 対象: Zanzibar Baoの概要、初期配置、座標、2段階、捕獲義務、複合手、nyumba、終わらない手、計算機探索
- 確認項目: 4列×8穴、South先手、namuaとmtaji、自己側2列での蒔き、相手前列からの強制捕獲、捕獲keteの再投入、複合手、active houseでの停止選択
- 位置づけ: Maastrichtのゲーム研究者による計算機研究資料。基本骨格をR-002・R-003と照合できるが、論文自身が完全な規則説明ではないと明記し、de Voogt (1995) とDonkersの規則へ参照を戻している。細則の単独根拠にはしない。

### R-008: K.I.B.A. フランス語規則

- 発行主体: K.I.B.A. — Klubo Internacia de Bao-Amantoj（国際Bao愛好者クラブ）
- タイトル: Bao la Kiswahili規則（フランス語版）
- 版: 2009年版とみられる（ファイル名による）
- 翻訳: Roland Hahn
- URL: https://www.kibao.org/doc/regole2009kiba_fr.pdf
- 団体サイト: https://www.kibao.org/
- 確認日: 2026-06-29
- 言語: フランス語
- 対象: 一般規則、kunamua、mtaji、kichwa・kimbi、nyumba、kutakata、kutakatia、kuendelea、棋譜
- 確認項目: 勝利条件、初期配置、South先手、捕獲義務、非捕獲手、前列優先、nyumbaからの2個蒔き、mtajiへのnyumba持ち越し、6個未満時の機能停止と再開、kutakatia、棋譜
- 由来: 文書末尾でDonkersのWeb規則を改訂し、フランス語へ翻訳したものと明記する。
- 位置づけ: Bao専門クラブが実戦運用向けに整理した非英語の規則全文。R-002と独立した現地一次資料ではないが、所有中nyumbaと6個以上で働く機能を区別する記述、スワヒリ語の動詞形、クラブ運用上の規則を確認する補助資料として用いる。

### R-009: K.I.B.A. 英語Web規則

- 発行主体: K.I.B.A. — Klubo Internacia de Bao-Amantoj
- タイトル: Bao la Kiswahili rules（英語版）
- URL: https://www.kibao.org/cs_kanuni.php?lng=en
- 確認日: 2026-10-08
- 更新日: 本文から特定できず
- 対象: §4.5 “Kutakatia (takasia)” の規則と数値局面
- 確認項目: 捕獲対象が1穴、相手のtakata、対象穴での停止と例外、64個の完全局面
- 確認方法: 検索サービスが同URLについて返した本文で確認した。直接アクセスは502で取得できず、現時点の配信状態や更新日は確認できない。
- 位置づけ: R-008と同じクラブの規則系統であり、R-002と独立した現地一次資料としては数えない。規則の採用根拠はR-001・R-006を中心とし、R-009はE30の盤面出典として用いる。掲載された別の反例は合計56個のため、完全なmtaji局面としては採用しない。

## 基準資料の暫定順位

1. R-001をザンジバル版の中心資料候補とする。
2. R-002で規則の条件分岐、用語、実装可能性を照合する。
3. R-003で初心者向け説明とR-001以後の訂正を確認する。
4. R-004は終わらない手に関する論点だけに用いる。
5. R-006で候補手の探索、初心者向けの戦術学習、takasiaの後年の著者説明を照合する。
6. R-007で計算機研究における基本骨格の再現を照合する。
7. R-008・R-009でクラブ規則、用語形、数値局面を照合する。ただしR-002からの派生系統であることを明記する。
8. R-005は用語用例の確認に限って参照する。

この順位は暫定である。ザンジバルの競技団体が公表した規則、または現地競技者による新しい一次資料が見つかった場合は再評価する。

## Phase 1で確認できなかった資料

以下は2026-06時点の調査履歴である。R-001全文の未取得は2026-10-08に解消し、takasiaの採用判断を更新した。他の規則の項目別照合は継続する。

- R-001は著者公開の全文配布ページまで確認したが、2026-06-29の再試行でも配布元のアクセス制限によりルール本文を取得・通読できなかった。
- ザンジバルの競技団体または現地競技者が現在公開している規則本文は、2026-06-28の検索では確認できなかった。
- Chama cha Baoやザンジバルの大会・団体の存在に触れる二次資料はあるが、規則本文と発行主体を検証できないため基準資料には加えていない。

これらは資料不存在の断定ではない。入手できた時点で追加調査し、R-002・R-003に依存する暫定判断を再評価する。

## Phase 10で検討した非英語資料

- R-008のフランス語規則は、発行主体、対象ゲーム、規則全文、翻訳者、元規則を確認できたため補助資料へ採用した。
- イタリア語のBao解説・競技記事は複数確認したが、de VoogtまたはK.I.B.A.規則の翻訳・翻案が中心で、今回の規則照合に独立した根拠を加えないため参考文献へ追加しなかった。
- スウェーデン語等の百科事典的再掲は、出典が既存資料へ戻るため採用しなかった。
- スワヒリ語については、BAKITA・BAKIZAなど公的機関の存在は確認したが、Bao la Kiswahiliの規則または本書の用語を検証できる公開資料を確認できなかった。

## 資料間の差異

差異を発見した場合は結論だけに統合せず、`docs/drafts/` の比較メモと `docs/TODO.md` に記録する。
