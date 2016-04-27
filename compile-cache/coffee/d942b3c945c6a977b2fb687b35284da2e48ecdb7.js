(function() {
  var AbstractProvider, ClassProvider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractProvider = require('./abstract-provider');

  module.exports = ClassProvider = (function(_super) {
    __extends(ClassProvider, _super);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    ClassProvider.prototype.hoverEventSelectors = '.entity.inherited-class, .support.namespace, .support.class, .comment-clickable .region';

    ClassProvider.prototype.clickEventSelectors = '.entity.inherited-class, .support.namespace, .support.class';

    ClassProvider.prototype.gotoRegex = /^\\?[A-Z][A-za-z0-9_]*(\\[A-Z][A-Za-z0-9_])*$/;


    /**
     * Goto the class from the term given.
     *
     * @param  {TextEditor} editor TextEditor to search for namespace of term.
     * @param  {string}     term   Term to search for.
     */

    ClassProvider.prototype.gotoFromWord = function(editor, term) {
      var classInfo, classesResponse, matches, proxy, regexMatches;
      if (term === void 0 || term.indexOf('$') === 0) {
        return;
      }
      term = this.parser.getFullClassName(editor, term);
      proxy = require('../services/php-proxy.coffee');
      classesResponse = proxy.classes();
      if (!classesResponse.autocomplete) {
        return;
      }
      this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
      matches = this.fuzzaldrin.filter(classesResponse.autocomplete, term);
      if (matches[0] === term) {
        regexMatches = /(?:\\)(\w+)$/i.exec(matches[0]);
        if (regexMatches === null || regexMatches.length === 0) {
          this.jumpWord = matches[0];
        } else {
          this.jumpWord = regexMatches[1];
        }
        classInfo = proxy.methods(matches[0]);
        return atom.workspace.open(classInfo.filename, {
          searchAllPanes: true
        });
      }
    };


    /**
     * Gets the correct selector when a class or namespace is clicked.
     *
     * @param  {jQuery.Event}  event  A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */

    ClassProvider.prototype.getSelectorFromEvent = function(event) {
      return this.parser.getClassSelectorFromEvent(event);
    };


    /**
     * Goes through all the lines within the editor looking for classes within comments. More specifically if they have
     * @var, @param or @return prefixed.
     *
     * @param  {TextEditor} editor The editor to search through.
     */

    ClassProvider.prototype.registerMarkers = function(editor) {
      var key, regex, row, rows, text, _results;
      text = editor.getText();
      rows = text.split('\n');
      _results = [];
      for (key in rows) {
        row = rows[key];
        regex = /@param|@var|@return|@throws|@see/gi;
        if (regex.test(row)) {
          _results.push(this.addMarkerToCommentLine(row.split(' '), parseInt(key), editor, true));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };


    /**
     * Removes any markers previously created by registerMarkers.
     *
     * @param {TextEditor} editor The editor to search through
     */

    ClassProvider.prototype.cleanMarkers = function(editor) {
      var i, marker, _ref;
      _ref = this.allMarkers[editor.getLongTitle()];
      for (i in _ref) {
        marker = _ref[i];
        marker.destroy();
      }
      return this.allMarkers = [];
    };


    /**
     * Analyses the words array given for any classes and then creates a marker for them.
     *
     * @param {array} words           The array of words to check.
     * @param {int} rowIndex          The current row the words are on within the editor.
     * @param {TextEditor} editor     The editor the words are from.
     * @param {bool} shouldBreak      Flag to say whether the search should break after finding 1 class.
     * @param {int} currentIndex  = 0 The current column index the search is on.
     * @param {int} offset        = 0 Any offset that should be applied when creating the marker.
     */

    ClassProvider.prototype.addMarkerToCommentLine = function(words, rowIndex, editor, shouldBreak, currentIndex, offset) {
      var key, keywordRegex, marker, markerProperties, options, range, regex, value, _results;
      if (currentIndex == null) {
        currentIndex = 0;
      }
      if (offset == null) {
        offset = 0;
      }
      _results = [];
      for (key in words) {
        value = words[key];
        regex = /^\\?([A-Za-z0-9_]+)\\?([A-Za-zA-Z_\\]*)?/g;
        keywordRegex = /^(array|object|bool|string|static|null|boolean|void|int|integer|mixed|callable)$/gi;
        if (regex.test(value) && keywordRegex.test(value) === false) {
          if (value.includes('|')) {
            this.addMarkerToCommentLine(value.split('|'), rowIndex, editor, false, currentIndex, parseInt(key));
          } else {
            range = [[rowIndex, currentIndex + parseInt(key) + offset], [rowIndex, currentIndex + parseInt(key) + value.length + offset]];
            marker = editor.markBufferRange(range);
            markerProperties = {
              term: value
            };
            marker.setProperties(markerProperties);
            options = {
              type: 'highlight',
              "class": 'comment-clickable comment'
            };
            editor.decorateMarker(marker, options);
            if (this.allMarkers[editor.getLongTitle()] === void 0) {
              this.allMarkers[editor.getLongTitle()] = [];
            }
            this.allMarkers[editor.getLongTitle()].push(marker);
          }
          if (shouldBreak === true) {
            break;
          }
        }
        _results.push(currentIndex += value.length);
      }
      return _results;
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param  {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    ClassProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("^(class|interface|abstractclass|trait) +" + term, "i");
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9nb3RvL2NsYXNzLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0Ysb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLG1CQUFBLEdBQXFCLHlGQUFyQixDQUFBOztBQUFBLDRCQUNBLG1CQUFBLEdBQXFCLDZEQURyQixDQUFBOztBQUFBLDRCQUVBLFNBQUEsR0FBVywrQ0FGWCxDQUFBOztBQUlBO0FBQUE7Ozs7O09BSkE7O0FBQUEsNEJBVUEsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLElBQVQsR0FBQTtBQUNWLFVBQUEsd0RBQUE7QUFBQSxNQUFBLElBQUcsSUFBQSxLQUFRLE1BQVIsSUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsS0FBcUIsQ0FBN0M7QUFDSSxjQUFBLENBREo7T0FBQTtBQUFBLE1BR0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsSUFBakMsQ0FIUCxDQUFBO0FBQUEsTUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLDhCQUFSLENBTFIsQ0FBQTtBQUFBLE1BTUEsZUFBQSxHQUFrQixLQUFLLENBQUMsT0FBTixDQUFBLENBTmxCLENBQUE7QUFRQSxNQUFBLElBQUEsQ0FBQSxlQUE2QixDQUFDLFlBQTlCO0FBQUEsY0FBQSxDQUFBO09BUkE7QUFBQSxNQVVBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/goto/class-provider.coffee
