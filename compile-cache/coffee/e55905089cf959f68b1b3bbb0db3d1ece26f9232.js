(function() {
  var CompositeDisposable, deregister, disposables, emitEvent, handler, observeConfig, observeEditors, register, utility;

  CompositeDisposable = require('atom').CompositeDisposable;

  handler = require('./handler');

  utility = require('./utility');

  disposables = null;

  emitEvent = function(editor, name, args) {
    return utility.getEditorData(editor).then(function(_arg) {
      var contents, filepath, filetypes, key, parameters, value;
      filepath = _arg.filepath, contents = _arg.contents, filetypes = _arg.filetypes;
      parameters = utility.buildRequestParameters(filepath, contents, filetypes);
      parameters.event_name = name;
      for (key in args) {
        value = args[key];
        parameters[key] = value;
      }
      return handler.request('POST', 'event_notification', parameters);
    });
  };

  observeEditors = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var enabled, isEnabled, observers, onBufferUnload, onBufferVisit, onCurrentIdentifierFinished, onInsertLeave, path;
      path = editor.getPath() || utility.getEditorTmpFilepath(editor);
      enabled = false;
      isEnabled = function() {
        return utility.isEnabledForScope(editor.getRootScopeDescriptor());
      };
      onBufferVisit = function() {
        return emitEvent(editor, 'BufferVisit');
      };
      onBufferUnload = function() {
        return emitEvent(editor, 'BufferUnload', {
          unloaded_buffer: path
        });
      };
      onInsertLeave = function() {
        return emitEvent(editor, 'InsertLeave');
      };
      onCurrentIdentifierFinished = function() {
        return emitEvent(editor, 'CurrentIdentifierFinished');
      };
      observers = new CompositeDisposable();
      observers.add(editor.observeGrammar(function() {
        if (isEnabled()) {
          onBufferVisit();
          return enabled = true;
        } else {
          if (enabled) {
            onBufferUnload();
          }
          return enabled = false;
        }
      }));
      observers.add(editor.onDidChangePath(function() {
        if (enabled) {
          onBufferUnload();
          onBufferVisit();
        }
        return path = editor.getPath();
      }));
      observers.add(editor.onDidStopChanging(function() {
        if (enabled) {
          onInsertLeave();
          return onCurrentIdentifierFinished();
        }
      }));
      return observers.add(editor.onDidDestroy(function() {
        if (enabled) {
          onBufferUnload();
        }
        return observers.dispose();
      }));
    });
  };

  observeConfig = function() {
    return atom.config.observe('you-complete-me', function(value) {
      return handler.reset();
    });
  };

  register = function() {
    disposables = new CompositeDisposable();
    disposables.add(observeEditors());
    return disposables.add(observeConfig());
  };

  deregister = function() {
    return disposables.dispose();
  };

  module.exports = {
    register: register,
    deregister: deregister
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9ldmVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLElBTGQsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsSUFBZixHQUFBO1dBQ1YsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsTUFBdEIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxTQUFDLElBQUQsR0FBQTtBQUNqQyxVQUFBLHFEQUFBO0FBQUEsTUFEbUMsZ0JBQUEsVUFBVSxnQkFBQSxVQUFVLGlCQUFBLFNBQ3ZELENBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQsU0FBbkQsQ0FBYixDQUFBO0FBQUEsTUFDQSxVQUFVLENBQUMsVUFBWCxHQUF3QixJQUR4QixDQUFBO0FBRUEsV0FBQSxXQUFBOzBCQUFBO0FBQUEsUUFBQSxVQUFXLENBQUEsR0FBQSxDQUFYLEdBQWtCLEtBQWxCLENBQUE7QUFBQSxPQUZBO2FBR0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0Isb0JBQXhCLEVBQThDLFVBQTlDLEVBSmlDO0lBQUEsQ0FBbkMsRUFEVTtFQUFBLENBUFosQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO1dBQ2YsSUFBSSxDQUFDLFNB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

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/event.coffee
