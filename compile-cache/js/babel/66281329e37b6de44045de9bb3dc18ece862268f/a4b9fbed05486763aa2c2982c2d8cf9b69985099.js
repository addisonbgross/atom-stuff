Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _javaUtil = require('./javaUtil');

var _javaUtil2 = _interopRequireDefault(_javaUtil);

'use babel';

var AtomJavaUtil = (function () {
  function AtomJavaUtil() {
    _classCallCheck(this, AtomJavaUtil);
  }

  _createClass(AtomJavaUtil, [{
    key: 'getCurrentPackageName',
    value: function getCurrentPackageName(editor) {
      return this._lastMatch(editor.getText(), /package ([^;]*);/);
    }
  }, {
    key: 'getCurrentClassSimpleName',
    value: function getCurrentClassSimpleName(editor) {
      return editor.getTitle().split('.')[0];
    }
  }, {
    key: 'getCurrentClassName',
    value: function getCurrentClassName(editor) {
      return this.getCurrentPackageName(editor) + '.' + this.getCurrentClassName(editor);
    }
  }, {
    key: 'getImportedClassName',
    value: function getImportedClassName(editor, classSimpleName) {
      return this._lastMatch(editor.getText(), new RegExp('import (.*' + classSimpleName + ');'));
    }
  }, {
    key: 'getPossibleClassNames',
    value: function getPossibleClassNames(editor, classSimpleName, prefix) {
      var classNames = [];
      var className = this.getImportedClassName(editor, classSimpleName);
      if (className) {
        classNames.push(className);
      } else {
        if (prefix.indexOf('.') === -1) {
          // Use package name of current file or 'java.lang'
          classNames.push(this.getCurrentPackageName(editor) + '.' + classSimpleName);
          classNames.push('java.lang.' + classSimpleName);
        } else {
          // Use the whole prefix as classname
          classNames.push(prefix);
        }
      }
      return classNames;
    }
  }, {
    key: 'getLine',
    value: function getLine(editor, bufferPosition) {
      return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    }
  }, {
    key: 'getWord',
    value: function getWord(editor, bufferPosition, removeParenthesis) {
      var line = this.getLine(editor, bufferPosition);
      return this.getLastWord(line, removeParenthesis);
    }
  }, {
    key: 'getLastWord',
    value: function getLastWord(line, removeParenthesis) {
      var result = this._lastMatch(line, /[^\s-]+$/);
      return removeParenthesis ? result.replace(/.*\(/, '') : result;
    }
  }, {
    key: 'getPrevWord',
    value: function getPrevWord(editor, bufferPosition) {
      var words = this.getLine(editor, bufferPosition).split(/[\s\(]+/);
      return words.length >= 2 ? words[words.length - 2] : null;
    }
  }, {
    key: 'importClass',
    value: function importClass(editor, className, foldImports) {
      // Add import statement if import does not already exist.
      // But do not import if class belongs in java.lang or current package.
      var packageName = _javaUtil2['default'].getPackageName(className);
      if (!this.getImportedClassName(editor, className) && packageName !== 'java.lang' && packageName !== this.getCurrentPackageName(editor)) {
        this.organizeImports(editor, 'import ' + className + ';', foldImports);
      }
    }
  }, {
    key: 'getImports',
    value: function getImports(editor) {
      var buffer = editor.getBuffer();
      return buffer.getText().match(/import\s.*;/g) || [];
    }
  }, {
    key: 'organizeImports',
    value: function organizeImports(editor, newImport, foldImports) {
      var _this = this;

      var buffer = editor.getBuffer();
      buffer.transact(function () {
        // Get current imports
        var imports = _this.getImports(editor);
        if (newImport) {
          imports.push(newImport);
        }
        // Remove current imports
        buffer.replace(/import\s.*;[\r\n]+/g, '');
        // Add sorted imports
        buffer.insert([1, 0], '\n');
        _lodash._.each(_lodash._.sortBy(imports), function (value, index) {
          buffer.insert([index + 2, 0], value + '\n');
        });

        if (foldImports) {
          _this.foldImports(editor);
        }
      });
    }
  }, {
    key: 'foldImports',
    value: function foldImports(editor) {
      var firstRow = 0;
      var lastRow = 0;
      var buffer = editor.getBuffer();
      buffer.scan(/import\s.*;/g, function (m) {
        lastRow = m.range.end.row;
      });

      if (lastRow) {
        var pos = editor.getCursorBufferPosition();
        editor.setSelectedBufferRange([[firstRow, 0], [lastRow, 0]]);
        editor.foldSelectedLines();
        editor.setCursorBufferPosition(pos);
      }
    }
  }, {
    key: 'determineClassName',
    value: function determineClassName(editor, bufferPosition, text, prefix, suffix, prevReturnType) {
      try {
        var classNames = null;
        var isInstance = /\)$/.test(prefix);

        var classSimpleName = null;

        // Determine class name
        if (!prefix || prefix === 'this') {
          // Use this as class name
          classSimpleName = this.getCurrentClassSimpleName(editor);
          isInstance = true;
        } else if (prefix) {
          // Get class name from prefix
          // Also support '((ClassName)var)' syntax (a quick hack)
          classSimpleName = this.getWord(editor, bufferPosition).indexOf('((') !== -1 ? prefix.match(/[^\)]*/)[0] : prefix;
        }

        if (!this._isValidClassName(classSimpleName) && !/[\.\)]/.test(prefix)) {
          // Find class name by a variable name given as prefix
          // TODO traverse brackets backwards to match correct scope (with regexp)
          // TODO handle 'this.varName' correctly
          classSimpleName = this._lastMatch(editor.getTextInRange([[bufferPosition.row - 25, 0], bufferPosition]), new RegExp('([A-Z][a-zA-Z0-9_]*)(<[A-Z][a-zA-Z0-9_<>, ]*>)?\\s' + prefix, 'g'));
          classSimpleName = classSimpleName.replace(' ' + prefix, '');
          classSimpleName = classSimpleName.replace(/\<.*\>/, '');

          isInstance = true;
        }

        if (this._isValidClassName(classSimpleName)) {
          // Convert simple name to a full class name and use that
          classNames = this.getPossibleClassNames(editor, classSimpleName, prefix);
        } else {
          // Just use return type of previous snippet (a quick hack)
          // TODO determine type using classloader
          classNames = [prevReturnType];
          isInstance = true;
        }

        return { classNames: classNames, isInstance: isInstance };
      } catch (err) {
        console.error(err);
        return {};
      }
    }
  }, {
    key: '_isValidClassName',
    value: function _isValidClassName(text) {
      return (/^[A-Z][^\.\)]*$/.test(text) || /\.[A-Z][^\.\)]*$/.test(text)
      );
    }
  }, {
    key: '_lastMatch',
    value: function _lastMatch(str, regex) {
      var array = str.match(regex) || [''];
      return array[array.length - 1];
    }
  }]);

  return AtomJavaUtil;
})();

