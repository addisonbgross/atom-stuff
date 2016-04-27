Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getSuggestions = getSuggestions;
exports.onDidInsertSuggestion = onDidInsertSuggestion;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fuzzaldrin = require('fuzzaldrin');

var _functional = require('./functional');

var _cmakeContext = require('./cmake-context');

var _cmakeContext2 = _interopRequireDefault(_cmakeContext);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _variables = require('./variables');

var _variables2 = _interopRequireDefault(_variables);

'use babel';

function constants_suggestions(prefix, list) {
    return (0, _fuzzaldrin.filter)(list, prefix).map(function (constant) {
        return {
            text: constant,
            displayText: constant,
            type: 'constant'
        };
    });
}

function commands_suggestions(prefix) {
    return (0, _fuzzaldrin.filter)(_commands2['default'], prefix.toLowerCase()).map(function (command) {
        return {
            text: command + '()',
            displayText: command,
            type: 'function'
        };
    });
}

function variables_suggestions(prefix) {
    return (0, _fuzzaldrin.filter)(_variables2['default'], prefix.toUpperCase()).map(function (variable) {
        return {
            text: variable,
            displayText: variable,
            type: 'variable'
        };
    });
}

var suggest = (0, _functional.dispatch)(function (context, prefix) {
    if (context === 'find_file' || context === 'find_path') {
        return constants_suggestions(prefix, constants.FindPath);
    }
}, function (context, prefix) {
    if (context === 'find_library') {
        return [].concat(_toConsumableArray(constants_suggestions(prefix, constants.FindProgram)), _toConsumableArray(constants_suggestions(prefix, ['NAMES_PER_DIR'])));
    }
}, function (context, prefix) {
    if (context === 'find_package') {
        return constants_suggestions(prefix, constants.FindModules);
    }
}, function (context, prefix) {
    if (context === 'find_program') {
        return constants_suggestions(prefix, constants.FindProgram);
    }
}, function (context, prefix) {
    if (context === 'include') {
        return constants_suggestions(prefix, constants.Modules);
    }
}, function (context, prefix) {
    if (context.length > 0) {
        return [].concat(_toConsumableArray(constants_suggestions(prefix, constants.Booleans)), _toConsumableArray(variables_suggestions(prefix)));
    }
}, function (context, prefix) {
    return commands_suggestions(prefix);
});

var selector = '.source.cmake';
exports.selector = selector;
var disableForSelector = '.source.cmake .comment';
exports.disableForSelector = disableForSelector;
var inclusionPriority = 1;

exports.inclusionPriority = inclusionPriority;

function getSuggestions(_ref) {
    var editor = _ref.editor;
    var prefix = _ref.prefix;
    var scope_descriptor = _ref.scopeDescriptor;

    return suggest((0, _cmakeContext2['default'])(editor, scope_descriptor), prefix);
}

