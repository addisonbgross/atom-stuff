(function() {
  var $$, InfoPane, MainPane, Modifiers, Outputs, ProfilePane, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  Outputs = require('../output/output');

  Modifiers = require('../modifier/modifier');

  MainPane = require('./command-info-main-pane');

  ProfilePane = require('./command-info-profile-pane');

  module.exports = InfoPane = (function(_super) {
    __extends(InfoPane, _super);

    function InfoPane() {
      return InfoPane.__super__.constructor.apply(this, arguments);
    }

    InfoPane.content = function() {
      return this.div({
        "class": 'command inset-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'top panel-heading'
          }, function() {
            _this.div({
              id: 'info',
              "class": 'align'
            }, function() {
              _this.div({
                "class": 'icon-triangle-right expander'
              });
              return _this.div({
                id: 'name',
                outlet: 'name'
              });
            });
            return _this.div({
              id: 'options',
              "class": 'align'
            }, function() {
              _this.div({
                "class": 'icon-pencil'
              });
              _this.div({
                "class": 'icon-triangle-up move-up'
              });
              _this.div({
                "class": 'icon-triangle-down move-down'
              });
              return _this.div({
                "class": 'icon-x'
              });
            });
          });
          return _this.div({
            "class": 'info hidden panel-body',
            outlet: 'info'
          });
        };
      })(this));
    };

    InfoPane.prototype.initialize = function(command) {
      this.command = command;
      this.panes = [];
      this.name.text(this.command.name);
      this.info.append(this.buildPane(MainPane, 'General'));
      this.initializeModifierModules();
      this.info.append(this.buildPane(ProfilePane, 'Highlighting'));
      this.initializeOutputModules();
      return this.addEventHandlers();
    };

    InfoPane.prototype.setCallbacks = function(up, down, edit, remove) {
      this.up = up;
      this.down = down;
      this.edit = edit;
      this.remove = remove;
    };

    InfoPane.prototype.addEventHandlers = function() {
      this.on('click', '.icon-pencil', (function(_this) {
        return function() {
          return _this.edit(_this.command);
        };
      })(this));
      this.on('click', '.move-up', (function(_this) {
        return function() {
          return _this.up(_this.command);
        };
      })(this));
      this.on('click', '.move-down', (function(_this) {
        return function() {
          return _this.down(_this.command);
        };
      })(this));
      this.on('click', '.icon-x', (function(_this) {
        return function() {
          return _this.remove(_this.command);
        };
      })(this));
      return this.on('click', '.expander', function(_arg) {
        var currentTarget;
        currentTarget = _arg.currentTarget;
        if (currentTarget.classList.contains('icon-triangle-right')) {
          currentTarget.classList.remove('icon-triangle-right');
          currentTarget.classList.add('icon-triangle-down');
          return currentTarget.parentNode.parentNode.parentNode.children[1].classList.remove('hidden');
        } else {
          currentTarget.classList.add('icon-triangle-right');
          currentTarget.classList.remove('icon-triangle-down');
          return currentTarget.parentNode.parentNode.parentNode.children[1].classList.add('hidden');
        }
      });
    };

    InfoPane.prototype.buildPane = function(Element, name) {
      var element;
      if (name != null) {
        element = $$(function() {
          return this.div({
            "class": 'inset-panel'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": 'panel-heading'
              }, name);
              if (Element != null) {
                return _this.div({
                  "class": 'panel-body padded'
                });
              }
            };
          })(this));
        });
      } else {
        element = $$(function() {
          return this.div({
            "class": 'inset-panel'
          }, (function(_this) {
            return function() {
              return _this.div({
                "class": 'panel-body padded'
              });
            };
          })(this));
        });
      }
      if (Element != null) {
        this.panes.push(new Element(this.command));
        element.find('.panel-body').append(this.panes[this.panes.length - 1].element);
      }
      return this.info.append(element);
    };

    InfoPane.prototype.initializeOutputModules = function() {
      var key, _i, _len, _ref1, _ref2, _results;
      _ref2 = Object.keys((_ref1 = this.command.output) != null ? _ref1 : {});
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (Outputs.activate(key) !== true) {
          continue;
        }
        if (Outputs.modules[key]["private"]) {
          continue;
        }
        _results.push(this.buildPane(Outputs.modules[key].info, 'Output: ' + Outputs.modules[key].name));
      }
      return _results;
    };

    InfoPane.prototype.initializeModifierModules = function() {
      var key, _i, _len, _ref1, _ref2, _results;
      _ref2 = Object.keys((_ref1 = this.command.modifier) != null ? _ref1 : {});
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        if (Modifiers.modules[key]["private"]) {
          continue;
        }
        _results.push(this.buildPane(Modifiers.modules[key].info, 'Modifier: ' + Modifiers.modules[key].name));
      }
      return _results;
    };

    return InfoPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsVUFBQSxFQUFELEVBQUssWUFBQSxJQUFMLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FIWixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDZCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQkFBUDtPQUFMLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sbUJBQVA7V0FBTCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxFQUFBLEVBQUksTUFBSjtBQUFBLGNBQVksT0FBQSxFQUFPLE9BQW5CO2FBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyw4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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-pane.coffee