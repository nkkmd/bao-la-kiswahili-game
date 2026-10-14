# 認証付きGit通信の技術fixture

既存registryとpipeline sessionを変更せず、専用の技術refでGit push、古いexpected SHAの競合拒否、応答喪失注入、実proxy接続拒否を確認する。生のGit bundleから独立検算する。科学用registryへ接続しない。

仕様・結果・限界は[技術文書](../../../doc/research-generation-5/befcs-git-20261014/README.md)を参照する。実通信は専用branchのpush・attempt 1・既定repositoryだけで許可し、PRではローカルfixtureのみを検査する。tokenをファイルや保存証拠へ書き出さない。
