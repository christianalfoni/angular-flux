var app = angular.module('app', ['flux'])
  .service('AppActions', function (flux) {
    return flux.createActions([
      'update'
    ]);
  })
  .service('AppStore', function (AppActions, flux) {

    return flux.createStore(function () {

      this.state('value', 'foo');

      this.updateValue = function (value) {
        this.state('value', value);
      };

      this.listenTo(AppActions.update, this.updateValue);

    });

  })
  .controller('MyCtrl', function (AppStore, AppActions, $scope) {

    AppStore.attachTo($scope);

    $scope.update = function () {
      AppActions.update('bar');
    };

  });