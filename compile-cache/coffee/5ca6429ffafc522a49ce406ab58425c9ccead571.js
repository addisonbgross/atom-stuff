(function() {
  var ColorRegex, Escape;

  ColorRegex = /\x1b\[([0-9;]*)m/g;

  Escape = /\x1b/;

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
          if ((m = Escape.exec(innerText)) != null) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9hbnNpLXBhcnNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsbUJBQWIsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxNQURULENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxZQUFBLEVBQWMsU0FBQyxTQUFELEdBQUE7QUFDWixVQUFBLDZCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBO3lCQUFBO0FBQ0UsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQUEsQ0FBUyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsQ0FBVCxDQUFaLENBQUEsQ0FERjtBQUFBLE9BREE7QUFHQSxhQUFPLE1BQVAsQ0FKWTtJQUFBLENBQWQ7QUFBQSxJQU1BLFdBQUEsRUFBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxDQUFDLENBQUEsQ0FBRCxFQUFLLENBQUEsQ0FBTCxFQUFTLENBQUEsQ0FBVCxDQUFULENBQUE7QUFDQSxNQUFBLElBQW9CLElBQUEsS0FBUSxFQUE1QjtBQUFBLGVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUCxDQUFBO09BREE7QUFFQTtBQUFBLFdBQUEsMkNBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUcsQ0FBQyxDQUFBLEdBQUksUUFBQSxDQUFTLEtBQVQsQ0FBTCxDQUFBLElBQXlCLEVBQXpCLElBQWdDLENBQUEsSUFBSyxFQUF4QztBQUNFLFVBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLENBQVosQ0FERjtT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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/ansi-parser.coffee
