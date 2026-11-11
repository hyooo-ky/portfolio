# Portfolio

静的HTML・CSS・JavaScriptのサイトです。実績データは `data/works.json` で管理し、Node.jsのスクリプトでHTMLを生成します。外部パッケージのインストールは不要です。

## 実績の更新

1. 画像を `img/` に追加します。
2. `data/works.json` に次の形式で実績を追加します。配列の順番が表示順になります。

```json
{
  "title": "EXAMPLE",
  "category": "CORPORATE SITE / WordPress",
  "url": "https://example.com/",
  "img": "img/work-12.webp"
}
```

3. ターミナルでこのフォルダを開き、実行します。

```sh
npm run build
```

4. `dist/index.html` をブラウザで開き、表示を確認します。
5. JSON・画像・生成済みの `index.html` を一緒にコミットします。

JSONの書式、必須項目、URL、画像ファイルに問題がある場合はエラーになり、入力確認が完了するまで `index.html` と `dist/` を書き換えません。実績は公開HTMLに含まれるため、閲覧側のJavaScriptが無効でも表示できます。

## 編集するファイル

- 実績: `data/works.json`
- レイアウト・本文: `index.html`（`works:start` から `works:end` までは自動生成されるので編集しない）
- スタイル: `css/style.scss`（変更時は別途SassでCSSを生成）
- 動作・演出: `js/main.js`

`npm run build:works` は実績のHTMLのみ更新します。`npm run build` はそれに加えて公開用の `dist/` を生成します。`dist/` はGit管理しません。

## Cloudflareの確認用ブランチ

`preview/json-works` を確認用ブランチとして使います。本番ブランチは `main` のままにします。

`wrangler.jsonc` はビルド時に `npm run build` を実行し、`dist/` の静的ファイルを使用する設定です。

Cloudflareの対象Worker `portfolio` の設定から、Build / Builds → Branch control を確認してください。

- Production branch: `main`
- Preview builds: 有効（対象ブランチを指定できる場合は `preview/json-works`）
- Preview command: 新しいWorker Previews方式では `npx wrangler preview`。既存の方式では `npx wrangler versions upload` を使用します。現在の画面でどちらの方式かを確認し、プレビューで `wrangler deploy` を使わないでください。
- Build command: `npm run build`。未設定でもWranglerのカスタムビルドが実行します。両方設定するとビルドが2回走りますが出力は同じです。
- Root directory: リポジトリのルート

既存Workerに「Set up Worker Previews」と表示される場合、切り替えは一方向です。まず既存の設定を確認し、プレビューのためだけに移行しないでください。

設定後は確認用ブランチのビルドを実行し、Cloudflareが返すプレビューURLを開きます。URLはビルド成功後の表示を使用し、推測しないでください。今回の作業では `main` にマージしません。

## GitHub Pages

GitHub Pages側は、コミットしたルートの `index.html` を引き続き使えます。JSONだけ更新してHTMLを生成し忘れるとGitHub Pagesには反映されないため、必ずビルド後の `index.html` もコミットしてください。

## 画像の軽量化

既存の実績画像11件とプロフィール画像は、寸法を維持したWebP（品質85）で配信します。元のJPEGは再変換用として残しています。実績追加時も可能であればWebPを使い、JSONには実際に公開する画像のパスを指定してください。OGP・アイコン・背景ノイズは今回変更していません。
