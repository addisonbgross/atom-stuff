(function() {
  var $$, Modifiers, StreamInfoPane, buildPane;

  Modifiers = require('../stream-modifiers/modifiers');

  $$ = require('atom-space-pen-views').$$;

  buildPane = function(Element, name, command, config) {
    var el, element;
    if (name != null) {
      element = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'panel-heading'
            }, name);
            if (Element != null) {
              return _this.div({
                "class": 'panel-body padded'
              });
            }
          };
        })(this));
      });
    } else {
      element = $$(function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'panel-body padded'
            });
          };
        })(this));
      });
    }
    if (Element != null) {
      el = new Element(command, config);
      element.find('.panel-body').append(el.element);
    }
    return element[0];
  };

  module.exports = StreamInfoPane = (function() {
    function StreamInfoPane(command, data) {
      var config, keys, mod, name, values, _i, _len, _ref, _ref1;
      this.element = document.createElement('div');
      keys = document.createElement('div');
      values = document.createElement('div');
      _ref = data.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if (!Modifiers.activate(name)) {
          continue;
        }
        if (Modifiers.modules[name]["private"]) {
          continue;
        }
        mod = Modifiers.modules[name];
        this.element.appendChild(buildPane(mod.info, mod.name, command, config));
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return StreamInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLXN0cmVhbS1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsK0JBQVIsQ0FBWixDQUFBOztBQUFBLEVBRUMsS0FBTSxPQUFBLENBQVEsc0JBQVIsRUFBTixFQUZELENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QixNQUF6QixHQUFBO0FBQ1YsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFHLFlBQUg7QUFDRSxNQUFBLE9BQUEsR0FBVSxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ1gsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLGFBQVA7U0FBTCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsSUFBN0IsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxJQUFHLGVBQUg7cUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxtQkFBUDtlQUFMLEVBREY7YUFGeUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQURXO01BQUEsQ0FBSCxDQUFWLENBREY7S0FBQSxNQUFBO0FBT0UsTUFBQSxPQUFBLEdBQVUsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNYLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxhQUFQO1NBQUwsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFMLEVBRHlCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFEVztNQUFBLENBQUgsQ0FBVixDQVBGO0tBQUE7QUFVQSxJQUFBLElBQUcsZUFBSDtBQUNFLE1BQUEsRUFBQSxHQUFTLElBQUEsT0FBQSxDQUFRLE9BQVIsRUFBaUIsTUFBakIsQ0FBVCxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLGFBQWIsQ0FBMkIsQ0FBQyxNQUE1QixDQUFtQyxFQUFFLENBQUMsT0FBdEMsQ0FEQSxDQURGO0tBVkE7V0FhQSxPQUFRLENBQUEsQ0FBQSxFQWRFO0VBQUEsQ0FKWixDQUFBOztBQUFBLEVBb0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLHdCQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDWCxVQUFBLHNEQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRFAsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlQsQ0FBQTtBQUdBO0FBQUEsV0FBQSwyQ0FBQSxHQUFBO0FBQ0UsMEJBREcsYUFBQSxNQUFNLGVBQUEsTUFDVCxDQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsU0FBeUIsQ0FBQyxRQUFWLENBQW1CLElBQW5CLENBQWhCO0FBQUEsbUJBQUE7U0FBQTtBQUNBLFFBQUEsSUFBWSxTQUFTLENBQUMsT0FBUSxDQUFBLElBQUEsQ0FBSyxDQUFDLFNBQUQsQ0FBbkM7QUFBQSxtQkFBQTtTQURBO0FBQUEsUUFFQSxHQUFBLEdBQU0sU0FBUyxDQUFDLE9BQVEsQ0FBQSxJQUFBLENBRnhCLENBQUE7QUFBQSxRQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixTQUFBLENBQVUsR0FBRyxDQUFDLElBQWQsRUFBb0IsR0FBRyxDQUFDLElBQXhCLEVBQThCLE9BQTlCLEVBQXVDLE1BQXZDLENBQXJCLENBSEEsQ0FERjtBQUFBLE9BSEE7QUFBQSxNQVFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFyQixDQVJBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixNQUFyQixDQVRBLENBRFc7SUFBQSxDQUFiOzswQkFBQTs7TUF0QkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-stream-pane.coffee
