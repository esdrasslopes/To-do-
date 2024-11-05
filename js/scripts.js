// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const description = document.querySelector("#description");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editDescription = document.querySelector("#edit-description");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const SearchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

// Variáveis globais
let oldInputValue;
let oldDescriptionValue;

// Funções

const savetodo = (title, text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const textContent = document.createElement("div");
  textContent.classList.add("text-content");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = title;

  textContent.appendChild(todoTitle);

  const todoText = document.createElement("p");
  todoText.innerHTML = text;

  textContent.appendChild(todoText);

  todo.appendChild(textContent);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash-alt"></i>';

  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    savetoLocalStorage({ title, text, done });
  }

  todoList.appendChild(todo);

  [todoInput, description].forEach((item) => {
    item.value = "";
  });

  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (title, text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    let todoText = todo.querySelector("p");

    if (
      todoTitle.innerText === oldInputValue &&
      todoText.innerText === oldDescriptionValue
    ) {
      todoTitle.innerText = title;
      todoText.innerText = text;
      updateeditTodoLocalStorage(oldInputValue, oldDescriptionValue, title, text)
    }
  });
};

const getSearchTodo = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    let todoText = todo.querySelector("p").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    todo.style.display = "flex";

    console.log(todoText);

    if (
      !todoTitle.includes(normalizedSearch) &&
      !todoText.includes(normalizedSearch)
    ) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) => {
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
      });

      break;

    case "todo":
      todos.forEach((todo) => {
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
      });
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;
  const descriptionValue = description.value;
  if (inputValue || descriptionValue) {
    savetodo(inputValue, descriptionValue);
  }
});

document.addEventListener("click", (e) => {
  const targetElement = e.target;
  const parentElement = targetElement.closest("div");

  let todoTitle;
  let todoText;

  if (parentElement && parentElement.querySelector("h3")) {
    todoTitle = parentElement.querySelector("h3").innerText;
    todoText = parentElement.querySelector("p").innerText;
  }

  if (targetElement.classList.contains("finish-todo")) {
    parentElement.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle, todoText);
  }

  if (targetElement.classList.contains("remove-todo")) {
    parentElement.remove();
    removeTodoLocalStorage(todoTitle, todoText);
  }

  if (targetElement.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
    editDescription.value = todoText;
    oldDescriptionValue = todoText;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;
  const editDescriptionValue = editDescription.value;
  if (editInputValue || editDescriptionValue) {
    updateTodo(editInputValue, editDescriptionValue);
  }
  toggleForms();
});

SearchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchTodo(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  SearchInput.value = "";
  SearchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Local Storage

const getTodoLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodoLocalStorage();

  todos.forEach((todo) => savetodo(todo.title, todo.text, todo.done, 0));
};

const savetoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoTitle, TodoText) => {
  const todos = getTodoLocalStorage();

  const filterTodos = todos.filter(
    (todo) => todo.title != todoTitle && todo.text != TodoText
  );

  localStorage.setItem("todos", JSON.stringify(filterTodos));
};

const updateTodoStatusLocalStorage = (todoTitle, TodoText) => {
  const todos = getTodoLocalStorage();

  todos.map((todo) =>
    todo.text === TodoText && todo.title === todoTitle
      ? (todo.done = !todo.done)
      : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateeditTodoLocalStorage = (
  TodoOldTitle,
  TodoOldtext,
  TodoNewTitle,
  TodoNewText
) => {
  
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => {
    if (todo.title === TodoOldTitle && todo.text === TodoOldtext) {
      todo.title = TodoNewTitle;
      todo.text = TodoNewText;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
