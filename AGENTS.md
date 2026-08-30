# Repository documentation instructions

## Human-facing documentation language

Bao研究およびAI Engineeringの**人間向けMarkdown文書は日本語を主言語とする**。

新規作成・更新時は、必ず次の2文書を参照すること。

- [`doc/DOCUMENTATION_LANGUAGE_POLICY.md`](doc/DOCUMENTATION_LANGUAGE_POLICY.md)
- [`doc/JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](doc/JAPANESE_DOCUMENTATION_QUALITY_GATE.md)

特に次を守る。

- **説明本文、見出し、研究の問い、結果、解釈、限界、状態説明、読者向けナビゲーションは日本語で書く。**
- 「日本語を主言語とする」は、英語本文が多数残っていてもよいという意味ではない。人間向け文書の論理を英語文だけで進めてはならない。
- 英語専門語・canonical termを残す場合も、**文の骨格と説明責任は日本語に置く**。たとえば `Stage 1 was technically valid.` のような通常説明文は不可であり、「Stage 1は技術的にvalidだった。」のように日本語文として記述する。
- `Current Status`、`Research Log`、`Resume Here`、`Final Stage 1 decision`、`Immutable boundaries`、`Closure reason`、`Read order`のような**人間向け見出しだけが英語の状態を完成形として認めない**。canonical identifierや正式な英語Study titleを除き、見出しは日本語化する。
- Study ID、Program ID、Stage ID、AI generation、canonical uppercase decision token、JSON field、code identifier、hash、commit SHA、固定classifier label、file path、exact command / exact outputは改名・翻訳しない。
- `INCONCLUSIVE`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`NOT-AUTHORIZED-NOT-EXECUTED`など異なる状態を日本語化の過程で相互に読み替えない。
- preregistration、authorization artifact、result JSON、hash-bound artifact、historical checkpoint、workflow provenance、immutable decision recordなどの凍結済み記録は、翻訳だけを目的として変更しない。
- 凍結済み記録を変更できない場合でも、**その周囲のREADME・Overview・Final Report・Current Status・Reproducibility Index・Research Log・Resume文書では日本語説明を提供する**。
- 新しい研究・programのclosure前には、`README.md`、Overview、Final Report、Current Status、Reproducibility Index、Research Log、Resume/再開文書、results/authorizations等の人間向けREADME、中央索引を`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`で監査する。
- **英語だけの通常文章または英語だけの人間向け見出しが残っている場合、明示的にcanonical / immutable / exact-output例外であることを説明できない限り、日本語品質ゲートはFAILとする。**
- 進行中研究でseed block消費中、formal run中、independent verification中、canonical artifact確定中の場合は、言語整備を研究実行へ割り込ませず、安全なcheckpointまたはclosure後に行う。

英語専門語を排除することが目的ではない。**機械的・科学的な厳密性を保持しながら、人間が研究内容を自然な日本語で正確に理解できる文書にすること**を必須品質とする。
