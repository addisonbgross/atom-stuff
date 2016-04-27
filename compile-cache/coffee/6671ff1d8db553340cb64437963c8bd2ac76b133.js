(function() {
  var AnnotationManager, AutocompletionManager, GotoManager, StatusInProgress, TooltipManager, config, parser, plugins, proxy;

  GotoManager = require("./goto/goto-manager.coffee");

  TooltipManager = require("./tooltip/tooltip-manager.coffee");

  AnnotationManager = require("./annotation/annotation-manager.coffee");

  AutocompletionManager = require("./autocompletion/autocompletion-manager.coffee");

  StatusInProgress = require("./services/status-in-progress.coffee");

  config = require('./config.coffee');

  proxy = require('./services/php-proxy.coffee');

  parser = require('./services/php-file-parser.coffee');

  plugins = require('./services/plugin-manager.coffee');

  module.exports = {
    config: {
      binComposer: {
        title: 'Command to use composer',
        description: 'This plugin depends on composer in order to work. Specify the path to your composer bin (e.g : bin/composer, composer.phar, composer)',
        type: 'string',
        "default": '/usr/local/bin/composer',
        order: 1
      },
      binPhp: {
        title: 'Command php',
        description: 'This plugin use php CLI in order to work. Please specify your php command ("php" on UNIX systems)',
        type: 'string',
        "default": 'php',
        order: 2
      },
      autoloadPaths: {
        title: 'Autoloader file',
        description: 'Relative path to the files of autoload.php from composer (or an other one). You can specify multiple paths (comma separated) if you have different paths for some projects.',
        type: 'array',
        "default": ['vendor/autoload.php', 'autoload.php'],
        order: 3
      },
      classMapFiles: {
        title: 'Classmap files',
        description: 'Relative path to the files that contains a classmap (array with "className" => "fileName"). By default on composer it\'s vendor/composer/autoload_classmap.php',
        type: 'array',
        "default": ['vendor/composer/autoload_classmap.php', 'autoload/ezp_kernel.php'],
        order: 4
      },
      insertNewlinesForUseStatements: {
        title: 'Insert newlines for use statements.',
        description: 'When enabled, the plugin will add additional newlines before or after an automatically added use statement when it can\'t add them nicely to an existing group. This results in more cleanly separated use statements but will create additional vertical whitespace.',
        type: 'boolean',
        "default": false,
        order: 5
      },
      verboseErrors: {
        title: 'Errors on file saving showed',
        description: 'When enabled, you\'ll have a notification once an error occured on autocomplete. Otherwise, the message will just be logged in developer console',
        type: 'boolean',
        "default": false,
        order: 6
      }
    },
    activate: function() {
      config.testConfig();
      config.init();
      this.autocompletionManager = new AutocompletionManager();
      this.autocompletionManager.init();
      this.gotoManager = new GotoManager();
      this.gotoManager.init();
      this.tooltipManager = new TooltipManager();
      this.tooltipManager.init();
      this.annotationManager = new AnnotationManager();
      this.annotationManager.init();
      return proxy.init();
    },
    deactivate: function() {
      this.gotoManager.deactivate();
      this.tooltipManager.deactivate();
      this.annotationManager.deactivate();
      return this.autocompletionManager.deactivate();
    },
    consumeStatusBar: function(statusBar) {
      config.statusInProgress.initialize(statusBar);
      return config.statusInProgress.attach();
    },
    consumePlugin: function(plugin) {
      return plugins.plugins.push(plugin);
    },
    provideAutocompleteTools: function() {
      this.services = {
        proxy: proxy,
        parser: parser
      };
      return this.services;
    },
    getProvider: function() {
      return this.autocompletionManager.getProviders();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9wZWVrbW8tcGhwLWF0b20tYXV0b2NvbXBsZXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1SEFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3Q0FBUixDQUZwQixDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLGdEQUFSLENBSHhCLENBQUE7O0FBQUEsRUFJQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0NBQVIsQ0FKbkIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FMVCxDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSw2QkFBUixDQU5SLENBQUE7O0FBQUEsRUFPQSxNQUFBLEdBQVMsT0FBQSxDQUFRLG1DQUFSLENBUFQsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0NBQVIsQ0FSVixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsTUFBQSxFQUNJO0FBQUEsTUFBQSxXQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyx5QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHVJQURiO0FBQUEsUUFHQSxJQUFBLEVBQU0sUUFITjtBQUFBLFFBSUEsU0FBQSxFQUFTLHlCQUpUO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQURKO0FBQUEsTUFRQSxNQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUdBRGI7QUFBQSxRQUdBLElBQUEsRUFBTSxRQUhOO0FBQUEsUUFJQSxTQUFBLEVBQVMsS0FKVDtBQUFBLFFBS0EsS0FBQSxFQUFPLENBTFA7T0FUSjtBQUFBLE1BZ0JBLGFBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNktBRGI7QUFBQSxRQUdBLElBQUEsRUFBTSxPQUhOO0FBQUEsUUFJQSxTQUFBLEVBQVMsQ0FBQyxxQkFBRCxFQUF3QixjQUF4QixDQUpUO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQWpCSjtBQUFBLE1Bd0JBLGFBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsZ0tBRGI7QUFBQSxRQUdBLElBQUEsRUFBTSxPQUhOO0FBQUEsUUFJQSxTQUFBLEVBQVMsQ0FBQyx1Q0FBRCxFQUEwQyx5QkFBMUMsQ0FKVDtBQUFBLFFBS0EsS0FBQSxFQUFPLENBTFA7T0F6Qko7QUFBQSxNQWdDQSw4QkFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8scUNBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx1UUFEYjtBQUFBLFFBSUEsSUFBQSxFQUFNLFNBSk47QUFBQSxRQUtBLFNBQUEsRUFBUyxLQUxUO0FBQUEsUUFNQSxLQUFBLEVBQU8sQ0FOUDtPQWpDSjtBQUFBLE1BeUNBLGFBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLDhCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsa0pBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0ExQ0o7S0FESjtBQUFBLElBaURBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixNQUFBLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsSUFBUCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHFCQUFELEdBQTZCLElBQUEscUJBQUEsQ0FBQSxDQUg3QixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEscUJBQXFCLENBQUMsSUFBdkIsQ0FBQSxDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFBLENBTm5CLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQUEsQ0FUdEIsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLENBVkEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsaUJBQUEsQ0FBQSxDQVp6QixDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsSUFBbkIsQ0FBQSxDQWJBLENBQUE7YUFlQSxLQUFLLENBQUMsSUFBTixDQUFBLEVBaEJNO0lBQUEsQ0FqRFY7QUFBQSxJQW1FQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQWIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsVUFBaEIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxVQUFuQixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxxQkFBcUIsQ0FBQyxVQUF2QixDQUFBLEVBSlE7SUFBQSxDQW5FWjtBQUFBLElBeUVBLGdCQUFBLEVBQWtCLFNBQUMsU0FBRCxHQUFBO0FBQ2QsTUFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBeEIsQ0FBbUMsU0FBbkMsQ0FBQSxDQUFBO2FBQ0EsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQXhCLENBQUEsRUFGYztJQUFBLENBekVsQjtBQUFBLElBNkVBLGFBQUEsRUFBZSxTQUFDLE1BQUQsR0FBQTthQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBaEIsQ0FBcUIsTUFBckIsRUFEVztJQUFBLENBN0VmO0FBQUEsSUFnRkEsd0JBQUEsRUFBMEIsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLE1BQUEsRUFBUSxNQURSO09BREosQ0FBQTtBQUlBLGFBQU8sSUFBQyxDQUFBLFFBQVIsQ0FMc0I7SUFBQSxDQWhGMUI7QUFBQSxJQXVGQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1QsYUFBTyxJQUFDLENBQUEscUJBQXFCLENBQUMsWUFBdkIsQ0FBQSxDQUFQLENBRFM7SUFBQSxDQXZGYjtHQVhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/peekmo-php-atom-autocomplete.coffee
