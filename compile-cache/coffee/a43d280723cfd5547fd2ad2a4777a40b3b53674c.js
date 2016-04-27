(function() {
  var AllModifier, AllSaver;

  module.exports = {
    name: 'Highlight All',
    edit: AllSaver = (function() {
      function AllSaver() {}

      AllSaver.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'all'
        });
        return null;
      };

      return AllSaver;

    })(),
    modifier: AllModifier = (function() {
      function AllModifier() {}

      AllModifier.prototype.modify = function(_arg) {
        var temp;
        temp = _arg.temp;
        if (!((temp.type != null) && temp.type !== '')) {
          temp.type = 'warning';
        }
        return null;
      };

      return AllModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3N0cmVhbS1tb2RpZmllcnMvYWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxlQUFOO0FBQUEsSUFFQSxJQUFBLEVBQ1E7NEJBQ0o7O0FBQUEseUJBQUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNILFFBQUEsT0FBUSxDQUFBLE1BQUEsQ0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUF6QixDQUE4QjtBQUFBLFVBQUEsSUFBQSxFQUFNLEtBQU47U0FBOUIsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxJQUFQLENBRkc7TUFBQSxDQUFMLENBQUE7O3NCQUFBOztRQUpKO0FBQUEsSUFRQSxRQUFBLEVBQ1E7K0JBQ0o7O0FBQUEsNEJBQUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sWUFBQSxJQUFBO0FBQUEsUUFEUSxPQUFELEtBQUMsSUFDUixDQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsQ0FBNkIsbUJBQUEsSUFBZSxJQUFJLENBQUMsSUFBTCxLQUFlLEVBQTNELENBQUE7QUFBQSxVQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksU0FBWixDQUFBO1NBQUE7QUFDQSxlQUFPLElBQVAsQ0FGTTtNQUFBLENBQVIsQ0FBQTs7eUJBQUE7O1FBVko7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/stream-modifiers/all.coffee
