(function() {
  var $$, Environment, InfoPane, MainPane, Modifiers, Outputs, StreamInfoPane, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  Outputs = require('../output/output');

  Modifiers = require('../modifier/modifier');

  Environment = require('../environment/environment');

  MainPane = require('./command-info-main-pane');

  StreamInfoPane = require('./command-info-stream-pane');

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
      this.initializeEnvironmentModule();
      this.initializeHighlightingPanes();
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

    InfoPane.prototype.buildPane = function(Element, name, config) {
      var bodyclass, element, headerclass;
      headerclass = 'panel-heading';
      bodyclass = 'panel-body padded';
      if (name != null) {
        element = $$(function() {
          return this.div({
            "class": 'inset-panel'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": headerclass
              }, name);
              if (Element != null) {
                return _this.div({
                  "class": bodyclass
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
                "class": bodyclass
              });
            };
          })(this));
        });
      }
      if (Element != null) {
        this.panes.push(new Element(this.command, config));
        element.find('.panel-body').append(this.panes[this.panes.length - 1].element);
      }
      return this.info.append(element);
    };

    InfoPane.prototype.initializeHighlightingPanes = function() {
      this.initializeStreamModules(this.command.stdout, 'Standard Output');
      return this.initializeStreamModules(this.command.stderr, 'Standard Error');
    };

    InfoPane.prototype.initializeStreamModules = function(stream, name) {
      if (stream.pipeline.length !== 0) {
        return this.buildPane(StreamInfoPane, name, stream);
      }
    };

    InfoPane.prototype.initializeEnvironmentModule = function() {
      var key;
      key = this.command.environment.name;
      if (Environment.activate(key) !== true) {
        return;
      }
      if (Environment.modules[key]["private"]) {
        return;
      }
      return this.buildPane(Environment.modules[key].info, 'Environment: ' + Environment.modules[key].name);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsVUFBQSxFQUFELEVBQUssWUFBQSxJQUFMLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSw0QkFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDRCQUFSLENBUGpCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRUosK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1CQUFQO1dBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsRUFBQSxFQUFJLE1BQUo7QUFBQSxjQUFZLE9BQUEsRUFBTyxPQUFuQjthQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMv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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-pane.coffee
