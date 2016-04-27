(function() {
  var createCluster, createPlanet;

  createCluster = function(planet, lat, lng, count) {
    var cloud, i, speed, _i, _results;
    speed = 50 + Math.random() * 5;
    _results = [];
    for (i = _i = 0; 0 <= count ? _i <= count : _i >= count; i = 0 <= count ? ++_i : --_i) {
      cloud = new ex.Cloud(lat + Math.random() * 30, lng + Math.random() * 30, 0, speed, 3 + Math.random() * 10);
      cloud.build();
      _results.push(planet.addOrbitable(cloud));
    }
    return _results;
  };

  createPlanet = function(id) {
    var body, i, planet, _i;
    if (id == null) {
      id = 0;
    }
    planet = new ex.Planet(id);
    body = document.getElementById('stage');
    body.appendChild(planet.build());
    for (i = _i = 0; _i <= 10; i = ++_i) {
      createCluster(planet, 180 - Math.random() * 360, 180 - Math.random() * 360, 1 + Math.random() * 10);
    }
    body.onclick = function() {
      console.log('click');
      window.playing = !window.playing;
      if (window.playing) {
        return window.animate();
      }
    };
    return planet;
  };

  window.playing = false;

  window.onload = function() {
    var planets;
    planets = [createPlanet(0)];
    window.animate = function() {
      planets.forEach(function(planet) {
        return planet.animate(new Date().getTime());
      });
      return setTimeout((function() {
        if (playing) {
          return requestAnimationFrame(animate);
        }
      }), 0);
    };
    return animate();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL2Jvb3QuanMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBTUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixTQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixLQUFuQixHQUFBO0FBQ2QsUUFBQSw2QkFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEVBQUEsR0FBRyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBYyxDQUF6QixDQUFBO0FBQ0E7U0FBUyxnRkFBVCxHQUFBO0FBQ0UsTUFBQSxLQUFBLEdBQVksSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBYyxFQUE3QixFQUFpQyxHQUFBLEdBQUksSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWMsRUFBbkQsRUFBdUQsQ0FBdkQsRUFBMEQsS0FBMUQsRUFBaUUsQ0FBQSxHQUFJLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixFQUFyRixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsb0JBR0EsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsS0FBcEIsRUFIQSxDQURGO0FBQUE7b0JBRmM7RUFBQSxDQUFoQixDQUFBOztBQUFBLEVBUUEsWUFBQSxHQUFlLFNBQUMsRUFBRCxHQUFBO0FBQ2IsUUFBQSxtQkFBQTs7TUFEYyxLQUFHO0tBQ2pCO0FBQUEsSUFBQSxNQUFBLEdBQWEsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLEVBQVYsQ0FBYixDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FGUCxDQUFBO0FBQUEsSUFJQSxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFNLENBQUMsS0FBUCxDQUFBLENBQWpCLENBSkEsQ0FBQTtBQU1BLFNBQVMsOEJBQVQsR0FBQTtBQUNFLE1BQUEsYUFBQSxDQUFjLE1BQWQsRUFBc0IsR0FBQSxHQUFJLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFjLEdBQXhDLEVBQTZDLEdBQUEsR0FBSSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBYyxHQUEvRCxFQUFvRSxDQUFBLEdBQUUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEVBQXRGLENBQUEsQ0FERjtBQUFBLEtBTkE7QUFBQSxJQVNBLElBQUksQ0FBQyxPQUFMLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFBLE1BQVUsQ0FBQyxPQUQ1QixDQUFBO0FBRUEsTUFBQSxJQUFvQixNQUFNLENBQUMsT0FBM0I7ZUFBQSxNQUFNLENBQUMsT0FBUCxDQUFBLEVBQUE7T0FIYTtJQUFBLENBVGYsQ0FBQTtXQWNBLE9BZmE7RUFBQSxDQVJmLENBQUE7O0FBQUEsRUF5QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0F6QmpCLENBQUE7O0FBQUEsRUEyQkEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsU0FBQSxHQUFBO0FBRWQsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsQ0FBQyxZQUFBLENBQWEsQ0FBYixDQUFELENBQVYsQ0FBQTtBQUFBLElBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixTQUFDLE1BQUQsR0FBQTtlQUNkLE1BQU0sQ0FBQyxPQUFQLENBQW1CLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxPQUFQLENBQUEsQ0FBbkIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTthQUdBLFVBQUEsQ0FBVyxDQUFDLFNBQUEsR0FBQTtBQUFHLFFBQUEsSUFBaUMsT0FBakM7aUJBQUEscUJBQUEsQ0FBc0IsT0FBdEIsRUFBQTtTQUFIO01BQUEsQ0FBRCxDQUFYLEVBQTBELENBQTFELEVBSmU7SUFBQSxDQUZqQixDQUFBO1dBUUEsT0FBQSxDQUFBLEVBVmM7RUFBQSxDQTNCaEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/planets/boot.js.coffee
