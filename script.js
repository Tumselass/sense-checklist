'use strict';

const todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function(position) {
    let todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    let totalTodos = this.todos.length;
    let completedTodos = 0;

    // get number og completed todos
    this.todos.forEach(todo => {
      if (todo.completed) {
        completedTodos++;
      }
    })
    // set all or none
    this.todos.forEach(todo => {
      totalTodos === completedTodos ? todo.completed = false : todo.completed = true;
    });
  }
};

// display todos
const handlers = {
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  },
  addTodo: function() {
    let addTodoTextInput = document.getElementById('add-todo-text-input');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },
  changeTodo: function() {
    let changeTodoPositionInput = document.getElementById('change-todo-position-input');
    let changeTodoTextInput = document.getElementById('change-todo-text-input');
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted : function() {
    let toggleCompletedPositionInput = document.getElementById('toggle-completed-cosition-input');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  }
};

const view = {
  displayTodos: function() {
    let todoUl = document.querySelector('ul');
    todoUl.innerHTML = '';
    todoList.todos.forEach((todo, index) => {
      let todoLi = document.createElement('li');
      let todoTextWithCompletion = '';
      if (todo.completed) {
        todoTextWithCompletion = `(x) ${todo.todoText}`;
      } else {
        todoTextWithCompletion = `( ) ${todo.todoText}`;
      }
      todoLi.id = index;
      todoLi.textContent = todoTextWithCompletion;
      todoLi.appendChild(this.createDeleteButton());
      todoUl.appendChild(todoLi);
    });
  },
  createDeleteButton: function() {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-button');                                 
    return deleteButton;
  },
  createCompleteButton: function() {
     
  },
  eventListeners: function() {
    document.querySelector('ul').addEventListener('click', (e) => {
      let clickedElement = e.target;
      if (clickedElement.className === 'delete-button') {
        handlers.deleteTodo(parseInt(clickedElement.parentNode.id));
      }
    });
  }
};

// init eventlisteners

view.eventListeners();








