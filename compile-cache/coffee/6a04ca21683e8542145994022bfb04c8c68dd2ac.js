(function() {
  var Android, AnsiHtmlStream, CompositeDisposable, LogView, spawn;

  LogView = require('./log-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  spawn = require('child_process').spawn;

  AnsiHtmlStream = require('ansi-html-stream');

  module.exports = Android = {
    subscriptions: null,
    logView: null,
    activate: function(state) {
      this.logView = new LogView;
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'android:build-gradle': (function(_this) {
          return function() {
            return _this.buildGradle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.logView.destroy();
    },
    buildGradle: function() {
      var ansiHtmlStream, build, currentRootDir, editor, i, options, rootDirs, _i, _ref;
      this.logView.open();
      editor = atom.workspace.getActiveTextEditor();
      rootDirs = atom.project.rootDirectories;
      for (i = _i = 0, _ref = rootDirs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (rootDirs[i].contains(editor.getPath())) {
          currentRootDir = rootDirs[i].path;
          break;
        }
      }
      options = {
        cwd: currentRootDir,
        env: process.env
      };
      build = spawn("gradle", ["assembleDebug", "--console=rich"], options);
      ansiHtmlStream = AnsiHtmlStream();
      ansiHtmlStream.on('data', (function(_this) {
        return function(data) {
          return _this.logView.addLine(data);
        };
      })(this));
      build.stdout.pipe(ansiHtmlStream);
      build.stderr.on('data', function(data) {
        return console.log("stderr: " + data);
      });
      return build.on('close', function(code) {
        if (code === 0) {
          alert("Build completed successfully.");
        }
        if (code === !0) {
          alert("Build faield. code " + code);
        }
        return console.log("child process exited with code: " + code);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYW5kcm9pZC9saWIvYW5kcm9pZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FGRCxDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixPQUFBLENBQVEsa0JBQVIsQ0FIakIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FDZjtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUNBLE9BQUEsRUFBUyxJQURUO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO2FBTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO09BQXBDLENBQW5CLEVBUFE7SUFBQSxDQUhWO0FBQUEsSUFZQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxFQUZVO0lBQUEsQ0FaWjtBQUFBLElBZ0JBLFdBQUEsRUFBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLDZFQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FGVCxDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUh4QixDQUFBO0FBS0EsV0FBUyxrR0FBVCxHQUFBO0FBQ0UsUUFBQSxJQUFHLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFaLENBQXFCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBckIsQ0FBSDtBQUNFLFVBQUEsY0FBQSxHQUFpQixRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBN0IsQ0FBQTtBQUNBLGdCQUZGO1NBREY7QUFBQSxPQUxBO0FBQUEsTUFVQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxjQUFMO0FBQUEsUUFDQSxHQUFBLEVBQUssT0FBTyxDQUFDLEdBRGI7T0FYRixDQUFBO0FBQUEsTUFhQSxLQUFBLEdBQVEsS0FBQSxDQUFNLFFBQU4sRUFBZ0IsQ0FBQyxlQUFELEVBQWtCLGdCQUFsQixDQUFoQixFQUFxRCxPQUFyRCxDQWJSLENBQUE7QUFBQSxNQWVBLGNBQUEsR0FBaUIsY0FBQSxDQUFBLENBZmpCLENBQUE7QUFBQSxNQWlCQSxjQUFjLENBQUMsRUFBZixDQUFrQixNQUFsQixFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQ3hCLEtBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixJQUFqQixFQUR3QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBakJBLENBQUE7QUFBQSxNQW9CQSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWIsQ0FBa0IsY0FBbEIsQ0FwQkEsQ0FBQTtBQUFBLE1Bc0JBLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBYixDQUFnQixNQUFoQixFQUF3QixTQUFDLElBQUQsR0FBQTtlQUN0QixPQUFPLENBQUMsR0FBUixDQUFhLFVBQUEsR0FBVSxJQUF2QixFQURzQjtNQUFBLENBQXhCLENBdEJBLENBQUE7YUF5QkEsS0FBSyxDQUFDLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFFBQUEsSUFBeUMsSUFBQSxLQUFRLENBQWpEO0FBQUEsVUFBQSxLQUFBLENBQU0sK0JBQU4sQ0FBQSxDQUFBO1NBQUE7QUFDQSxRQUFBLElBQXNDLElBQUEsS0FBUSxDQUFBLENBQTlDO0FBQUEsVUFBQSxLQUFBLENBQU8scUJBQUEsR0FBcUIsSUFBNUIsQ0FBQSxDQUFBO1NBREE7ZUFFQSxPQUFPLENBQUMsR0FBUixDQUFhLGtDQUFBLEdBQWtDLElBQS9DLEVBSGdCO01BQUEsQ0FBbEIsRUExQlc7SUFBQSxDQWhCYjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/android/lib/android.coffee
