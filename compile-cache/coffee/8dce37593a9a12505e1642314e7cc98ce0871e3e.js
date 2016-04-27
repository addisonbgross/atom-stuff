(function() {
  var File, Point, buildRequestParameters, getEditorData, getEditorTmpFilepath, getScopeFiletypes, isEnabledForScope, os, path, _ref;

  os = require('os');

  path = require('path');

  _ref = require('atom'), File = _ref.File, Point = _ref.Point;

  getEditorTmpFilepath = function(editor) {
    return path.resolve(os.tmpdir(), "AtomYcmBuffer-" + (editor.getBuffer().getId()));
  };

  getEditorData = function(editor, scopeDescriptor) {
    var bufferPosition, contents, filepath, filetypes;
    if (editor == null) {
      editor = atom.workspace.getActiveTextEditor();
    }
    if (scopeDescriptor == null) {
      scopeDescriptor = editor.getRootScopeDescriptor();
    }
    filepath = editor.getPath();
    contents = editor.getText();
    filetypes = getScopeFiletypes(scopeDescriptor);
    bufferPosition = editor.getCursorBufferPosition();
    if (filepath != null) {
      return Promise.resolve({
        filepath: filepath,
        contents: contents,
        filetypes: filetypes,
        bufferPosition: bufferPosition
      });
    } else {
      return new Promise(function(fulfill, reject) {
        var file;
        filepath = getEditorTmpFilepath(editor);
        file = new File(filepath);
        return file.write(contents).then(function() {
          return fulfill({
            filepath: filepath,
            contents: contents,
            filetypes: filetypes,
            bufferPosition: bufferPosition
          });
        })["catch"](function(error) {
          return reject(error);
        });
      });
    }
  };

  getScopeFiletypes = function(scopeDescriptor) {
    if (scopeDescriptor == null) {
      scopeDescriptor = atom.workspace.getActiveTextEditor().getRootScopeDescriptor();
    }
    return scopeDescriptor.getScopesArray().map(function(scope) {
      return scope.split('.').pop();
    });
  };

  buildRequestParameters = function(filepath, contents, filetypes, bufferPosition) {
    var parameters;
    if (filetypes == null) {
      filetypes = [];
    }
    if (bufferPosition == null) {
      bufferPosition = new Point(0, 0);
    }
    parameters = {
      filepath: filepath,
      line_num: bufferPosition.row + 1,
      column_num: bufferPosition.column + 1,
      file_data: {}
    };
    parameters.file_data[filepath] = {
      contents: contents,
      filetypes: filetypes
    };
    atom.workspace.getTextEditors().filter(function(editor) {
      return editor.isModified() && (editor.getPath() != null) && editor.getPath() !== filepath;
    }).forEach(function(editor) {
      return parameters.file_data[editor.getPath()] = {
        contents: editor.getText(),
        filetypes: getScopeFiletypes(editor.getRootScopeDescriptor())
      };
    });
    return parameters;
  };

  isEnabledForScope = function(scopeDescriptor) {
    var enabledFiletypes, filetype, filetypes;
    enabledFiletypes = atom.config.get('you-complete-me.enabledFiletypes').split(',').map(function(filetype) {
      return filetype.trim();
    });
    filetypes = getScopeFiletypes(scopeDescriptor);
    filetype = filetypes.find(function(filetype) {
      return enabledFiletypes.indexOf(filetype) >= 0;
    });
    if (filetype != null) {
      return true;
    } else {
      return false;
    }
  };

  module.exports = {
    getEditorTmpFilepath: getEditorTmpFilepath,
    getEditorData: getEditorData,
    getScopeFiletypes: getScopeFiletypes,
    buildRequestParameters: buildRequestParameters,
    isEnabledForScope: isEnabledForScope
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi91dGlsaXR5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4SEFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsT0FBZ0IsT0FBQSxDQUFRLE1BQVIsQ0FBaEIsRUFBQyxZQUFBLElBQUQsRUFBTyxhQUFBLEtBRlAsQ0FBQTs7QUFBQSxFQUlBLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxHQUFBO0FBQ3JCLFdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQWIsRUFBMkIsZ0JBQUEsR0FBZSxDQUFDLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxLQUFuQixDQUFBLENBQUQsQ0FBMUMsQ0FBUCxDQURxQjtFQUFBLENBSnZCLENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLFNBQUMsTUFBRCxFQUFnRCxlQUFoRCxHQUFBO0FBQ2QsUUFBQSw2Q0FBQTs7TUFEZSxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtLQUN4Qjs7TUFEOEQsa0JBQWtCLE1BQU0sQ0FBQyxzQkFBUCxDQUFBO0tBQ2hGO0FBQUEsSUFBQSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFYLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBLENBRFgsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLGlCQUFBLENBQWtCLGVBQWxCLENBRlosQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUhq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

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/utility.coffee
