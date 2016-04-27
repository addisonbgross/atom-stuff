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

    Tab.prototype.unlock = function() {
      return this.view.unlock();
    };

    Tab.prototype.lock = function() {
      return this.view.lock();
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
