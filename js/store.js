angular.module('todomvc').service('store', function (actions, flux, $rootScope, $routeParams, todoStorage) {

  return flux.createStore(function () {

    this.addState({
      todos: todoStorage.get(),
      status: '',
      statusFilter: null,
      remainingCount: 0,
      completedCount: 0,
      allChecked: false
    });

    this.saveTodos = function () {
      var todos = this.getState('todos');
      todoStorage.put(todos);
      this.updateStats();
    };

    this.updateStats = function () {
      var todos = this.getState('todos');
      var remainingCount = todos.filter(function (todo) {
        return !todo.completed;
      }).length;
      this.setState('remainingCount', remainingCount);
      this.setState('completedCount', todos.length - remainingCount);
      this.setState('allChecked', !remainingCount);
    };

    this.addTodo = function (todo) {
      var todos = this.getState('todos');
      todo.title = todo.title.trim();
      if (todo.title) {
        todos.push(todo);
        this.saveTodos();
      }
    };

    this.updateTodo = function (title, todo) {
      title = title.trim();
      if (!title) {
        this.removeTodo(todo);
      } else {
        todo.title = title;
      }
      this.saveTodos();
    };

    this.removeTodo = function (todo) {
      var todos = this.getState('todos');
      todos.splice(todos.indexOf(todo), 1);
      this.saveTodos();
    };

    this.clearCompletedTodos = function () {
      var todos = this.getState('todos');
      for (var x = todos.length - 1; x >= 0; x--) {
        if (todos[x].completed) {
          todos.splice(x, 1);
        }
      }
      this.saveTodos();
    };

    this.markAll = function () {
      var todos = this.getState('todos');
      var isAllCompleted = !!this.getState('remainingCount');
      todos.forEach(function (todo) {
        todo.completed = isAllCompleted;
      });
      this.setState('allChecked', isAllCompleted);
      this.saveTodos();
    };

    this.toggleCompleted = function (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    };

    // Monitor the current route for changes and adjust the filter accordingly.
    $rootScope.$on('$routeChangeSuccess', function () {
      var status = this.setState('status', $routeParams.status || '');
      switch(status) {
        case 'active':
          this.setState('statusFilter', {completed: false});
          break;
        case 'completed':
          this.setState('statusFilter', {completed: true});
          break;
        default:
          this.setState('statusFilter', null);
      }
    }.bind(this));

    this.listenTo(actions.addTodo, this.addTodo);
    this.listenTo(actions.updateTodo, this.updateTodo);
    this.listenTo(actions.removeTodo, this.removeTodo);
    this.listenTo(actions.clearCompletedTodos, this.clearCompletedTodos);
    this.listenTo(actions.markAll, this.markAll);
    this.listenTo(actions.toggleCompleted, this.toggleCompleted);

    this.updateStats();

  });

});