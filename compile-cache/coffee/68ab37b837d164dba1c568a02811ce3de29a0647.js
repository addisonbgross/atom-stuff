(function() {
  var Command, CommandEditPane, CompositeDisposable, Input, LinterList, ModifierModules, OutputModules, ProfileModules, Project, ProviderModules, SettingsView, path, _ref;

  Input = require('./provider/input');

  Command = require('./provider/command');

  Project = require('./provider/project');

  LinterList = null;

  _ref = [], ProfileModules = _ref[0], OutputModules = _ref[1], ModifierModules = _ref[2], ProviderModules = _ref[3];

  CompositeDisposable = require('atom').CompositeDisposable;

  CommandEditPane = null;

  SettingsView = null;

  path = null;

  module.exports = {
    subscriptions: null,
    activate: function(state) {
      Input.activate();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'build-tools:third-command': function() {
          return Input.key(2);
        },
        'build-tools:second-command': function() {
          return Input.key(1);
        },
        'build-tools:first-command': function() {
          return Input.key(0);
        },
        'build-tools:third-command-ask': function() {
          return Input.keyAsk(2);
        },
        'build-tools:second-command-ask': function() {
          return Input.keyAsk(1);
        },
        'build-tools:first-command-ask': function() {
          return Input.keyAsk(0);
        },
        'build-tools:commands': function() {
          return Input.selection();
        },
        'core:cancel': function() {
          return Input.cancel();
        }
      }));
      this.subscriptions.add(atom.views.addViewProvider(Command, function(command) {
        command.oldname = command.name;
        if (CommandEditPane == null) {
          CommandEditPane = require('./view/command-edit-pane');
        }
        return new CommandEditPane(command);
      }));
      return this.subscriptions.add(atom.workspace.addOpener(function(uritoopen) {
        if (uritoopen.endsWith('.build-tools.cson')) {
          if (path == null) {
            path = require('path');
          }
          if (SettingsView == null) {
            SettingsView = require('./view/settings-view');
          }
          return new SettingsView(path.dirname(uritoopen), uritoopen);
        }
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      (ModifierModules != null ? ModifierModules : require('./modifier/modifier')).reset();
      (ProviderModules != null ? ProviderModules : require('./provider/provider')).reset();
      (OutputModules != null ? OutputModules : require('./output/output')).reset();
      Input.deactivate();
      ModifierModules = null;
      ProviderModules = null;
      OutputModules = null;
      CommandEditPane = null;
      return SettingsView = null;
    },
    provideLinter: function() {
      return {
        name: 'build-tools',
        grammarScopes: ['*'],
        scope: 'project',
        lintOnFly: false,
        lint: function() {
          if (LinterList == null) {
            LinterList = require('./linter-list');
          }
          return LinterList.messages;
        }
      };
    },
    provideInput: function() {
      if (ModifierModules == null) {
        ModifierModules = require('./modifier/modifier');
      }
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      if (ProviderModules == null) {
        ProviderModules = require('./provider/provider');
      }
      if (OutputModules == null) {
        OutputModules = require('./output/output');
      }
      return {
        Input: Input,
        ModifierModules: ModifierModules,
        ProfileModules: ProfileModules,
        ProviderModules: ProviderModules,
        OutputModules: OutputModules
      };
    },
    provideConsole: function() {
      (OutputModules != null ? OutputModules : OutputModules = require('./output/output')).activate('console');
      return OutputModules.modules.console.provideConsole();
    },
    consumeModifierModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (ModifierModules == null) {
        ModifierModules = require('./modifier/modifier');
      }
      return ModifierModules.addModule(key, mod);
    },
    consumeProfileModule: function(_arg) {
      var key, profile;
      key = _arg.key, profile = _arg.profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      return ProfileModules.addProfile(key, profile);
    },
    consumeProviderModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (ProviderModules == null) {
        ProviderModules = require('./provider/provider');
      }
      return ProviderModules.addModule(key, mod);
    },
    consumeOutputModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (OutputModules == null) {
        OutputModules = require('./output/output');
      }
      return OutputModules.addModule(key, mod);
    },
    config: {
      CloseOnSuccess: {
        title: 'Close console on success',
        description: 'Value is used in command settings. 0 to hide console on success, >0 to hide console after x seconds',
        type: 'integer',
        "default": 3
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9LQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLElBSmIsQ0FBQTs7QUFBQSxFQUtBLE9BQW9FLEVBQXBFLEVBQUMsd0JBQUQsRUFBaUIsdUJBQWpCLEVBQWdDLHlCQUFoQyxFQUFpRCx5QkFMakQsQ0FBQTs7QUFBQSxFQU9DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFQRCxDQUFBOztBQUFBLEVBU0EsZUFBQSxHQUFrQixJQVRsQixDQUFBOztBQUFBLEVBVUEsWUFBQSxHQUFlLElBVmYsQ0FBQTs7QUFBQSxFQVlBLElBQUEsR0FBTyxJQVpQLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxLQUFLLENBQUMsUUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsMkJBQUEsRUFBNkIsU0FBQSxHQUFBO2lCQUFHLEtBQUssQ0FBQyxHQUFO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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/main.coffee
