Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atomJavaUtil = require('./atomJavaUtil');

var _atomJavaUtil2 = _interopRequireDefault(_atomJavaUtil);

var _javaUtil = require('./javaUtil');

var _javaUtil2 = _interopRequireDefault(_javaUtil);

'use babel';

var AtomAutocompleteProvider = (function () {
  function AtomAutocompleteProvider(classLoader) {
    _classCallCheck(this, AtomAutocompleteProvider);

    this.classLoader = classLoader;

    // settings for autocomplete-plus
    this.selector = '.source.java';
    this.disableForSelector = '.source.java .comment';
  }

  _createClass(AtomAutocompleteProvider, [{
    key: 'configure',
    value: function configure(config) {
      // settings for autocomplete-plus
      this.inclusionPriority = config.inclusionPriority;
      this.excludeLowerPriority = config.excludeLowerPriority;
      this.foldImports = config.foldImports;
    }

    // autocomplete-plus
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var origPrefix = _ref.prefix;

      // text: 'package.Class.me', prefix: 'package.Class', suffix: 'me'
      // text: 'package.Cla', prefix: 'package', suffix: 'Cla'
      // text: 'Cla', prefix: '', suffix: 'Cla'
      // line: 'new Cla', text: 'Cla', prevWord: 'new'
      var line = _atomJavaUtil2['default'].getLine(editor, bufferPosition);
      var prevWord = _atomJavaUtil2['default'].getPrevWord(editor, bufferPosition);
      var text = _atomJavaUtil2['default'].getWord(editor, bufferPosition, true);
      var prefix = text.substring(0, text.lastIndexOf('.'));
      var suffix = origPrefix.replace('.', '');
      var couldBeClass = /^[A-Z]/.test(suffix) || prefix;
      var isInstance = false;

      var results = null;
      if (couldBeClass) {
        var classes = this.classLoader.findClass(text);
        if (prevWord === 'new' && classes && classes.length) {
          // Class constructor suggestions
          results = [];
          _lodash._.each(classes, function (classDesc) {
            _lodash._.each(classDesc.constructors, function (constructor) {
              results.push(constructor);
            });
          });
        } else {
          // Class suggestions
          results = classes;
        }
      }

      if (!results || !results.length) {
        // Find member of a class
        // TODO ugly. refactor.
        var stat = _atomJavaUtil2['default'].determineClassName(editor, bufferPosition, text, prefix, suffix, this.prevReturnType);
        isInstance = stat.isInstance;
        _lodash._.every(stat.classNames, function (className) {
          // methods of this class
          results = _this.classLoader.findClassMember(className, suffix) || [];
          // methods of extending classes
          var superClass = _this.classLoader.findSuperClassName(className);
          while (superClass) {
            var r = _this.classLoader.findClassMember(superClass, suffix);
            if (r) {
              var _results;

              (_results = results).push.apply(_results, _toConsumableArray(r));
            }
            superClass = _this.classLoader.findSuperClassName(superClass);
          }
          return !results.length;
        });
      }

      // Autocomplete-plus filters all duplicates. This is a workaround for that.
      var duplicateWorkaround = {};

      // Map results to autocomplete-plus suggestions
      return _lodash._.map(results, function (desc) {
        var snippet = _this._createSnippet(desc, line, prefix, !isInstance && desc.type !== 'constructor');
        if (!duplicateWorkaround[snippet]) {
          duplicateWorkaround[snippet] = 1;
        }
        var counter = duplicateWorkaround[snippet]++;
        return {
          snippet: snippet + (counter > 1 ? ' (' + counter + ')' : ''),
          replacementPrefix: isInstance ? suffix : text,
          leftLabel: desc.member ? _this._getFormattedReturnType(desc.member) : desc.simpleName,
          type: desc.type !== 'constructor' ? desc.type : 'method',
          desc: desc
        };
      });
    }
  }, {
    key: '_getFormattedReturnType',
    value: function _getFormattedReturnType(member) {
      return member.visibility + ' ' + _javaUtil2['default'].getSimpleName(member.returnType);
    }
  }, {
    key: '_createSnippet',
    value: function _createSnippet(desc, line, prefix, addMemberClass) {
      // TODO use full class name in case of a name conflict
      // Use full class name in case of class import or method with long prefix
      var useFullClassName = desc.type === 'class' ? /^import/.test(line) : prefix.indexOf('.') !== -1;
      var text = useFullClassName ? desc.className : desc.simpleName;
      if (desc.member) {
        text = (addMemberClass ? '${1:' + text + '}.' : '') + this._createMemberSnippet(desc.member, desc.type);
      }
      return text;
    }
  }, {
    key: '_createMemberSnippet',
    value: function _createMemberSnippet(member, type) {
      var snippet = null;
      if (!member.params) {
        snippet = type === 'property' ? member.name : member.name + '()';
      } else {
        (function () {
          var index = 2;
          var params = _lodash._.map(member.params, function (param) {
            return '${' + index++ + ':' + _javaUtil2['default'].getSimpleName(param) + '}';
          });
          snippet = _lodash._.reduce(params, function (result, param) {
            return result + param + ', ';
          }, member.name + '(').replace(/, $/, ')');
          snippet = snippet + '${' + index + ':}';
        })();
      }
      return snippet;
    }

    // autocomplete-plus
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion(_ref2) {
      var editor = _ref2.editor;
      var suggestion = _ref2.suggestion;

      if (suggestion.type === 'class') {
        // Add import statement if simple class name was used as a completion text
        if (suggestion.snippet.indexOf('.') === -1) {
          _atomJavaUtil2['default'].importClass(editor, suggestion.desc.className, this.foldImports);
        }
      } else if (suggestion.desc.member) {
        // Save snippet return type for later use (type determination)
        this.prevReturnType = suggestion.desc.member.returnType;
      }
      this.classLoader.touch(suggestion.desc);
    }
  }]);

  return AtomAutocompleteProvider;
})();

