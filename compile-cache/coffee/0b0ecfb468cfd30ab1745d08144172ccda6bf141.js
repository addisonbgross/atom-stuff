(function() {
  var $$, ListView, OutputViewManager, SelectListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, item, items, _i, _len;
      items = this.data.split("\n");
      branches = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var current, name;
      name = _arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.merge(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.merge = function(branch) {
      return git.cmd(['merge', branch], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        OutputViewManager["new"]().addLine(data).finish();
        atom.workspace.getTextEditors().forEach(function(editor) {
          return fs.exists(editor.getPath(), function(exist) {
            if (!exist) {
              return editor.destroy();
            }
          });
        });
        return git.refresh();
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL21lcmdlLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQURMLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FGTixDQUFBOztBQUFBLEVBR0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBSHBCLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBO0FBQUEsTUFBQSwwQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBSFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsdUJBS0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsK0JBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEVBRFgs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

//# sourceURL=/home/champ/.atom/packages/git-plus/lib/views/merge-list-view.coffee