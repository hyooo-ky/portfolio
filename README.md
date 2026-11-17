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
- 動作・演出: `js/site.js`

`npm run build:works` は実績のHTMLのみ更新します。`npm run build` はそれに加えて公開用の `dist/` を生成します。`dist/` はGit管理しません。

## Cloudflareの確認用ブランチ

`preview/redesign-editorial` を確認用ブランチとして使います。本番ブランチは `main` のままにします。

`wrangler.jsonc` はビルド時に `npm run build` を実行し、`dist/` の静的ファイルを使用する設定です。

Cloudflareの対象Worker `portfolio` の設定から、Build / Builds → Branch control を確認してください。

- Production branch: `main`
- Preview builds: 有効（対象ブランチを指定できる場合は `preview/redesign-editorial`）
- Preview command: 新しいWorker Previews方式では `npx wrangler preview`。既存の方式では `npx wrangler versions upload` を使用します。現在の画面でどちらの方式かを確認し、プレビューで `wrangler deploy` を使わないでください。
- Build command: `npm run build`。未設定でもWranglerのカスタムビルドが実行します。両方設定するとビルドが2回走りますが出力は同じです。
- Root directory: リポジトリのルート

既存Workerに「Set up Worker Previews」と表示される場合、切り替えは一方向です。まず既存の設定を確認し、プレビューのためだけに移行しないでください。

設定後は確認用ブランチのビルドを実行し、Cloudflareが返すプレビューURLを開きます。URLはビルド成功後の表示を使用し、推測しないでください。今回の作業では `main` にマージしません。

## GitHub Pages

GitHub Pages側は、コミットしたルートの `index.html` を引き続き使えます。JSONだけ更新してHTMLを生成し忘れるとGitHub Pagesには反映されないため、必ずビルド後の `index.html` もコミットしてください。

## 画像の軽量化

既存の実績画像11件とプロフィール画像は、寸法を維持したWebP（品質85）で配信します。表示で使っていない元のJPEGは削除しました。必要な場合は削除前のGit履歴から復元できます。実績追加時も可能であればWebPを使い、JSONには実際に公開する画像のパスを指定してください。OGP・アイコン・背景ノイズは今回変更していません。

## 担当範囲タグ

`data/works.json` の `roles` 配列で表示・順序を管理します。例: `"roles": ["デザイン", "コーディング", "CMS構築"]`。省略または空配列ならタグは表示しません。変更後は `npm run build` を実行します。

## 旧サイト画像のモーダル

`archiveImage` に `img/` 配下の画像を指定すると、その実績カードは旧サイト画像を開きます。PC幅70%、スマホ幅90%で画像を縦スクロールでき、閉じるボタン・背景クリック・Escで閉じられます。JavaScriptが無効な場合は画像を直接開きます。CHUDEN CTIに設定済みです。

## スクロールの余韻（確認用）

Lenis 1.3.27（MIT）を `js/vendor/` に同梱しています。PCのホイールに控えめな減速を追加します。強さは `js/smooth-scroll.js` の `lerp: 0.16` で調整します（大きいほど追従が速くなります）。スマホは標準のタッチスクロールを利用します。サイト内で動きをOFFにした場合は追加演出を無効にし、モーダル表示中は背景スクロールを止めます。

## 確認用の動きの調整

`js/site.js` に見出しのライン出現、実績カードの順次出現、現在セクションのナビ表示、ページ上端の細い進行ラインをまとめています。CSSのホバー演出はマウス操作時だけ適用します。サイト内で動きをOFFにした場合は追加演出を無効にします。

## Web画面の背景オブジェクト

`js/web-scene.js` は Three.js 0.180.0（MIT）を同梱したビルド済みモジュールです。外部CDNへの接続なしでグリッドからWeb画面、スマートフォンへ変形する背景オブジェクトを描画します。原稿は `scripts/web-scene-source.mjs` にあります。画面外では描画ループを停止し、サイト内で動きをOFFにすると静止画として描画します。WebGL非対応環境は既存SVGを使います。

## 背景オブジェクトの動作

グリッド→ワイヤーフレーム→Web画面の3段階をスクロールに連動させています。サイト内で動きをOFFにすると完成形を静止表示し、WebGL非対応時にはグリッドのSVGを表示します。掲載内容は変更していません。

オブジェクトはbody直下の固定背景として最下部まで表示します。本文・実績画像より背面に置き、FV以降は薄く表示します。

Web画面が完成した後、ページ全体のスクロール進行18〜42%で、同じ部品をスマートフォンの1列レイアウトへ変形します。逆スクロールでは元のWeb画面へ戻ります。

初期の代替SVGもグリッドに統一し、3D読み込み前に完成画面が見える現象を防いでいます。Worksの上余白を広げ、構築アニメーションの開始から完成までのスクロール距離を調整しています。

## 3Dの初期描画負荷

反射用の環境マップは64pxのキューブ面で事前生成し、`img/web-scene/reflection-v1.bin.gz` に保存しています。画面に表示するオブジェクトの形状やCanvasの解像度は維持し、内部の反射計算を軽くしています。初回描画の前に `renderer.compileAsync()` でマテリアルを準備します。非同期コンパイルの効果はブラウザ・GPUの対応によって異なります。

## フォントの読み込み

Inter（300〜800）とCormorant Garamond（400）のLatin WOFF2を `fonts/` に同梱し、FV用に先読みします。書体はGoogle Fontsと同じもので、OFLライセンスも同梱しています。Noto Sans JP（300〜500）はGoogle Fontsから非同期に読み込み、`npm run build` が本文・実績から必要な文字を自動抽出して `text=` を更新します。文字数が増えてURLが長くなる場合は通常の文字セット配信へ戻ります。JavaScript無効時は `noscript` のスタイルシートを利用します。

反射マップの元コードは `scripts/reflection-source.mjs` です。各端末で照明を描画し直す代わりに、同じ半精度浮動小数点データを読み込むため、反射の見た目を維持できます。圧縮データの展開には主要ブラウザで対応済みの `DecompressionStream` を利用し、未対応環境はSVGを表示します。グリッドの点はInstancedMeshでまとめて描画します。

## 動きの切り替え

初期状態はOS設定にかかわらずONです。ヘッダーの「動き ON／OFF」で切り替え、`localStorage` の `portfolio-motion` に選択を保存します。保存できない環境でも、そのページ内の切り替えは利用できます。`js/motion.js` がCSS・スクロール・3Dに共通の状態を配信し、OFFでは主なアニメーションを止めます。
