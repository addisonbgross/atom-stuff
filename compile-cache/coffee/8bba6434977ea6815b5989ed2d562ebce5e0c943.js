(function() {
  var StatusInProgress;

  module.exports = StatusInProgress = (function() {
    StatusInProgress.prototype.actions = [];

    function StatusInProgress() {
      this.span = document.createElement("span");
      this.span.className = "inline-block text-subtle";
      this.span.innerHTML = "Indexing..";
      this.progress = document.createElement("progress");
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.subcontainer = document.createElement("div");
      this.subcontainer.className = "block";
      this.container.appendChild(this.subcontainer);
      this.subcontainer.appendChild(this.progress);
      this.subcontainer.appendChild(this.span);
    }

    StatusInProgress.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusInProgress.prototype.update = function(text, show) {
      if (show) {
        this.container.className = "inline-block";
        this.span.innerHTML = text;
        return this.actions.push(text);
      } else {
        this.actions.forEach(function(value, index) {
          if (value === text) {
            return this.actions.splice(index, 1);
          }
        }, this);
        if (this.actions.length === 0) {
          return this.hide();
        } else {
          return this.span.innerHTML = this.actions[0];
        }
      }
    };

    StatusInProgress.prototype.hide = function() {
      return this.container.className = 'hidden';
    };

    StatusInProgress.prototype.attach = function() {
      return this.tile = this.statusBar.addRightTile({
        item: this.container,
        priority: 19
      });
    };

    StatusInProgress.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusInProgress;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9zdGF0dXMtaW4tcHJvZ3Jlc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FLTTtBQUNKLCtCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBRWEsSUFBQSwwQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLDBCQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsWUFGbEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQUpaLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FOYixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsY0FQdkIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FUaEIsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFkLEdBQTBCLE9BVjFCLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsWUFBeEIsQ0FYQSxDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBMEIsSUFBQyxDQUFBLFFBQTNCLENBYkEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxXQUFkLENBQTBCLElBQUMsQ0FBQSxJQUEzQixDQWRBLENBRFc7SUFBQSxDQUZiOztBQUFBLCtCQW1CQSxVQUFBLEdBQVksU0FBRSxTQUFGLEdBQUE7QUFBYyxNQUFiLElBQUMsQ0FBQSxZQUFBLFNBQVksQ0FBZDtJQUFBLENBbkJaLENBQUE7O0FBQUEsK0JBcUJBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBSDtBQUNJLFFBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLGNBQXZCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixJQURsQixDQUFBO2VBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxFQUhKO09BQUEsTUFBQTtBQUtJLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQWlCLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNiLFVBQUEsSUFBRyxLQUFBLEtBQVMsSUFBWjttQkFDSSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsQ0FBdkIsRUFESjtXQURhO1FBQUEsQ0FBakIsRUFHRSxJQUhGLENBQUEsQ0FBQTtBQUtBLFFBQUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBdEI7aUJBQ0ksSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURKO1NBQUEsTUFBQTtpQkFHSSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLEVBSC9CO1NBVko7T0FETTtJQUFBLENBckJSLENBQUE7O0FBQUEsK0JBcUNBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsU0FEbkI7SUFBQSxDQXJDTixDQUFBOztBQUFBLCtCQXdDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0I7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsU0FBUDtBQUFBLFFBQWtCLFFBQUEsRUFBVSxFQUE1QjtPQUF4QixFQURGO0lBQUEsQ0F4Q1IsQ0FBQTs7QUFBQSwrQkEyQ0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBRE07SUFBQSxDQTNDUixDQUFBOzs0QkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/status-in-progress.coffee
