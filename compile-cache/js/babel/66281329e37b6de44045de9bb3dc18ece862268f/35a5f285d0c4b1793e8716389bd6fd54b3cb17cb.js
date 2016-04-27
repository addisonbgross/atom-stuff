Object.defineProperty(exports, '__esModule', {
    value: true
});

var _atom = require('atom');

'use babel';

function skip(i, predicate) {
    while (i >= 0 && predicate(i)) {
        i--;
    }
    return i;
}

exports['default'] = function (editor, scope_descriptor) {
    if (scope_descriptor.scopes.length > 1) {
        var _ret = (function () {
            var range = new _atom.Range([0, 0], editor.getCursorBufferPosition());
            var text = editor.getTextInRange(range);
            var last = skip(skip(text.length - 1, function (index) {
                return text.charAt(index) !== '(';
            }) - 1, function (index) {
                return (/\s/.test(text.charAt(index))
                );
            }) + 1;
            var first = skip(last - 1, function (index) {
                return !/\s/.test(text.charAt(index));
            });
            return {
                v: text.substring(first, last).trim()
            };
        })();

        if (typeof _ret === 'object') return _ret.v;
    }
    return '';
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbWFrZS9saWIvY21ha2UtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVvQixNQUFNOztBQUYxQixXQUFXLENBQUM7O0FBSVosU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUN4QixXQUFPLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNCLFNBQUMsRUFBRSxDQUFDO0tBQ1A7QUFDRCxXQUFPLENBQUMsQ0FBQztDQUNaOztxQkFFYyxVQUFTLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRTtBQUM5QyxRQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUNwQyxnQkFBTSxLQUFLLEdBQUcsZ0JBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztBQUNsRSxnQkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxnQkFBTSxJQUFJLEdBQUcsSUFBSSxDQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxVQUFBLEtBQUs7dUJBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHO2FBQUEsQ0FBQyxHQUFHLENBQUMsRUFDOUQsVUFBQSxLQUFLO3VCQUFJLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7YUFBQSxDQUN6QyxHQUFHLENBQUMsQ0FBQztBQUNOLGdCQUFNLEtBQUssR0FBRyxJQUFJLENBQ2QsSUFBSSxHQUFHLENBQUMsRUFDUixVQUFBLEtBQUs7dUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFBQSxDQUMxQyxDQUFDO0FBQ0Y7bUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFO2NBQUM7Ozs7S0FDN0M7QUFDRCxXQUFPLEVBQUUsQ0FBQztDQUNiIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbWFrZS9saWIvY21ha2UtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcblxuZnVuY3Rpb24gc2tpcChpLCBwcmVkaWNhdGUpIHtcbiAgICB3aGlsZSAoaSA+PSAwICYmIHByZWRpY2F0ZShpKSkge1xuICAgICAgICBpLS07XG4gICAgfVxuICAgIHJldHVybiBpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlZGl0b3IsIHNjb3BlX2Rlc2NyaXB0b3IpIHtcbiAgICBpZiAoc2NvcGVfZGVzY3JpcHRvci5zY29wZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCByYW5nZSA9IG5ldyBSYW5nZShbMCwgMF0sIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShyYW5nZSk7XG4gICAgICAgIGNvbnN0IGxhc3QgPSBza2lwKFxuICAgICAgICAgICAgc2tpcCh0ZXh0Lmxlbmd0aCAtIDEsIGluZGV4ID0+IHRleHQuY2hhckF0KGluZGV4KSAhPT0gJygnKSAtIDEsXG4gICAgICAgICAgICBpbmRleCA9PiAvXFxzLy50ZXN0KHRleHQuY2hhckF0KGluZGV4KSlcbiAgICAgICAgKSArIDE7XG4gICAgICAgIGNvbnN0IGZpcnN0ID0gc2tpcChcbiAgICAgICAgICAgIGxhc3QgLSAxLFxuICAgICAgICAgICAgaW5kZXggPT4gIS9cXHMvLnRlc3QodGV4dC5jaGFyQXQoaW5kZXgpKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcoZmlyc3QsIGxhc3QpLnRyaW0oKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuIl19
//# sourceURL=/home/champ/.atom/packages/autocomplete-cmake/lib/cmake-context.js
