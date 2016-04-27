(function() {
  var Buffer, BufferInfoPane, BufferPane, View, buffers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  buffers = {};

  module.exports = {
    name: 'Text Buffer',
    description: 'Display command output in unnamed text buffer',
    "private": false,
    activate: function() {
      return buffers = {};
    },
    deactivate: function() {
      return buffers = {};
    },
    edit: BufferPane = (function(_super) {
      __extends(BufferPane, _super);

      function BufferPane() {
        return BufferPane.__super__.constructor.apply(this, arguments);
      }

      BufferPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'recycle_buffer',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Recycle editor tab');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Re-use the same buffer');
                });
              });
            });
            return _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'all_in_one',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Execute Queue in one buffer');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Print output of all commands of the queue in one buffer');
                });
              });
            });
          };
        })(this));
      };

      BufferPane.prototype.set = function(command) {
        var _ref, _ref1;
        if ((command != null ? (_ref = command.output) != null ? _ref.buffer : void 0 : void 0) != null) {
          this.find('#recycle_buffer').prop('checked', command.output.buffer.recycle_buffer);
          return this.find('#all_in_one').prop('checked', (_ref1 = command.output.buffer.queue_in_buffer) != null ? _ref1 : true);
        } else {
          this.find('#recycle_buffer').prop('checked', true);
          return this.find('#all_in_one').prop('checked', true);
        }
      };

      BufferPane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).buffer == null) {
          _base.buffer = {};
        }
        command.output.buffer.recycle_buffer = this.find('#recycle_buffer').prop('checked');
        command.output.buffer.queue_in_buffer = this.find('#all_in_one').prop('checked');
        return null;
      };

      return BufferPane;

    })(View),
    info: BufferInfoPane = (function() {
      function BufferInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Recycle Buffer:</div>\n<div class="text-padded">Execute queue in one buffer:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.buffer.recycle_buffer);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.buffer.queue_in_buffer);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return BufferInfoPane;

    })(),
    output: Buffer = (function() {
      function Buffer() {}

      Buffer.prototype.newQueue = function(queue) {
        var command, _name, _ref;
        this.buffer = null;
        this.p = null;
        this.queue_in_buffer = (_ref = queue.queue[queue.queue.length - 1].output.buffer) != null ? _ref.queue_in_buffer : void 0;
        if (this.queue_in_buffer) {
          if ((command = queue.queue[queue.queue.length - 1]).output.buffer.recycle_buffer) {
            if (buffers[_name = command.project] == null) {
              buffers[_name] = {};
            }
            if ((this.buffer = buffers[command.project][command.name]) != null) {
              return this.buffer.setText('');
            } else {
              return (this.p = atom.workspace.open(null)).then((function(_this) {
                return function(buffer) {
                  _this.buffer = buffer;
                  buffers[command.project][command.name] = _this.buffer;
                  _this.buffer.onDidDestroy(function() {
                    var _ref1;
                    _this.buffer = null;
                    return (_ref1 = buffers[command.project]) != null ? _ref1[command.name] = null : void 0;
                  });
                  return _this.p = null;
                };
              })(this));
            }
          } else {
            return (this.p = atom.workspace.open(null)).then((function(_this) {
              return function(buffer) {
                _this.buffer = buffer;
                _this.p = null;
                return _this.buffer.onDidDestroy(function() {
                  return _this.buffer = null;
                });
              };
            })(this));
          }
        }
      };

      Buffer.prototype.newCommand = function(command) {
        var _name;
        if (this.queue_in_buffer) {
          return;
        }
        this.buffer = null;
        if (command.output.buffer.recycle_buffer) {
          if (buffers[_name = command.project] == null) {
            buffers[_name] = {};
          }
          if ((this.buffer = buffers[command.project][command.name]) != null) {
            return this.buffer.setText('');
          } else {
            return (this.p = atom.workspace.open(null)).then((function(_this) {
              return function(buffer) {
                _this.buffer = buffer;
                buffers[command.project][command.name] = _this.buffer;
                _this.buffer.onDidDestroy(function() {
                  var _ref;
                  _this.buffer = null;
                  return (_ref = buffers[command.project]) != null ? _ref[command.name] = null : void 0;
                });
                return _this.p = null;
              };
            })(this));
          }
        } else {
          return (this.p = atom.workspace.open(null)).then((function(_this) {
            return function(buffer) {
              _this.buffer = buffer;
              _this.p = null;
              return _this.buffer.onDidDestroy(function() {
                return _this.buffer = null;
              });
            };
          })(this));
        }
      };

      Buffer.prototype.stdout_in = function(_arg) {
        var input, _ref;
        input = _arg.input;
        if (this.p != null) {
          return this.p.then((function(_this) {
            return function(buffer) {
              var _ref;
              _this.buffer = buffer;
              _this.p = null;
              return (_ref = _this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
            };
          })(this));
        } else {
          return (_ref = this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
        }
      };

      Buffer.prototype.stderr_in = function(_arg) {
        var input, _ref;
        input = _arg.input;
        if (this.p != null) {
          return this.p.then((function(_this) {
            return function(buffer) {
              var _ref;
              _this.buffer = buffer;
              _this.p = null;
              return (_ref = _this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
            };
          })(this));
        } else {
          return (_ref = this.buffer) != null ? _ref.insertText(input + '\n') : void 0;
        }
      };

      return Buffer;

    })(),
    getBuffers: function() {
      return buffers;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9idWZmZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxFQUZWLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLCtDQURiO0FBQUEsSUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQUEsR0FBVSxHQURGO0lBQUEsQ0FKVjtBQUFBLElBT0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLE9BQUEsR0FBVSxHQURBO0lBQUEsQ0FQWjtBQUFBLElBVUEsSUFBQSxFQUNRO0FBRUosbUNBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sbUJBQVA7U0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxnQkFBUDthQUFMLEVBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxFQUFBLEVBQUksZ0JBQUo7QUFBQSxnQkFBc0IsSUFBQSxFQUFNLFVBQTVCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/buffer.coffee
