/****************************
 * データ保存用の変数
 ****************************/

// 買い物リスト全体を保存する配列
let items = [];

// 各データを識別するためのIDカウンター
let id = 0;


/****************************
 * HTML要素の取得
 ****************************/

// フォーム全体
const form = document.getElementById("form");

// 商品一覧を表示するul
const list = document.getElementById("list");

// カテゴリ絞り込み用select
const filter = document.getElementById("filter");

// 商品名入力欄
const nameInput = document.getElementById("name");

// カテゴリ選択欄
const categorySelect = document.getElementById("category");

// 登録件数表示用
const countText = document.getElementById("count");


/****************************
 * 起動時：localStorageから読込
 ****************************/

// ブラウザに保存されているデータを取得
const saved = localStorage.getItem("shoppingItems");

// 保存データが存在する場合のみ処理
if (saved) {

  // JSON文字列 → 配列オブジェクトに変換
  items = JSON.parse(saved);

  // 既存データの最大ID + 1 を次のIDに設定
  if (items.length > 0) {
    id = Math.max(...items.map(i => i.id)) + 1;
  }
}

// 最初に画面を描画
render();


/****************************
 * 追加処理（フォーム送信時）
 ****************************/

form.addEventListener("submit", e => {

  // フォーム送信によるページ再読み込みを防ぐ
  e.preventDefault();

  // 入力値の前後の空白を削除
  const name = nameInput.value.trim();

  // 空入力チェック
  if (name === "") {
    alert("商品名を入力してください");
    return; // ここで処理終了
  }

  /***** 登録日時の作成 *****/

  const now = new Date();

  const time =
    now.getFullYear() + "/" +
    String(now.getMonth() + 1).padStart(2, "0") + "/" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  /***** データ追加 *****/

  items.push({
    id: id++,                      // 現在のIDを使用してから+1
    name: name,                    // 商品名
    category: categorySelect.value,// カテゴリ
    time: time                     // 登録日時
  });

  // localStorageへ保存
  save();

  // フォーム入力欄をリセット
  form.reset();

  // 画面再描画
  render();
});

// カテゴリ変更時に再描画
filter.addEventListener("change", render);


/****************************
 * 画面表示処理
 ****************************/

function render() {

  // 一度すべての表示を削除
  list.innerHTML = "";

  // 表示対象のデータを決定
  const showItems =
    filter.value === "all"
      ? items
      : items.filter(i => i.category === filter.value);

  // 1件ずつli要素を作成
  showItems.forEach(item => {

    const li = document.createElement("li");

    // 商品名とカテゴリ表示
    const text = document.createElement("span");
    text.textContent = `${item.name}（${item.category}）`;

    // 登録日時表示
    const time = document.createElement("small");
    time.textContent = "🕒 " + item.time;
    time.style.display = "block";
    time.style.fontSize = "12px";

    /***** 各種ボタン作成 *****/

    // 編集ボタン
    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => editItem(item.id));

    // 削除ボタン
    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", () => deleteItem(item.id));

    // 上へ移動
    const upBtn = document.createElement("button");
    upBtn.textContent = "↑";
    upBtn.addEventListener("click", () => move(item.id, -1));

    // 下へ移動
    const downBtn = document.createElement("button");
    downBtn.textContent = "↓";
    downBtn.addEventListener("click", () => move(item.id, 1));

    // liにすべて追加
    li.append(text, time, editBtn, delBtn, upBtn, downBtn);

    // ulに追加
    list.appendChild(li);
  });

  // 登録件数表示
  countText.textContent = `登録件数：${items.length} 件`;
}


/****************************
 * 編集処理
 ****************************/

function editItem(itemId) {

  // 対象データを検索
  const item = items.find(i => i.id === itemId);

  // 入力ダイアログ表示
  const newName = prompt("新しい商品名", item.name);

  // 入力チェック
  if (newName && newName.trim() !== "") {
    item.name = newName.trim();
    save();
    render();
  }
}


/****************************
 * 削除処理
 ****************************/

function deleteItem(itemId) {

  // 指定ID以外のデータだけ残す
  items = items.filter(i => i.id !== itemId);

  save();
  render();
}


/****************************
 * 並び替え処理
 ****************************/

function move(itemId, dir) {

  // 現在位置取得
  const index = items.findIndex(i => i.id === itemId);
  const target = index + dir;

  // 範囲外なら何もしない
  if (target < 0 || target >= items.length) return;

  // 要素の入れ替え
  [items[index], items[target]] = [items[target], items[index]];

  save();
  render();
}


/****************************
 * 保存処理
 ****************************/

function save() {
  // 配列 → JSON文字列 → localStorage保存
  localStorage.setItem("shoppingItems", JSON.stringify(items));
}
