(function() {
  var CppRefactorClassInfoView;

  module.exports = CppRefactorClassInfoView = (function() {
    function CppRefactorClassInfoView(serializedState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('cpp-refactor');
      message = document.createElement('div');
      message.textContent = "This is class info";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    CppRefactorClassInfoView.prototype.serialize = function() {};

    CppRefactorClassInfoView.prototype.destroy = function() {
      return this.element.remove();
    };

    CppRefactorClassInfoView.prototype.getElement = function() {
      return this.element;
    };

    return CppRefactorClassInfoView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvY3BwLXJlZmFjdG9yL2xpYi9jcHAtcmVmYWN0b3ItY2xhc3MtaW5mby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDVyxJQUFBLGtDQUFDLGVBQUQsR0FBQTtBQUVULFVBQUEsT0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGNBQXZCLENBREEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSlYsQ0FBQTtBQUFBLE1BS0EsT0FBTyxDQUFDLFdBQVIsR0FBc0Isb0JBTHRCLENBQUE7QUFBQSxNQU1BLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsU0FBdEIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FQQSxDQUZTO0lBQUEsQ0FBYjs7QUFBQSx1Q0FXQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBWFgsQ0FBQTs7QUFBQSx1Q0FjQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsRUFESztJQUFBLENBZFQsQ0FBQTs7QUFBQSx1Q0FpQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxRQURPO0lBQUEsQ0FqQlosQ0FBQTs7b0NBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/cpp-refactor/lib/cpp-refactor-class-info-view.coffee
