(function() {
  var Breakpoint, DbgpInstance, DebugContext, Disposable, Emitter, Q, Watchpoint, helpers, parseString, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  parseString = require('xml2js').parseString;

  Q = require('q');

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable;

  helpers = require('../../helpers.coffee');

  DebugContext = require('../../models/debug-context');

  Watchpoint = require('../../models/watchpoint');

  Breakpoint = require('../../models/breakpoint');

  module.exports = DbgpInstance = (function(_super) {
    __extends(DbgpInstance, _super);

    function DbgpInstance(params) {
      this.executeStop = __bind(this.executeStop, this);
      this.executeRun = __bind(this.executeRun, this);
      this.buildContext = __bind(this.buildContext, this);
      this.contextGet = __bind(this.contextGet, this);
      this.updateContext = __bind(this.updateContext, this);
      this.updateWatchpoints = __bind(this.updateWatchpoints, this);
      this.executeDetach = __bind(this.executeDetach, this);
      this.processContextNames = __bind(this.processContextNames, this);
      this["continue"] = __bind(this["continue"], this);
      this.executeBreakpointRemove = __bind(this.executeBreakpointRemove, this);
      this.executeBreakpoint = __bind(this.executeBreakpoint, this);
      this.sendAllBreakpoints = __bind(this.sendAllBreakpoints, this);
      this.onInit = __bind(this.onInit, this);
      this.setFeature = __bind(this.setFeature, this);
      this.getFeature = __bind(this.getFeature, this);
      this.command = __bind(this.command, this);
      this.stuff = __bind(this.stuff, this);
      this.parseResponse = __bind(this.parseResponse, this);
      this.parse = __bind(this.parse, this);
      DbgpInstance.__super__.constructor.apply(this, arguments);
      this.socket = params.socket;
      this.GlobalContext = params.context;
      this.promises = [];
      this.socket.on('data', this.stuff);
      this.emitter = new Emitter;
      this.buffer = '';
      this.GlobalContext.addDebugContext(this);
      this.GlobalContext.notifySessionStart();
      this.breakpointMap = {};
      this.socket.on("error", (function(_this) {
        return function(error) {
          console.error("Socket Error:", error);
          return _this.GlobalContext.notifySessionEnd();
        };
      })(this));
    }

    DbgpInstance.prototype.stop = function() {
      this.socket.end();
      return this.GlobalContext.notifySessionEnd();
    };

    DbgpInstance.prototype.syncStack = function(depth) {
      var options;
      options = {};
      if (depth < 0) {
        depth = 0;
      }
      return this.executeCommand('stack_get', options).then((function(_this) {
        return function(data) {
          var csonFrame, frame, stackFrames, _i, _len, _ref1;
          stackFrames = [];
          if (data.response.stack != null) {
            _ref1 = data.response.stack;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              frame = _ref1[_i];
              csonFrame = {
                id: frame.$.level,
                label: frame.$.where,
                filepath: frame.$.filename,
                line: frame.$.lineno,
                active: parseInt(frame.$.level, 10) === depth ? true : false
              };
              stackFrames.push(csonFrame);
            }
          }
          return _this.setStack(stackFrames);
        };
      })(this));
    };

    DbgpInstance.prototype.nextTransactionId = function() {
      if (!this.transaction_id) {
        this.transaction_id = 1;
      }
      return this.transaction_id++;
    };

    DbgpInstance.prototype.parse = function(buffer) {
      var len, message, n, o;
      while (buffer.split("\0").length >= 2) {
        n = buffer.indexOf("\0");
        len = parseInt(buffer.slice(0, n));
        if (buffer.length >= n + len + 2) {
          message = buffer.slice(n + 1, n + 1 + len);
          buffer = buffer.slice(n + 2 + len);
          if (message !== "") {
            o = parseString(message, (function(_this) {
              return function(err, result) {
                var type;
                if (err) {
                  return console.error(err);
                } else {
                  type = Object.keys(result)[0];
                  switch (type) {
                    case "init":
                      return _this.onInit(result);
                    case "response":
                      return _this.parseResponse(result);
                  }
                }
              };
            })(this));
          }
        } else {
          return buffer;
        }
      }
      return buffer;
    };

    DbgpInstance.prototype.parseResponse = function(data) {
      var result, transactionId;
      result = data.response.$;
      transactionId = result.transaction_id;
      if (this.promises[transactionId] !== void 0) {
        this.promises[transactionId].resolve(data);
        return delete this.promises[transactionId];
      } else {
        return console.warn("Could not find promise for transaction " + transactionId);
      }
    };

    DbgpInstance.prototype.stuff = function(data) {
      var message;
      return this.buffer = message = this.parse(this.buffer + data);
    };

    DbgpInstance.prototype.executeCommand = function(command, options, data) {
      return this.command(command, options, data);
    };

    DbgpInstance.prototype.command = function(command, options, data) {
      var arg, argu, argu2, deferred, payload, transactionId, val;
      transactionId = this.nextTransactionId();
      deferred = Q.defer();
      this.promises[transactionId] = deferred;
      payload = command + " -i " + transactionId;
      if (options && Object.keys(options).length > 0) {
        argu = (function() {
          var _results;
          _results = [];
          for (arg in options) {
            val = options[arg];
            _results.push("-" + arg + " " + helpers.escapeValue(val));
          }
          return _results;
        })();
        argu2 = argu.join(" ");
        payload += " " + argu2;
      }
      if (data) {
        payload += " -- " + new Buffer(data, 'ascii').toString('base64');
      }
      if (this.socket) {
        this.socket.write(payload + "\0");
      } else {
        console.error("No socket found");
      }
      return deferred.promise;
    };

    DbgpInstance.prototype.getFeature = function(feature_name) {
      return this.command("feature_get", {
        n: feature_name
      });
    };

    DbgpInstance.prototype.setFeature = function(feature_name, value) {
      return this.command("feature_set", {
        n: feature_name,
        v: value
      });
    };

    DbgpInstance.prototype.onInit = function(data) {
      console.log("init", data);
      return this.setFeature('show_hidden', 1).then((function(_this) {
        return function() {
          return _this.setFeature('max_depth', atom.config.get('php-debug.MaxDepth'));
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.setFeature('max_data', atom.config.get('php-debug.MaxData'));
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.setFeature('max_children', atom.config.get('php-debug.MaxChildren'));
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.setFeature('multiple_sessions', 0);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendAllBreakpoints();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.executeRun();
        };
      })(this));
    };

    DbgpInstance.prototype.sendAllBreakpoints = function() {
      var breakpoint, breakpoints, commands, exception, _i, _j, _len, _len1, _ref1;
      breakpoints = this.GlobalContext.getBreakpoints();
      commands = [];
      for (_i = 0, _len = breakpoints.length; _i < _len; _i++) {
        breakpoint = breakpoints[_i];
        commands.push(this.executeBreakpoint(breakpoint));
      }
      if (atom.config.get('php-debug.PhpException.FatalError')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Fatal error',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.CatchableFatalError')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Catchable fatal error',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.Warning')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Warning',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.StrictStandards')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Strict standards',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.Xdebug')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Xdebug',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.UnknownError')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Unknown error',
          stackdepth: -1
        })));
      }
      if (atom.config.get('php-debug.PhpException.Notice')) {
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: 'Notice',
          stackdepth: -1
        })));
      }
      _ref1 = atom.config.get('php-debug.CustomExceptions');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        exception = _ref1[_j];
        console.log(exception);
        commands.push(this.executeBreakpoint(new Breakpoint({
          type: Breakpoint.TYPE_EXCEPTION,
          exception: exception,
          stackdepth: -1
        })));
      }
      return Q.all(commands);
    };

    DbgpInstance.prototype.executeBreakpoint = function(breakpoint) {
      var conditional, data, idx, options, p, path, setting, _i, _len, _ref1;
      switch (breakpoint.getType()) {
        case Breakpoint.TYPE_LINE:
          path = breakpoint.getPath();
          path = helpers.localPathToRemote(path);
          options = {
            t: 'line',
            f: encodeURI('file://' + path),
            n: breakpoint.getLine()
          };
          conditional = "";
          idx = 0;
          data = null;
          _ref1 = breakpoint.getSettingsValues("condition");
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            setting = _ref1[_i];
            if (idx++ > 1) {
              conditional += " && ";
            }
            conditional += "(" + setting.value + ")";
          }
          if (!!conditional) {
            data = conditional;
          }
          break;
        case Breakpoint.TYPE_EXCEPTION:
          options = {
            t: 'exception',
            x: breakpoint.getException()
          };
      }
      p = this.command("breakpoint_set", options, data);
      return p.then((function(_this) {
        return function(data) {
          return _this.breakpointMap[breakpoint.getId()] = data.response.$.id;
        };
      })(this));
    };

    DbgpInstance.prototype.executeBreakpointRemove = function(breakpoint) {
      var options, path;
      path = breakpoint.getPath();
      path = helpers.localPathToRemote(path);
      options = {
        d: this.breakpointMap[breakpoint.getId()]
      };
      return this.command("breakpoint_remove", options);
    };

    DbgpInstance.prototype["continue"] = function(type) {
      this.GlobalContext.notifyRunning();
      return this.command(type).then((function(_this) {
        return function(data) {
          var breakpoint, filepath, lineno, message, messages, response, thing;
          response = data.response;
          switch (response.$.status) {
            case 'break':
              messages = response["xdebug:message"];
              message = messages[0];
              thing = message.$;
              filepath = decodeURI(thing['filename']).replace("file:///", "");
              if (!filepath.match(/^[a-zA-Z]:/)) {
                filepath = '/' + filepath;
              }
              lineno = thing['lineno'];
              type = 'break';
              if (thing.exception) {
                type = "error";
              }
              breakpoint = new Breakpoint({
                filepath: filepath,
                line: lineno,
                type: type
              });
              return _this.GlobalContext.notifyBreak(breakpoint);
            case 'stopping':
              return _this.executeStop();
            default:
              console.dir(response);
              return console.error("Unhandled status: " + response.$.status);
          }
        };
      })(this));
    };

    DbgpInstance.prototype.syncCurrentContext = function(depth) {
      var p2, p3, p4, p5;
      p2 = this.getContextNames(depth).then((function(_this) {
        return function(data) {
          return _this.processContextNames(depth, data);
        };
      })(this));
      p3 = p2.then((function(_this) {
        return function(data) {
          return _this.updateWatchpoints(data);
        };
      })(this));
      p4 = p3.then(((function(_this) {
        return function(data) {
          return _this.syncStack(depth);
        };
      })(this)));
      p5 = p4.then((function(_this) {
        return function(data) {
          return _this.GlobalContext.notifyContextUpdate();
        };
      })(this));
      return p5.done();
    };

    DbgpInstance.prototype.getContextNames = function(depth) {
      var options;
      options = {};
      if (depth >= 0) {
        options.d = depth;
      }
      return this.command("context_names", options);
    };

    DbgpInstance.prototype.processContextNames = function(depth, data) {
      var commands, context, index, scope, scopes, _i, _len, _ref1;
      _ref1 = data.response.context;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        context = _ref1[_i];
        this.addScope(context.$.id, context.$.name);
      }
      commands = [];
      scopes = this.getScopes();
      for (index in scopes) {
        scope = scopes[index];
        commands.push(this.updateContext(depth, scope));
      }
      return Q.all(commands);
    };

    DbgpInstance.prototype.executeDetach = function() {
      return this.command('status').then((function(_this) {
        return function(data) {
          var breakpoint, breakpoints, _i, _len;
          if (data.response.$.status === 'break') {
            breakpoints = _this.GlobalContext.getBreakpoints();
            for (_i = 0, _len = breakpoints.length; _i < _len; _i++) {
              breakpoint = breakpoints[_i];
              _this.executeBreakpointRemove(breakpoint);
            }
            return _this.command('run').then(function(data) {
              return _this.command('detach').then(function(data) {
                return _this.executeStop();
              });
            });
          } else if (data.response.$.status === 'stopped') {
            return _this.executeStop();
          } else {
            return _this.command('detach').then(function(data) {
              return _this.executeStop();
            });
          }
        };
      })(this));
    };

    DbgpInstance.prototype.updateWatchpoints = function(data) {
      var commands, watch, _i, _len, _ref1;
      this.clearWatchpoints();
      commands = [];
      _ref1 = this.GlobalContext.getWatchpoints();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        watch = _ref1[_i];
        commands.push(this.evalWatchpoint(watch));
      }
      return Q.all(commands);
    };

    DbgpInstance.prototype.executeEval = function(expression) {
      return this.command("eval", null, expression);
    };

    DbgpInstance.prototype.evalWatchpoint = function(watchpoint) {
      var p;
      p = this.command("eval", null, watchpoint.getExpression());
      return p.then((function(_this) {
        return function(data) {
          var datum;
          datum = null;
          if (data.response.error) {
            datum = {
              name: "Error",
              fullname: "Error",
              type: "error",
              value: data.response.error[0].message[0],
              label: ""
            };
          } else {
            datum = _this.parseContextVariable({
              variable: data.response.property[0]
            });
          }
          datum.label = watchpoint.getExpression();
          watchpoint.setValue(datum);
          return _this.addWatchpoint(watchpoint);
        };
      })(this));
    };

    DbgpInstance.prototype.updateContext = function(depth, scope) {
      var p;
      p = this.contextGet(depth, scope.scopeId);
      return p.then((function(_this) {
        return function(data) {
          var context;
          context = _this.buildContext(data);
          return _this.setScopeContext(scope.scopeId, context);
        };
      })(this));
    };

    DbgpInstance.prototype.contextGet = function(depth, scope) {
      var options;
      options = {
        c: scope
      };
      if (depth >= 0) {
        options.d = depth;
      }
      return this.command("context_get", options);
    };

    DbgpInstance.prototype.buildContext = function(response) {
      var data, property, v, _i, _len, _ref1;
      data = {};
      data.type = 'context';
      data.context = response.response.$.context;
      data.variables = [];
      if (response.response.property) {
        _ref1 = response.response.property;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          property = _ref1[_i];
          v = this.parseContextVariable({
            variable: property
          });
          data.variables.push(v);
        }
        return data;
      }
    };

    DbgpInstance.prototype.executeRun = function() {
      return this["continue"]("run");
    };

    DbgpInstance.prototype.executeStop = function() {
      this.command("stop");
      return this.stop();
    };

    DbgpInstance.prototype.parseContextVariable = function(_arg) {
      var datum, property, variable, _i, _j, _len, _len1, _ref1, _ref2;
      variable = _arg.variable;
      datum = {
        name: variable.$.name,
        fullname: variable.$.fullname,
        type: variable.$.type
      };
      if (variable.$.fullname != null) {
        datum.label = variable.$.fullname;
      } else if (variable.$.name != null) {
        datum.label = variable.$.name;
      }
      switch (variable.$.type) {
        case "string":
          switch (variable.$.encoding) {
            case "base64":
              if (variable._ == null) {
                datum.value = "";
              } else {
                datum.value = new Buffer(variable._, 'base64').toString('ascii');
              }
              break;
            default:
              console.error("Unhandled context variable encoding: " + variable.$.encoding);
          }
          break;
        case "array":
          datum.value = [];
          datum.length = variable.$.numchildren;
          if (variable.property) {
            _ref1 = variable.property;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              property = _ref1[_i];
              datum.value.push(this.parseContextVariable({
                variable: property
              }));
            }
          }
          break;
        case "object":
          datum.value = [];
          if (variable.property) {
            _ref2 = variable.property;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              property = _ref2[_j];
              datum.value.push(this.parseContextVariable({
                variable: property
              }));
            }
          }
          break;
        case "int":
          datum.type = "numeric";
          datum.value = variable._;
          break;
        case "error":
          datum.value = "";
          break;
        case "uninitialized":
          datum.value = void 0;
          break;
        case "null":
          datum.value = null;
          break;
        case "bool":
          datum.value = variable._;
          break;
        case "float":
          datum.type = "numeric";
          datum.value = variable._;
          break;
        default:
          console.dir(variable);
          console.error("Unhandled context variable type: " + variable.$.type);
      }
      return datum;
    };

    return DbgpInstance;

  })(DebugContext);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9lbmdpbmVzL2RiZ3AvZGJncC1pbnN0YW5jZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0dBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxXQUFoQyxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQXdCLE9BQUEsQ0FBUSxXQUFSLENBQXhCLEVBQUMsZUFBQSxPQUFELEVBQVUsa0JBQUEsVUFGVixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUhWLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLDRCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEseUJBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx5QkFBUixDQVBiLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBYSxJQUFBLHNCQUFDLE1BQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/engines/dbgp/dbgp-instance.coffee
