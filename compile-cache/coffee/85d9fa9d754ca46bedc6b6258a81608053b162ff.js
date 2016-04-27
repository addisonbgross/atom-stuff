(function() {
  var HEIGHT, WIDTH, playing;

  WIDTH = 400;

  HEIGHT = 300;

  playing = false;

  $(function() {
    var $canvas, $stage, planet, renderer, stage, texture;
    $canvas = $('#canvas');
    $stage = $('#stage');
    stage = new PIXI.Stage(0x000000);
    renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
    $stage.append(renderer.view);
    texture = PIXI.Texture.fromImage('images/0.png');
    planet = new PIXI.Sprite(texture);
    planet.position.x = 0;
    planet.position.y = 0;
    stage.addChild(planet);
    window.animate = function() {
      renderer.render(stage);
      return setTimeout((function() {
        if (playing) {
          return requestAnimationFrame(animate);
        }
      }), 0);
    };
    return animate();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9waXhpX2Jvb3QuanMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLEdBQVIsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxHQURULENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsS0FIVixDQUFBOztBQUFBLEVBTUEsQ0FBQSxDQUFFLFNBQUEsR0FBQTtBQUNBLFFBQUEsaURBQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxDQUFBLENBQUUsU0FBRixDQUFWLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxDQUFBLENBQUUsUUFBRixDQURULENBQUE7QUFBQSxJQUdBLEtBQUEsR0FBWSxJQUFBLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBWCxDQUhaLENBQUE7QUFBQSxJQUtBLFFBQUEsR0FBVyxJQUFJLENBQUMsa0JBQUwsQ0FBd0IsS0FBeEIsRUFBK0IsTUFBL0IsQ0FMWCxDQUFBO0FBQUEsSUFPQSxNQUFNLENBQUMsTUFBUCxDQUFjLFFBQVEsQ0FBQyxJQUF2QixDQVBBLENBQUE7QUFBQSxJQVNBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQWIsQ0FBdUIsY0FBdkIsQ0FUVixDQUFBO0FBQUEsSUFVQSxNQUFBLEdBQWEsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFZLE9BQVosQ0FWYixDQUFBO0FBQUEsSUFZQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQWhCLEdBQW9CLENBWnBCLENBQUE7QUFBQSxJQWFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBaEIsR0FBb0IsQ0FicEIsQ0FBQTtBQUFBLElBZUEsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLENBZkEsQ0FBQTtBQUFBLElBaUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBQSxDQUFBO2FBQ0EsVUFBQSxDQUFXLENBQUMsU0FBQSxHQUFBO0FBQUcsUUFBQSxJQUFpQyxPQUFqQztpQkFBQSxxQkFBQSxDQUFzQixPQUF0QixFQUFBO1NBQUg7TUFBQSxDQUFELENBQVgsRUFBMEQsQ0FBMUQsRUFGZTtJQUFBLENBakJqQixDQUFBO1dBcUJBLE9BQUEsQ0FBQSxFQXRCQTtFQUFBLENBQUYsQ0FOQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/pixi_boot.js.coffee
