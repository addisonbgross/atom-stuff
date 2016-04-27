(function() {
  var WildcardSaver, baseName, error, file, fileWithoutExtension, folder, path;

  path = null;

  baseName = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.basename(filename);
    }
  };

  fileWithoutExtension = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.basename(filename, path.extname(filename));
    }
  };

  folder = function(project, wd) {
    var filename;
    if (wd == null) {
      wd = '.';
    }
    if ((filename = file(project, wd)) != null) {
      return path.dirname(filename);
    }
  };

  file = function(project, wd) {
    var _ref;
    if (wd == null) {
      wd = '.';
    }
    try {
      return path.relative(path.resolve(project, wd), (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } catch (_error) {}
  };

  error = 'Could not get path from active text editor';

  module.exports = {
    name: 'Wildcards',
    description: 'Replace wildcards in command and working directory',
    "private": false,
    edit: WildcardSaver = (function() {
      function WildcardSaver() {}

      WildcardSaver.prototype.get = function(command) {
        command.modifier.wildcards = {};
        return null;
      };

      return WildcardSaver;

    })(),
    activate: function() {
      return path = require('path');
    },
    deactivate: function() {
      return path = null;
    },
    preSplit: function(command) {
      return new Promise(function(resolve, reject) {
        if (/%[fbde]/.test(command.wd)) {
          if (/%f/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%f)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = file(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%b/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%b)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = baseName(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%d/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%d)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = folder(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%e/.test(command.wd)) {
            command.wd = command.wd.replace(/(\\)?(%e)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = fileWithoutExtension(command.project, null)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
        }
        if (/%[fbde]/.test(command.command)) {
          if (/%f/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%f)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = file(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%b/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%b)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = baseName(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%d/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%d)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = folder(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
          if (/%e/.test(command.command)) {
            command.command = command.command.replace(/(\\)?(%e)/g, function($0, $1, $2) {
              var _ref;
              if ($1) {
                return $2;
              } else {
                return (function() {
                  if ((_ref = fileWithoutExtension(command.project, command.wd)) != null) {
                    return _ref;
                  } else {
                    throw new Error(error);
                  }
                })();
              }
            });
          }
        }
        return resolve();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL3dpbGRjYXJkcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0VBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLFNBQUMsT0FBRCxFQUFVLEVBQVYsR0FBQTtBQUNULFFBQUEsUUFBQTs7TUFEbUIsS0FBSztLQUN4QjtBQUFBLElBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZCxFQURGO0tBRFM7RUFBQSxDQUZYLENBQUE7O0FBQUEsRUFNQSxvQkFBQSxHQUF1QixTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDckIsUUFBQSxRQUFBOztNQUQrQixLQUFLO0tBQ3BDO0FBQUEsSUFBQSxJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLEVBQXdCLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUF4QixFQURGO0tBRHFCO0VBQUEsQ0FOdkIsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxTQUFDLE9BQUQsRUFBVSxFQUFWLEdBQUE7QUFDUCxRQUFBLFFBQUE7O01BRGlCLEtBQUs7S0FDdEI7QUFBQSxJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFERjtLQURPO0VBQUEsQ0FWVCxDQUFBOztBQUFBLEVBY0EsSUFBQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEVBQVYsR0FBQTtBQUNMLFFBQUEsSUFBQTs7TUFEZSxLQUFLO0tBQ3BCO0FBQUE7YUFDRSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QixDQUFkLDhEQUE2RSxDQUFFLE9B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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/wildcards.coffee
