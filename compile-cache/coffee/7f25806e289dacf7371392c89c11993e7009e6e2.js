(function() {
  var AsmViewer, TextEditor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  module.exports = AsmViewer = (function(_super) {
    __extends(AsmViewer, _super);

    AsmViewer.prototype.lines = null;

    function AsmViewer(params) {
      var file, line;
      line = params.startline;
      file = params.fullname;
      AsmViewer.__super__.constructor.call(this, params);
      this.GDB = params.gdb;
      this.lines = {};
      this.setText("" + (line + 1) + ":");
      this.GDB.disassembleData({
        file: {
          name: file,
          linenum: line + 1,
          lines: -1
        },
        mode: 1
      }, (function(_this) {
        return function(instructions) {
          var alignSpace, asm, linenum, maxOffset, maxOffsetLength, src, text, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
          maxOffset = -1;
          for (_i = 0, _len = instructions.length; _i < _len; _i++) {
            src = instructions[_i];
            _ref = src.line_asm_insn;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              asm = _ref[_j];
              if (Number(asm.offset) > maxOffset) {
                maxOffset = Number(asm.offset);
              }
            }
          }
          maxOffsetLength = maxOffset.toString().length;
          text = [];
          linenum = 0;
          for (_k = 0, _len2 = instructions.length; _k < _len2; _k++) {
            src = instructions[_k];
            text.push("" + src.line + ":");
            _this.lines[Number(src.line) - 1] = linenum;
            linenum += 1;
            _ref1 = src.line_asm_insn;
            for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
              asm = _ref1[_l];
              if (!asm.offset) {
                asm.offset = '0';
              }
              alignSpace = '                '.slice(0, maxOffsetLength - asm.offset.length);
              text.push("    " + asm['func-name'] + "+" + alignSpace + asm.offset + ":    " + asm.inst);
              linenum += 1;
            }
          }
          _this.setText(text.join('\n'));
          return console.log(_this.lines);
        };
      })(this));
    }

    AsmViewer.prototype.fileLineToBufferLine = function(line) {
      if (!(line in this.lines)) {
        return Number(0);
      }
      return this.lines[line];
    };

    AsmViewer.prototype.bufferLineToFileLine = function(line) {
      var left, lines, mid, midLine, right;
      lines = Object.keys(this.lines);
      left = 0;
      right = lines.length - 1;
      while (left <= right) {
        mid = Math.floor((left + right) / 2);
        midLine = this.lines[lines[mid]];
        if (line < midLine) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      return Number(lines[left - 1]);
    };

    AsmViewer.prototype.shouldPromptToSave = function(_arg) {
      var windowCloseRequested;
      windowCloseRequested = (_arg != null ? _arg : {}).windowCloseRequested;
      return false;
    };

    return AsmViewer;

  })(TextEditor);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9saWIvYXNtLXZpZXdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7QUFBQSx3QkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUNhLElBQUEsbUJBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSxVQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLFNBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxRQURkLENBQUE7QUFBQSxNQUdBLDJDQUFNLE1BQU4sQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsR0FBRCxHQUFPLE1BQU0sQ0FBQyxHQUxkLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFQVCxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsT0FBRCxDQUFTLEVBQUEsR0FBRSxDQUFDLElBQUEsR0FBSyxDQUFOLENBQUYsR0FBVSxHQUFuQixDQVJBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZUFBTCxDQUFxQjtBQUFBLFFBQUMsSUFBQSxFQUFNO0FBQUEsVUFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLFVBQWEsT0FBQSxFQUFTLElBQUEsR0FBSyxDQUEzQjtBQUFBLFVBQThCLEtBQUEsRUFBTyxDQUFBLENBQXJDO1NBQVA7QUFBQSxRQUFpRCxJQUFBLEVBQU0sQ0FBdkQ7T0FBckIsRUFBZ0YsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsWUFBRCxHQUFBO0FBQzlF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

//# sourceURL=/home/champ/.atom/packages/atom-debugger/lib/asm-viewer.coffee
