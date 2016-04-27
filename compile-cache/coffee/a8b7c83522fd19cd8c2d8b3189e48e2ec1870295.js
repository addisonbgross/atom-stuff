(function() {
  var for_each_line, fs, ident_to_find, print, reg,
    __slice = [].slice;

  fs = require('fs');

  print = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log(x.reduce(function(a, b) {
      return a + (b != null ? ", " + b : "");
    }));
  };

  ident_to_find = "daemon";

  reg = RegExp("(?:(class|struct)\\s+(\\w+\\s*(?:\\([\\w\\(\\),\\-\\+\\*/]*\\))*\\s+)*(" + ident_to_find + ")\\s*(?::|\\n|$))");

  for_each_line = function(filepath, func) {
    var line, lineindex, _i, _len, _ref, _results;
    lineindex = 0;
    _ref = fs.readFileSync(filepath).toString().split('\n');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _results.push(func(line, lineindex++));
    }
    return _results;
  };

  for_each_line("/Users/milanburansky/Code/bb/portal-daemon/lib/daemon/daemon.h", function(line, linei) {
    var m;
    if (m = reg.exec(line)) {
      return print(linei, line);
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvY3BwLXJlZmFjdG9yL3NwZWMvdGVzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sUUFBQSxDQUFBO0FBQUEsSUFETywyREFDUCxDQUFBO1dBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTthQUNuQixDQUFBLEdBQUksQ0FBRyxTQUFILEdBQVcsSUFBQSxHQUFPLENBQWxCLEdBQXlCLEVBQXpCLEVBRGU7SUFBQSxDQUFULENBQVosRUFETTtFQUFBLENBRlIsQ0FBQTs7QUFBQSxFQU1BLGFBQUEsR0FBZ0IsUUFOaEIsQ0FBQTs7QUFBQSxFQVFBLEdBQUEsR0FBTSxNQUFBLENBQUcseUVBQUEsR0FJSixhQUpJLEdBSVUsbUJBSmIsQ0FSTixDQUFBOztBQUFBLEVBaUJBLGFBQUEsR0FBZ0IsU0FBQyxRQUFELEVBQVcsSUFBWCxHQUFBO0FBQ2QsUUFBQSx5Q0FBQTtBQUFBLElBQUEsU0FBQSxHQUFZLENBQVosQ0FBQTtBQUNBO0FBQUE7U0FBQSwyQ0FBQTtzQkFBQTtBQUNFLG9CQUFBLElBQUEsQ0FBSyxJQUFMLEVBQVcsU0FBQSxFQUFYLEVBQUEsQ0FERjtBQUFBO29CQUZjO0VBQUEsQ0FqQmhCLENBQUE7O0FBQUEsRUF1QkEsYUFBQSxDQUFjLGdFQUFkLEVBQWdGLFNBQUMsSUFBRCxFQUFNLEtBQU4sR0FBQTtBQUM5RSxRQUFBLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxHQUFJLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBVCxDQUFQO2FBQ0UsS0FBQSxDQUFNLEtBQU4sRUFBWSxJQUFaLEVBREY7S0FEOEU7RUFBQSxDQUFoRixDQXZCQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/cpp-refactor/spec/test.coffee
