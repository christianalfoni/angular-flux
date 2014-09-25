angular-flux
============

A plugin for Angular JS that lets you write code with the FLUX pattern

### Background
Read the following blog post about this plugin: [Is it possible to use the FLUX architecture with Angular JS?]
(http://www.christianalfoni.com/javascript/2014/09/25/using-flux-with-angular.html). A short summary is that the
"flux"-service added with this
plugin lets you add actions and store services to your application. By following the pattern in the example below you
 will ensure a "one way flow" of state. Making it a lot easier to scale your application.

 Also feel free to check out the refactored TodoMVC application in this repo. Based on the Angular JS example on
 [todomvc.com](http://www.todomvc.com).

### How to install
```html
<body>
  <script src="angular.js"></script>
  <script src="angular-flux.js"></script>
</body>
```


```sh
$ bower install angular-flux-bower
```

### How to use

```javascript
angular.module('app', ['flux'])
  .service('actions', function (flux) {

    return flux.createActions([
      'addTodo'
    ]);

  })
  .service('store', function (flux, actions) {

    return flux.createStore({

      this.addState({
        todos: []
      });

      this.addTodo = function (todo) {
        this.getState('todos').push(todo);
      };

      this.listenTo(actions.addTodo, this.addTodo);

    });

  })
  .controller('TodoCtrl', function ($scope, store, actions) {

    store.addStateTo($scope);

    $scope.input = {
      title: ''
    };

    $scope.addTodo = function () {
      actions.addTodo({
        title: $scope.input.title,
        completed: false
      });
      $scope.input.title = '';
    };

  });
```

### Store
```javascript
angular.module('app', [])
  .service('store', function (flux, actions) {
    return flux.createStore({

      this.addState({
        stateA: 'foo',
        stateB: 'bar'
      });

      // Change a state
      this.handleActionA = function (value) {
        this.setState('stateA', value);
      };

      // Change multiple states at once
      this.handleActionB = function (value) {
        this.setState({
          stateA: this.getState('stateB'),
          stateB: value
        });
      };

      // Trigger an event that will reach all scopes
      this.handleActionC = function () {
        this.emit('my:event');
      };

      this.listenTo(actions.actionA, this.handleActionA);
      this.listenTo(actions.actionB, this.handleActionB);
      this.listenTo(actions.actionC, this.handleActionC);

    });
  });
```

### Adding state
```javascript
angular.module('app', ['flux'])
  .controller('TodoCtrl', function ($scope, store) {

    // You can also add state to nested object on
    // your $scope
    $scope.store = {};
    store.addStateTo($scope.store);


  });
```

### Keeping a one way flow
When defining bindings in your templates only use **ng-model** for $scope properties in your controller. $scope
properties related to a state should only have a "one way" binding. F.ex.:

```html
<input type="text" ng-value="myStoreValue"/>
<input type="checkbox" ng-checked="myStoreBool"/>
```

### Good to know
- When scopes are removed, so are their relationship with any store