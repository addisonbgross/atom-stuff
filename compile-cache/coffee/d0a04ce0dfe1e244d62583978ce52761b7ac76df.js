(function() {
  var $, $$, Command, DepInfoPane, DependencyPane, Input, Project, View, path, resolveDependencies, resolveDependency, resolveQueue, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  resolveQueue = function(queue, q, projects, resolve, reject) {
    var c;
    if ((c = queue.splice(0, 1)[0]) == null) {
      return resolve(q);
    }
    return resolveDependencies(c, [], projects).then((function(new_q) {
      return resolveQueue(queue, q.concat(new_q.reverse()), projects, resolve, reject);
    }), reject);
  };

  resolveDependencies = function(command, q, projects) {
    return new Promise(function(resolve, reject) {
      var _name;
      q.push(command);
      if (command.modifier.dependency == null) {
        return resolve(q);
      }
      if (command.source == null) {
        throw new Error('No source parameter');
      }
      if (projects[_name = command.project] == null) {
        projects[_name] = {};
      }
      if (projects[command.project][command.source] == null) {
        projects[command.project][command.source] = new Project(command.project, command.source);
      }
      return resolveDependency(command.modifier.dependency, q, projects, projects[command.project][command.source], resolve, reject);
    });
  };

  resolveDependency = function(_arg, q, projects, project, resolve, reject) {
    var abort, k, list;
    list = _arg.list, abort = _arg.abort;
    if ((k = list.pop()) == null) {
      return resolve(q);
    }
    return project.getCommandById(k[0], k[1]).then((function(command) {
      if (command.name !== k[2]) {
        return reject(new Error("Command names " + command.name + " and " + k[0] + ":" + k[1] + ":" + k[2] + " do not match"));
      }
      return resolveDependencies(command, q, projects).then((function() {
        return resolveDependency({
          list: list,
          abort: abort
        }, q, projects, project, resolve, reject);
      }), reject);
    }), function(e) {
      if (abort) {
        return reject(e);
      }
      return resolveDependency({
        list: list,
        abort: abort
      }, q, projects, project, resolve, reject);
    });
  };

  module.exports = {
    name: 'Dependencies',
    description: 'Execute other commands before this one.',
    "private": false,
    activate: function(command, project, input) {
      Command = command;
      Project = project;
      return Input = input;
    },
    edit: DependencyPane = (function(_super) {
      __extends(DependencyPane, _super);

      function DependencyPane() {
        return DependencyPane.__super__.constructor.apply(this, arguments);
      }

      DependencyPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'dependency-list'
            }, function() {
              _this.div({
                "class": 'active-dependencies',
                outlet: 'deps'
              });
              _this.div({
                "class": 'dependency-select-list hidden',
                outlet: 'select'
              });
              return _this.div({
                "class": 'config-icons'
              }, function() {
                _this.div({
                  id: 'add',
                  "class": 'icon-plus'
                });
                return _this.div({
                  id: 'cancel',
                  "class": 'icon-x hidden'
                });
              });
            });
            return _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'abort',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Abort when command not found');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Cancel the operation if a command could not be resolved');
                });
              });
            });
          };
        })(this));
      };

      DependencyPane.prototype.set = function(command, source) {
        var dep, _i, _len, _ref1;
        this.find('#add').on('click', (function(_this) {
          return function() {
            var project, _ref1;
            try {
              project = new Project(path.dirname(source), source);
              return project.getCommandNameObjects().then((function(commands) {
                var id, item, name, pid, _i, _len, _ref1;
                _this.select.empty();
                for (_i = 0, _len = commands.length; _i < _len; _i++) {
                  _ref1 = commands[_i], pid = _ref1.pid, id = _ref1.id, name = _ref1.name;
                  item = $$(function() {
                    return this.div({
                      "class": 'dependency',
                      pid: pid,
                      id: id,
                      name: name
                    }, (function(_this) {
                      return function() {
                        return _this.div("" + pid + ":" + id + ":" + name);
                      };
                    })(this));
                  });
                  item.on('click', function(_arg) {
                    var currentTarget;
                    currentTarget = _arg.currentTarget;
                    pid = currentTarget.attributes.getNamedItem('pid').value;
                    id = currentTarget.attributes.getNamedItem('id').value;
                    name = currentTarget.attributes.getNamedItem('name').value;
                    _this.add([pid, id, name]);
                    return _this.cancel();
                  });
                  _this.select.append(item);
                }
                _this.deps.addClass('hidden');
                _this.select.removeClass('hidden');
                _this.find('#add').addClass('hidden');
                return _this.find('#cancel').removeClass('hidden');
              }), function(e) {
                var _ref1;
                return (_ref1 = atom.notifications) != null ? _ref1.addError(e) : void 0;
              });
            } catch (_error) {
              return (_ref1 = atom.notifications) != null ? _ref1.addError("Could not read from config file " + source) : void 0;
            }
          };
        })(this));
        this.find('#cancel').on('click', (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this));
        this.deps.empty();
        if ((command != null ? command.modifier.dependency : void 0) != null) {
          _ref1 = command.modifier.dependency.list;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            dep = _ref1[_i];
            this.deps.append(this.generateItem(dep));
          }
          return this.find('#abort').prop('checked', command.modifier.dependency.abort);
        } else {
          return this.find('#abort').prop('checked', true);
        }
      };

      DependencyPane.prototype.get = function(command) {
        var child, id, name, pid, _i, _len, _ref1;
        command.modifier.dependency = {};
        command.modifier.dependency.list = [];
        command.modifier.dependency.abort = this.find('#abort').prop('checked');
        _ref1 = this.deps.children();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          pid = child.attributes.getNamedItem('pid').value;
          id = child.attributes.getNamedItem('id').value;
          name = child.attributes.getNamedItem('name').value;
          command.modifier.dependency.list.push([pid, id, name]);
        }
        return null;
      };

      DependencyPane.prototype.add = function(item) {
        return this.deps.append(this.generateItem(item));
      };

      DependencyPane.prototype.cancel = function() {
        this.deps.removeClass('hidden');
        this.select.addClass('hidden');
        this.find('#add').removeClass('hidden');
        return this.find('#cancel').addClass('hidden');
      };

      DependencyPane.prototype.generateItem = function(_arg) {
        var id, item, name, pid;
        pid = _arg[0], id = _arg[1], name = _arg[2];
        item = $$(function() {
          return this.div({
            "class": 'dependency',
            pid: pid,
            id: id,
            name: name
          }, (function(_this) {
            return function() {
              _this.div("" + pid + ":" + id + ":" + name);
              return _this.div({
                "class": 'actions'
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
            };
          })(this));
        });
        item.on('click', '.icon-triangle-down', function(_arg1) {
          var currentTarget, i;
          currentTarget = _arg1.currentTarget;
          i = $(currentTarget.parentNode.parentNode);
          return i.next().after(i);
        });
        item.on('click', '.icon-triangle-up', function(_arg1) {
          var currentTarget, i;
          currentTarget = _arg1.currentTarget;
          i = $(currentTarget.parentNode.parentNode);
          return i.prev().before(i);
        });
        item.on('click', '.icon-x', function(_arg1) {
          var currentTarget;
          currentTarget = _arg1.currentTarget;
          return $(currentTarget.parentNode.parentNode).remove();
        });
        return item;
      };

      return DependencyPane;

    })(View),
    info: DepInfoPane = (function() {
      function DepInfoPane(command) {
        var id, keys, name, pid, value, values, _i, _key, _len, _ref1, _ref2;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        _ref1 = command.modifier.dependency.list;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          _ref2 = _ref1[_i], pid = _ref2[0], id = _ref2[1], name = _ref2[2];
          _key = document.createElement('div');
          _key.classList.add('text-padded');
          _key.innerText = "Dependency " + pid + ":" + id + ":";
          value = document.createElement('div');
          value.classList.add('text-padded');
          value.innerText = name;
          keys.appendChild(_key);
          values.appendChild(value);
        }
        _key = document.createElement('div');
        _key.classList.add('text-padded');
        _key.innerText = 'Abort on resolve error:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.modifier.dependency.abort);
        keys.appendChild(_key);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return DepInfoPane;

    })(),
    "in": function(queue) {
      return new Promise(function(resolve, reject) {
        var projects;
        projects = {};
        return new Promise(function(resolve, reject) {
          return resolveQueue(queue.queue, [], projects, resolve, reject);
        }).then((function(q) {
          var key, key2, _i, _j, _len, _len1, _ref1, _ref2;
          queue.queue = q;
          _ref1 = Object.keys(projects);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            key = _ref1[_i];
            _ref2 = Object.keys(projects[key]);
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              key2 = _ref2[_j];
              projects[key][key2].destroy();
            }
          }
          return resolve();
        }), function(e) {
          var key, key2, _i, _j, _len, _len1, _ref1, _ref2;
          _ref1 = Object.keys(projects);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            key = _ref1[_i];
            _ref2 = Object.keys(projects[key]);
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              key2 = _ref2[_j];
              projects[key][key2].destroy();
            }
          }
          return reject(e);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL2RlcGVuZGVuY3kuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1JQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLElBSlYsQ0FBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxJQUxSLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsU0FBQyxLQUFELEVBQVEsQ0FBUixFQUFXLFFBQVgsRUFBcUIsT0FBckIsRUFBOEIsTUFBOUIsR0FBQTtBQUNiLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBeUIsbUNBQXpCO0FBQUEsYUFBTyxPQUFBLENBQVEsQ0FBUixDQUFQLENBQUE7S0FBQTtXQUNBLG1CQUFBLENBQW9CLENBQXBCLEVBQXVCLEVBQXZCLEVBQTJCLFFBQTNCLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsQ0FBQyxTQUFDLEtBQUQsR0FBQTthQUFXLFlBQUEsQ0FBYSxLQUFiLEVBQW9CLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFULENBQXBCLEVBQStDLFFBQS9DLEVBQXlELE9BQXpELEVBQWtFLE1BQWxFLEVBQVg7SUFBQSxDQUFELENBQTFDLEVBQWtJLE1BQWxJLEVBRmE7RUFBQSxDQVBmLENBQUE7O0FBQUEsRUFXQSxtQkFBQSxHQUFzQixTQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWEs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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/dependency.coffee
