'use strict';

const todoList = {
  listName: '',
  lastModified: null,
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeName: function(newName) {
    this.todos.listName = newName;
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
  },
  deleteAll: function() {
    this.todos.length = 0;
  }
};

const todoListControls = {
  displayToggleAll: false,
  displayDeleteAll: false
};

// display todos
const handlers = {
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
    view.displayControls();
  },
  deleteAll: function() {
    todoList.deleteAll();
    view.displayTodos();
    view.displayControls();
  },
  addTodo: function() {
    let addTodoTextInput = document.getElementById('add-todo-text-input');
    if (addTodoTextInput.value === '') {return};
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
    view.displayControls();
  },
  changeTodo: function(position, todoText) {
    todoList.changeTodo(position, todoText);
    view.displayTodos();
  },
  changeName: function(newName) {
    todoList.changeName(newName);
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
    view.displayControls();
  },
  toggleCompleted : function(position) {
    todoList.toggleCompleted(position);
    view.displayTodos();
    view.displayControls();
  }
};

const settings = {
  toggleMenu: function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('show-menu');
  }
}

const view = {
  displayTodos: function() {
    let todoUl = document.querySelector('ul');
    todoUl.innerHTML = '';

    todoList.todos.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);

    todoList.todos.forEach((todo, index) => {
      let todoLi = document.createElement('li');
      let todoSpan = document.createElement('span');
      todoSpan.classList.add('todo-text');
      if (todo.completed) {
        todoLi.appendChild(this.createCompleteButton('marked-completed'));
        todoSpan.classList.add('faded-text');
      } else {
        todoLi.appendChild(this.createCompleteButton());
        todoSpan.setAttribute('contenteditable', 'true');
      }
      todoLi.id = index;
      todoSpan.textContent = todo.todoText;
      todoLi.appendChild(todoSpan);
      todoLi.appendChild(this.createDeleteButton());
      todoUl.appendChild(todoLi);
    });
    document.getElementById('last-mod').innerText = this.setModifiedTime();
  },
  displayControls: function() {
    const toggleAllButton = document.getElementById('toggle-all-todos');
    // toggle all button
    if (!todoListControls.displayToggleAll && todoList.todos.length > 1) {
      toggleAllButton.classList.remove('hidden');
      todoListControls.displayToggleAll = true;
    } else if (todoListControls.displayToggleAll && todoList.todos.length < 2) {
      toggleAllButton.classList.add('hidden');
      todoListControls.displayToggleAll = false;
    }

    const deleteAllButton = document.getElementById('delete-all-todos')
    let completedTodos = 0;
    todoList.todos.forEach(todo => {
      if (todo.completed) {
        completedTodos++;
      }
    });
    if ((completedTodos === todoList.todos.length) && todoList.todos.length > 1) {
      deleteAllButton.classList.remove('hidden');
    } else if ((completedTodos != todoList.todos.length) || todoList.todos.length < 2) {
      deleteAllButton.classList.add('hidden');
    }
  },
  createDeleteButton: function() {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'delete-button', 'fas', 'fa-trash-alt');              
    return deleteButton;
  },
  createCompleteButton: function(complete) {
     const completeButton = document.createElement('button');
     completeButton.classList.add('btn', 'complete-button', 'fas', 'fa-check', complete);
     return completeButton;
  },
  setModifiedTime: function() {
    const modifiedTime = new Date();
    let modHours = modifiedTime.getHours();
    let modMinutes = modifiedTime.getMinutes();
    if (modHours < 10) {modHours = '0' + modHours};
    if (modMinutes < 10) {modMinutes = '0' + modMinutes};
    const displayModifiedtime = modHours + ':' + modMinutes;
    document.getElementById('edited').classList.remove('hidden');
    todoList.lastModified = modifiedTime;
    return displayModifiedtime;
  },
  eventListeners: function() {
    // adding events to delete and completed button
    const eventUl = document.querySelector('ul');
    eventUl.addEventListener('click', (e) => {
      const clickedElement = e.target;
      if (clickedElement.className.includes('delete-button')) {
        animations.deleteAnimation(handlers.deleteTodo, parseInt(clickedElement.parentNode.id));
      }
      if (clickedElement.className.includes('complete-button')) {
        handlers.toggleCompleted(parseInt(clickedElement.parentNode.id));
      }
    });
    // updating changed todo task on blur
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
    // prevent multiline todos and blur on enter
    const todoListContainer = document.getElementById('todo-list');
    todoListContainer.addEventListener('keydown', (e) => {
      if (e.target.id === 'list-name' || e.target.className === 'todo-text') {
        if (e.keyCode === 13 || e.which === 13) {
           e.preventDefault();
          e.target.blur();
        }
      }
    })
    // updating list name on blur
    const listNameInput = document.getElementById('list-name');
    listNameInput.addEventListener('blur', (e) => {
      const newListName = e.target.textContent;
      if (newListName === todoList.todos.listName) {
        return;
      } else {
        handlers.changeName(newListName);
      }
    })
    // adding enter key to add button
    const addButton = document.getElementById('add-todo-text-input');
    addButton.addEventListener('keydown', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        handlers.addTodo();
      }
    });
  }
};

// init eventlisteners

view.eventListeners();

const animations = {
  deleteAnimation: function(callback, id) {
    const element = document.getElementById(id);
    element.addEventListener('animationend', () => {
      callback(element);
    }, {once: true}); 
    element.classList.add('delete-animation');
  },
  deleteAllAnimation: function(callback) {
    const element = document.getElementById('todo-list');
    element.addEventListener('animationend', () => {
      callback();
      element.classList.remove('delete-animation-all');
    });
    element.classList.add('delete-animation-all');
  }
};