function onDidInsertSuggestion(_ref2) {
    var editor = _ref2.editor;
    var suggestion = _ref2.suggestion;

    if (suggestion && suggestion.type === 'function') {
        editor.moveLeft(1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbWFrZS9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzBCQUVxQixZQUFZOzswQkFDVixjQUFjOzs0QkFDWCxpQkFBaUI7Ozs7d0JBQ3RCLFlBQVk7Ozs7eUJBQ04sYUFBYTs7SUFBNUIsU0FBUzs7eUJBQ0MsYUFBYTs7OztBQVBuQyxXQUFXLENBQUM7O0FBU1osU0FBUyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3pDLFdBQU8sd0JBQU8sSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFFBQVE7ZUFBTTtBQUMzQyxnQkFBSSxFQUFFLFFBQVE7QUFDZCx1QkFBVyxFQUFFLFFBQVE7QUFDckIsZ0JBQUksRUFBRSxVQUFVO1NBQ25CO0tBQUMsQ0FBQyxDQUFDO0NBQ1A7O0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7QUFDbEMsV0FBTywrQ0FBaUIsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztlQUFNO0FBQzVELGdCQUFJLEVBQUssT0FBTyxPQUFJO0FBQ3BCLHVCQUFXLEVBQUUsT0FBTztBQUNwQixnQkFBSSxFQUFFLFVBQVU7U0FDbkI7S0FBQyxDQUFDLENBQUM7Q0FDUDs7QUFFRCxTQUFTLHFCQUFxQixDQUFDLE1BQU0sRUFBRTtBQUNuQyxXQUFPLGdEQUFrQixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxRQUFRO2VBQU07QUFDOUQsZ0JBQUksRUFBRSxRQUFRO0FBQ2QsdUJBQVcsRUFBRSxRQUFRO0FBQ3JCLGdCQUFJLEVBQUUsVUFBVTtTQUNuQjtLQUFDLENBQUMsQ0FBQztDQUNQOztBQUVELElBQU0sT0FBTyxHQUFHLDBCQUNaLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNqQixRQUFJLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUNwRCxlQUFPLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUQ7Q0FDSixFQUNELFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNqQixRQUFJLE9BQU8sS0FBSyxjQUFjLEVBQUU7QUFDNUIsNENBQ08scUJBQXFCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsc0JBQ3BELHFCQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQ3JEO0tBQ0w7Q0FDSixFQUNELFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNqQixRQUFJLE9BQU8sS0FBSyxjQUFjLEVBQUU7QUFDNUIsZUFBTyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQy9EO0NBQ0osRUFDRCxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDakIsUUFBSSxPQUFPLEtBQUssY0FBYyxFQUFFO0FBQzVCLGVBQU8scUJBQXFCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMvRDtDQUNKLEVBQ0QsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ2pCLFFBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN2QixlQUFPLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDM0Q7Q0FDSixFQUNELFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNqQixRQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLDRDQUNPLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLHNCQUNqRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FDbEM7S0FDTDtDQUNKLEVBQ0QsVUFBQyxPQUFPLEVBQUUsTUFBTTtXQUFLLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztDQUFBLENBQ3BELENBQUE7O0FBRU0sSUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDOztBQUNqQyxJQUFNLGtCQUFrQixHQUFHLHdCQUF3QixDQUFDOztBQUNwRCxJQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQzs7OztBQUU1QixTQUFTLGNBQWMsQ0FBQyxJQUFtRCxFQUFFO1FBQXBELE1BQU0sR0FBUCxJQUFtRCxDQUFsRCxNQUFNO1FBQUUsTUFBTSxHQUFmLElBQW1ELENBQTFDLE1BQU07UUFBbUIsZ0JBQWdCLEdBQWxELElBQW1ELENBQWxDLGVBQWU7O0FBQzNELFdBQU8sT0FBTyxDQUFDLCtCQUFjLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ25FOztBQUVNLFNBQVMscUJBQXFCLENBQUMsS0FBb0IsRUFBRTtRQUFyQixNQUFNLEdBQVAsS0FBb0IsQ0FBbkIsTUFBTTtRQUFFLFVBQVUsR0FBbkIsS0FBb0IsQ0FBWCxVQUFVOztBQUNyRCxRQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtBQUM5QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCO0NBQ0oiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNtYWtlL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAnZnV6emFsZHJpbic7XG5pbXBvcnQge2Rpc3BhdGNofSBmcm9tICcuL2Z1bmN0aW9uYWwnO1xuaW1wb3J0IGNtYWtlX2NvbnRleHQgZnJvbSAnLi9jbWFrZS1jb250ZXh0JztcbmltcG9ydCBjb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJztcbmltcG9ydCAqIGFzIGNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgdmFyaWFibGVzIGZyb20gJy4vdmFyaWFibGVzJztcblxuZnVuY3Rpb24gY29uc3RhbnRzX3N1Z2dlc3Rpb25zKHByZWZpeCwgbGlzdCkge1xuICAgIHJldHVybiBmaWx0ZXIobGlzdCwgcHJlZml4KS5tYXAoKGNvbnN0YW50KSA9PiAoe1xuICAgICAgICB0ZXh0OiBjb25zdGFudCxcbiAgICAgICAgZGlzcGxheVRleHQ6IGNvbnN0YW50LFxuICAgICAgICB0eXBlOiAnY29uc3RhbnQnXG4gICAgfSkpO1xufVxuXG5mdW5jdGlvbiBjb21tYW5kc19zdWdnZXN0aW9ucyhwcmVmaXgpIHtcbiAgICByZXR1cm4gZmlsdGVyKGNvbW1hbmRzLCBwcmVmaXgudG9Mb3dlckNhc2UoKSkubWFwKChjb21tYW5kKSA9PiAoe1xuICAgICAgICB0ZXh0OiBgJHtjb21tYW5kfSgpYCxcbiAgICAgICAgZGlzcGxheVRleHQ6IGNvbW1hbmQsXG4gICAgICAgIHR5cGU6ICdmdW5jdGlvbidcbiAgICB9KSk7XG59XG5cbmZ1bmN0aW9uIHZhcmlhYmxlc19zdWdnZXN0aW9ucyhwcmVmaXgpIHtcbiAgICByZXR1cm4gZmlsdGVyKHZhcmlhYmxlcywgcHJlZml4LnRvVXBwZXJDYXNlKCkpLm1hcCgodmFyaWFibGUpID0+ICh7XG4gICAgICAgIHRleHQ6IHZhcmlhYmxlLFxuICAgICAgICBkaXNwbGF5VGV4dDogdmFyaWFibGUsXG4gICAgICAgIHR5cGU6ICd2YXJpYWJsZSdcbiAgICB9KSk7XG59XG5cbmNvbnN0IHN1Z2dlc3QgPSBkaXNwYXRjaChcbiAgICAoY29udGV4dCwgcHJlZml4KSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0ID09PSAnZmluZF9maWxlJyB8fCBjb250ZXh0ID09PSAnZmluZF9wYXRoJykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0YW50c19zdWdnZXN0aW9ucyhwcmVmaXgsIGNvbnN0YW50cy5GaW5kUGF0aCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIChjb250ZXh0LCBwcmVmaXgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09ICdmaW5kX2xpYnJhcnknKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIC4uLmNvbnN0YW50c19zdWdnZXN0aW9ucyhwcmVmaXgsIGNvbnN0YW50cy5GaW5kUHJvZ3JhbSksXG4gICAgICAgICAgICAgICAgLi4uY29uc3RhbnRzX3N1Z2dlc3Rpb25zKHByZWZpeCwgWydOQU1FU19QRVJfRElSJ10pXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAoY29udGV4dCwgcHJlZml4KSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0ID09PSAnZmluZF9wYWNrYWdlJykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0YW50c19zdWdnZXN0aW9ucyhwcmVmaXgsIGNvbnN0YW50cy5GaW5kTW9kdWxlcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIChjb250ZXh0LCBwcmVmaXgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09ICdmaW5kX3Byb2dyYW0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RhbnRzX3N1Z2dlc3Rpb25zKHByZWZpeCwgY29uc3RhbnRzLkZpbmRQcm9ncmFtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgKGNvbnRleHQsIHByZWZpeCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dCA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RhbnRzX3N1Z2dlc3Rpb25zKHByZWZpeCwgY29uc3RhbnRzLk1vZHVsZXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAoY29udGV4dCwgcHJlZml4KSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgLi4uY29uc3RhbnRzX3N1Z2dlc3Rpb25zKHByZWZpeCwgY29uc3RhbnRzLkJvb2xlYW5zKSxcbiAgICAgICAgICAgICAgICAuLi52YXJpYWJsZXNfc3VnZ2VzdGlvbnMocHJlZml4KVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgKGNvbnRleHQsIHByZWZpeCkgPT4gY29tbWFuZHNfc3VnZ2VzdGlvbnMocHJlZml4KVxuKVxuXG5leHBvcnQgY29uc3Qgc2VsZWN0b3IgPSAnLnNvdXJjZS5jbWFrZSc7XG5leHBvcnQgY29uc3QgZGlzYWJsZUZvclNlbGVjdG9yID0gJy5zb3VyY2UuY21ha2UgLmNvbW1lbnQnO1xuZXhwb3J0IGNvbnN0IGluY2x1c2lvblByaW9yaXR5ID0gMTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN1Z2dlc3Rpb25zKHtlZGl0b3IsIHByZWZpeCwgc2NvcGVEZXNjcmlwdG9yOiBzY29wZV9kZXNjcmlwdG9yfSkge1xuICAgIHJldHVybiBzdWdnZXN0KGNtYWtlX2NvbnRleHQoZWRpdG9yLCBzY29wZV9kZXNjcmlwdG9yKSwgcHJlZml4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRGlkSW5zZXJ0U3VnZ2VzdGlvbih7ZWRpdG9yLCBzdWdnZXN0aW9ufSkge1xuICAgIGlmIChzdWdnZXN0aW9uICYmIHN1Z2dlc3Rpb24udHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlZGl0b3IubW92ZUxlZnQoMSk7XG4gICAgfVxufVxuIl19
//# sourceURL=/home/champ/.atom/packages/autocomplete-cmake/lib/provider.js
