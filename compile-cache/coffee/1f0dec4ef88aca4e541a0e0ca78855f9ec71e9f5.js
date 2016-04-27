(function() {
  var exec, open_terminal, path, platform;

  exec = require('child_process').exec;

  path = require('path');

  platform = require('os').platform;


  /*
     Opens a terminal in the given directory, as specefied by the config
   */

  open_terminal = function(dirpath) {
    var app, args, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
    app = atom.config.get('atom-terminal.app');
    args = atom.config.get('atom-terminal.args');
    setWorkingDirectory = atom.config.get('atom-terminal.setWorkingDirectory');
    surpressDirArg = atom.config.get('atom-terminal.surpressDirectoryArgument');
    runDirectly = atom.config.get('atom-terminal.MacWinRunDirectly');
    cmdline = "\"" + app + "\" " + args;
    if (!surpressDirArg) {
      cmdline += " \"" + dirpath + "\"";
    }
    if (platform() === "darwin" && !runDirectly) {
      cmdline = "open -a " + cmdline;
    }
    if (platform() === "win32" && !runDirectly) {
      cmdline = "start \"\" " + cmdline;
    }
    console.log("atom-terminal executing: ", cmdline);
    if (setWorkingDirectory) {
      if (dirpath != null) {
        return exec(cmdline, {
          cwd: dirpath
        });
      }
    } else {
      if (dirpath != null) {
        return exec(cmdline);
      }
    }
  };

  module.exports = {
    activate: function() {
      atom.commands.add("atom-workspace", "atom-terminal:open", (function(_this) {
        return function() {
          return _this.open();
        };
      })(this));
      return atom.commands.add("atom-workspace", "atom-terminal:open-project-root", (function(_this) {
        return function() {
          return _this.openroot();
        };
      })(this));
    },
    open: function() {
      var editor, file, filepath, _ref;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? (_ref = editor.buffer) != null ? _ref.file : void 0 : void 0;
      filepath = file != null ? file.path : void 0;
      if (filepath) {
        return open_terminal(path.dirname(filepath));
      }
    },
    openroot: function() {
      var pathname, _i, _len, _ref, _results;
      _ref = atom.project.getPaths();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pathname = _ref[_i];
        _results.push(open_terminal(pathname));
      }
      return _results;
    }
  };

  if (platform() === 'darwin') {
    module.exports.config = {
      app: {
        type: 'string',
        "default": 'Terminal.app'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  } else if (platform() === 'win32') {
    module.exports.config = {
      app: {
        type: 'string',
        "default": 'C:\\Windows\\System32\\cmd.exe'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  } else {
    module.exports.config = {
      app: {
        type: 'string',
        "default": '/usr/bin/x-terminal-emulator'
      },
      args: {
        type: 'string',
        "default": ''
      },
      surpressDirectoryArgument: {
        type: 'boolean',
        "default": true
      },
      setWorkingDirectory: {
        type: 'boolean',
        "default": true
      },
      MacWinRunDirectly: {
        type: 'boolean',
        "default": false
      }
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJtaW5hbC9saWIvYXRvbS10ZXJtaW5hbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxJQUFoQyxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsSUFBUixDQUFhLENBQUMsUUFGekIsQ0FBQTs7QUFJQTtBQUFBOztLQUpBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUVkLFFBQUEsb0VBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQU4sQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FEUCxDQUFBO0FBQUEsSUFJQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLENBSnRCLENBQUE7QUFBQSxJQUtBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlDQUFoQixDQUxqQixDQUFBO0FBQUEsSUFNQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQU5kLENBQUE7QUFBQSxJQVNBLE9BQUEsR0FBVyxJQUFBLEdBQUksR0FBSixHQUFRLEtBQVIsR0FBYSxJQVR4QixDQUFBO0FBWUEsSUFBQSxJQUFHLENBQUEsY0FBSDtBQUNJLE1BQUEsT0FBQSxJQUFhLEtBQUEsR0FBSyxPQUFMLEdBQWEsSUFB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

//# sourceURL=/home/champ/.atom/packages/atom-terminal/lib/atom-terminal.coffee
