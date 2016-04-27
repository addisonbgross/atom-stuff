(function() {
  (function(module) {
    return module.Random = (function() {
      function Random(seed) {
        this.seed = seed;
      }

      Random.prototype.get = function() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280.0;
      };

      return Random;

    })();
  })(typeof window !== "undefined" && window !== null ? window : module.exports);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL3JhbmRvbS5qcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLEVBQUEsQ0FBQyxTQUFDLE1BQUQsR0FBQTtXQUNPLE1BQU0sQ0FBQztBQUNFLE1BQUEsZ0JBQUUsSUFBRixHQUFBO0FBQVMsUUFBUixJQUFDLENBQUEsT0FBQSxJQUFPLENBQVQ7TUFBQSxDQUFiOztBQUFBLHVCQUNBLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQyxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsR0FBZSxLQUFoQixDQUFBLEdBQXlCLE1BQWpDLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLFNBRkw7TUFBQSxDQURMLENBQUE7O29CQUFBOztTQUZIO0VBQUEsQ0FBRCxDQUFBLENBT0ssZ0RBQUgsR0FBZ0IsTUFBaEIsR0FBNEIsTUFBTSxDQUFDLE9BUHJDLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/planets/random.js.coffee