exports['default'] = new AtomJavaUtil();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9hdG9tSmF2YVV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFa0IsUUFBUTs7d0JBQ0wsWUFBWTs7OztBQUhqQyxXQUFXLENBQUM7O0lBS04sWUFBWTtXQUFaLFlBQVk7MEJBQVosWUFBWTs7O2VBQVosWUFBWTs7V0FFSywrQkFBQyxNQUFNLEVBQUU7QUFDNUIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0tBQzlEOzs7V0FFd0IsbUNBQUMsTUFBTSxFQUFFO0FBQ2hDLGFBQU8sTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4Qzs7O1dBRWtCLDZCQUFDLE1BQU0sRUFBRTtBQUMxQixhQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQzNDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN0Qzs7O1dBRW1CLDhCQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUU7QUFDNUMsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFDckMsSUFBSSxNQUFNLENBQUMsWUFBWSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3REOzs7V0FFb0IsK0JBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUU7QUFDckQsVUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDckUsVUFBSSxTQUFTLEVBQUU7QUFDYixrQkFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FB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RCxvQkFBVSxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxZQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFBRTs7QUFFM0Msb0JBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFDN0QsTUFBTSxDQUFDLENBQUM7U0FDWCxNQUFNOzs7QUFHTCxvQkFBVSxHQUFHLENBQUUsY0FBYyxDQUFFLENBQUM7QUFDaEMsb0JBQVUsR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsZUFBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDO09BQ25DLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDWixlQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRjs7O1dBRWdCLDJCQUFDLElBQUksRUFBRTtBQUN0QixhQUFPLGtCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQUM7S0FDdEU7OztXQUVTLG9CQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDckIsVUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLGFBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDaEM7OztTQTVLRyxZQUFZOzs7cUJBZ0xILElBQUksWUFBWSxFQUFFIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9hdG9tSmF2YVV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgXyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgamF2YVV0aWwgZnJvbSAnLi9qYXZhVXRpbCc7XG5cbmNsYXNzIEF0b21KYXZhVXRpbCB7XG5cbiAgZ2V0Q3VycmVudFBhY2thZ2VOYW1lKGVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLl9sYXN0TWF0Y2goZWRpdG9yLmdldFRleHQoKSwgL3BhY2thZ2UgKFteO10qKTsvKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRDbGFzc1NpbXBsZU5hbWUoZWRpdG9yKSB7XG4gICAgcmV0dXJuIGVkaXRvci5nZXRUaXRsZSgpLnNwbGl0KCcuJylbMF07XG4gIH1cblxuICBnZXRDdXJyZW50Q2xhc3NOYW1lKGVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRQYWNrYWdlTmFtZShlZGl0b3IpICsgJy4nXG4gICAgICArIHRoaXMuZ2V0Q3VycmVudENsYXNzTmFtZShlZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW1wb3J0ZWRDbGFzc05hbWUoZWRpdG9yLCBjbGFzc1NpbXBsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdE1hdGNoKGVkaXRvci5nZXRUZXh0KCksXG4gICAgICBuZXcgUmVnRXhwKCdpbXBvcnQgKC4qJyArIGNsYXNzU2ltcGxlTmFtZSArICcpOycpKTtcbiAgfVxuXG4gIGdldFBvc3NpYmxlQ2xhc3NOYW1lcyhlZGl0b3IsIGNsYXNzU2ltcGxlTmFtZSwgcHJlZml4KSB7XG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IFtdO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMuZ2V0SW1wb3J0ZWRDbGFzc05hbWUoZWRpdG9yLCBjbGFzc1NpbXBsZU5hbWUpO1xuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJlZml4LmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcbiAgICAgICAgLy8gVXNlIHBhY2thZ2UgbmFtZSBvZiBjdXJyZW50IGZpbGUgb3IgJ2phdmEubGFuZydcbiAgICAgICAgY2xhc3NOYW1lcy5wdXNoKHRoaXMuZ2V0Q3VycmVudFBhY2thZ2VOYW1lKGVkaXRvcikgK1xuICAgICAgICAgICcuJyArIGNsYXNzU2ltcGxlTmFtZSk7XG4gICAgICAgIGNsYXNzTmFtZXMucHVzaCgnamF2YS5sYW5nLicgKyBjbGFzc1NpbXBsZU5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVXNlIHRoZSB3aG9sZSBwcmVmaXggYXMgY2xhc3NuYW1lXG4gICAgICAgIGNsYXNzTmFtZXMucHVzaChwcmVmaXgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xhc3NOYW1lcztcbiAgfVxuXG4gIGdldExpbmUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikge1xuICAgIHJldHVybiBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICB9XG5cbiAgZ2V0V29yZChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCByZW1vdmVQYXJlbnRoZXNpcykge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdldExpbmUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbik7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdFdvcmQobGluZSwgcmVtb3ZlUGFyZW50aGVzaXMpO1xuICB9XG5cbiAgZ2V0TGFzdFdvcmQobGluZSwgcmVtb3ZlUGFyZW50aGVzaXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9sYXN0TWF0Y2gobGluZSwgL1teXFxzLV0rJC8pO1xuICAgIHJldHVybiByZW1vdmVQYXJlbnRoZXNpcyA/IHJlc3VsdC5yZXBsYWNlKC8uKlxcKC8sICcnKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGdldFByZXZXb3JkKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHtcbiAgICBjb25zdCB3b3JkcyA9IHRoaXMuZ2V0TGluZShlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS5zcGxpdCgvW1xcc1xcKF0rLyk7XG4gICAgcmV0dXJuIHdvcmRzLmxlbmd0aCA+PSAyID8gd29yZHNbd29yZHMubGVuZ3RoIC0gMl0gOiBudWxsO1xuICB9XG5cbiAgaW1wb3J0Q2xhc3MoZWRpdG9yLCBjbGFzc05hbWUsIGZvbGRJbXBvcnRzKSB7XG4gICAgLy8gQWRkIGltcG9ydCBzdGF0ZW1lbnQgaWYgaW1wb3J0IGRvZXMgbm90IGFscmVhZHkgZXhpc3QuXG4gICAgLy8gQnV0IGRvIG5vdCBpbXBvcnQgaWYgY2xhc3MgYmVsb25ncyBpbiBqYXZhLmxhbmcgb3IgY3VycmVudCBwYWNrYWdlLlxuICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gamF2YVV0aWwuZ2V0UGFja2FnZU5hbWUoY2xhc3NOYW1lKTtcbiAgICBpZiAoIXRoaXMuZ2V0SW1wb3J0ZWRDbGFzc05hbWUoZWRpdG9yLCBjbGFzc05hbWUpICYmXG4gICAgICAgIHBhY2thZ2VOYW1lICE9PSAnamF2YS5sYW5nJyAmJlxuICAgICAgICBwYWNrYWdlTmFtZSAhPT0gdGhpcy5nZXRDdXJyZW50UGFja2FnZU5hbWUoZWRpdG9yKSkge1xuICAgICAgdGhpcy5vcmdhbml6ZUltcG9ydHMoZWRpdG9yLCAnaW1wb3J0ICcgKyBjbGFzc05hbWUgKyAnOycsIGZvbGRJbXBvcnRzKTtcbiAgICB9XG4gIH1cblxuICBnZXRJbXBvcnRzKGVkaXRvcikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICByZXR1cm4gYnVmZmVyLmdldFRleHQoKS5tYXRjaCgvaW1wb3J0XFxzLio7L2cpIHx8IFtdO1xuICB9XG5cbiAgb3JnYW5pemVJbXBvcnRzKGVkaXRvciwgbmV3SW1wb3J0LCBmb2xkSW1wb3J0cykge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICBidWZmZXIudHJhbnNhY3QoKCkgPT4ge1xuICAgICAgLy8gR2V0IGN1cnJlbnQgaW1wb3J0c1xuICAgICAgY29uc3QgaW1wb3J0cyA9IHRoaXMuZ2V0SW1wb3J0cyhlZGl0b3IpO1xuICAgICAgaWYgKG5ld0ltcG9ydCkge1xuICAgICAgICBpbXBvcnRzLnB1c2gobmV3SW1wb3J0KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlbW92ZSBjdXJyZW50IGltcG9ydHNcbiAgICAgIGJ1ZmZlci5yZXBsYWNlKC9pbXBvcnRcXHMuKjtbXFxyXFxuXSsvZywgJycpO1xuICAgICAgLy8gQWRkIHNvcnRlZCBpbXBvcnRzXG4gICAgICBidWZmZXIuaW5zZXJ0KFsxLCAwXSwgJ1xcbicpO1xuICAgICAgXy5lYWNoKF8uc29ydEJ5KGltcG9ydHMpLCAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGJ1ZmZlci5pbnNlcnQoW2luZGV4ICsgMiwgMF0sIHZhbHVlICsgJ1xcbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChmb2xkSW1wb3J0cykge1xuICAgICAgICB0aGlzLmZvbGRJbXBvcnRzKGVkaXRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmb2xkSW1wb3J0cyhlZGl0b3IpIHtcbiAgICBjb25zdCBmaXJzdFJvdyA9IDA7XG4gICAgbGV0IGxhc3RSb3cgPSAwO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICBidWZmZXIuc2NhbigvaW1wb3J0XFxzLio7L2csIChtKSA9PiB7XG4gICAgICBsYXN0Um93ID0gbS5yYW5nZS5lbmQucm93O1xuICAgIH0pO1xuXG4gICAgaWYgKGxhc3RSb3cpIHtcbiAgICAgIGNvbnN0IHBvcyA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1tmaXJzdFJvdywgMF0sIFtsYXN0Um93LCAwXV0pO1xuICAgICAgZWRpdG9yLmZvbGRTZWxlY3RlZExpbmVzKCk7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zKTtcbiAgICB9XG4gIH1cblxuICBkZXRlcm1pbmVDbGFzc05hbWUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgdGV4dCwgcHJlZml4LCBzdWZmaXgsXG4gICAgICBwcmV2UmV0dXJuVHlwZSkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgY2xhc3NOYW1lcyA9IG51bGw7XG4gICAgICBsZXQgaXNJbnN0YW5jZSA9IC9cXCkkLy50ZXN0KHByZWZpeCk7XG5cbiAgICAgIGxldCBjbGFzc1NpbXBsZU5hbWUgPSBudWxsO1xuXG4gICAgICAvLyBEZXRlcm1pbmUgY2xhc3MgbmFtZVxuICAgICAgaWYgKCFwcmVmaXggfHwgcHJlZml4ID09PSAndGhpcycpIHtcbiAgICAgICAgLy8gVXNlIHRoaXMgYXMgY2xhc3MgbmFtZVxuICAgICAgICBjbGFzc1NpbXBsZU5hbWUgPSB0aGlzLmdldEN1cnJlbnRDbGFzc1NpbXBsZU5hbWUoZWRpdG9yKTtcbiAgICAgICAgaXNJbnN0YW5jZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHByZWZpeCkge1xuICAgICAgICAvLyBHZXQgY2xhc3MgbmFtZSBmcm9tIHByZWZpeFxuICAgICAgICAvLyBBbHNvIHN1cHBvcnQgJygoQ2xhc3NOYW1lKXZhciknIHN5bnRheCAoYSBxdWljayBoYWNrKVxuICAgICAgICBjbGFzc1NpbXBsZU5hbWUgPSB0aGlzLmdldFdvcmQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgICAuaW5kZXhPZignKCgnKSAhPT0gLTEgPyBwcmVmaXgubWF0Y2goL1teXFwpXSovKVswXSA6IHByZWZpeDtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9pc1ZhbGlkQ2xhc3NOYW1lKGNsYXNzU2ltcGxlTmFtZSkgJiZcbiAgICAgICAgICAhL1tcXC5cXCldLy50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgLy8gRmluZCBjbGFzcyBuYW1lIGJ5IGEgdmFyaWFibGUgbmFtZSBnaXZlbiBhcyBwcmVmaXhcbiAgICAgICAgLy8gVE9ETyB0cmF2ZXJzZSBicmFja2V0cyBiYWNrd2FyZHMgdG8gbWF0Y2ggY29ycmVjdCBzY29wZSAod2l0aCByZWdleHApXG4gICAgICAgIC8vIFRPRE8gaGFuZGxlICd0aGlzLnZhck5hbWUnIGNvcnJlY3RseVxuICAgICAgICBjbGFzc1NpbXBsZU5hbWUgPSB0aGlzLl9sYXN0TWF0Y2goXG4gICAgICAgICAgZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93IC0gMjUsIDBdLCBidWZmZXJQb3NpdGlvbl0pLFxuICAgICAgICAgIG5ldyBSZWdFeHAoJyhbQS1aXVthLXpBLVowLTlfXSopKDxbQS1aXVthLXpBLVowLTlfPD4sIF0qPik/XFxcXHMnICtcbiAgICAgICAgICAgIHByZWZpeCwgJ2cnKSk7XG4gICAgICAgIGNsYXNzU2ltcGxlTmFtZSA9IGNsYXNzU2ltcGxlTmFtZS5yZXBsYWNlKCcgJyArIHByZWZpeCwgJycpO1xuICAgICAgICBjbGFzc1NpbXBsZU5hbWUgPSBjbGFzc1NpbXBsZU5hbWUucmVwbGFjZSgvXFw8LipcXD4vLCAnJyk7XG5cbiAgICAgICAgaXNJbnN0YW5jZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pc1ZhbGlkQ2xhc3NOYW1lKGNsYXNzU2ltcGxlTmFtZSkpIHtcbiAgICAgICAgLy8gQ29udmVydCBzaW1wbGUgbmFtZSB0byBhIGZ1bGwgY2xhc3MgbmFtZSBhbmQgdXNlIHRoYXRcbiAgICAgICAgY2xhc3NOYW1lcyA9IHRoaXMuZ2V0UG9zc2libGVDbGFzc05hbWVzKGVkaXRvciwgY2xhc3NTaW1wbGVOYW1lLFxuICAgICAgICAgIHByZWZpeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBKdXN0IHVzZSByZXR1cm4gdHlwZSBvZiBwcmV2aW91cyBzbmlwcGV0IChhIHF1aWNrIGhhY2spXG4gICAgICAgIC8vIFRPRE8gZGV0ZXJtaW5lIHR5cGUgdXNpbmcgY2xhc3Nsb2FkZXJcbiAgICAgICAgY2xhc3NOYW1lcyA9IFsgcHJldlJldHVyblR5cGUgXTtcbiAgICAgICAgaXNJbnN0YW5jZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGNsYXNzTmFtZXMsIGlzSW5zdGFuY2UgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICBfaXNWYWxpZENsYXNzTmFtZSh0ZXh0KSB7XG4gICAgcmV0dXJuIC9eW0EtWl1bXlxcLlxcKV0qJC8udGVzdCh0ZXh0KSB8fCAvXFwuW0EtWl1bXlxcLlxcKV0qJC8udGVzdCh0ZXh0KTtcbiAgfVxuXG4gIF9sYXN0TWF0Y2goc3RyLCByZWdleCkge1xuICAgIGNvbnN0IGFycmF5ID0gc3RyLm1hdGNoKHJlZ2V4KSB8fCBbJyddO1xuICAgIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tSmF2YVV0aWwoKTtcbiJdfQ==
//# sourceURL=/home/champ/.atom/packages/autocomplete-java/lib/atomJavaUtil.js
