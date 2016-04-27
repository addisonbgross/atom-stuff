Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

'use babel';

var JavaUtil = (function () {
  function JavaUtil() {
    _classCallCheck(this, JavaUtil);
  }

  _createClass(JavaUtil, [{
    key: 'getSimpleName',
    value: function getSimpleName(className) {
      return className.match(/[^\.]*$/g)[0];
    }
  }, {
    key: 'getPackageName',
    value: function getPackageName(className) {
      return className.replace('.' + this.getSimpleName(className), '');
    }
  }, {
    key: 'getInverseName',
    value: function getInverseName(className) {
      return _lodash._.reduceRight(className.split('.'), function (result, next) {
        return result + next;
      }, '');
    }
  }]);

  return JavaUtil;
})();

exports['default'] = new JavaUtil();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9qYXZhVXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFa0IsUUFBUTs7QUFGMUIsV0FBVyxDQUFDOztJQUlOLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRUMsdUJBQUMsU0FBUyxFQUFFO0FBQ3ZCLGFBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2Qzs7O1dBRWEsd0JBQUMsU0FBUyxFQUFFO0FBQ3hCLGFBQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNuRTs7O1dBRWEsd0JBQUMsU0FBUyxFQUFFO0FBQ3hCLGFBQU8sVUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUs7QUFDM0QsZUFBTyxNQUFNLEdBQUcsSUFBSSxDQUFDO09BQ3RCLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDUjs7O1NBZEcsUUFBUTs7O3FCQWtCQyxJQUFJLFFBQVEsRUFBRSIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvamF2YVV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgXyB9IGZyb20gJ2xvZGFzaCc7XG5cbmNsYXNzIEphdmFVdGlsIHtcblxuICBnZXRTaW1wbGVOYW1lKGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBjbGFzc05hbWUubWF0Y2goL1teXFwuXSokL2cpWzBdO1xuICB9XG5cbiAgZ2V0UGFja2FnZU5hbWUoY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGNsYXNzTmFtZS5yZXBsYWNlKCcuJyArIHRoaXMuZ2V0U2ltcGxlTmFtZShjbGFzc05hbWUpLCAnJyk7XG4gIH1cblxuICBnZXRJbnZlcnNlTmFtZShjbGFzc05hbWUpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2VSaWdodChjbGFzc05hbWUuc3BsaXQoJy4nKSwgKHJlc3VsdCwgbmV4dCkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3VsdCArIG5leHQ7XG4gICAgfSwgJycpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEphdmFVdGlsKCk7XG4iXX0=
//# sourceURL=/home/champ/.atom/packages/autocomplete-java/lib/javaUtil.js