exports.AtomAutocompleteProvider = AtomAutocompleteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9BdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUVrQixRQUFROzs0QkFDRCxnQkFBZ0I7Ozs7d0JBQ3BCLFlBQVk7Ozs7QUFKakMsV0FBVyxDQUFDOztJQU1DLHdCQUF3QjtBQUV4QixXQUZBLHdCQUF3QixDQUV2QixXQUFXLEVBQUU7MEJBRmQsd0JBQXdCOztBQUdqQyxRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7O0FBRy9CLFFBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyx1QkFBdUIsQ0FBQztHQUNuRDs7ZUFSVSx3QkFBd0I7O1dBVTFCLG1CQUFDLE1BQU0sRUFBRTs7QUFFaEIsVUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztBQUNsRCxVQUFJLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0FBQ3hELFVBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUN2Qzs7Ozs7V0FHYSx3QkFBQyxJQUE0QyxFQUFFOzs7VUFBN0MsTUFBTSxHQUFQLElBQTRDLENBQTNDLE1BQU07VUFBRSxjQUFjLEdBQXZCLElBQTRDLENBQW5DLGNBQWM7VUFBVSxVQUFVLEdBQTNDLElBQTRDLENBQW5CLE1BQU07Ozs7OztBQUs1QyxVQUFNLElBQUksR0FBRywwQkFBYSxPQUFPLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzFELFVBQU0sUUFBUSxHQUFHLDBCQUFhLFdBQVcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbEUsVUFBTSxJQUFJLEdBQUcsMEJBQWEsT0FBTyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEUsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLFVBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDO0FBQ3JELFVBQUksVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFVBQUksWUFBWSxFQUFFO0FBQ2hCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pELFlBQUksUUFBUSxLQUFLLEtBQUssSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTs7QUFFbkQsaUJBQU8sR0FBRyxFQUFFLENBQUM7QUFDYixvQkFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUEsU0FBUyxFQUFJO0FBQzNCLHNCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQUEsV0FBVyxFQUFJO0FBQzVDLHFCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzNCLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLE1BQU07O0FBRUwsaUJBQU8sR0FBRyxPQUFPLENBQUM7U0FDbkI7T0FDRjs7QUFFRCxVQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRzs7O0FBR2pDLFlBQU0sSUFBSSxHQUFHLDBCQUFhLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQ2pFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM3QyxrQkFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDN0Isa0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxTQUFTLEVBQUk7O0FBRXBDLGlCQUFPLEdBQUcsTUFBSyxXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXBFLGNBQUksVUFBVSxHQUFHLE1BQUssV0FBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLGlCQUFPLFVBQVUsRUFBRTtBQUNqQixnQkFBTSxDQUFDLEdBQUcsTUFBSyxXQUFXLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvRCxnQkFBSSxDQUFDLEVBQUU7OztBQUNMLDBCQUFBLE9BQU8sRUFBQyxJQUFJLE1BQUEsOEJBQUksQ0FBQyxFQUFDLENBQUM7YUFDcEI7QUFDRCxzQkFBVSxHQUFHLE1BQUssV0FBVyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1dBQzlEO0FBQ0QsaUJBQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQ3hCLENBQUMsQ0FBQztPQUNKOzs7QUFHRCxVQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQzs7O0FBRy9CLGFBQU8sVUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzlCLFlBQU0sT0FBTyxHQUFHLE1BQUssY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUNwRCxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDO0FBQzlDLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNqQyw2QkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7QUFDRCxZQUFNLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQy9DLGVBQU87QUFDTCxpQkFBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFDO0FBQzVELDJCQUFpQixFQUFFLFVBQVUsR0FBRyxNQUFNLEdBQUcsSUFBSTtBQUM3QyxtQkFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQ3BCLE1BQUssdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVO0FBQzdELGNBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVE7QUFDeEQsY0FBSSxFQUFFLElBQUk7U0FDWCxDQUFDO09BQ0gsQ0FBQyxDQUFDO0tBQ0o7OztXQUVzQixpQ0FBQyxNQUFNLEVBQUU7QUFDOUIsYUFBTyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxzQkFBUyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzVFOzs7V0FFYSx3QkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7OztBQUdqRCxVQUFNLGdCQUFnQixHQUNwQixJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUUsVUFBSSxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQy9ELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksR0FBRyxDQUFDLGNBQWMsR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUEsR0FDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3JEO0FBQ0QsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRW1CLDhCQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDakMsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGVBQU8sR0FBRyxBQUFDLElBQUksS0FBSyxVQUFVLEdBQzFCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDdEMsTUFBTTs7QUFDTCxjQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxjQUFNLE1BQU0sR0FBRyxVQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzdDLG1CQUFPLElBQUksR0FBSSxLQUFLLEVBQUUsQUFBQyxHQUFHLEdBQUcsR0FBRyxzQkFBUyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO1dBQ3JFLENBQUMsQ0FBQztBQUNILGlCQUFPLEdBQUcsVUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBSztBQUM1QyxtQkFBTyxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztXQUM5QixFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxQyxpQkFBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQzs7T0FDekM7QUFDRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7Ozs7V0FHb0IsK0JBQUMsS0FBb0IsRUFBRTtVQUFyQixNQUFNLEdBQVAsS0FBb0IsQ0FBbkIsTUFBTTtVQUFFLFVBQVUsR0FBbkIsS0FBb0IsQ0FBWCxVQUFVOztBQUN2QyxVQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFOztBQUUvQixZQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzFDLG9DQUFhLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQ3hELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNyQjtPQUNGLE1BQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFakMsWUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7T0FDekQ7QUFDRCxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekM7OztTQTVJVSx3QkFBd0IiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmEvbGliL0F0b21BdXRvY29tcGxldGVQcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBfIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBhdG9tSmF2YVV0aWwgZnJvbSAnLi9hdG9tSmF2YVV0aWwnO1xuaW1wb3J0IGphdmFVdGlsIGZyb20gJy4vamF2YVV0aWwnO1xuXG5leHBvcnQgY2xhc3MgQXRvbUF1dG9jb21wbGV0ZVByb3ZpZGVyIHtcblxuICBjb25zdHJ1Y3RvcihjbGFzc0xvYWRlcikge1xuICAgIHRoaXMuY2xhc3NMb2FkZXIgPSBjbGFzc0xvYWRlcjtcblxuICAgIC8vIHNldHRpbmdzIGZvciBhdXRvY29tcGxldGUtcGx1c1xuICAgIHRoaXMuc2VsZWN0b3IgPSAnLnNvdXJjZS5qYXZhJztcbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLmphdmEgLmNvbW1lbnQnO1xuICB9XG5cbiAgY29uZmlndXJlKGNvbmZpZykge1xuICAgIC8vIHNldHRpbmdzIGZvciBhdXRvY29tcGxldGUtcGx1c1xuICAgIHRoaXMuaW5jbHVzaW9uUHJpb3JpdHkgPSBjb25maWcuaW5jbHVzaW9uUHJpb3JpdHk7XG4gICAgdGhpcy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IGNvbmZpZy5leGNsdWRlTG93ZXJQcmlvcml0eTtcbiAgICB0aGlzLmZvbGRJbXBvcnRzID0gY29uZmlnLmZvbGRJbXBvcnRzO1xuICB9XG5cbiAgLy8gYXV0b2NvbXBsZXRlLXBsdXNcbiAgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeDogb3JpZ1ByZWZpeH0pIHtcbiAgICAvLyB0ZXh0OiAncGFja2FnZS5DbGFzcy5tZScsIHByZWZpeDogJ3BhY2thZ2UuQ2xhc3MnLCBzdWZmaXg6ICdtZSdcbiAgICAvLyB0ZXh0OiAncGFja2FnZS5DbGEnLCBwcmVmaXg6ICdwYWNrYWdlJywgc3VmZml4OiAnQ2xhJ1xuICAgIC8vIHRleHQ6ICdDbGEnLCBwcmVmaXg6ICcnLCBzdWZmaXg6ICdDbGEnXG4gICAgLy8gbGluZTogJ25ldyBDbGEnLCB0ZXh0OiAnQ2xhJywgcHJldldvcmQ6ICduZXcnXG4gICAgY29uc3QgbGluZSA9IGF0b21KYXZhVXRpbC5nZXRMaW5lKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIGNvbnN0IHByZXZXb3JkID0gYXRvbUphdmFVdGlsLmdldFByZXZXb3JkKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIGNvbnN0IHRleHQgPSBhdG9tSmF2YVV0aWwuZ2V0V29yZChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCB0cnVlKTtcbiAgICBjb25zdCBwcmVmaXggPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHN1ZmZpeCA9IG9yaWdQcmVmaXgucmVwbGFjZSgnLicsICcnKTtcbiAgICBjb25zdCBjb3VsZEJlQ2xhc3MgPSAvXltBLVpdLy50ZXN0KHN1ZmZpeCkgfHwgcHJlZml4O1xuICAgIGxldCBpc0luc3RhbmNlID0gZmFsc2U7XG5cbiAgICBsZXQgcmVzdWx0cyA9IG51bGw7XG4gICAgaWYgKGNvdWxkQmVDbGFzcykge1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuY2xhc3NMb2FkZXIuZmluZENsYXNzKHRleHQpO1xuICAgICAgaWYgKHByZXZXb3JkID09PSAnbmV3JyAmJiBjbGFzc2VzICYmIGNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIENsYXNzIGNvbnN0cnVjdG9yIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIGNsYXNzRGVzYyA9PiB7XG4gICAgICAgICAgXy5lYWNoKGNsYXNzRGVzYy5jb25zdHJ1Y3RvcnMsIGNvbnN0cnVjdG9yID0+IHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2xhc3Mgc3VnZ2VzdGlvbnNcbiAgICAgICAgcmVzdWx0cyA9IGNsYXNzZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCghcmVzdWx0cyB8fCAhcmVzdWx0cy5sZW5ndGgpKSB7XG4gICAgICAvLyBGaW5kIG1lbWJlciBvZiBhIGNsYXNzXG4gICAgICAvLyBUT0RPIHVnbHkuIHJlZmFjdG9yLlxuICAgICAgY29uc3Qgc3RhdCA9IGF0b21KYXZhVXRpbC5kZXRlcm1pbmVDbGFzc05hbWUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbixcbiAgICAgICAgdGV4dCwgcHJlZml4LCBzdWZmaXgsIHRoaXMucHJldlJldHVyblR5cGUpO1xuICAgICAgaXNJbnN0YW5jZSA9IHN0YXQuaXNJbnN0YW5jZTtcbiAgICAgIF8uZXZlcnkoc3RhdC5jbGFzc05hbWVzLCBjbGFzc05hbWUgPT4ge1xuICAgICAgICAvLyBtZXRob2RzIG9mIHRoaXMgY2xhc3NcbiAgICAgICAgcmVzdWx0cyA9IHRoaXMuY2xhc3NMb2FkZXIuZmluZENsYXNzTWVtYmVyKGNsYXNzTmFtZSwgc3VmZml4KSB8fCBbXTtcbiAgICAgICAgLy8gbWV0aG9kcyBvZiBleHRlbmRpbmcgY2xhc3Nlc1xuICAgICAgICBsZXQgc3VwZXJDbGFzcyA9IHRoaXMuY2xhc3NMb2FkZXIuZmluZFN1cGVyQ2xhc3NOYW1lKGNsYXNzTmFtZSk7XG4gICAgICAgIHdoaWxlIChzdXBlckNsYXNzKSB7XG4gICAgICAgICAgY29uc3QgciA9IHRoaXMuY2xhc3NMb2FkZXIuZmluZENsYXNzTWVtYmVyKHN1cGVyQ2xhc3MsIHN1ZmZpeCk7XG4gICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCguLi5yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VwZXJDbGFzcyA9IHRoaXMuY2xhc3NMb2FkZXIuZmluZFN1cGVyQ2xhc3NOYW1lKHN1cGVyQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhcmVzdWx0cy5sZW5ndGg7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBdXRvY29tcGxldGUtcGx1cyBmaWx0ZXJzIGFsbCBkdXBsaWNhdGVzLiBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgdGhhdC5cbiAgICBjb25zdCBkdXBsaWNhdGVXb3JrYXJvdW5kID0ge307XG5cbiAgICAvLyBNYXAgcmVzdWx0cyB0byBhdXRvY29tcGxldGUtcGx1cyBzdWdnZXN0aW9uc1xuICAgIHJldHVybiBfLm1hcChyZXN1bHRzLCAoZGVzYykgPT4ge1xuICAgICAgY29uc3Qgc25pcHBldCA9IHRoaXMuX2NyZWF0ZVNuaXBwZXQoZGVzYywgbGluZSwgcHJlZml4LFxuICAgICAgICAhaXNJbnN0YW5jZSAmJiBkZXNjLnR5cGUgIT09ICdjb25zdHJ1Y3RvcicpO1xuICAgICAgaWYgKCFkdXBsaWNhdGVXb3JrYXJvdW5kW3NuaXBwZXRdKSB7XG4gICAgICAgIGR1cGxpY2F0ZVdvcmthcm91bmRbc25pcHBldF0gPSAxO1xuICAgICAgfVxuICAgICAgY29uc3QgY291bnRlciA9IGR1cGxpY2F0ZVdvcmthcm91bmRbc25pcHBldF0rKztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNuaXBwZXQ6IHNuaXBwZXQgKyAoY291bnRlciA+IDEgPyAnICgnICsgY291bnRlciArICcpJyA6ICcnKSxcbiAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IGlzSW5zdGFuY2UgPyBzdWZmaXggOiB0ZXh0LFxuICAgICAgICBsZWZ0TGFiZWw6IGRlc2MubWVtYmVyID9cbiAgICAgICAgICB0aGlzLl9nZXRGb3JtYXR0ZWRSZXR1cm5UeXBlKGRlc2MubWVtYmVyKSA6IGRlc2Muc2ltcGxlTmFtZSxcbiAgICAgICAgdHlwZTogZGVzYy50eXBlICE9PSAnY29uc3RydWN0b3InID8gZGVzYy50eXBlIDogJ21ldGhvZCcsXG4gICAgICAgIGRlc2M6IGRlc2MsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZvcm1hdHRlZFJldHVyblR5cGUobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlci52aXNpYmlsaXR5ICsgJyAnICsgamF2YVV0aWwuZ2V0U2ltcGxlTmFtZShtZW1iZXIucmV0dXJuVHlwZSk7XG4gIH1cblxuICBfY3JlYXRlU25pcHBldChkZXNjLCBsaW5lLCBwcmVmaXgsIGFkZE1lbWJlckNsYXNzKSB7XG4gICAgLy8gVE9ETyB1c2UgZnVsbCBjbGFzcyBuYW1lIGluIGNhc2Ugb2YgYSBuYW1lIGNvbmZsaWN0XG4gICAgLy8gVXNlIGZ1bGwgY2xhc3MgbmFtZSBpbiBjYXNlIG9mIGNsYXNzIGltcG9ydCBvciBtZXRob2Qgd2l0aCBsb25nIHByZWZpeFxuICAgIGNvbnN0IHVzZUZ1bGxDbGFzc05hbWUgPVxuICAgICAgZGVzYy50eXBlID09PSAnY2xhc3MnID8gL15pbXBvcnQvLnRlc3QobGluZSkgOiBwcmVmaXguaW5kZXhPZignLicpICE9PSAtMTtcbiAgICBsZXQgdGV4dCA9IHVzZUZ1bGxDbGFzc05hbWUgPyBkZXNjLmNsYXNzTmFtZSA6IGRlc2Muc2ltcGxlTmFtZTtcbiAgICBpZiAoZGVzYy5tZW1iZXIpIHtcbiAgICAgIHRleHQgPSAoYWRkTWVtYmVyQ2xhc3MgPyAnJHsxOicgKyB0ZXh0ICsgJ30uJyA6ICcnKSArXG4gICAgICAgIHRoaXMuX2NyZWF0ZU1lbWJlclNuaXBwZXQoZGVzYy5tZW1iZXIsIGRlc2MudHlwZSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgX2NyZWF0ZU1lbWJlclNuaXBwZXQobWVtYmVyLCB0eXBlKSB7XG4gICAgbGV0IHNuaXBwZXQgPSBudWxsO1xuICAgIGlmICghbWVtYmVyLnBhcmFtcykge1xuICAgICAgc25pcHBldCA9ICh0eXBlID09PSAncHJvcGVydHknKVxuICAgICAgICA/IG1lbWJlci5uYW1lIDogbWVtYmVyLm5hbWUgKyAnKCknO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaW5kZXggPSAyO1xuICAgICAgY29uc3QgcGFyYW1zID0gXy5tYXAobWVtYmVyLnBhcmFtcywgKHBhcmFtKSA9PiB7XG4gICAgICAgIHJldHVybiAnJHsnICsgKGluZGV4KyspICsgJzonICsgamF2YVV0aWwuZ2V0U2ltcGxlTmFtZShwYXJhbSkgKyAnfSc7XG4gICAgICB9KTtcbiAgICAgIHNuaXBwZXQgPSBfLnJlZHVjZShwYXJhbXMsIChyZXN1bHQsIHBhcmFtKSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQgKyBwYXJhbSArICcsICc7XG4gICAgICB9LCBtZW1iZXIubmFtZSArICcoJykucmVwbGFjZSgvLCAkLywgJyknKTtcbiAgICAgIHNuaXBwZXQgPSBzbmlwcGV0ICsgJyR7JyArIGluZGV4ICsgJzp9JztcbiAgICB9XG4gICAgcmV0dXJuIHNuaXBwZXQ7XG4gIH1cblxuICAvLyBhdXRvY29tcGxldGUtcGx1c1xuICBvbkRpZEluc2VydFN1Z2dlc3Rpb24oe2VkaXRvciwgc3VnZ2VzdGlvbn0pIHtcbiAgICBpZiAoc3VnZ2VzdGlvbi50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAvLyBBZGQgaW1wb3J0IHN0YXRlbWVudCBpZiBzaW1wbGUgY2xhc3MgbmFtZSB3YXMgdXNlZCBhcyBhIGNvbXBsZXRpb24gdGV4dFxuICAgICAgaWYgKHN1Z2dlc3Rpb24uc25pcHBldC5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgIGF0b21KYXZhVXRpbC5pbXBvcnRDbGFzcyhlZGl0b3IsIHN1Z2dlc3Rpb24uZGVzYy5jbGFzc05hbWUsXG4gICAgICAgICAgdGhpcy5mb2xkSW1wb3J0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdWdnZXN0aW9uLmRlc2MubWVtYmVyKSB7XG4gICAgICAvLyBTYXZlIHNuaXBwZXQgcmV0dXJuIHR5cGUgZm9yIGxhdGVyIHVzZSAodHlwZSBkZXRlcm1pbmF0aW9uKVxuICAgICAgdGhpcy5wcmV2UmV0dXJuVHlwZSA9IHN1Z2dlc3Rpb24uZGVzYy5tZW1iZXIucmV0dXJuVHlwZTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xvYWRlci50b3VjaChzdWdnZXN0aW9uLmRlc2MpO1xuICB9XG5cbn1cbiJdfQ==
//# sourceURL=/home/champ/.atom/packages/autocomplete-java/lib/AtomAutocompleteProvider.js
