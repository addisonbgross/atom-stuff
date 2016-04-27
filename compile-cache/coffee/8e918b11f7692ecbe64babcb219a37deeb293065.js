(function() {
  var $, $$, CompositeDisposable, Modifiers, StreamPane, TextEditorView, View, nice, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  Modifiers = require('../stream-modifiers/modifiers');

  nice = {
    stdout: 'Standard Output Stream (stdout)',
    stderr: 'Standard Error Stream (stderr)'
  };

  module.exports = StreamPane = (function(_super) {
    __extends(StreamPane, _super);

    function StreamPane() {
      return StreamPane.__super__.constructor.apply(this, arguments);
    }

    StreamPane.content = function() {
      return this.div({
        "class": 'stream-modifier panel-body'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, function() {
              _this.span({
                "class": 'inline-block panel-text icon icon-plug',
                outlet: 'heading'
              });
              return _this.span({
                id: 'add-modifier',
                "class": 'inline-block btn btn-sm icon icon-plus'
              }, 'Add Modifier');
            });
            return _this.div({
              "class": 'panel-body padded',
              outlet: 'panes_view'
            });
          });
        };
      })(this));
    };

    StreamPane.prototype.attached = function() {
      this.disposables = new CompositeDisposable;
      return this.panes = [];
    };

    StreamPane.prototype.detached = function() {
      var item, _i, _len, _ref1, _ref2;
      this.removeEventHandlers();
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if ((_ref2 = item.view) != null) {
          if (typeof _ref2.destroy === "function") {
            _ref2.destroy();
          }
        }
      }
      this.panes = null;
      return this.panes_view.empty();
    };

    StreamPane.prototype.set = function(command, stream, sourceFile) {
      this.command = command;
      this.stream = stream;
      this.sourceFile = sourceFile;
      this.heading.text(nice[this.stream]);
      this.loadAddCommands(stream);
      if (this.command != null) {
        this.loadModifierModules(this.command[stream].pipeline);
      }
      return this.addEventHandlers();
    };

    StreamPane.prototype.get = function(command, stream) {
      var e, view, _i, _len, _ref1;
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i].view;
        if ((e = view.get(command, stream)) != null) {
          return e;
        }
      }
      return null;
    };

    StreamPane.prototype.loadAddCommands = function(stream) {
      var context, contextMenu, key, name, _i, _len, _ref1;
      this.addClass(stream);
      context = [];
      _ref1 = Object.keys(Modifiers.modules).sort();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        name = Modifiers.modules[key].name;
        this.disposables.add(atom.commands.add(this[0], "build-tools:add-" + key, ((function(_this) {
          return function(k) {
            return function() {
              return _this.addModifier(k);
            };
          };
        })(this))(key)));
        context.push({
          label: name,
          command: "build-tools:add-" + key
        });
      }
      contextMenu = {};
      contextMenu["." + stream + " #add-modifier"] = context;
      return this.disposables.add(atom.contextMenu.add(contextMenu));
    };

    StreamPane.prototype.loadModifierModules = function(pipeline) {
      var config, name, _i, _len, _ref1, _results;
      _results = [];
      for (_i = 0, _len = pipeline.length; _i < _len; _i++) {
        _ref1 = pipeline[_i], name = _ref1.name, config = _ref1.config;
        _results.push(this.addModifier(name, config));
      }
      return _results;
    };

    StreamPane.prototype.addModifier = function(name, config) {
      var mod, view;
      if (Modifiers.activate(name) !== true) {
        return;
      }
      mod = Modifiers.modules[name];
      if (mod["private"]) {
        return;
      }
      view = this.buildPane(new mod.edit, mod.name, 'icon-eye', name, mod.description, config).view;
      return this.initializePane(view, config);
    };

    StreamPane.prototype.initializePane = function(view, config) {
      return view != null ? typeof view.set === "function" ? view.set(this.command, config, this.stream, this.sourceFile) : void 0 : void 0;
    };

    StreamPane.prototype.buildPane = function(view, name, icon, key, desc, config) {
      var item;
      if (desc == null) {
        desc = '';
      }
      item = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'panel-heading top module'
            }, function() {
              _this.div({
                "class": 'align'
              }, function() {
                _this.div({
                  "class": "settings-name icon " + icon
                }, name);
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, desc);
                });
              });
              return _this.div({
                "class": 'align'
              }, function() {
                _this.div({
                  "class": 'icon-triangle-up'
                });
                _this.div({
                  "class": 'icon-triangle-down'
                });
                return _this.div({
                  "class": 'icon-x'
                });
              });
            });
          };
        })(this));
      });
      if (view.element != null) {
        item.append(view.element);
      }
      item.on('click', '.panel-heading .align .icon-triangle-up', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.moveModifierUp(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      item.on('click', '.panel-heading .align .icon-triangle-down', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.moveModifierDown(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      item.on('click', '.panel-heading .align .icon-x', (function(_this) {
        return function(event) {
          var index, pane, _i, _len, _ref1, _results;
          _ref1 = _this.panes;
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            pane = _ref1[index];
            if (pane.key === key) {
              _this.removeModifier(index);
              event.stopPropagation();
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      this.panes_view.append(item);
      this.panes.push({
        pane: item,
        view: view,
        key: key,
        config: config
      });
      return {
        pane: item,
        view: view,
        config: config
      };
    };

    StreamPane.prototype.moveModifierUp = function(index) {
      var e;
      if ((index === 0) || (index > Object.keys(Modifiers.modules).length)) {
        return false;
      }
      e = this.panes.splice(index, 1)[0];
      this.panes.splice(index - 1, 0, e);
      return $(this.panes_view.children()[index - 1]).before(e.pane);
    };

    StreamPane.prototype.moveModifierDown = function(index) {
      var e;
      if (index >= Object.keys(Modifiers.modules).length) {
        return false;
      }
      e = this.panes.splice(index + 1, 1)[0];
      this.panes.splice(index, 0, e);
      return $(this.panes_view.children()[index]).before(e.pane);
    };

    StreamPane.prototype.removeModifier = function(index) {
      var pane;
      if (index > this.panes.length) {
        return false;
      }
      pane = this.panes.splice(index, 1)[0].pane;
      return pane.remove();
    };

    StreamPane.prototype.addEventHandlers = function() {
      return this.on('click', '#add-modifier', function(event) {
        return atom.contextMenu.showForEvent(event);
      });
    };

    StreamPane.prototype.removeEventHandlers = function() {
      this.off('click', '#add-modifier');
      return this.disposables.dispose();
    };

    return StreamPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1lZGl0LXN0cmVhbS1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0MsT0FBQSxDQUFRLHNCQUFSLENBQWhDLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsc0JBQUEsY0FBUixFQUF3QixZQUFBLElBQXhCLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsK0JBQVIsQ0FKWixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsaUNBQVI7QUFBQSxJQUNBLE1BQUEsRUFBUSxnQ0FEUjtHQVBGLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNEJBQVA7T0FBTCxFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN4QyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLGNBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-edit-stream-pane.coffee
