const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.https.onRequest((req, res) => {
    const html = createHtml();
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).end(html);
    return;
});

const createHtml = () => {
    const app_domain = "oshare.o-app.net"
    const SITEURL = `https://${app_domain}`
    const PAGEURL = `${SITEURL}`
    const TITLE = `Oshareでコース・ルートを共有しよう`
    const DESCRIPTION = 'オリエンテーリングのレッグ作成、ルート投稿・比較・レビューができるサービスです'
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>colorinco</title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="${400}">
    <meta property="og:image:height" content="${400}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Oshare">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/o-app-12a70.appspot.com/o/images%2Fbackground.png?alt=media&token=ebfa6b08-d618-4edd-9c94-6ca0c7b49e93">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/";</script>
  </body>
</html>
`
}