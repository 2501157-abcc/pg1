let items = [];
let id = 0;

const form = document.getElementById("form");
const list = document.getElementById("list");
const filter = document.getElementById("filter");
const nameInput = document.getElementById("name");
const categorySelect = document.getElementById("category");
const countText = document.getElementById("count");

/* =========================
   起動時：localStorage読込
========================= */

const saved = localStorage.getItem("shoppingItems");

if (saved) {
  items = JSON.parse(saved);
  if (items.length > 0) {
    id = Math.max(...items.map(i => i.id)) + 1;
  }
}

render();

/* =========================
   追加
========================= */

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();

  if (name === "") {
    alert("商品名を入力してください");
    return;
  }

  const now = new Date();
  const time =
    now.getFullYear() + "/" +
    String(now.getMonth() + 1).padStart(2, "0") + "/" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  items.push({
    id: id++,
    name: name,
    category: categorySelect.value,
    time: time
  });

  save();
  form.reset();
  render();
});

filter.addEventListener("change", render);

/* =========================
   表示
========================= */

function render() {
  list.innerHTML = "";

  const showItems =
    filter.value === "all"
      ? items
      : items.filter(i => i.category === filter.value);

  showItems.forEach(item => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${item.name}（${item.category}）`;

    const time = document.createElement("small");
    time.textContent = "🕒 " + item.time;
    time.style.display = "block";
    time.style.fontSize = "12px";

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => editItem(item.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", () => deleteItem(item.id));

    const upBtn = document.createElement("button");
    upBtn.textContent = "↑";
    upBtn.addEventListener("click", () => move(item.id, -1));

    const downBtn = document.createElement("button");
    downBtn.textContent = "↓";
    downBtn.addEventListener("click", () => move(item.id, 1));

    li.append(text, time, editBtn, delBtn, upBtn, downBtn);
    list.appendChild(li);
  });

  countText.textContent = `登録件数：${items.length} 件`;
}

/* =========================
   編集・削除・移動
========================= */

function editItem(itemId) {
  const item = items.find(i => i.id === itemId);
  const newName = prompt("新しい商品名", item.name);

  if (newName && newName.trim() !== "") {
    item.name = newName.trim();
    save();
    render();
  }
}

function deleteItem(itemId) {
  items = items.filter(i => i.id !== itemId);
  save();
  render();
}

function move(itemId, dir) {
  const index = items.findIndex(i => i.id === itemId);
  const target = index + dir;

  if (target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  save();
  render();
}

/* =========================
   保存
========================= */

function save() {
  localStorage.setItem("shoppingItems", JSON.stringify(items));
}
