const form = document.querySelector("#topic-form");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const topicsList = document.querySelector("#topics");
const emptyState = document.querySelector("#empty");
const count = document.querySelector("#count");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector("#cancel-btn");

const storageKey = "notebook-topics";
let topics = loadTopics();
let editId = null;

function loadTopics() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveTopics() {
  localStorage.setItem(storageKey, JSON.stringify(topics));
}

function setCount() {
  count.textContent = `${topics.length} مورد`;
}

function resetForm() {
  form.reset();
  editId = null;
  submitBtn.textContent = "افزودن تاپیک";
  cancelBtn.hidden = true;
}

function renderTopics() {
  topicsList.innerHTML = "";

  topics.forEach((topic) => {
    const item = document.createElement("li");
    item.className = "topic";

    const title = document.createElement("h3");
    title.textContent = topic.title;

    const content = document.createElement("p");
    content.textContent = topic.content;

    const meta = document.createElement("span");
    meta.className = "count";
    meta.textContent = `آخرین تغییر: ${new Date(topic.updatedAt).toLocaleString("fa-IR")}`;

    const actions = document.createElement("div");
    actions.className = "topic-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "ویرایش";
    editButton.addEventListener("click", () => startEdit(topic.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "حذف";
    deleteButton.addEventListener("click", () => removeTopic(topic.id));

    actions.append(editButton, deleteButton);
    item.append(title, content, meta, actions);
    topicsList.appendChild(item);
  });

  emptyState.classList.toggle("show", topics.length === 0);
  setCount();
}

function startEdit(id) {
  const topic = topics.find((item) => item.id === id);
  if (!topic) {
    return;
  }
  editId = id;
  titleInput.value = topic.title;
  contentInput.value = topic.content;
  submitBtn.textContent = "ذخیره تغییرات";
  cancelBtn.hidden = false;
}

function removeTopic(id) {
  topics = topics.filter((topic) => topic.id !== id);
  saveTopics();
  renderTopics();

  if (editId === id) {
    resetForm();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    return;
  }

  if (editId) {
    topics = topics.map((topic) =>
      topic.id === editId
        ? { ...topic, title, content, updatedAt: new Date().toISOString() }
        : topic
    );
  } else {
    const newTopic = {
      id: crypto.randomUUID(),
      title,
      content,
      updatedAt: new Date().toISOString(),
    };
    topics.unshift(newTopic);
  }

  saveTopics();
  renderTopics();
  resetForm();
});

cancelBtn.addEventListener("click", resetForm);

renderTopics();
