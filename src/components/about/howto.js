export const contents = [
    {
        title: "できること",
        content: `
        <p><input type="checkbox" id="checkbox5" checked="true"><label for="checkbox5">コース作成・公開・共有</label><br>
        <input type="checkbox" id="checkbox4" checked="true"><label for="checkbox4">ルート作成・公開・共有</label><br>
        <input type="checkbox" id="checkbox3" checked="true"><label for="checkbox3">ルート比較</label><br>
        <input type="checkbox" id="checkbox2" checked="true"><label for="checkbox2">ルートへのコメント・いいね（投票）</label><br>
        <input type="checkbox" id="checkbox1"><label for="checkbox1">ルート付き画像をダウンロード</label><br>
        <input type="checkbox" id="checkbox0"><label for="checkbox0">SNSシェア</label></p>
    `
    },
    {
        title: "ユーザー登録する",
        content: `
        <ol>
            <li><a href="https://oshare.o-app.net/login">ログインページ</a>にアクセス。</li>
            <li>ログイン方式を選択します。
                <ul>
                    <li>メールアドレス・パスワード認証</li>
                    <li>Googleアカウント認証</li>
                    <li>Twitterアカウント認証</li>
                </ul>
            </li>
            <li>それぞれの方式に応じてログインしてください。</li>
        </ol>
    `
    },
    {
        title: "画像をアップロードする",
        content: `
        <ol>
<li>ログインする</li>
<li><a href="https://oshare.o-app.net/mypage">マイページ</a>の「画像をアップロードする」ボタンを押してファイルを選択します。</li>
<li>切り取り画面が表示されるので、必要な部分のみを選択してください。
<ul>
<li>なるべく必要な部分のみになるようにしてください。</li>
<li>すでにコースが書かれている場合、回転させると見やすいと思います。</li>
<li>ファイルサイズは5MB制限です。</li>
</ul>
</li>
<li>CUTボタンで切り取ります。</li>
<li>画像名を入力し、アップロードボタンでアップロードします。
<ul>
<li>画像名は自動的に取得されます。</li>
<li>画像名は公開されません。</li>
</ul>
</li>
<li>アップロードに成功すると数秒後にマイページにサムネイルが表示されます。</li>
</ol>
<p>※ 一人５枚までアップロード可能です（５月１日現在）</p>
    `
    },
    {
        title: "コースを作る",
        content: `
        <ol>
<li>コースを組みたい画像をクリックします。（<a href="#%E7%94%BB%E5%83%8F%E3%82%92%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89%E3%81%99%E3%82%8B">画像をアップロードする</a>）</li>
<li>クリックモードでコントロールを設置する。
<ul>
<li>エディタ画面には２つのモードがあります。
<ul>
<li>ドラッグモードでは画像の移動・拡大縮小ができますが、クリックイベントは発生しません。</li>
<li>クリックモードではクリックイベントが発生しますが、画像のドラッグはできません。</li>
</ul>
</li>
<li>「左クリック」で追加、「右クリック」で削除、「ドラッグ」で移動</li>
<li>左上のスライダーで円の大きさや太さを調節できます。</li>
</ul>
</li>
<li>レッグを作成する
<ul>
<li>レッグ名を入力するとコントロール選択モードになります。</li>
<li>「クリックモード」でコントロールを順番にクリックします。</li>
</ul>
</li>
<li>最後にコース名を入力して保存します。</li>
</ol>
    `
    },
    {
        title: "ルートを書く",
        content: `
        <ol>
<li>ルートを書きたいレッグを選択します。</li>
<li>ルート名を入力します。</li>
<li>「クリックモード」でクリックすると、クリックした場所まで直線が引かれます。</li>
<li>同様に、「左クリック」でポイント追加、「右クリック」でポイント削除</li>
</ol>
    `
    },
];