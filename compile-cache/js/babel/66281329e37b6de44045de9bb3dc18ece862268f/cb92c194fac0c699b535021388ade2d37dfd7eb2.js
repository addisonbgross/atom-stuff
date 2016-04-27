'use babel';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.existy = existy;
exports.dispatch = dispatch;

function existy(value) {
    return value != null;
}

function dispatch() {
    var funs = arguments;
    return function () {
        for (var f of funs) {
            var ret = f.apply(null, arguments);
            if (existy(ret)) {
                return ret;
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbWFrZS9saWIvZnVuY3Rpb25hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7O0FBRUwsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQzFCLFdBQU8sS0FBSyxJQUFJLElBQUksQ0FBQztDQUN4Qjs7QUFFTSxTQUFTLFFBQVEsR0FBRztBQUN2QixRQUFJLElBQUksR0FBRyxTQUFTLENBQUM7QUFDckIsV0FBTyxZQUFXO0FBQ2QsYUFBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDaEIsZ0JBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLGdCQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNiLHVCQUFPLEdBQUcsQ0FBQzthQUNkO1NBQ0o7S0FDSixDQUFDO0NBQ0wiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNtYWtlL2xpYi9mdW5jdGlvbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGlzdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgIHZhciBmdW5zID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgZiBvZiBmdW5zKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gZi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKGV4aXN0eShyZXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4iXX0=
//# sourceURL=/home/champ/.atom/packages/autocomplete-cmake/lib/functional.js
