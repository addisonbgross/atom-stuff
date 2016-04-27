(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles, prevMessage;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    prevMessage = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return prevMessage.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    message = prevMessage.join('\n');
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      var currentChanges, nothingToCommit, replacementText, textToReplace;
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ");
      if (prevChangedFiles.length > 0) {
        nothingToCommit = "nothing to commit, working directory clean";
        currentChanges = "committed:\n" + commentchar;
        textToReplace = null;
        if (status.indexOf(nothingToCommit) > -1) {
          textToReplace = nothingToCommit;
        } else if (status.indexOf(currentChanges) > -1) {
          textToReplace = currentChanges;
        }
        replacementText = "Changes to be committed:\n" + (prevChangedFiles.map(function(f) {
          return "" + commentchar + "   " + f;
        }).join("\n"));
        status = status.replace(textToReplace, replacementText);
      }
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
  };

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LWFtZW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrUEFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFOZCxDQUFBOztBQUFBLEVBUUEsbUJBQUEsR0FBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsUUFBQSxPQUFBO0FBQUEsSUFBQSxJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FBQTs7O0FBRUs7V0FBQSxzREFBQTt1QkFBQTtBQUNILHNCQUFBO0FBQUEsVUFBQyxNQUFBLElBQUQ7QUFBQSxVQUFPLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBbEI7VUFBQSxDQURHO0FBQUE7O1NBSGU7RUFBQSxDQVJ0QixDQUFBOztBQUFBLEVBY0EscUJBQUEsR0FBd0IsU0FBQyxJQUFELEdBQUE7V0FDdEI7QUFBQSxNQUFBLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFYO0FBQUEsTUFDQSxJQUFB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

//# sourceURL=/home/champ/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
