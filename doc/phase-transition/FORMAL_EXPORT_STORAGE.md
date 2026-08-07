# Formal実験 最終成果物保管規則

更新日: 2026-08-02

保管台帳: `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

## 目的

固定ローカル環境で完了したformal experimentの最終成果物を、Git repositoryとは分離して長期保管し、archiveとSHA-256の対応を再検証できる状態にする。

この規則は成果物の保存運用だけを定める。事前登録条件、分析条件、formal decision、解釈境界は変更しない。

## 1. 保管ディレクトリ

formal experimentごとに、WSL home直下へ次の形式で専用ディレクトリを作る。

```text
/home/oruorane/bao-eNNN-exports/
```

Windowsから参照する場合:

```text
\\wsl.localhost\Ubuntu\home\oruorane\bao-eNNN-exports
```

例:

```text
/home/oruorane/bao-e011-exports/
/home/oruorane/bao-e018-exports/
/home/oruorane/bao-e019-exports/
```

最終formal exportはGit repository内へ置かない。

## 2. 最低保管構成

各experimentの最終export directoryには最低限、次の2ファイルを保存する。

```text
eNNN-final-formal-evaluation.tar.gz
eNNN-final-formal-evaluation.tar.gz.sha256
```

archive名はexperiment IDを小文字化した`eNNN`を使用する。

## 3. SHA-256ファイル

archiveを最終保管ディレクトリへ配置した後、そのディレクトリ内でbasenameを使ってSHA-256ファイルを生成する。

```bash
cd ~/bao-eNNN-exports
sha256sum eNNN-final-formal-evaluation.tar.gz \
  > eNNN-final-formal-evaluation.tar.gz.sha256
```

検証:

```bash
sha256sum -c eNNN-final-formal-evaluation.tar.gz.sha256
```

期待出力:

```text
eNNN-final-formal-evaluation.tar.gz: OK
```

`.sha256`内には移動前の絶対パスを残さない。これにより保管ディレクトリを移動しても、同一ディレクトリ内で検証できる。

## 4. 研究台帳への記録

final bundleを固定したexperimentでは、少なくとも次を`FORMAL_EXPORT_INDEX.md`およびcompletion/final-bundle checkpointへ記録する。

- archive filename
- archive SHA-256
- local export directory
- Windows参照パス
- final bundle audit checkpoint（存在する場合）
- archive integrity / formal decision（監査済みの場合）

保存場所の変更は科学結果の変更ではない。archive bytesが同一であることはSHA-256で確認する。

## 5. 現在の保管先

### E-011

既存保管先:

```text
/home/oruorane/bao-e011-exports/
```

Windows:

```text
\\wsl.localhost\Ubuntu\home\oruorane\bao-e011-exports
```

Final archive:

- `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`

### E-018

保管先:

```text
/home/oruorane/bao-e018-exports/
```

Windows:

```text
\\wsl.localhost\Ubuntu\home\oruorane\bao-e018-exports
```

Final archive:

- `e018-final-formal-evaluation.tar.gz`
- `e018-final-formal-evaluation.tar.gz.sha256`
- SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- final bundle audit: `doc/phase-transition/checkpoints/2026-08-02-e018-final-bundle-audit.md`

## 6. 将来のexperiment

E-019以降も、formal final bundleを作成する場合は原則として同じ規則を使用する。

既存experimentについて、実際のfinal export保管を確認していないものを遡及的に「保管済み」とは記録しない。
