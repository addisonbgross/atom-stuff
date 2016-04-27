Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atom = require('atom');

var _AtomAutocompleteProvider = require('./AtomAutocompleteProvider');

var _JavaClassLoader = require('./JavaClassLoader');

var _atomJavaUtil = require('./atomJavaUtil');

var _atomJavaUtil2 = _interopRequireDefault(_atomJavaUtil);

'use babel';

var AtomAutocompletePackage = (function () {
  function AtomAutocompletePackage() {
    _classCallCheck(this, AtomAutocompletePackage);

    this.config = require('./config.json');
    this.subscriptions = undefined;
    this.provider = undefined;
    this.classLoader = undefined;
    this.classpath = null;
    this.initialized = false;
  }

  _createClass(AtomAutocompletePackage, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.classLoader = new _JavaClassLoader.JavaClassLoader(atom.config.get('autocomplete-java.javaHome'));
      this.provider = new _AtomAutocompleteProvider.AtomAutocompleteProvider(this.classLoader);
      this.subscriptions = new _atom.CompositeDisposable();

      // Listen for commands
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:organize-imports', function () {
        _this._organizeImports();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:refresh-project', function () {
        if (_this.initialized) {
          _this._refresh(false);
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:full-refresh', function () {
        if (_this.initialized) {
          _this._refresh(true);
        }
      }));

      // Listen for config changes
      // TODO refactor: bypasses provider.configure()
      this.subscriptions.add(atom.config.observe('autocomplete-java.inclusionPriority', function (val) {
        _this.provider.inclusionPriority = val;
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-java.excludeLowerPriority', function (val) {
        _this.provider.excludeLowerPriority = val;
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-java.foldImports', function (val) {
        _this.provider.foldImports = val;
      }));

      // Listen for buffer change
      this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function (paneItem) {
        _this._onChange(paneItem);
      }));

      // Listen for file save
      atom.workspace.observeTextEditors(function (editor) {
        _this.subscriptions.add(editor.getBuffer().onWillSave(function () {
          _this._onSave(editor);
        }));
      });

      // Start full refresh
      setTimeout(function () {
        // Refresh all classes
        _this.initialized = true;
        _this._refresh(true);
      }, 300);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
      this.provider = null;
      this.classLoader = null;
      this.subscriptions = null;
      this.classpath = null;
      this.initialized = false;
    }
  }, {
    key: 'getProvider',
    value: function getProvider() {
      return this.provider;
    }

    // Commands

  }, {
    key: '_refresh',
    value: _asyncToGenerator(function* (fullRefresh) {
      // Refresh provider settings
      // TODO observe config changes
      this.provider.configure(atom.config.get('autocomplete-java'));
      this.classLoader.setJavaHome(atom.config.get('autocomplete-java.javaHome'));

      // Load classes using classpath
      var classpath = yield this._loadClasspath();
      if (classpath) {
        this.classLoader.loadClasses(classpath, atom.config.get('autocomplete-java.loadClassMembers'), fullRefresh);
      }
    })
  }, {
    key: '_refreshClass',
    value: function _refreshClass(className, delayMillis) {
      var _this2 = this;

      setTimeout(function () {
        if (_this2.classpath) {
          _this2.classLoader.loadClass(className, _this2.classpath, atom.config.get('autocomplete-java.loadClassMembers'));
        } else {
          console.warn('autocomplete-java: classpath not set.');
        }
      }, delayMillis);
    }
  }, {
    key: '_organizeImports',
    value: function _organizeImports() {
      var editor = atom.workspace.getActiveTextEditor();
      if (this._isJavaFile(editor)) {
        _atomJavaUtil2['default'].organizeImports(editor, null, atom.config.get('autocomplete-java.foldImports'));
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(paneItem) {
      var _this3 = this;

      if (this._isJavaFile(paneItem)) {
        // Active file has changed -> fold imports
        if (atom.config.get('autocomplete-java.foldImports')) {
          _atomJavaUtil2['default'].foldImports(paneItem);
        }
        // Active file has changed -> touch every imported class
        _lodash._.each(_atomJavaUtil2['default'].getImports(paneItem), function (imp) {
          try {
            _this3.classLoader.touchClass(imp.match(/import\s*(\S*);/)[1]);
          } catch (err) {
            // console.warn(err);
          }
        });
      }
    }
  }, {
    key: '_onSave',
    value: function _onSave(editor) {
      // TODO use onDidSave for refreshing and onWillSave for organizing imports
      if (this._isJavaFile(editor)) {
        // Refresh saved class after it has been compiled
        if (atom.config.get('autocomplete-java.refreshClassOnSave')) {
          var fileMatch = editor.getPath().match(/\/([^\/]*)\.java/);
          var packageMatch = editor.getText().match(/package\s(.*);/);
          if (fileMatch && packageMatch) {
            // TODO use file watcher instead of hardcoded timeout
            var className = packageMatch[1] + '.' + fileMatch[1];
            this._refreshClass(className, 3000);
          }
        }
      }
    }

    // Util methods

  }, {
    key: '_isJavaFile',
    value: function _isJavaFile(editor) {
      return editor instanceof _atom.TextEditor && editor.getPath() && editor.getPath().match(/\.java$/);
    }

    // TODO: this is a quick hack for loading classpath. replace with
    // atom-javaenv once it has been implemented
  }, {
    key: '_loadClasspath',
    value: _asyncToGenerator(function* () {
      var _this4 = this;

      var separator = null;
      var classpathSet = new Set();
      var classpathFileName = atom.config.get('autocomplete-java.classpathFilePath');

      yield atom.workspace.scan(/^.+$/, { paths: ['*' + classpathFileName] }, function (file) {
        separator = file.filePath.indexOf(':') !== -1 ? ';' : ':';
        _lodash._.each(file.matches, function (match) {
          // NOTE: The :\ replace is a quick hack for supporting Windows
          // absolute paths e.g E:\myProject\lib
          _lodash._.each(match.matchText.replace(':\\', '+\\').split(/[\:\;]+/), function (path) {
            classpathSet.add(_this4._asAbsolutePath(file.filePath, path.replace('+\\', ':\\')));
          });
        });
      });

      var classpath = '';
      _lodash._.each([].concat(_toConsumableArray(classpathSet)), function (path) {
        classpath = classpath + path + separator;
      });
      this.classpath = classpath;
      return classpath;
    })

    // TODO: this is a quick hack for loading path. replace with atom-javaenv
    // once it has been implemented
  }, {
    key: '_asAbsolutePath',
    value: function _asAbsolutePath(currentFilePath, path) {
      var p = path;
      var dirPath = currentFilePath.match(/(.*)[\\\/]/)[1];
      var addBaseDir = false;
      // Remove ../ or ..\ from beginning
      while (/^\.\.[\\\/]/.test(p)) {
        addBaseDir = true;
        dirPath = dirPath.match(/(.*)[\\\/]/)[1];
        p = p.substring(3);
      }
      // Remove ./ or .\ from beginning
      while (/^\.[\\\/]/.test(p)) {
        addBaseDir = true;
        p = p.substring(2);
      }
      return addBaseDir ? dirPath + '/' + p : p;
    }
  }]);

  return AtomAutocompletePackage;
})();

