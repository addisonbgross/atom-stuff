(function() {
  var Command, Queue, path;

  path = require('path');

  Queue = require('../pipeline/queue');

  module.exports = Command = (function() {
    function Command(_arg) {
      var _ref;
      _ref = _arg != null ? _arg : {}, this.project = _ref.project, this.source = _ref.source, this.name = _ref.name, this.command = _ref.command, this.wd = _ref.wd, this.env = _ref.env, this.modifier = _ref.modifier, this.environment = _ref.environment, this.stdout = _ref.stdout, this.stderr = _ref.stderr, this.output = _ref.output, this.version = _ref.version;
      if (this.env == null) {
        this.env = {};
      }
      if (this.wd == null) {
        this.wd = '.';
      }
      if (this.modifier == null) {
        this.modifier = {};
      }
      if (this.output == null) {
        this.output = {};
      }
      if (this.stdout == null) {
        this.stdout = {
          highlighting: 'nh'
        };
      }
      if (this.stderr == null) {
        this.stderr = {
          highlighting: 'nh'
        };
      }
      if (this.version == null) {
        this.version = 1;
      }
      if (this.version === 1) {
        this.migrateToV2();
      }
    }

    Command.prototype.getSpawnInfo = function() {
      var args;
      this.original = this.command;
      args = Command.splitQuotes(this.command);
      this.command = args[0];
      this.args = args.slice(1);
      return this.mergeEnvironment(process.env);
    };

    Command.prototype.getWD = function() {
      return path.resolve(this.project, this.wd);
    };

    Command.prototype.mergeEnvironment = function(env) {
      var key, _i, _len, _ref, _results;
      _ref = Object.keys(env);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!this.env[key]) {
          _results.push(this.env[key] = env[key]);
        }
      }
      return _results;
    };

    Command.splitQuotes = function(cmd_string) {
      var a, args, cmd_list, getQuoteIndex, i, instring, qi, _i, _len;
      args = [];
      cmd_list = cmd_string.split(' ');
      instring = false;
      getQuoteIndex = function(line) {
        var c;
        if ((c = line.indexOf('"')) !== -1) {
          return {
            index: c,
            character: '"'
          };
        }
        if ((c = line.indexOf("'")) !== -1) {
          return {
            index: c,
            character: "'"
          };
        }
      };
      while (cmd_list.length !== 0) {
        if (!instring) {
          args.push(cmd_list[0]);
        } else {
          args[args.length - 1] += ' ' + cmd_list[0];
        }
        qi = getQuoteIndex(cmd_list[0]);
        if ((qi = getQuoteIndex(cmd_list[0])) != null) {
          if (instring) {
            instring = false;
          } else {
            if (cmd_list[0].substr(qi.index + 1).indexOf(qi.character) === -1) {
              instring = true;
            }
          }
        }
        cmd_list.shift();
      }
      for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
        a = args[i];
        if (/[\"\']/.test(a[0]) && /[\"\']/.test(a[a.length - 1])) {
          args[i] = a.slice(1, -1);
        }
      }
      return args;
    };

    Command.prototype.migrateToV2 = function() {
      if (this.stdout.pty === true) {
        this.environment = {
          name: 'ptyw',
          config: {
            rows: this.stdout.pty_rows,
            cols: this.stdout.pty_cols
          }
        };
        delete this.stdout.pty;
        delete this.stdout.pty_rows;
        delete this.stdout.pty_cols;
      } else {
        this.environment = {
          name: 'child_process',
          config: {
            stdoe: 'both'
          }
        };
      }
      this.migrateStreamV2(this.stdout);
      this.migrateStreamV2(this.stderr);
      return this.version = 2;
    };

    Command.prototype.migrateStreamV2 = function(str) {
      if (str.pipeline != null) {
        return;
      }
      str.pipeline = [];
      if (str.highlighting === 'nh') {
        if (str.ansi_option === 'remove') {
          str.pipeline.push({
            name: 'remansi'
          });
        }
      } else if (str.highlighting === 'ha') {
        str.pipeline.push({
          name: 'all'
        });
      } else if (str.highlighting === 'hc') {
        str.pipeline.push({
          name: 'profile',
          config: {
            profile: str.profile
          }
        });
      } else if (str.highlighting === 'hr') {
        str.pipeline.push({
          name: 'regex',
          config: {
            regex: str.regex,
            defaults: str.defaults
          }
        });
      } else if (str.highlighting === 'ht') {
        str.pipeline.push({
          name: 'regex',
          config: {
            regex: '(?<type> error|warning):'
          }
        });
      }
      delete str.highlighting;
      delete str.profile;
      delete str.ansi_option;
      delete str.regex;
      return delete str.defaults;
    };

    Command.prototype.getQueue = function() {
      return new Queue(this);
    };

    return Command;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL2NvbW1hbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsbUJBQVIsQ0FEUixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsaUJBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsNEJBRFksT0FBZ0gsSUFBL0csSUFBQyxDQUFBLGVBQUEsU0FBUyxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLGVBQUEsU0FBUyxJQUFDLENBQUEsVUFBQSxJQUFJLElBQUMsQ0FBQSxXQUFBLEtBQUssSUFBQyxDQUFBLGdCQUFBLFVBQVUsSUFBQyxDQUFBLG1CQUFBLGFBQWEsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGVBQUEsT0FDakgsQ0FBQTs7UUFBQSxJQUFDLENBQUEsTUFBTztPQUFSOztRQUNBLElBQUMsQ0FBQSxLQUFNO09BRFA7O1FBRUEsSUFBQyxDQUFBLFdBQVk7T0FGYjs7UUFHQSxJQUFDLENBQUEsU0FBVTtPQUhYOztRQUlBLElBQUMsQ0FBQSxTQUFVO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDs7T0FKWDs7UUFLQSxJQUFDLENBQUEsU0FBVTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7O09BTFg7O1FBTUEsSUFBQyxDQUFBLFVBQVc7T0FOWjtBQU9BLE1BQUEsSUFBa0IsSUFBQyxDQUFBLE9BQUQsS0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/command.coffee
