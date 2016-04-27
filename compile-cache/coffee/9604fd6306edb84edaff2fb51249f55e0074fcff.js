(function() {
  var Modifiers, OutputPipelineRaw;

  Modifiers = require('../stream-modifiers/modifiers');

  module.exports = OutputPipelineRaw = (function() {
    function OutputPipelineRaw(settings, stream) {
      var c, config, name, _i, _len, _ref, _ref1, _ref2;
      this.settings = settings;
      this.stream = stream;
      this.pipeline = [];
      _ref = this.stream.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if ((c = Modifiers.modules[name]) != null) {
          if (c.modifier.prototype.modify_raw != null) {
            Modifiers.activate(name);
            this.pipeline.push(new c.modifier(config, this.settings));
          }
        } else {
          if ((_ref2 = atom.notifications) != null) {
            _ref2.addError("Could not find raw stream modifier: " + name);
          }
        }
      }
    }

    OutputPipelineRaw.prototype.destroy = function() {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (typeof mod.destroy === "function") {
          mod.destroy();
        }
      }
      return this.pipeline = null;
    };

    OutputPipelineRaw.prototype["in"] = function(_input) {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        _input = mod.modify_raw(_input);
      }
      return _input;
    };

    return OutputPipelineRaw;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1waXBlbGluZS1yYXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSwrQkFBUixDQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSwyQkFBRSxRQUFGLEVBQWEsTUFBYixHQUFBO0FBQ1gsVUFBQSw2Q0FBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLFNBQUEsTUFDeEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFaLENBQUE7QUFDQTtBQUFBLFdBQUEsMkNBQUEsR0FBQTtBQUNFLDBCQURHLGFBQUEsTUFBTSxlQUFBLE1BQ1QsQ0FBQTtBQUFBLFFBQUEsSUFBRyxxQ0FBSDtBQUNFLFVBQUEsSUFBRyx1Q0FBSDtBQUNFLFlBQUEsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsSUFBbkIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBbUIsSUFBQSxDQUFDLENBQUMsUUFBRixDQUFXLE1BQVgsRUFBbUIsSUFBQyxDQUFBLFFBQXBCLENBQW5CLENBREEsQ0FERjtXQURGO1NBQUEsTUFBQTs7aUJBS29CLENBQUUsUUFBcEIsQ0FBOEIsc0NBQUEsR0FBc0MsSUFBcEU7V0FMRjtTQURGO0FBQUEsT0FGVztJQUFBLENBQWI7O0FBQUEsZ0NBVUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsbUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7dUJBQUE7O1VBQUEsR0FBRyxDQUFDO1NBQUo7QUFBQSxPQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZMO0lBQUEsQ0FWVCxDQUFBOztBQUFBLGdDQWNBLEtBQUEsR0FBSSxTQUFDLE1BQUQsR0FBQTtBQUNGLFVBQUEsbUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7dUJBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsQ0FBVCxDQURGO0FBQUEsT0FBQTtBQUVBLGFBQU8sTUFBUCxDQUhFO0lBQUEsQ0FkSixDQUFBOzs2QkFBQTs7TUFMSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-pipeline-raw.coffee
