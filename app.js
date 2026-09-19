// 這段程式碼用來管理待辦清單的資料與畫面更新
const STORAGE_KEY = 'todo-list-items';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

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
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依照目前資料重新渲染待辦清單與統計數量
function renderTodos() {
  const todos = loadTodos();
  const incompleteCount = todos.filter((todo) => !todo.completed).length;

  remainingCount.textContent = `未完成: ${incompleteCount} 項`;

  if (todos.length === 0) {
    todoList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const listItem = document.createElement('li');
    listItem.className = `todo-item${todo.completed ? ' is-completed' : ''}`;
    listItem.dataset.id = String(todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('aria-label', '勾選此待辦事項');
    checkbox.addEventListener('change', () => {
      const currentTodos = loadTodos();
      const target = currentTodos.find((item) => item.id === todo.id);

      if (!target) {
        return;
      }

      target.completed = checkbox.checked;
      saveTodos(currentTodos);
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
      const currentTodos = loadTodos().filter((item) => item.id !== todo.id);
      saveTodos(currentTodos);
      renderTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(text);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });
}

// 新增待辦事項，空白輸入會被忽略
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  const todos = loadTodos();
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos(todos);
  todoInput.value = '';
  todoInput.focus();
  renderTodos();
}

todoForm.addEventListener('submit', addTodo);
renderTodos();
