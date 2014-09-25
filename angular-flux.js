(function (window, angular) {


  angular.module('flux', [])
    .provider('flux', function fluxProvider () {

      this.$get = ['$rootScope', function fluxFactory ($rootScope) {

        /* ACTIONS */

        function createAction () {
          var callbacks = [];
          var action = function () {
            var args = arguments;
            callbacks.forEach(function (callback) {
              callback.func.apply(callback.context, args);
            });
          };
          action.onTrigger = function (callback, context) {
            callbacks.push({
              context: context,
              func: callback
            });
          };
          return action;
        }

        /* STORE */


        function Store () {
          this._state = {};
          this._scopes = [];
        }

        Store.prototype = {
          addState: function (state, value) {
            if (typeof state === 'object') {
              this._state = state;
            } else if (typeof state === 'string') {
              this._state[state] = value;
            }
          },
          setState: function (state, value) {
            if (typeof state === 'string' && arguments.length === 2) {
              if (typeof this._state[state] === 'undefined') {
                throw new Error('angular-flux: You are trying to set a state, ' + state + ', that does not exist, use addState instead')
              }
              this._state[state] = value;
              this._update(state, value);
              return this._state[state];
            } else if (typeof state === 'object' && arguments.length === 1) {
              Object.keys(state).forEach(function (key) {
                if (typeof this._state[key] === 'undefined') {
                  throw new Error('angular-flux: You are trying to set a state, ' + key + ', that does not exist, use addState instead')
                }
                this._state[key] = state[key];
                this._update(key, state[key]);
              }, this);
              return state;
            }
          },
          getState: function (state) {
            if (typeof state === 'string' && arguments.length === 1) {
              return this._state[state];
            }
          },
          emit: function () {
            $rootScope.$emit.apply($rootScope, arguments);
          },
          listenTo: function (action, callback) {
            action.onTrigger(callback, this);
          },
          _update: function (state, value) {
            this._scopes.forEach(function (scope) {
              if (!scope.states || (scope.states && scope.states.indexOf(state) >= 0)) {
                scope.scope[state] = value;
              }
            }, this);
          }
        };

        return {
          createActions: function (actions) {
            var exports = {};
            actions.forEach(function (action) {
              exports[action] = createAction();
            });
            return exports;
          },
          createStore: function (constr) {
            var store = new Store();
            constr.call(store);
            return {
              addStateTo: function (scope, states) {

                var scopeData = {
                  scope: scope,
                  states: states
                };

                store._scopes.push(scopeData);

                scope.$on('$destroy', function () {
                  store._scopes.splice(store._scopes.indexOf(scopeData), 1);
                });

                Object.keys(store._state).forEach(function (key) {
                  scope[key] = store._state[key];
                }, this);

              }
            };
          }
        };
      }];

    });

}(window, window.angular));