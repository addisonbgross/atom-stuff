(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ex.Planet = (function() {
    function Planet(id, rotation, rotationSpeed) {
      this.id = id != null ? id : 0;
      this.rotation = rotation != null ? rotation : 0;
      this.rotationSpeed = rotationSpeed != null ? rotationSpeed : 20;
      this.orbitables = [];
    }

    Planet.prototype.build = function() {
      this.node = document.createElement('div');
      this.body = document.createElement('div');
      this.node.appendChild(this.body);
      this.node.className = 'planet';
      this.body.className = 'body';
      this.body.setAttribute('style', "background: url(images/" + this.id + ".png);");
      return this.node;
    };

    Planet.prototype.animate = function(t) {
      var dif;
      if ((this.lastTime == null) || t - this.lastTime > 1000) {
        this.lastTime = t;
      }
      this.body.style.backgroundPosition = "" + this.rotation + "px 0";
      dif = (t - this.lastTime) / 1000;
      this.rotation += this.rotationSpeed * dif;
      this.orbitables.forEach(function(orbitable) {
        return orbitable.animate(dif);
      });
      return this.lastTime = t;
    };

    Planet.prototype.addOrbitable = function(orbitable) {
      if (__indexOf.call(this.orbitables, orbitable) < 0) {
        this.orbitables.push(orbitable);
      }
      this.node.appendChild(orbitable.node);
      return this.node.appendChild(orbitable.shadowNode);
    };

    return Planet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL3BsYW5ldC5qcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEscUpBQUE7O0FBQUEsRUFBTSxFQUFFLENBQUM7QUFDTSxJQUFBLGdCQUFFLEVBQUYsRUFBUyxRQUFULEVBQXdCLGFBQXhCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxrQkFBQSxLQUFHLENBQ2hCLENBQUE7QUFBQSxNQURtQixJQUFDLENBQUEsOEJBQUEsV0FBVyxDQUMvQixDQUFBO0FBQUEsTUFEa0MsSUFBQyxDQUFBLHdDQUFBLGdCQUFjLEVBQ2pELENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFBZCxDQURXO0lBQUEsQ0FBYjs7QUFBQSxxQkFHQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQURSLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsSUFBbkIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsUUFIbEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLE1BSmxCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixPQUFuQixFQUE2Qix5QkFBQSxHQUF5QixJQUFDLENBQUEsRUFBMUIsR0FBNkIsUUFBMUQsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLEtBUkk7SUFBQSxDQUhQLENBQUE7O0FBQUEscUJBYUEsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBRVAsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFxQix1QkFBSixJQUFrQixDQUFBLEdBQUksSUFBQyxDQUFBLFFBQUwsR0FBZ0IsSUFBbkQ7QUFBQSxRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBWixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFaLEdBQWlDLEVBQUEsR0FBRyxJQUFDLENBQUEsUUFBSixHQUFhLE1BRDlDLENBQUE7QUFBQSxNQUdBLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxJQUFDLENBQUEsUUFBTixDQUFBLEdBQWtCLElBSHhCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxRQUFELElBQWEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FMOUIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLFNBQUMsU0FBRCxHQUFBO2VBQWUsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBZjtNQUFBLENBQXBCLENBUEEsQ0FBQTthQVFBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFWTDtJQUFBLENBYlQsQ0FBQTs7QUFBQSxxQkF5QkEsWUFBQSxHQUFjLFNBQUMsU0FBRCxHQUFBO0FBQ1osTUFBQSxJQUFrQyxlQUFhLElBQUMsQ0FBQSxVQUFkLEVBQUEsU0FBQSxLQUFsQztBQUFBLFFBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQWlCLFNBQWpCLENBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsU0FBUyxDQUFDLElBQTVCLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixTQUFTLENBQUMsVUFBNUIsRUFIWTtJQUFBLENBekJkLENBQUE7O2tCQUFBOztNQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/planets/planet.js.coffee
