(function() {
  var $, CompositeDisposable, ConfigPane, Project, Providers, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Providers = require('../provider/provider');

  Project = require('../provider/project');

  module.exports = ConfigPane = (function(_super) {
    __extends(ConfigPane, _super);

    function ConfigPane() {
      this.reload = __bind(this.reload, this);
      return ConfigPane.__super__.constructor.apply(this, arguments);
    }

    ConfigPane.content = function() {
      return this.div({
        id: 'config'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.span({
              "class": 'inline-block panel-text icon icon-database'
            }, 'Providers');
            _this.span({
              id: 'add-provider',
              "class": 'inline-block btn btn-sm icon icon-plus'
            }, 'Add provider');
            return _this.span({
              id: 'migrate-global',
              "class": 'inline-block btn btn-sm icon icon-globe hidden'
            }, 'Migrate old commands');
          });
          return _this.div({
            "class": 'panel-body padded',
            outlet: 'provider_list'
          });
        };
      })(this));
    };

    ConfigPane.prototype.initialize = function(projectPath, filePath) {
      this.projectPath = projectPath;
      this.filePath = filePath;
      this.model = new Project(this.projectPath, this.filePath, true);
      return ConfigPane.__super__.initialize.apply(this, arguments);
    };

    ConfigPane.prototype.destroy = function() {
      this.model.destroy();
      this.model = null;
      this.projectPath = null;
      this.filePath = null;
      this.hidePanes = null;
      return this.showPane = null;
    };

    ConfigPane.prototype.attached = function() {
      var context, key, name, _i, _len, _ref1;
      this.disposables = new CompositeDisposable;
      context = [];
      _ref1 = Object.keys(Providers.modules);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        name = Providers.modules[key].name;
        this.disposables.add(atom.commands.add(this[0], ("build-tools:add-" + name).replace(/\ /g, '-'), ((function(_this) {
          return function(k) {
            return function() {
              return _this.model.addProvider(k);
            };
          };
        })(this))(key)));
        context.push({
          label: "Add " + name,
          command: ("build-tools:add-" + name).replace(/\ /g, '-')
        });
      }
      this.disposables.add(atom.contextMenu.add({
        '#add-provider': context
      }));
      this.on('click', '#add-provider', function(event) {
        return atom.contextMenu.showForEvent(event);
      });
      this.on('click', '#migrate-global', this.model.migrateGlobal);
      this.model.hasGlobal((function(_this) {
        return function() {
          return _this.find('#migrate-global').removeClass('hidden');
        };
      })(this));
      this.disposables.add(this.model.onSave(this.reload));
      return this.reload();
    };

    ConfigPane.prototype.detached = function() {
      this.disposables.dispose();
      this.provider_list.html('');
      return this.find('#migrate-global').addClass('hidden');
    };

    ConfigPane.prototype.setCallbacks = function(hidePanes, showPane) {
      this.hidePanes = hidePanes;
      this.showPane = showPane;
    };

    ConfigPane.prototype.reload = function() {
      var index, provider, _base, _i, _len, _ref1, _results;
      this.provider_list.html('');
      _ref1 = this.model.providers;
      _results = [];
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        provider = _ref1[index];
        this.provider_list.append(this.buildPane(Providers.modules[provider.key].name, provider.view.element, index));
        _results.push(typeof (_base = provider.view).setCallbacks === "function" ? _base.setCallbacks(this.hidePanes, this.showPane) : void 0);
      }
      return _results;
    };

    ConfigPane.prototype.buildPane = function(name, element, id) {
      var item;
      item = $(element);
      item.find('#provider-name').text(name);
      item.on('click', '.config-buttons .icon-triangle-up', (function(_this) {
        return function() {
          return _this.model.moveProviderUp(id);
        };
      })(this));
      item.on('click', '.config-buttons .icon-triangle-down', (function(_this) {
        return function() {
          return _this.model.moveProviderDown(id);
        };
      })(this));
      item.on('click', '.config-buttons .icon-x', (function(_this) {
        return function() {
          return _this.model.removeProvider(id);
        };
      })(this));
      return element;
    };

    return ConfigPane;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29uZmlnLXBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFBSixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEscUJBQVIsQ0FIVixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLGlDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxRQUFKO09BQUwsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLDRDQUFQO2FBQU4sRUFBMkQsV0FBM0QsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxFQUFBLEVBQUksY0FBSjtBQUFBLGNBQW9CLE9BQUEsRUFBTyx3Q0FBM0I7YUFBTixFQUEyRSxjQUEzRSxDQURBLENBQUE7bUJBRUEsS0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/config-pane.coffee
