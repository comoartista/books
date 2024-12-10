const form = document.querySelector("#item-form");
const inputTitle = form.querySelector("#book-title");
const inputAuthor = form.querySelector("#book-author");
const inputCover = form.querySelector("#book-cover");
const itemList = document.querySelector("#item-list");
const filterInput = document.querySelector("#filter");

function createElement(tag, className, content = "") {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.textContent = content;
  return element;
}

function createImageElement(file, altText) {
  const img = document.createElement("img");
  img.alt = altText;

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target.result);
    reader.readAsDataURL(file);
  } else {
    img.src = "./images/default.png";
  }

  return img;
}

function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem("items")) || [];
}
function saveItemsToStorage(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();
  items.push(item);
  saveItemsToStorage(items);
}

function renderItem(item) {
  const itemEl = createElement("li", "book-item");

  const imageWrapperEl = createElement("div", "img");
  const imageEl = document.createElement("img");
  imageEl.src = item.cover;
  imageEl.alt = item.title;
  imageWrapperEl.appendChild(imageEl);

  const detailsWrapperEl = createElement("div", "book-details");
  const titleEl = createElement("h3", "book-title", item.title);
  const authorEl = createElement("p", "book-author", item.author);
  detailsWrapperEl.append(titleEl, authorEl);

  const buttonEl = createElement("button", "remove-btn", "Remove");
  buttonEl.addEventListener("click", () => {
    itemEl.remove();
  });

  itemEl.append(imageWrapperEl, detailsWrapperEl, buttonEl);
  itemList.appendChild(itemEl);
}

function addItem(e) {
  e.preventDefault();

  const newTitle = inputTitle.value.trim();
  const newAuthor = inputAuthor.value.trim();
  const newCoverFile = inputCover.files[0];

  if (!newTitle || !newAuthor) {
    alert("Please fill in all fields");
    return;
  }

  const processNewItem = (cover) => {
    const newItem = {
      title: newTitle,
      author: newAuthor,
      cover: cover || "./images/default.png",
    };
    addItemToStorage(newItem);
    renderItem(newItem);
    form.reset();
  };

  if (newCoverFile) {
    const reader = new FileReader();
    reader.onload = (e) => processNewItem(e.target.result);
    reader.readAsDataURL(newCoverFile);
  } else {
    processNewItem();
  }
}

function loadItems() {
  const items = getItemsFromStorage();
  items.forEach(renderItem);
}

function removeItem(e) {
  const titleToDelete =
    e.target.previousElementSibling.firstElementChild.textContent
      .trim()
      .toLowerCase();
  if (e.target.classList.contains("remove-btn")) {
    e.target.parentElement.remove();
  }

  removeItemFromStorage(titleToDelete);
}

function removeItemFromStorage(titleToDelete) {
  const items = getItemsFromStorage();

  const updateItems = items.filter(
    (item) => item.title.trim().toLowerCase() !== titleToDelete
  );
  saveItemsToStorage(updateItems);
}

function filterItem(e) {
  text = e.target.value.trim().toLowerCase();
  let hasMatches = false;

  itemList.querySelectorAll("li").forEach((item) => {
    const itemName = item
      .querySelector(".book-title")
      .textContent.trim()
      .toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = "flex";
      hasMatches = true;
    } else {
      item.style.display = "none";
    }
  });
  if (!hasMatches) {
    alert("No matches");
  }
}
document.addEventListener("DOMContentLoaded", loadItems);
form.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
filterInput.addEventListener("input", filterItem);
