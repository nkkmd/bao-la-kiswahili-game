# G5-05 — 一度限りの実行記録

ソース固定・技術CI合格後にTRIGGER.jsonを別コミットで追加する。LEASE.jsonはseed読取前にActionsがGitHubブランチへ永続保存し、区画全体を消費済みにする。run・attempt・binding・固定ソースと区画を結合する。存在するleaseを削除・上書きして再実行しない。[再現性](../REPRODUCIBILITY.md)を参照する。
