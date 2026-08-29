# Repository documentation instructions

## Human-facing documentation language

Bao研究およびAI Engineeringの**人間向けMarkdown文書は日本語を主言語とする**。

新規作成・更新時は、必ず[`doc/DOCUMENTATION_LANGUAGE_POLICY.md`](doc/DOCUMENTATION_LANGUAGE_POLICY.md)を参照すること。

特に次を守る。

- 説明本文、見出し、研究の問い、結果、解釈、限界は原則日本語で書く。
- Study ID、Program ID、Stage ID、AI generation、canonical uppercase decision token、JSON field、code identifier、hash、commit SHA、固定classifier labelは改名・翻訳しない。
- `INCONCLUSIVE`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`NOT-AUTHORIZED-NOT-EXECUTED`など異なる状態を日本語化の過程で相互に読み替えない。
- preregistration、authorization artifact、result JSON、hash-bound artifact、historical checkpoint、workflow provenanceなどの凍結済み記録は、翻訳だけを目的として変更しない。
- 進行中研究でseed block消費中、formal run中、independent verification中、canonical artifact確定中の場合は、言語整備を研究実行へ割り込ませず、安全なcheckpointまたはclosure後に行う。

英語専門語を排除することが目的ではない。**機械的・科学的な厳密性を保持しながら、人間が日本語で正確に理解できる文書にすること**を優先する。
