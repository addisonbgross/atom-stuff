(function() {
  var Command, CommandEditPane, CompositeDisposable, Input, LinterList, ModifierModules, OutputModules, ProfileModules, Project, ProviderModules, SettingsView, StreamModifierModules, path, _ref;

  Input = require('./provider/input');

  Command = require('./provider/command');

  Project = require('./provider/project');

  LinterList = null;

  _ref = [], ProfileModules = _ref[0], OutputModules = _ref[1], ModifierModules = _ref[2], ProviderModules = _ref[3], StreamModifierModules = _ref[4];

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
      (StreamModifierModules != null ? StreamModifierModules : require('./stream-modifiers/modifiers')).reset();
      (OutputModules != null ? OutputModules : require('./output/output')).reset();
      Input.deactivate();
      ModifierModules = null;
      ProviderModules = null;
      StreamModifierModules = null;
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
      if (StreamModifierModules == null) {
        StreamModifierModules = require('./stream-modifiers/modifiers');
      }
      if (OutputModules == null) {
        OutputModules = require('./output/output');
      }
      return {
        Input: Input,
        ModifierModules: ModifierModules,
        ProfileModules: ProfileModules,
        ProviderModules: ProviderModules,
        StreamModifierModules: StreamModifierModules,
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
    consumeProfileModuleV1: function(_arg) {
      var key, profile;
      key = _arg.key, profile = _arg.profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      return ProfileModules.addProfile(key, profile);
    },
    consumeProfileModuleV2: function(_arg) {
      var key, profile;
      key = _arg.key, profile = _arg.profile;
      if (ProfileModules == null) {
        ProfileModules = require('./profiles/profiles');
      }
      return ProfileModules.addProfile(key, profile, 2);
    },
    consumeProviderModule: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (ProviderModules == null) {
        ProviderModules = require('./provider/provider');
      }
      return ProviderModules.addModule(key, mod);
    },
    consumeStreamModifier: function(_arg) {
      var key, mod;
      key = _arg.key, mod = _arg.mod;
      if (StreamModifierModules == null) {
        StreamModifierModules = require('./stream-modifiers/modifiers');
      }
      return StreamModifierModules.addModule(key, mod);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJMQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLElBSmIsQ0FBQTs7QUFBQSxFQUtBLE9BQTJGLEVBQTNGLEVBQUMsd0JBQUQsRUFBaUIsdUJBQWpCLEVBQWdDLHlCQUFoQyxFQUFpRCx5QkFBakQsRUFBa0UsK0JBTGxFLENBQUE7O0FBQUEsRUFPQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBUEQsQ0FBQTs7QUFBQSxFQVNBLGVBQUEsR0FBa0IsSUFUbEIsQ0FBQTs7QUFBQSxFQVVBLFlBQUEsR0FBZSxJQVZmLENBQUE7O0FBQUEsRUFZQSxJQUFBLEdBQU8sSUFaUCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLFNBQUEsR0FBQTtpQkFBRyxL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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/main.coffee
