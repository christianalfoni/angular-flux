angular.module('todomvc').service('actions', function (flux) {
  return flux.createActions([
    'addTodo',
    'removeTodo',
    'updateTodo',
    'clearCompletedTodos',
    'markAll',
    'toggleCompleted'
  ]);
});