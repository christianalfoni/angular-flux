/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
  .controller('TodoCtrl', function TodoCtrl (store, actions, $scope) {
    'use strict';

    store.addStateTo($scope);

    $scope.titles = {
      newTodo: '',
      editedTodo: ''
    };
    $scope.editedTodo = null;

    $scope.addTodo = function () {
      actions.addTodo({
        title: $scope.titles.newTodo,
        completed: false
      });
      $scope.titles.newTodo = '';
    };

    $scope.editTodo = function (todo) {
      $scope.editedTodo = todo;
      $scope.titles.editedTodo = todo.title;
    };

    $scope.doneEditing = function (todo) {
      actions.updateTodo($scope.titles.editedTodo, todo);
      $scope.editedTodo = null;
    };

    $scope.revertEditing = function () {
      $scope.editedTodo = null;
    };

    $scope.removeTodo = function (todo) {
      actions.removeTodo(todo);
    };

    $scope.toggleCompleted = function (todo) {
      actions.toggleCompleted(todo);
    };

    $scope.clearCompletedTodos = function () {
      actions.clearCompletedTodos();
    };

    $scope.markAll = function () {
      actions.markAll();
    };

  });
