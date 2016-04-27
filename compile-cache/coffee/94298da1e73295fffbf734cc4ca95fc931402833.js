(function() {
  var ColorRegex, ColorRegexEnd;

  ColorRegex = /\x1b\[([0-9;]*)m/g;

  ColorRegexEnd = /\x1b\[?[0-9;]*$/;

  module.exports = {
    classToStyle: function(className) {
      var style, styles, _i, _len, _ref;
      styles = [];
      _ref = className.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        style = _ref[_i];
        styles.push(parseInt(style.substr(1)));
      }
      return styles;
    },
    ansiToStyle: function(ansi) {
      var i, style, styles, _i, _len, _ref;
      styles = [-1, -1, -1];
      if (ansi === '') {
        return [0, 0, 0];
      }
      _ref = ansi.split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        style = _ref[_i];
        if ((i = parseInt(style)) >= 30 && i <= 37) {
          styles[0] = i;
        } else if (i >= 40 && i <= 47) {
          styles[1] = i;
        } else if (i === 39) {
          styles[0] = 0;
        } else if (i === 49) {
          styles[1] = 0;
        } else if (i === 1 || i === 3 || i === 4) {
          styles[2] = i;
        } else if (i >= 21 && i <= 24) {
          styles[2] = i;
        } else if (i === 0) {
          styles = [0, 0, 0];
        }
      }
      return styles;
    },
    styleToClass: function(styles) {
      var classNames, style, _i, _len;
      classNames = [];
      for (_i = 0, _len = styles.length; _i < _len; _i++) {
        style = styles[_i];
        classNames.push("a" + style);
      }
      return classNames.join(' ');
    },
    copyAttributes: function(elements, id) {
      var e, e1, e2, v;
      e1 = elements[id];
      e2 = elements[id - 1];
      if ((e1 != null) && (e2 != null)) {
        if ((e = e2.children).length !== 0) {
          e1.className = e[e.length - 1].className;
          if ((v = e[e.length - 1].getAttribute('nextStyle')) != null) {
            e1.setAttribute('nextStyle', v);
          }
          if ((v = e[e.length - 1].getAttribute('endsWithAnsi'))) {
            return e1.setAttribute('endsWithAnsi', v);
          }
        } else {
          e1.className = e2.className;
          if ((v = e2.getAttribute('nextStyle'))) {
            e1.setAttribute('nextStyle', v);
          }
          if ((v = e2.getAttribute('endsWithAnsi'))) {
            return e1.setAttribute('endsWithAnsi', v);
          }
        }
      }
    },
    getEndsWithAnsi: function(elements, id) {
      var e, endsWithAnsi, _ref, _ref1;
      if (elements[id - 1] != null) {
        if ((e = elements[id - 1].children).length !== 0) {
          endsWithAnsi = (_ref = e[e.length - 1].getAttribute('endsWithAnsi')) != null ? _ref : '';
        } else {
          endsWithAnsi = (_ref1 = elements[id - 1].getAttribute('endsWithAnsi')) != null ? _ref1 : '';
        }
        return endsWithAnsi;
      } else {
        return '';
      }
    },
    getNextStyle: function(elements, id) {
      var e, lastStyle, _ref, _ref1;
      if (elements[id - 1] != null) {
        if ((e = elements[id - 1].children).length !== 0) {
          lastStyle = (_ref = e[e.length - 1].getAttribute('nextStyle')) != null ? _ref : e[e.length - 1].className;
        } else {
          lastStyle = (_ref1 = elements[id - 1].getAttribute('nextStyle')) != null ? _ref1 : elements[id - 1].className;
        }
        return this.classToStyle(lastStyle);
      } else {
        return [0, 0, 0];
      }
    },
    setNextStyle: function(elements, id, className) {
      var e;
      if ((e = elements[id].children).length !== 0) {
        return e[e.length - 1].setAttribute('nextStyle', className);
      } else {
        return elements[id].setAttribute('nextStyle', className);
      }
    },
    constructElements: function(input, delims, elements, id) {
      var className, d, e, element, index, innerText, left, m, right, style, textIndex, _i, _index, _len, _ref, _results;
      element = elements[id];
      _results = [];
      for (index = _i = 0, _len = delims.length; _i < _len; index = ++_i) {
        _ref = delims[index], style = _ref[0], _index = _ref[1], textIndex = _ref[2];
        innerText = input.substr(textIndex, (d = delims[index + 1]) != null ? d[1] - textIndex : void 0);
        className = this.styleToClass(style);
        if (innerText === '') {
          this.setNextStyle(elements, id, className);
          continue;
        }
        e = document.createElement('span');
        element.appendChild(e);
        e.className = className;
        if (index === delims.length - 1 && innerText !== '') {
          if ((m = ColorRegexEnd.exec(innerText)) != null) {
            left = innerText.substr(0, m.index);
            right = innerText.substr(m.index);
            e.setAttribute('endsWithAnsi', right);
            innerText = left;
          }
        }
        _results.push(e.innerText = innerText);
      }
      return _results;
    },
    getDelim: function(input, elements, id) {
      var delims, i, index, lastStyle, m, s, style, _i, _j, _len, _len1;
      lastStyle = this.getNextStyle(elements, id);
      delims = [[lastStyle, 0, 0]];
      while ((m = ColorRegex.exec(input)) != null) {
        delims.push([this.ansiToStyle(m[1]), m.index, m.index + 3 + m[1].length]);
      }
      for (index = _i = 0, _len = delims.length; _i < _len; index = ++_i) {
        style = delims[index][0];
        for (i = _j = 0, _len1 = style.length; _j < _len1; i = ++_j) {
          s = style[i];
          if (s === -1) {
            style[i] = delims[index - 1][0][i];
          }
        }
      }
      return delims;
    },
    parseAnsi: function(input, elements, id) {
      input = this.getEndsWithAnsi(elements, id) + input;
      return this.constructElements(input, this.getDelim(input, elements, id), elements, id);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9hbnNpLXBhcnNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsbUJBQWIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsaUJBRGhCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxZQUFBLEVBQWMsU0FBQyxTQUFELEdBQUE7QUFDWixVQUFBLDZCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBO3lCQUFBO0FBQ0UsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQUEsQ0FBUyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsQ0FBVCxDQUFaLENBQUEsQ0FERjtBQUFBLE9BREE7QUFHQSxhQUFPLE1BQVAsQ0FKWTtJQUFBLENBQWQ7QUFBQSxJQU1BLFdBQUEsRUFBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxDQUFDLENBQUEsQ0FBRCxFQUFLLENBQUEsQ0FBTCxFQUFTLENBQUEsQ0FBVCxDQUFULENBQUE7QUFDQSxNQUFBLElBQW9CLElBQUEsS0FBUSxFQUE1QjtBQUFBLGVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUCxDQUFBO09BREE7QUFFQTtBQUFBLFdBQUEsMkNBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUcsQ0FBQyxDQUFBLEdBQUksUUFBQSxDQUFTLEtBQVQsQ0FBTCxDQUFBLElBQXlCLEVBQXpCLElBQWdDLENBQUEsSUFBSyxFQUF4QztBQUNFLFVBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLENBQVosQ0FE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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/ansi-parser.coffee
