(function() {
  var log,
    __slice = [].slice;

  log = function() {
    var category, message;
    category = arguments[0], message = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (atom.inDevMode()) {
      return console.debug.apply(console, ["[YCM-" + category + "]"].concat(__slice.call(message)));
    }
  };

  module.exports = {
    log: log
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9kZWJ1Zy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsR0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFFBQUEsaUJBQUE7QUFBQSxJQURLLHlCQUFVLGlFQUNmLENBQUE7QUFBQSxJQUFBLElBQWlELElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBakQ7YUFBQSxPQUFPLENBQUMsS0FBUixnQkFBYyxDQUFDLE9BQUEsR0FBTyxRQUFQLEdBQWdCLEdBQUksU0FBQSxhQUFBLE9BQUEsQ0FBQSxDQUFuQyxFQUFBO0tBREk7RUFBQSxDQUFOLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssR0FBTDtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/debug.coffee
