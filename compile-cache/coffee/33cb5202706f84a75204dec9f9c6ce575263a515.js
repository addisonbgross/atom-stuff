(function() {
  var activate, config, deactivate, event, handler, menu, provider;

  provider = require('./provider');

  handler = require('./handler');

  config = require('./config');

  event = require('./event');

  menu = require('./menu');

  activate = function() {
    event.register();
    menu.register();
  };

  deactivate = function() {
    event.deregister();
    menu.deregister();
    handler.reset();
  };

  module.exports = {
    config: config,
    activate: activate,
    deactivate: deactivate,
    provide: function() {
      return provider;
    },
    provideLinter: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi95Y20uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUpQLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsSUFBQSxLQUFLLENBQUMsUUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQURBLENBRFM7RUFBQSxDQU5YLENBQUE7O0FBQUEsRUFXQSxVQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxLQUFLLENBQUMsVUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQURBLENBQUE7QUFBQSxJQUVBLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FGQSxDQURXO0VBQUEsQ0FYYixDQUFBOztBQUFBLEVBaUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxNQUFSO0FBQUEsSUFDQSxRQUFBLEVBQVUsUUFEVjtBQUFBLElBRUEsVUFBQSxFQUFZLFVBRlo7QUFBQSxJQUdBLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFBRyxTQUFIO0lBQUEsQ0FIVDtBQUFBLElBSUEsYUFBQSxFQUFlLFNBQUEsR0FBQTthQUFHLFNBQUg7SUFBQSxDQUpmO0dBbEJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/ycm.coffee
