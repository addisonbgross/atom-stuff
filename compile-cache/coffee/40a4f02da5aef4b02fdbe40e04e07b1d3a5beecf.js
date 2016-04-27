(function() {
  var Emitter, Tab, TabItem, TabView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TabView = require('./tab-view');

  TabItem = require('./tab-item');

  Emitter = require('atom').Emitter;

  module.exports = Tab = (function() {
    function Tab(name) {
      this.name = name;
      this.open = __bind(this.open, this);
      this.emitter = new Emitter;
      this.header = new TabItem('custom', this.name, (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      this.view = new TabView;
      this.header.setHeader("" + this.name);
      this.opener = null;
    }

    Tab.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Tab.prototype.clear = function() {
      return this.view.clear();
    };

    Tab.prototype.setIcon = function(icon) {
      return this.header.setIcon(icon);
    };

    Tab.prototype.setHeader = function(header) {
      this.header.setHeader(header);
      if (this.title == null) {
        this.title = document.createElement('span');
      }
      return this.title.innerText = header;
    };

    Tab.prototype.printLine = function(line) {
      return this.view.printLine(line);
    };

    Tab.prototype.finishConsole = function() {
      return this.view.finishConsole(this.open);
    };

    Tab.prototype.hasFocus = function() {
      return this === this.console.activeTab;
    };

    Tab.prototype.getHeader = function() {
      if (this.title != null) {
        return this.title;
      }
      this.title = document.createElement('span');
      this.title.innerText = "" + this.name;
      return this.title;
    };

    Tab.prototype.close = function() {
      return this.emitter.emit('close');
    };

    Tab.prototype.onClose = function(callback) {
      return this.emitter.on('close', callback);
    };

    Tab.prototype.setOpener = function(opener) {
      this.opener = opener;
    };

    Tab.prototype.open = function(element) {
      var linecol, lineno;
      if ((typeof this.opener === "function" ? this.opener(element) : void 0) != null) {
        return;
      }
      lineno = parseInt(element.attr('row'));
      linecol = parseInt(element.attr('col'));
      if (element.attr('name') !== '') {
        return atom.workspace.open(element.attr('name'), {
          initialLine: lineno - 1,
          initialColumn: linecol - 1
        });
      }
    };

    return Tab;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvY3VzdG9tLXRhYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0MsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLGFBQUUsSUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsT0FBQSxJQUNiLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxPQUFBLENBQVEsUUFBUixFQUFrQixJQUFDLENBQUEsSUFBbkIsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLE9BRlIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLEVBQUEsR0FBRyxJQUFDLENBQUEsSUFBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBSlYsQ0FEVztJQUFBLENBQWI7O0FBQUEsa0JBT0EsT0FBQSxHQUFTLFNB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/custom-tab.coffee
