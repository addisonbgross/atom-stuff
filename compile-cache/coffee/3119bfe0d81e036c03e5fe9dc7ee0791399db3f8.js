(function() {
  var Breakpoint, Codepoint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Codepoint = require('./codepoint');

  module.exports = Breakpoint = (function(_super) {
    __extends(Breakpoint, _super);

    atom.deserializers.add(Breakpoint);

    Breakpoint.version = '1d';

    Breakpoint.breakpointId = 1;

    Breakpoint.breakpointSettingId = 1;

    Breakpoint.TYPE_LINE = 'line';

    Breakpoint.TYPE_EXCEPTION = 'exception';

    Breakpoint.getNextBreakpointId = function() {
      return this.breakpointId++;
    };

    Breakpoint.getNextBreakpointSettingId = function() {
      return this.breakpointSettingId++;
    };

    function Breakpoint(_arg) {
      var filepath, line, marker;
      filepath = _arg.filepath, marker = _arg.marker, line = _arg.line, this.type = _arg.type, this.exception = _arg.exception, this.settings = _arg.settings;
      Breakpoint.__super__.constructor.apply(this, arguments);
      if (!this.type) {
        this.type = Breakpoint.TYPE_LINE;
      }
      this.id = Breakpoint.getNextBreakpointId();
    }

    Breakpoint.prototype.serialize = function() {
      return {
        deserializer: 'Breakpoint',
        version: this.constructor.version,
        data: {
          filepath: this.getPath(),
          line: this.getLine(),
          settings: JSON.stringify(this.getSettings())
        }
      };
    };

    Breakpoint.deserialize = function(_arg) {
      var data;
      data = _arg.data;
      return new Breakpoint({
        filepath: data.filepath,
        line: data.line,
        settings: Breakpoint.parseSettings(data.settings)
      });
    };

    Breakpoint.parseSettings = function(settings) {
      var idx, parsedSettings, ts, type, _i, _len;
      parsedSettings = JSON.parse(settings);
      for (type in parsedSettings) {
        settings = parsedSettings[type];
        for (idx = _i = 0, _len = settings.length; _i < _len; idx = ++_i) {
          ts = settings[idx];
          parsedSettings[type][idx].id = Breakpoint.getNextBreakpointSettingId();
        }
      }
      return parsedSettings;
    };

    Breakpoint.prototype.getId = function() {
      return this.id;
    };

    Breakpoint.prototype.getSettings = function() {
      if (!this.settings) {
        this.settings = {};
      }
      return this.settings;
    };

    Breakpoint.prototype.getSettingsValues = function(type) {
      if (!this.settings) {
        this.settings = {};
        return [];
      }
      if (!this.settings[type]) {
        return [];
      }
      return this.settings[type];
    };

    Breakpoint.prototype.addSetting = function(type, value) {
      if (!this.settings) {
        this.settings = {};
      }
      if (!this.settings[type]) {
        this.settings[type] = [];
      }
      value.id = Breakpoint.getNextBreakpointSettingId();
      this.settings[type].push(value);
      return value;
    };

    Breakpoint.prototype.removeSetting = function(setting) {
      var idx, settings, ts, type, _i, _len, _ref;
      if (!setting || !setting.id) {
        return;
      }
      if (!this.settings) {
        return;
      }
      _ref = this.settings;
      for (type in _ref) {
        settings = _ref[type];
        for (idx = _i = 0, _len = settings.length; _i < _len; idx = ++_i) {
          ts = settings[idx];
          if (ts.id === setting.id) {
            this.settings[type].splice(idx, 1);
            return;
          }
        }
      }
    };

    Breakpoint.prototype.getType = function() {
      return this.type;
    };

    Breakpoint.prototype.getException = function() {
      return this.exception;
    };

    Breakpoint.prototype.isLessThan = function(other) {
      if (!other instanceof Breakpoint) {
        return true;
      }
      if (other.getPath() < this.getPath()) {
        return true;
      }
      if (other.getLine() < this.getLine()) {
        return true;
      }
    };

    Breakpoint.prototype.isEqual = function(other) {
      if (!other instanceof Breakpoint) {
        return false;
      }
      if (other.getPath() !== this.getPath()) {
        return false;
      }
      if (other.getLine() !== this.getLine()) {
        return false;
      }
      return true;
    };

    Breakpoint.prototype.isGreaterThan = function(other) {
      return !this.isLessThan(other) && !this.isEqual(other);
    };

    Breakpoint.fromMarker = function(marker) {};

    return Breakpoint;

  })(Codepoint);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvYnJlYWtwb2ludC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUixDQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsVUFBQyxDQUFBLE9BQUQsR0FBVSxJQURWLENBQUE7O0FBQUEsSUFFQSxVQUFDLENBQUEsWUFBRCxHQUFlLENBRmYsQ0FBQTs7QUFBQSxJQUdBLFVBQUMsQ0FBQSxtQkFBRCxHQUFzQixDQUh0QixDQUFBOztBQUFBLElBSUEsVUFBQyxDQUFBLFNBQUQsR0FBYSxNQUpiLENBQUE7O0FBQUEsSUFLQSxVQUFDLENBQUEsY0FBRCxHQUFrQixXQUxsQixDQUFBOztBQUFBLElBUUEsVUFBQyxDQUFBLG1CQUFELEdBQXNCLFNBQUEsR0FBQTtBQUNwQixhQUFPLElBQUMsQ0FBQSxZQUFELEVBQVAsQ0FEb0I7SUFBQSxDQVJ0QixDQUFBOztBQUFBLElBV0EsVUFBQyxDQUFBLDBCQUFELEdBQTZCLFNBQUEsR0FBQTtBQUMzQixhQUFPLElBQUMsQ0FBQSxtQkFBRCxFQUFQLENBRDJCO0lBQUEsQ0FYN0IsQ0FBQTs7QUFjYSxJQUFBLG9CQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsc0JBQUE7QUFBQSxNQURhLGdCQUFBLFVBQVUsY0FBQSxRQUFRLFlBQUEsTUFBTSxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxpQkFBQSxXQUFXLElBQUMsQ0FBQSxnQkFB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/breakpoint.coffee
