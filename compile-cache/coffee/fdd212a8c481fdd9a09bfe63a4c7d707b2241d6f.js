(function() {
  var Console, CustomTab, Emitter, Tab;

  Tab = require('./tab');

  CustomTab = require('./custom-tab');

  Emitter = require('atom').Emitter;

  module.exports = Console = (function() {
    function Console() {
      this.tabs = {};
      this.emitter = new Emitter;
      this.activeTab = null;
    }

    Console.prototype.destroy = function() {
      var k, k2, _i, _j, _len, _len1, _ref, _ref1;
      this.emitter.dispose();
      _ref = Object.keys(this.tabs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _ref1 = Object.keys(this.tabs[k]);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          k2 = _ref1[_j];
          this.removeTab(this.tabs[k][k2]);
        }
      }
      this.tabs = {};
      return this.emitter = null;
    };

    Console.prototype.getTab = function(command) {
      var tab, _ref;
      if ((tab = (_ref = this.tabs[command.project]) != null ? _ref[command.name] : void 0) != null) {
        return tab;
      }
      return this.createTab(command);
    };

    Console.prototype.getCustomTab = function(name) {
      var tab, _ref;
      if ((tab = (_ref = this.tabs['custom']) != null ? _ref[name] : void 0) != null) {
        return tab;
      }
      return this.createCustomTab(name);
    };

    Console.prototype.createTab = function(command) {
      var tab, _base, _name;
      if ((_base = this.tabs)[_name = command.project] == null) {
        _base[_name] = {};
      }
      tab = this.tabs[command.project][command.name] = new Tab(command);
      tab.onClose((function(_this) {
        return function() {
          return _this.removeTab(tab);
        };
      })(this));
      tab.focus = (function(_this) {
        return function() {
          return _this.focusTab(tab);
        };
      })(this);
      tab.console = this;
      this.emitter.emit('add', tab);
      return tab;
    };

    Console.prototype.createCustomTab = function(name) {
      var tab, _base;
      if ((_base = this.tabs)['custom'] == null) {
        _base['custom'] = {};
      }
      tab = this.tabs.custom[name] = new CustomTab(name);
      tab.onClose((function(_this) {
        return function() {
          return _this.removeTab(tab);
        };
      })(this));
      tab.focus = (function(_this) {
        return function() {
          return _this.focusTab(tab);
        };
      })(this);
      tab.console = this;
      this.emitter.emit('add', tab);
      return tab;
    };

    Console.prototype.removeTab = function(tab) {
      this.emitter.emit('remove', tab);
      if (tab === this.activeTab) {
        this.activeTab = null;
      }
      if (tab.command != null) {
        delete this.tabs[tab.command.project][tab.command.name];
      } else {
        delete this.tabs.custom[tab.name];
      }
      return tab.destroy();
    };

    Console.prototype.focusTab = function(tab) {
      this.activeTab = tab;
      return this.emitter.emit('focus', tab);
    };

    Console.prototype.onFocusTab = function(callback) {
      return this.emitter.on('focus', callback);
    };

    Console.prototype.onCreateTab = function(callback) {
      return this.emitter.on('add', callback);
    };

    Console.prototype.onRemoveTab = function(callback) {
      return this.emitter.on('remove', callback);
    };

    return Console;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvY29uc29sZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxpQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBRmIsQ0FEVztJQUFBLENBQWI7O0FBQUEsc0JBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsdUNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFO0FBQUEsYUFBQSw4Q0FBQTt5QkFBQTtBQUNFLFVBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLEVBQUEsQ0FBcEIsQ0FBQSxDQURGO0FBQUEsU0FERjtBQUFBLE9BREE7QUFBQSxNQUlBLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFKUixDQUFBO2FBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQU5KO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHNCQWFBLE1BQUEsR0FBUSxTQUFDLE9BQUQs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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/console.coffee
