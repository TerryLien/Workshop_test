// 這段程式碼用來管理待辦清單、篩選條件與深色模式
const STORAGE_KEY = 'todo-list-items';
const THEME_KEY = 'todo-theme';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = loadTodos();
let currentFilter = 'all';

// 讀取 localStorage 中的待辦資料，若資料有問題則回傳空陣列
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error('載入待辦資料失敗:', error);
    return [];
  }
}

// 儲存待辦資料到 localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依據系統偏好或使用者設定套用深色模式
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';

  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? '切換至淺色模式' : '切換至深色模式');
}

// 讀取已儲存的主題，若未設定則跟隨作業系統設定
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// 依照篩選條件決定空白狀態的提示文字
function getEmptyStateMessage() {
  if (todos.length === 0) {
    return '還沒有任何待辦事項,新增一個吧!';
  }

  if (currentFilter === 'active') {
    return '目前沒有未完成的事項';
  }

  if (currentFilter === 'completed') {
    return '目前沒有已完成的事項';
  }

  return '還沒有任何待辦事項,新增一個吧!';
}

// 依照目前篩選條件回傳要顯示的待辦項目
function getVisibleTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 依照目前資料重新渲染待辦清單與統計數量
function renderTodos() {
  const visibleTodos = getVisibleTodos();
  const incompleteCount = todos.filter((todo) => !todo.completed).length;

  remainingCount.textContent = `未完成: ${incompleteCount} 項`;

  if (visibleTodos.length === 0) {
    todoList.innerHTML = '';
    emptyState.textContent = getEmptyStateMessage();
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  todoList.innerHTML = '';

  visibleTodos.forEach((todo) => {
    const listItem = document.createElement('li');
    listItem.className = `todo-item${todo.completed ? ' is-completed' : ''}`;
    listItem.dataset.id = String(todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('aria-label', '勾選此待辦事項');
    checkbox.addEventListener('change', () => {
      todos = todos.map((item) => {
        if (item.id === todo.id) {
          return {
            ...item,
            completed: checkbox.checked,
          };
        }

        return item;
      });

      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除 ${todo.text}`);
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(text);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });
}

// 更新篩選按鈕樣式
function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

// 篩選切換
function setFilter(filter) {
  currentFilter = filter;
  updateFilterButtons();
  renderTodos();
}

// 新增待辦事項，空白輸入會被忽略
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTodos();
  todoInput.value = '';
  todoInput.focus();
  renderTodos();
}

// 切換深色模式，並記住使用者偏好
function toggleTheme() {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener('click', toggleTheme);
todoForm.addEventListener('submit', addTodo);

initTheme();
updateFilterButtons();
renderTodos();
