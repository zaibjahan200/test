const STORAGE_KEY = "todo-app-items";
const ID_COUNTER_KEY = "todo-app-id-counter";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let todos = loadTodos();
let fallbackIdCounter = loadFallbackCounter();
renderTodos();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: generateId(),
    text,
    completed: false,
  });

  input.value = "";
  saveTodos();
  renderTodos();
});

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const counter = nextFallbackCounter();
  return `${counter}-${Math.random().toString(36).slice(2)}`;
}

function loadFallbackCounter() {
  try {
    const value = Number(localStorage.getItem(ID_COUNTER_KEY));
    return Number.isFinite(value) && value > 0 ? value : Date.now();
  } catch {
    return Date.now();
  }
}

function nextFallbackCounter() {
  fallbackIdCounter += 1;
  try {
    localStorage.setItem(ID_COUNTER_KEY, String(fallbackIdCounter));
  } catch {}
  return fallbackIdCounter;
}

function loadTodos() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    if (todo.completed) item.classList.add("completed");

    const left = document.createElement("div");
    left.className = "todo-item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Mark ${todo.text} as complete`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    left.appendChild(checkbox);
    left.appendChild(text);
    item.appendChild(left);
    item.appendChild(deleteButton);
    list.appendChild(item);
  });
}
