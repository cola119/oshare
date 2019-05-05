const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.https.onRequest((req, res) => {
  const path = req.path.split('/');
  const showId = path[2];
  return admin.firestore().collection("courses").where("created_at", "==", Number(showId)).get().then((snapshot) => {
    if (!snapshot) {
      res.status(404).end('404 Not Found')
      return
    }
    const data = snapshot.docs.map(doc => doc.data())[0];
    const imageUrl = data.thumbnail;
    const courseName = data.courseName;
    const html = createHtml(courseName, imageUrl, showId);
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).end(html);
    return;
  }).catch((err) => {
    console.warn(err)
  });
});

const createHtml = (courseName, imageUrl, showId) => {
  const app_domain = "oshare.o-app.net"
  const SITEURL = `https://${app_domain}`
  const PAGEURL = `${SITEURL}/show/${showId}`
  const TITLE = `${courseName}のコース・ルートを見る`
  const DESCRIPTION = 'オリエンテーリングのレッグ作成、ルート投稿・比較・レビューができるサービスです'
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>oshare</title>
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
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/_show/${showId}";</script>
  </body>
</html>
`
}