exports['default'] = new AtomAutocompletePackage();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9hdG9tQXV0b2NvbXBsZXRlUGFja2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFa0IsUUFBUTs7b0JBQ0MsTUFBTTs7d0NBRVEsNEJBQTRCOzsrQkFDckMsbUJBQW1COzs0QkFDMUIsZ0JBQWdCOzs7O0FBUHpDLFdBQVcsQ0FBQzs7SUFTTix1QkFBdUI7QUFFaEIsV0FGUCx1QkFBdUIsR0FFYjswQkFGVix1QkFBdUI7O0FBR3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0dBQzFCOztlQVRHLHVCQUF1Qjs7V0FXbkIsb0JBQUc7OztBQUNULFVBQUksQ0FBQyxXQUFXLEdBQUcscUNBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsUUFBUSxHQUFHLHVEQUE2QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRy9DLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxvQ0FBb0MsRUFDeEUsWUFBTTtBQUNKLGNBQUssZ0JBQWdCLEVBQUUsQ0FBQztPQUN6QixDQUFDLENBQ0gsQ0FBQztBQUNGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxD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QUFDLENBQUMsQ0FBQztBQUNyRCxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7O0FBRXZCLGFBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixrQkFBVSxHQUFHLElBQUksQ0FBQztBQUNsQixlQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxTQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNwQjs7QUFFRCxhQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsa0JBQVUsR0FBRyxJQUFJLENBQUM7QUFDbEIsU0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDcEI7QUFDRCxhQUFPLFVBQVUsR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDM0M7OztTQXZORyx1QkFBdUI7OztxQkEyTmQsSUFBSSx1QkFBdUIsRUFBRSIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvYXRvbUF1dG9jb21wbGV0ZVBhY2thZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgXyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBBdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXIgfSBmcm9tICcuL0F0b21BdXRvY29tcGxldGVQcm92aWRlcic7XG5pbXBvcnQgeyBKYXZhQ2xhc3NMb2FkZXIgfSBmcm9tICcuL0phdmFDbGFzc0xvYWRlcic7XG5pbXBvcnQgYXRvbUphdmFVdGlsIGZyb20gJy4vYXRvbUphdmFVdGlsJztcblxuY2xhc3MgQXRvbUF1dG9jb21wbGV0ZVBhY2thZ2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuanNvbicpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnByb3ZpZGVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xhc3NMb2FkZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jbGFzc3BhdGggPSBudWxsO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY2xhc3NMb2FkZXIgPSBuZXcgSmF2YUNsYXNzTG9hZGVyKFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YS5qYXZhSG9tZScpKTtcbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IEF0b21BdXRvY29tcGxldGVQcm92aWRlcih0aGlzLmNsYXNzTG9hZGVyKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gTGlzdGVuIGZvciBjb21tYW5kc1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXV0b2NvbXBsZXRlLWphdmE6b3JnYW5pemUtaW1wb3J0cycsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuX29yZ2FuaXplSW1wb3J0cygpO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXV0b2NvbXBsZXRlLWphdmE6cmVmcmVzaC1wcm9qZWN0JyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXV0b2NvbXBsZXRlLWphdmE6ZnVsbC1yZWZyZXNoJyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGNvbmZpZyBjaGFuZ2VzXG4gICAgLy8gVE9ETyByZWZhY3RvcjogYnlwYXNzZXMgcHJvdmlkZXIuY29uZmlndXJlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2NvbXBsZXRlLWphdmEuaW5jbHVzaW9uUHJpb3JpdHknLCAodmFsKSA9PiB7XG4gICAgICAgIHRoaXMucHJvdmlkZXIuaW5jbHVzaW9uUHJpb3JpdHkgPSB2YWw7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2F1dG9jb21wbGV0ZS1qYXZhLmV4Y2x1ZGVMb3dlclByaW9yaXR5JywgKHZhbCkgPT4ge1xuICAgICAgICB0aGlzLnByb3ZpZGVyLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdmFsO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvY29tcGxldGUtamF2YS5mb2xkSW1wb3J0cycsICh2YWwpID0+IHtcbiAgICAgICAgdGhpcy5wcm92aWRlci5mb2xkSW1wb3J0cyA9IHZhbDtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgYnVmZmVyIGNoYW5nZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbSgocGFuZUl0ZW0pID0+IHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHBhbmVJdGVtKTtcbiAgICB9KSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGZpbGUgc2F2ZVxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX29uU2F2ZShlZGl0b3IpO1xuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RhcnQgZnVsbCByZWZyZXNoXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGFsbCBjbGFzc2VzXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3JlZnJlc2godHJ1ZSk7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnByb3ZpZGVyID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTG9hZGVyID0gbnVsbDtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NwYXRoID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBnZXRQcm92aWRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcjtcbiAgfVxuXG4gIC8vIENvbW1hbmRzXG5cbiAgYXN5bmMgX3JlZnJlc2goZnVsbFJlZnJlc2gpIHtcbiAgICAvLyBSZWZyZXNoIHByb3ZpZGVyIHNldHRpbmdzXG4gICAgLy8gVE9ETyBvYnNlcnZlIGNvbmZpZyBjaGFuZ2VzXG4gICAgdGhpcy5wcm92aWRlci5jb25maWd1cmUoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YScpKTtcbiAgICB0aGlzLmNsYXNzTG9hZGVyLnNldEphdmFIb21lKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEuamF2YUhvbWUnKSk7XG5cbiAgICAvLyBMb2FkIGNsYXNzZXMgdXNpbmcgY2xhc3NwYXRoXG4gICAgY29uc3QgY2xhc3NwYXRoID0gYXdhaXQgdGhpcy5fbG9hZENsYXNzcGF0aCgpO1xuICAgIGlmIChjbGFzc3BhdGgpIHtcbiAgICAgIHRoaXMuY2xhc3NMb2FkZXIubG9hZENsYXNzZXMoY2xhc3NwYXRoLFxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLmxvYWRDbGFzc01lbWJlcnMnKSwgZnVsbFJlZnJlc2gpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWZyZXNoQ2xhc3MoY2xhc3NOYW1lLCBkZWxheU1pbGxpcykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2xhc3NwYXRoKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMb2FkZXIubG9hZENsYXNzKGNsYXNzTmFtZSwgdGhpcy5jbGFzc3BhdGgsXG4gICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YS5sb2FkQ2xhc3NNZW1iZXJzJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdhdXRvY29tcGxldGUtamF2YTogY2xhc3NwYXRoIG5vdCBzZXQuJyk7XG4gICAgICB9XG4gICAgfSwgZGVsYXlNaWxsaXMpO1xuICB9XG5cbiAgX29yZ2FuaXplSW1wb3J0cygpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKHRoaXMuX2lzSmF2YUZpbGUoZWRpdG9yKSkge1xuICAgICAgYXRvbUphdmFVdGlsLm9yZ2FuaXplSW1wb3J0cyhlZGl0b3IsIG51bGwsXG4gICAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEuZm9sZEltcG9ydHMnKSk7XG4gICAgfVxuICB9XG5cbiAgX29uQ2hhbmdlKHBhbmVJdGVtKSB7XG4gICAgaWYgKHRoaXMuX2lzSmF2YUZpbGUocGFuZUl0ZW0pKSB7XG4gICAgICAvLyBBY3RpdmUgZmlsZSBoYXMgY2hhbmdlZCAtPiBmb2xkIGltcG9ydHNcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLmZvbGRJbXBvcnRzJykpIHtcbiAgICAgICAgYXRvbUphdmFVdGlsLmZvbGRJbXBvcnRzKHBhbmVJdGVtKTtcbiAgICAgIH1cbiAgICAgIC8vIEFjdGl2ZSBmaWxlIGhhcyBjaGFuZ2VkIC0+IHRvdWNoIGV2ZXJ5IGltcG9ydGVkIGNsYXNzXG4gICAgICBfLmVhY2goYXRvbUphdmFVdGlsLmdldEltcG9ydHMocGFuZUl0ZW0pLCBpbXAgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuY2xhc3NMb2FkZXIudG91Y2hDbGFzcyhpbXAubWF0Y2goL2ltcG9ydFxccyooXFxTKik7LylbMV0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLndhcm4oZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX29uU2F2ZShlZGl0b3IpIHtcbiAgICAvLyBUT0RPIHVzZSBvbkRpZFNhdmUgZm9yIHJlZnJlc2hpbmcgYW5kIG9uV2lsbFNhdmUgZm9yIG9yZ2FuaXppbmcgaW1wb3J0c1xuICAgIGlmICh0aGlzLl9pc0phdmFGaWxlKGVkaXRvcikpIHtcbiAgICAgIC8vIFJlZnJlc2ggc2F2ZWQgY2xhc3MgYWZ0ZXIgaXQgaGFzIGJlZW4gY29tcGlsZWRcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLnJlZnJlc2hDbGFzc09uU2F2ZScpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVNYXRjaCA9IGVkaXRvci5nZXRQYXRoKCkubWF0Y2goL1xcLyhbXlxcL10qKVxcLmphdmEvKTtcbiAgICAgICAgY29uc3QgcGFja2FnZU1hdGNoID0gZWRpdG9yLmdldFRleHQoKS5tYXRjaCgvcGFja2FnZVxccyguKik7Lyk7XG4gICAgICAgIGlmIChmaWxlTWF0Y2ggJiYgcGFja2FnZU1hdGNoKSB7XG4gICAgICAgICAgLy8gVE9ETyB1c2UgZmlsZSB3YXRjaGVyIGluc3RlYWQgb2YgaGFyZGNvZGVkIHRpbWVvdXRcbiAgICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBwYWNrYWdlTWF0Y2hbMV0gKyAnLicgKyBmaWxlTWF0Y2hbMV07XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaENsYXNzKGNsYXNzTmFtZSwgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBVdGlsIG1ldGhvZHNcblxuICBfaXNKYXZhRmlsZShlZGl0b3IpIHtcbiAgICByZXR1cm4gZWRpdG9yIGluc3RhbmNlb2YgVGV4dEVkaXRvciAmJiBlZGl0b3IuZ2V0UGF0aCgpICYmXG4gICAgICBlZGl0b3IuZ2V0UGF0aCgpLm1hdGNoKC9cXC5qYXZhJC8pO1xuICB9XG5cbiAgLy8gVE9ETzogdGhpcyBpcyBhIHF1aWNrIGhhY2sgZm9yIGxvYWRpbmcgY2xhc3NwYXRoLiByZXBsYWNlIHdpdGhcbiAgLy8gYXRvbS1qYXZhZW52IG9uY2UgaXQgaGFzIGJlZW4gaW1wbGVtZW50ZWRcbiAgYXN5bmMgX2xvYWRDbGFzc3BhdGgoKSB7XG4gICAgbGV0IHNlcGFyYXRvciA9IG51bGw7XG4gICAgY29uc3QgY2xhc3NwYXRoU2V0ID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IGNsYXNzcGF0aEZpbGVOYW1lID1cbiAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEuY2xhc3NwYXRoRmlsZVBhdGgnKTtcblxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLnNjYW4oL14uKyQvLCB7IHBhdGhzOiBbJyonICsgY2xhc3NwYXRoRmlsZU5hbWVdIH0sXG4gICAgZmlsZSA9PiB7XG4gICAgICBzZXBhcmF0b3IgPSBmaWxlLmZpbGVQYXRoLmluZGV4T2YoJzonKSAhPT0gLTEgPyAnOycgOiAnOic7XG4gICAgICBfLmVhY2goZmlsZS5tYXRjaGVzLCBtYXRjaCA9PiB7XG4gICAgICAgIC8vIE5PVEU6IFRoZSA6XFwgcmVwbGFjZSBpcyBhIHF1aWNrIGhhY2sgZm9yIHN1cHBvcnRpbmcgV2luZG93c1xuICAgICAgICAvLyBhYnNvbHV0ZSBwYXRocyBlLmcgRTpcXG15UHJvamVjdFxcbGliXG4gICAgICAgIF8uZWFjaChtYXRjaC5tYXRjaFRleHQucmVwbGFjZSgnOlxcXFwnLCAnK1xcXFwnKS5zcGxpdCgvW1xcOlxcO10rLyksIHBhdGggPT4ge1xuICAgICAgICAgIGNsYXNzcGF0aFNldC5hZGQodGhpcy5fYXNBYnNvbHV0ZVBhdGgoZmlsZS5maWxlUGF0aCxcbiAgICAgICAgICAgIHBhdGgucmVwbGFjZSgnK1xcXFwnLCAnOlxcXFwnKSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbGV0IGNsYXNzcGF0aCA9ICcnO1xuICAgIF8uZWFjaChbLi4uY2xhc3NwYXRoU2V0XSwgcGF0aCA9PiB7XG4gICAgICBjbGFzc3BhdGggPSBjbGFzc3BhdGggKyBwYXRoICsgc2VwYXJhdG9yO1xuICAgIH0pO1xuICAgIHRoaXMuY2xhc3NwYXRoID0gY2xhc3NwYXRoO1xuICAgIHJldHVybiBjbGFzc3BhdGg7XG4gIH1cblxuICAvLyBUT0RPOiB0aGlzIGlzIGEgcXVpY2sgaGFjayBmb3IgbG9hZGluZyBwYXRoLiByZXBsYWNlIHdpdGggYXRvbS1qYXZhZW52XG4gIC8vIG9uY2UgaXQgaGFzIGJlZW4gaW1wbGVtZW50ZWRcbiAgX2FzQWJzb2x1dGVQYXRoKGN1cnJlbnRGaWxlUGF0aCwgcGF0aCkge1xuICAgIGxldCBwID0gcGF0aDtcbiAgICBsZXQgZGlyUGF0aCA9IGN1cnJlbnRGaWxlUGF0aC5tYXRjaCgvKC4qKVtcXFxcXFwvXS8pWzFdO1xuICAgIGxldCBhZGRCYXNlRGlyID0gZmFsc2U7XG4gICAgLy8gUmVtb3ZlIC4uLyBvciAuLlxcIGZyb20gYmVnaW5uaW5nXG4gICAgd2hpbGUgKC9eXFwuXFwuW1xcXFxcXC9dLy50ZXN0KHApKSB7XG4gICAgICBhZGRCYXNlRGlyID0gdHJ1ZTtcbiAgICAgIGRpclBhdGggPSBkaXJQYXRoLm1hdGNoKC8oLiopW1xcXFxcXC9dLylbMV07XG4gICAgICBwID0gcC5zdWJzdHJpbmcoMyk7XG4gICAgfVxuICAgIC8vIFJlbW92ZSAuLyBvciAuXFwgZnJvbSBiZWdpbm5pbmdcbiAgICB3aGlsZSAoL15cXC5bXFxcXFxcL10vLnRlc3QocCkpIHtcbiAgICAgIGFkZEJhc2VEaXIgPSB0cnVlO1xuICAgICAgcCA9IHAuc3Vic3RyaW5nKDIpO1xuICAgIH1cbiAgICByZXR1cm4gYWRkQmFzZURpciA/IGRpclBhdGggKyAnLycgKyBwIDogcDtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tQXV0b2NvbXBsZXRlUGFja2FnZSgpO1xuIl19
//# sourceURL=/home/champ/.atom/packages/autocomplete-java/lib/atomAutocompletePackage.js
