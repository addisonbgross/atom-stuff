(function() {
  var $, $$, Command, CommandPane, CompositeDisposable, HighlightingPane, MainPane, Modifiers, Outputs, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  Modifiers = require('../modifier/modifier');

  Outputs = require('../output/output');

  Command = require('../provider/command');

  MainPane = require('./command-edit-main-pane');

  HighlightingPane = require('./command-edit-highlighting-pane');

  module.exports = CommandPane = (function(_super) {
    __extends(CommandPane, _super);

    function CommandPane() {
      this.cancel = __bind(this.cancel, this);
      this.accept = __bind(this.accept, this);
      return CommandPane.__super__.constructor.apply(this, arguments);
    }

    CommandPane.content = function() {
      return this.div({
        "class": 'commandview'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'buttons'
          }, function() {
            _this.div({
              "class": 'btn btn-sm btn-error icon icon-x inline-block-tight'
            }, 'Cancel');
            return _this.div({
              "class": 'btn btn-sm btn-primary icon icon-check inline-block-tight'
            }, 'Accept');
          });
          return _this.div({
            "class": '_panes',
            outlet: 'panes_view'
          });
        };
      })(this));
    };

    CommandPane.prototype.initialize = function(command) {
      this.command = command;
      return this.blacklist = [];
    };

    CommandPane.prototype.destroy = function() {
      this.blacklist = null;
      this.success_callback = null;
      return this.cancel_callback = null;
    };

    CommandPane.prototype.setCallbacks = function(success_callback, cancel_callback) {
      this.success_callback = success_callback;
      this.cancel_callback = cancel_callback;
    };

    CommandPane.prototype.setBlacklist = function(blacklist) {
      this.blacklist = blacklist;
    };

    CommandPane.prototype.setSource = function(sourceFile) {
      this.sourceFile = sourceFile;
    };

    CommandPane.prototype.detached = function() {
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

    CommandPane.prototype.attached = function() {
      this.panes = [];
      if (__indexOf.call(this.blacklist, 'general') < 0) {
        this.buildPane(new MainPane, 'General', 'icon-gear');
      }
      if (__indexOf.call(this.blacklist, 'modifiers') < 0) {
        this.initializeModifierModules();
      }
      if (__indexOf.call(this.blacklist, 'highlighting') < 0) {
        this.buildPane(new HighlightingPane, 'Highlighting', 'icon-eye');
      }
      if (__indexOf.call(this.blacklist, 'outputs') < 0) {
        this.initializeOutputModules();
      }
      this.addEventHandlers();
      return this.initializePanes();
    };

    CommandPane.prototype.buildPane = function(view, name, icon, key, desc, enabled, moveable) {
      var item;
      if (desc == null) {
        desc = '';
      }
      if (moveable == null) {
        moveable = false;
      }
      item = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            var c;
            c = 'panel-heading top';
            if (key != null) {
              c += ' module';
            }
            return _this.div({
              "class": c
            }, function() {
              if (key != null) {
                _this.div({
                  "class": 'checkbox align'
                }, function() {
                  _this.input({
                    id: key,
                    type: 'checkbox'
                  });
                  return _this.label(function() {
                    _this.div({
                      "class": "settings-name icon " + icon
                    }, name);
                    return _this.div(function() {
                      return _this.span({
                        "class": 'inline-block text-subtle'
                      }, desc);
                    });
                  });
                });
                if (moveable) {
                  return _this.div({
                    "class": 'align'
                  }, function() {
                    _this.div({
                      "class": 'icon-triangle-up'
                    });
                    return _this.div({
                      "class": 'icon-triangle-down'
                    });
                  });
                }
              } else {
                return _this.span({
                  "class": "settings-name icon " + icon
                }, name);
              }
            });
          };
        })(this));
      });
      if (view.element != null) {
        item.append(view.element);
      }
      if (key != null) {
        item.find('input').prop('checked', enabled);
        if (view.element != null) {
          if (!enabled) {
            view.element.classList.add('hidden');
          }
          item.children()[0].children[0].children[0].onchange = function() {
            var _ref1, _ref2;
            if (this.checked) {
              return (_ref1 = this.parentNode.parentNode.parentNode.children[1]) != null ? _ref1.classList.remove('hidden') : void 0;
            } else {
              return (_ref2 = this.parentNode.parentNode.parentNode.children[1]) != null ? _ref2.classList.add('hidden') : void 0;
            }
          };
        }
        if (moveable) {
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
        }
      }
      this.panes_view.append(item);
      this.panes.push({
        pane: item,
        view: view,
        key: key
      });
      return {
        pane: item,
        view: view
      };
    };

    CommandPane.prototype.initializeModifierModules = function() {
      var key, mod, rest, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
      this.modifier_count = 0;
      _ref2 = Object.keys((_ref1 = this.command.modifier) != null ? _ref1 : {});
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        mod = Modifiers.modules[key];
        if (mod["private"]) {
          continue;
        }
        this.modifier_count = this.modifier_count + 1;
        this.buildPane(new mod.edit, "Modifier: " + mod.name, 'icon-pencil', key, mod.description, ((_ref3 = this.command.modifier) != null ? _ref3[key] : void 0) != null, true);
      }
      if (Object.keys((_ref4 = this.command.modifier) != null ? _ref4 : {}).length === 0) {
        rest = Object.keys(Modifiers.modules);
      } else {
        rest = Object.keys(Modifiers.modules).filter((function(_this) {
          return function(key) {
            var _ref5;
            return !(__indexOf.call(Object.keys((_ref5 = _this.command.modifier) != null ? _ref5 : {}), key) >= 0);
          };
        })(this));
      }
      _results = [];
      for (_j = 0, _len1 = rest.length; _j < _len1; _j++) {
        key = rest[_j];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Modifiers.activate(key) !== true) {
          continue;
        }
        mod = Modifiers.modules[key];
        if (mod["private"]) {
          continue;
        }
        this.modifier_count = this.modifier_count + 1;
        _results.push(this.buildPane(new mod.edit, "Modifier: " + mod.name, 'icon-pencil', key, mod.description, ((_ref5 = this.command.modifier) != null ? _ref5[key] : void 0) != null, true));
      }
      return _results;
    };

    CommandPane.prototype.initializeOutputModules = function() {
      var key, mod, _i, _len, _ref1, _ref2, _results;
      _ref1 = Object.keys(Outputs.modules);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        if (__indexOf.call(this.blacklist, key) >= 0) {
          continue;
        }
        if (Outputs.activate(key) !== true) {
          continue;
        }
        mod = Outputs.modules[key];
        if (mod["private"]) {
          continue;
        }
        _results.push(this.buildPane(new mod.edit, "Output: " + mod.name, 'icon-terminal', key, mod.description, ((_ref2 = this.command.output) != null ? _ref2[key] : void 0) != null));
      }
      return _results;
    };

    CommandPane.prototype.moveModifierUp = function(index) {
      var e;
      if ((index === 1) || (index > this.modifier_count)) {
        return false;
      }
      e = this.panes.splice(index, 1)[0];
      this.panes.splice(index - 1, 0, e);
      return $(this.panes_view.children()[index - 1]).before(e.pane);
    };

    CommandPane.prototype.moveModifierDown = function(index) {
      var e;
      if (index >= this.modifier_count) {
        return false;
      }
      e = this.panes.splice(index + 1, 1)[0];
      this.panes.splice(index, 0, e);
      return $(this.panes_view.children()[index]).before(e.pane);
    };

    CommandPane.prototype.removeEventHandlers = function() {
      this.off('click', '.checkbox label');
      this.off('click', '.buttons .icon-x');
      this.off('click', '.buttons .icon-check');
      return this.disposables.dispose();
    };

    CommandPane.prototype.addEventHandlers = function() {
      this.on('click', '.checkbox label', function(e) {
        var item, _base;
        item = $(e.currentTarget.parentNode.children[0]);
        item.prop('checked', !item.prop('checked'));
        return typeof (_base = item[0]).onchange === "function" ? _base.onchange() : void 0;
      });
      this.on('click', '.buttons .icon-x', this.cancel);
      this.on('click', '.buttons .icon-check', this.accept);
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.commands.add(this.element, {
        'core:confirm': this.accept,
        'core:cancel': this.cancel
      }));
    };

    CommandPane.prototype.initializePanes = function() {
      var command, view, _i, _len, _ref1, _results;
      _ref1 = this.panes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i].view;
        if (this.command.oldname != null) {
          command = this.command;
        } else {
          command = null;
        }
        _results.push(view != null ? typeof view.set === "function" ? view.set(command, this.sourceFile) : void 0 : void 0);
      }
      return _results;
    };

    CommandPane.prototype.accept = function(event) {
      var c, key, p, pane, ret, view, _i, _len, _ref1, _ref2, _ref3, _ref4;
      c = new Command;
      c.project = this.command.project;
      _ref1 = this.panes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], pane = _ref2.pane, view = _ref2.view, key = _ref2.key;
        if ((p = pane.children()[0].children[0].children[0]) != null) {
          if (p.checked) {
            if ((ret = view.get(c)) != null) {
              if ((_ref3 = atom.notifications) != null) {
                _ref3.addError("Error in '" + key + "' module: " + ret);
              }
              event.stopPropagation();
              return;
            }
          }
        } else {
          if ((ret = view.get(c)) != null) {
            if ((_ref4 = atom.notifications) != null) {
              _ref4.addError(ret);
            }
            event.stopPropagation();
            return;
          }
        }
      }
      this.success_callback(c, this.command.oldname);
      return this.cancel(event);
    };

    CommandPane.prototype.cancel = function(event) {
      if (typeof this.cancel_callback === "function") {
        this.cancel_callback();
      }
      return event.stopPropagation();
    };

    return CommandPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1lZGl0LXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRHQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLE9BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxxQkFBUixDQVBWLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBVFgsQ0FBQTs7QUFBQSxFQVVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQ0FBUixDQVZuQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLGtDQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFMLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxj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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-edit-pane.coffee
