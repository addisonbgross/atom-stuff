(function() {
  window.ex = {};

  ex.deg2rad = function(a) {
    return a * Math.PI / 180;
  };

  ex.rad2deg = function(a) {
    return a / Math.PI * 180;
  };

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || function(cb) {
    return setTimeout(cb, 1000 / 60);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL3V0aWxzLmpzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxNQUFNLENBQUMsRUFBUCxHQUFZLEVBQVosQ0FBQTs7QUFBQSxFQUVBLEVBQUUsQ0FBQyxPQUFILEdBQWEsU0FBQyxDQUFELEdBQUE7V0FBTyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQVQsR0FBYyxJQUFyQjtFQUFBLENBRmIsQ0FBQTs7QUFBQSxFQUdBLEVBQUUsQ0FBQyxPQUFILEdBQWEsU0FBQyxDQUFELEdBQUE7V0FBTyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQVQsR0FBYyxJQUFyQjtFQUFBLENBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxxQkFBUCxHQUErQixNQUFNLENBQUMscUJBQVAsSUFBZ0MsTUFBTSxDQUFDLHdCQUF2QyxJQUFtRSxNQUFNLENBQUMsMkJBQTFFLElBQXlHLE1BQU0sQ0FBQyxzQkFBaEgsSUFBMEksU0FBQyxFQUFELEdBQUE7V0FBUSxVQUFBLENBQVcsRUFBWCxFQUFlLElBQUEsR0FBTyxFQUF0QixFQUFSO0VBQUEsQ0FMekssQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/planets/utils.js.coffee
