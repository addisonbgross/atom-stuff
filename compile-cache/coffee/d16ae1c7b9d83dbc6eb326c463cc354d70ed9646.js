(function() {
  module.exports = {
    activate: function() {
      return this.workers = {};
    },
    deactivate: function() {
      var j, k, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = Object.keys(this.workers);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _ref1 = Object.keys(this.workers[k]);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          j = _ref1[_j];
          if ((_ref2 = this.workers[k][j]) != null) {
            _ref2.stop();
          }
        }
      }
      return this.workers = {};
    },
    getWorker: function(command) {
      var worker, _base, _name;
      if ((_base = this.workers)[_name = command.project] == null) {
        _base[_name] = {};
      }
      if ((worker = this.workers[command.project][command.name]) != null) {
        return worker;
      }
      return this.createWorker(command);
    },
    createWorker: function(command) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return command.getQueue().run().then((function(worker) {
            _this.workers[command.project][command.name] = worker;
            worker.onFinishedQueue(function() {
              return _this.removeWorker(command);
            });
            return resolve(worker);
          }), reject);
        };
      })(this));
    },
    removeWorker: function(command) {
      var _base, _name, _ref;
      if ((_base = this.workers)[_name = command.project] == null) {
        _base[_name] = {};
      }
      if ((_ref = this.workers[command.project][command.name]) != null) {
        _ref.stop();
      }
      return this.workers[command.project][command.name] = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL3dvcmtlci1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQURIO0lBQUEsQ0FBVjtBQUFBLElBR0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsNkNBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRTtBQUFBLGFBQUEsOENBQUE7d0JBQUE7O2lCQUNnQixDQUFFLElBQWhCLENBQUE7V0FERjtBQUFBLFNBREY7QUFBQSxPQUFBO2FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUpEO0lBQUEsQ0FIWjtBQUFBLElBU0EsU0FBQSxFQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsVUFBQSxvQkFBQTs7dUJBQTZCO09BQTdCO0FBQ0EsTUFBQSxJQUFpQiw4REFBakI7QUFBQSxlQUFPLE1BQVAsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxPQUFkLEVBSFM7SUFBQSxDQVRYO0FBQUEsSUFjQSxZQUFBLEVBQWMsU0FBQyxPQUFELEdBQUE7YUFDUixJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO2lCQUNWLE9BQU8sQ0FBQyxRQUFSLENBQUEsQ0FBa0IsQ0FBQyxHQUFuQixDQUFBLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBQyxTQUFDLE1BQUQsR0FBQTtBQUM3QixZQUFBLEtBQUMsQ0FBQSxPQUFRLENBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBaUIsQ0FBQSxPQUFPLENBQUMsSUFBUixDQUExQixHQUEwQyxNQUExQyxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsZUFBUCxDQUF1QixTQUFBLEdBQUE7cUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBYyxPQUFkLEVBQUg7WUFBQSxDQUF2QixDQURBLENBQUE7bUJBRUEsT0FBQSxDQUFRLE1BQVIsRUFINkI7VUFBQSxDQUFELENBQTlCLEVBSUcsTUFKSCxFQURVO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixFQURRO0lBQUEsQ0FkZDtBQUFBLElBdUJBLFlBQUEsRUFBYyxTQUFDLE9BQUQsR0FBQTtBQUNaLFVBQUEsa0JBQUE7O3VCQUE2QjtPQUE3Qjs7WUFDdUMsQ0FBRSxJQUF6QyxDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsT0FBUSxDQUFBLE9BQU8sQ0FBQyxPQUFSLENBQWlCLENBQUEsT0FBTyxDQUFDLElBQVIsQ0FBMUIsR0FBMEMsS0FIOUI7SUFBQSxDQXZCZDtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/worker-manager.coffee
