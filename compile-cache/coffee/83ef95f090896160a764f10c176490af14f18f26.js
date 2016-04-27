(function() {
  var convertIssues, fetchIssues, getIssues, handler, processContext, utility;

  handler = require('./handler');

  utility = require('./utility');

  processContext = function(editor) {
    return utility.getEditorData(editor).then(function(_arg) {
      var contents, filepath, filetypes;
      filepath = _arg.filepath, contents = _arg.contents, filetypes = _arg.filetypes;
      return {
        filepath: filepath,
        contents: contents,
        filetypes: filetypes
      };
    });
  };

  fetchIssues = function(_arg) {
    var contents, filepath, filetypes, parameters;
    filepath = _arg.filepath, contents = _arg.contents, filetypes = _arg.filetypes;
    parameters = utility.buildRequestParameters(filepath, contents, filetypes);
    parameters.event_name = 'FileReadyToParse';
    return handler.request('POST', 'event_notification', parameters).then(function(response) {
      var issues;
      issues = Array.isArray(response) ? response : [];
      return {
        issues: issues
      };
    });
  };

  convertIssues = function(_arg) {
    var extractRange, issues;
    issues = _arg.issues;
    extractRange = function(issue) {
      if (issue.location_extent.start.line_num > 0 && issue.location_extent.end.line_num > 0) {
        return [[issue.location_extent.start.line_num - 1, issue.location_extent.start.column_num - 1], [issue.location_extent.end.line_num - 1, issue.location_extent.end.column_num - 1]];
      } else {
        return [[issue.location.line_num - 1, issue.location.column_num - 1], [issue.location.line_num - 1, issue.location.column_num - 1]];
      }
    };
    return issues.map(function(issue) {
      return {
        type: issue.kind,
        text: issue.text,
        filePath: issue.location.filepath,
        range: extractRange(issue)
      };
    });
  };

  getIssues = function(context) {
    return Promise.resolve(context).then(processContext).then(fetchIssues).then(convertIssues);
  };

  module.exports = getIssues;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9nZXQtaXNzdWVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1RUFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNmLE9BQU8sQ0FBQyxhQUFSLENBQXNCLE1BQXRCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsU0FBQyxJQUFELEdBQUE7QUFDakMsVUFBQSw2QkFBQTtBQUFBLE1BRG1DLGdCQUFBLFVBQVUsZ0JBQUEsVUFBVSxpQkFBQSxTQUN2RCxDQUFBO0FBQUEsYUFBTztBQUFBLFFBQUMsVUFBQSxRQUFEO0FBQUEsUUFBVyxVQUFBLFFBQVg7QUFBQSxRQUFxQixXQUFBLFNBQXJCO09BQVAsQ0FEaUM7SUFBQSxDQUFuQyxFQURlO0VBQUEsQ0FIakIsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFFBQUEseUNBQUE7QUFBQSxJQURjLGdCQUFBLFVBQVUsZ0JBQUEsVUFBVSxpQkFBQSxTQUNsQyxDQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsT0FBTyxDQUFDLHNCQUFSLENBQStCLFFBQS9CLEVBQXlDLFFBQXpDLEVBQW1ELFNBQW5ELENBQWIsQ0FBQTtBQUFBLElBQ0EsVUFBVSxDQUFDLFVBQVgsR0FBd0Isa0JBRHhCLENBQUE7V0FFQSxPQUFPLENBQUMsT0FBUixDQUFnQixNQUFoQixFQUF3QixvQkFBeEIsRUFBOEMsVUFBOUMsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxTQUFDLFFBQUQsR0FBQTtBQUM3RCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBWSxLQUFLLENBQUMsT0FBTixDQUFjLFFBQWQsQ0FBSCxHQUErQixRQUEvQixHQUE2QyxFQUF0RCxDQUFBO0FBQ0EsYUFBTztBQUFBLFFBQUMsUUFBQSxNQUFEO09BQVAsQ0FGNkQ7SUFBQSxDQUEvRCxFQUhZO0VBQUEsQ0FQZCxDQUFBOztBQUFBLEVBY0EsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFFBQUEsb0JBQUE7QUFBQSxJQURnQixTQUFELEtBQUMsTUFDaEIsQ0FBQTtBQUFBLElBQUEsWUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsTUFBQSxJQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQTVCLEdBQXVDLENBQXZDLElBQTZDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQTFCLEdBQXFDLENBQXJGO2VBQTRGLENBQzFGLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBNUIsR0FBdUMsQ0FBeEMsRUFBMkMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsVUFBNUIsR0FBeUMsQ0FBcEYsQ0FEMEYsRUFFMUYsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUExQixHQUFxQyxDQUF0QyxFQUF5QyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUExQixHQUF1QyxDQUFoRixDQUYwRixFQUE1RjtPQUFBLE1BQUE7ZUFHTyxDQUNMLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFmLEdBQTBCLENBQTNCLEVBQThCLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBZixHQUE0QixDQUExRCxDQURLLEVBRUwsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWYsR0FBMEIsQ0FBM0IsRUFBOEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFmLEdBQTRCLENBQTFELENBRkssRUFIUDtPQURhO0lBQUEsQ0FBZixDQUFBO1dBU0EsTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFDLEtBQUQsR0FBQTthQUNUO0FBQUEsUUFBQSxJQUFBLEVBQU0sS0FBSyxDQUFDLElBQVo7QUFBQSxRQUNBLElBQUEsRUFBTSxLQUFLLENBQUMsSUFEWjtBQUFBLFFBRUEsUUFBQSxFQUFVLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFGekI7QUFBQSxRQUdBLEtBQUEsRUFBTyxZQUFBLENBQWEsS0FBYixDQUhQO1FBRFM7SUFBQSxDQUFYLEVBVmM7RUFBQSxDQWRoQixDQUFBOztBQUFBLEVBOEJBLFNBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtXQUNWLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE9BQWhCLENBQ0UsQ0FBQyxJQURILENBQ1EsY0FEUixDQUVFLENBQUMsSUFGSCxDQUVRLFdBRlIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxhQUhSLEVBRFU7RUFBQSxDQTlCWixDQUFBOztBQUFBLEVBb0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBcENqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/get-issues.coffee
