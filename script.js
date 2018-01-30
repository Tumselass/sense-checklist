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
  changeTodo: function(position, todoText) {
    todoList.changeTodo(position, todoText);
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted : function(position) {
    todoList.toggleCompleted(position);
    view.displayTodos();
  }
};

const view = {
  displayTodos: function() {
    let todoUl = document.querySelector('ul');
    todoUl.innerHTML = '';
    todoList.todos.forEach((todo, index) => {
      let todoLi = document.createElement('li');
      let todoSpan = document.createElement('span');
      todoSpan.classList.add('todo-text');
      todoSpan.setAttribute('contenteditable', 'true');
      if (todo.completed) {
        todoLi.appendChild(this.createCompleteButton('X'));
      } else {
        todoLi.appendChild(this.createCompleteButton('-'));
      }
      todoLi.id = index;
      todoSpan.textContent = todo.todoText;
      todoLi.appendChild(todoSpan);
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
  createCompleteButton: function(complete) {
     const completeButton = document.createElement('button');
     completeButton.innerText = complete
     completeButton.classList.add('complete-button');
     return completeButton;
  },
  eventListeners: function() {
    const eventUl = document.querySelector('ul');
    eventUl.addEventListener('click', (e) => {
      const clickedElement = e.target;
      if (clickedElement.className === 'delete-button') {
        handlers.deleteTodo(parseInt(clickedElement.parentNode.id));
      }
      if (clickedElement.className === 'complete-button') {
        handlers.toggleCompleted(parseInt(clickedElement.parentNode.id));
      }
    });

    eventUl.addEventListener('blur', (e) => {
      const bluredElement = e.target;
      if (bluredElement.className === 'todo-text') {
        const newTodoText = bluredElement.textContent;
        const bluredPosition = parseInt(bluredElement.parentNode.id);
        if (newTodoText === todoList.todos[bluredPosition].todoText) {
          return;
        } else {
        handlers.changeTodo(bluredPosition, newTodoText);
        }
      }
    }, true);
  }
};

// init eventlisteners

view.eventListeners();








