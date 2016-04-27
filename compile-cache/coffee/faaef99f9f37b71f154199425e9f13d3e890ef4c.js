(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ex.Cloud = (function(_super) {
    __extends(Cloud, _super);

    function Cloud() {
      return Cloud.__super__.constructor.apply(this, arguments);
    }

    Cloud.prototype.getStyle = function(front, x, y, rotate, dist) {
      var b, g, r, r3, ratio, scale, shadow, transform;
      scale = Math.abs(Math.cos(ex.deg2rad(dist / 128 * 90)));
      shadow = (5 + this.altitude) * 1 / scale;
      ratio = 1 - scale;
      r3 = ratio * ratio * ratio;
      r = 255 - Math.round(r3 * (255 - 0x8f));
      g = 255 - Math.round(r3 * (255 - 0xed));
      b = 255 - Math.round(r3 * (255 - 0xf4));
      transform = this.getTransform(rotate, Math.max(scale, 0.3));
      return "" + transform + " background: rgb(" + r + "," + g + "," + b + "); box-shadow: 0 0 4px 1px rgb(" + r + "," + g + "," + b + "), 0 0 8px 1px rgb(" + r + "," + g + "," + b + ");";
    };

    Cloud.prototype.getShadowStyle = function(front, x, y, rotate, dist) {
      var scale, transform;
      scale = Math.abs(Math.cos(ex.deg2rad(dist / 128 * 90)));
      transform = this.getTransform(rotate, Math.max(scale, 0.0001));
      if (front) {
        return transform;
      } else {
        return 'display: none;';
      }
    };

    Cloud.prototype.getTransform = function(rotate, scale) {
      var prefixes, transformString;
      transformString = "rotate(" + (Math.round(ex.rad2deg(rotate))) + "deg) scale(" + scale + ", 1)";
      prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
      return prefixes.map(function(p) {
        return "" + p + "transform: " + transformString + ";";
      }).join('');
    };

    return Cloud;

  })(ex.Orbitable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL2Nsb3VkLmpzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQTttU0FBQTs7QUFBQSxFQUFNLEVBQUUsQ0FBQztBQUNQLDRCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxvQkFBQSxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxNQUFkLEVBQXNCLElBQXRCLEdBQUE7QUFDUixVQUFBLDRDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUUsQ0FBQyxPQUFILENBQVcsSUFBQSxHQUFPLEdBQVAsR0FBYSxFQUF4QixDQUFULENBQVQsQ0FBUixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsQ0FBQyxDQUFBLEdBQUUsSUFBQyxDQUFBLFFBQUosQ0FBQSxHQUFnQixDQUFoQixHQUFvQixLQUQ3QixDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVMsQ0FBQSxHQUFFLEtBRlgsQ0FBQTtBQUFBLE1BR0EsRUFBQSxHQUFLLEtBQUEsR0FBUSxLQUFSLEdBQWdCLEtBSHJCLENBQUE7QUFBQSxNQUlBLENBQUEsR0FBSSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFBLEdBQUssQ0FBQyxHQUFBLEdBQU0sSUFBUCxDQUFoQixDQUpWLENBQUE7QUFBQSxNQUtBLENBQUEsR0FBSSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFBLEdBQUssQ0FBQyxHQUFBLEdBQU0sSUFBUCxDQUFoQixDQUxWLENBQUE7QUFBQSxNQU1BLENBQUEsR0FBSSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFBLEdBQUssQ0FBQyxHQUFBLEdBQU0sSUFBUCxDQUFoQixDQU5WLENBQUE7QUFBQSxNQVFBLFNBQUEsR0FBWSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFBc0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBQXRCLENBUlosQ0FBQTthQVVBLEVBQUEsR0FBRyxTQUFILEdBQWEsbUJBQWIsR0FBZ0MsQ0FBaEMsR0FBa0MsR0FBbEMsR0FBcUMsQ0FBckMsR0FBdUMsR0FBdkMsR0FBMEMsQ0FBMUMsR0FBNEMsaUNBQTVDLEdBQTZFLENBQTdFLEdBQStFLEdBQS9FLEdBQWtGLENBQWxGLEdBQW9GLEdBQXBGLEdBQXVGLENBQXZGLEdBQXlGLHFCQUF6RixHQUE4RyxDQUE5RyxHQUFnSCxHQUFoSCxHQUFtSCxDQUFuSCxHQUFxSCxHQUFySCxHQUF3SCxDQUF4SCxHQUEwSCxLQVhsSDtJQUFBLENBQVYsQ0FBQTs7QUFBQSxvQkFhQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsTUFBZCxFQUFzQixJQUF0QixHQUFBO0FBQ2QsVUFBQSxnQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFFLENBQUMsT0FBSCxDQUFXLElBQUEsR0FBTyxHQUFQLEdBQWEsRUFBeEIsQ0FBVCxDQUFULENBQVIsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsRUFBZ0IsTUFBaEIsQ0FBdEIsQ0FGWixDQUFBO0FBSUEsTUFBQSxJQUFHLEtBQUg7ZUFDRSxVQURGO09BQUEsTUFBQTtlQUdFLGlCQUhGO09BTGM7SUFBQSxDQWJoQixDQUFBOztBQUFBLG9CQXVCQSxZQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1osVUFBQSx5QkFBQTtBQUFBLE1BQUEsZUFBQSxHQUFtQixTQUFBLEdBQVEsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxPQUFILENBQVcsTUFBWCxDQUFYLENBQUQsQ0FBUixHQUFzQyxhQUF0QyxHQUFtRCxLQUFuRCxHQUF5RCxNQUE1RSxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLE1BQVosRUFBb0IsT0FBcEIsRUFBNkIsVUFBN0IsQ0FEWCxDQUFBO2FBRUEsUUFBUSxDQUFDLEdBQVQsQ0FBYSxTQUFDLENBQUQsR0FBQTtlQUFPLEVBQUEsR0FBRyxDQUFILEdBQUssYUFBTCxHQUFrQixlQUFsQixHQUFrQyxJQUF6QztNQUFBLENBQWIsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxFQUEvRCxFQUhZO0lBQUEsQ0F2QmQsQ0FBQTs7aUJBQUE7O0tBRHFCLEVBQUUsQ0FBQyxVQUExQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/planets/cloud.js.coffee
