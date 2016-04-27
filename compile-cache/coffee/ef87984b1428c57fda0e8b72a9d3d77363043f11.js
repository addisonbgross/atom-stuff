(function() {
  var $, $$, Command, CommandPane, CompositeDisposable, MainPane, Modifiers, Outputs, ProfilePane, View, _ref,
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

  ProfilePane = require('./command-edit-profile-pane');

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
      this.initializeModifierModules();
      if (__indexOf.call(this.blacklist, 'highlighting') < 0) {
        this.buildPane(new ProfilePane, 'Highlighting', 'icon-plug');
      }
      this.initializeOutputModules();
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
      if ((index === 1) || (index > Object.keys(Modifiers.modules).length)) {
        return false;
      }
      e = this.panes.splice(index, 1)[0];
      this.panes.splice(index - 1, 0, e);
      return $(this.panes_view.children()[index - 1]).before(e.pane);
    };

    CommandPane.prototype.moveModifierDown = function(index) {
      var e;
      if (index >= Object.keys(Modifiers.modules).length) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1lZGl0LXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLE9BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxxQkFBUixDQVBWLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBVFgsQ0FBQTs7QUFBQSxFQVVBLFdBQUEsR0FBYyxPQUFBLENBQVEsNkJBQVIsQ0FWZCxDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLGtDQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFMLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-edit-pane.coffee
