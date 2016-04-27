(function() {
  var CppRefactorView;

  module.exports = CppRefactorView = (function() {
    function CppRefactorView(serializedState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('cpp-refactor');
      message = document.createElement('div');
      message.textContent = "My own message";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    CppRefactorView.prototype.serialize = function() {};

    CppRefactorView.prototype.destroy = function() {
      return this.element.remove();
    };

    CppRefactorView.prototype.getElement = function() {
      return this.element;
    };

    return CppRefactorView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvY3BwLXJlZmFjdG9yL2xpYi9jcHAtcmVmYWN0b3Itdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDVyxJQUFBLHlCQUFDLGVBQUQsR0FBQTtBQUVULFVBQUEsT0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGNBQXZCLENBREEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSlYsQ0FBQTtBQUFBLE1BS0EsT0FBTyxDQUFDLFdBQVIsR0FBc0IsZ0JBTHRCLENBQUE7QUFBQSxNQU1BLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsU0FBdEIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FQQSxDQUZTO0lBQUEsQ0FBYjs7QUFBQSw4QkFZQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBWlgsQ0FBQTs7QUFBQSw4QkFlQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsRUFESztJQUFBLENBZlQsQ0FBQTs7QUFBQSw4QkFrQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxRQURPO0lBQUEsQ0FsQlosQ0FBQTs7MkJBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/cpp-refactor/lib/cpp-refactor-view.coffee
