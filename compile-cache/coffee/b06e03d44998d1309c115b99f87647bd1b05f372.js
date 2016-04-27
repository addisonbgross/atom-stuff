(function() {
  var AbstractProvider, ClassProvider, TextEditor, proxy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  proxy = require('./abstract-provider');

  AbstractProvider = require('./abstract-provider');

  module.exports = ClassProvider = (function(_super) {
    __extends(ClassProvider, _super);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    ClassProvider.prototype.hoverEventSelectors = '.entity.inherited-class, .support.namespace, .support.class, .comment-clickable .region';


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    ClassProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var classInfo, description, fullClassName, type, _ref;
      fullClassName = this.parser.getFullClassName(editor, term);
      proxy = require('../services/php-proxy.coffee');
      classInfo = proxy.methods(fullClassName);
      if (!classInfo || !classInfo.wasFound) {
        return;
      }
      type = '';
      if (classInfo.isClass) {
        type = (classInfo.isAbstract ? 'abstract ' : '') + 'class';
      } else if (classInfo.isTrait) {
        type = 'trait';
      } else if (classInfo.isInterface) {
        type = 'interface';
      }
      description = '';
      description += "<p><div>";
      description += type + ' ' + '<strong>' + classInfo.shortName + '</strong> &mdash; ' + classInfo["class"];
      description += '</div></p>';
      description += '<div>';
      description += (classInfo.args.descriptions.short ? classInfo.args.descriptions.short : '(No documentation available)');
      description += '</div>';
      if (((_ref = classInfo.args.descriptions.long) != null ? _ref.length : void 0) > 0) {
        description += '<div class="section">';
        description += "<h4>Description</h4>";
        description += "<div>" + classInfo.args.descriptions.long + "</div>";
        description += "</div>";
      }
      return description;
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
     * Gets the correct element to attach the popover to from the retrieved selector.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    ClassProvider.prototype.getPopoverElementFromSelector = function(selector) {
      var array;
      array = this.$(selector).toArray();
      return array[array.length - 1];
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi90b29sdGlwL2NsYXNzLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEscUJBQVIsQ0FGUixDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBSG5CLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0Ysb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLG1CQUFBLEdBQXFCLHlGQUFyQixDQUFBOztBQUVBO0FBQUE7Ozs7O09BRkE7O0FBQUEsNEJBUUEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWYsR0FBQTtBQUNmLFVBQUEsaURBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxDQUFoQixDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLDhCQUFSLENBRlIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLEtBQUssQ0FBQyxPQUFOLENBQWMsYUFBZCxDQUhaLENBQUE7QUFLQSxNQUFBLElBQUcsQ0FBQSxTQUFBLElBQWlCLENBQUEsU0FBYSxDQUFDLFFBQWxDO0FBQ0ksY0FBQSxDQURKO09BTEE7QUFBQSxNQVFBLElBQUEsR0FBTyxFQVJQLENBQUE7QUFVQSxNQUFBLElBQUcsU0FBUyxDQUFDLE9BQWI7QUFDSSxRQUFBLElBQUEsR0FBTyxDQUFJLFNBQVMsQ0FBQyxVQUFiLEdBQTZCLFdBQTdCLEdBQThDLEVBQS9DLENBQUEsR0FBcUQsT0FBNUQsQ0FESjtPQUFBLE1BR0ssSUFBRyxTQUFTLENBQUMsT0FBYjtBQUNELFFBQUEsSUFBQSxHQUFPLE9BQVAsQ0FEQztPQUFBLE1BR0EsSUFBRyxTQUFTLENBQUMsV0FBYjtBQUNELFFBQUEsSUFBQSxHQUFPLFdBQVAsQ0FEQztPQWhCTDtBQUFBLE1Bb0JBLFdBQUEsR0FBYyxFQXBCZCxDQUFBO0FBQUEsTUFzQkEsV0FBQSxJQUFlLFVBdEJmLENBQUE7QUFBQSxNQXVCQSxXQUFBLElBQW1CLElBQUEsR0FBTyxHQUFQLEdBQWEsVUFBYixHQUEwQixTQUFTLENBQUMsU0FBcEMsR0FBZ0Qsb0JBQWhELEdBQXVFLFNBQVMsQ0FBQyxPQUFELENBdkJuRyxDQUFBO0FBQUEsTUF3QkEsV0FBQSxJQUFlLFlBeEJmLENBQUE7QUFBQSxNQTJCQSxXQUFBLElBQWUsT0EzQmYsQ0FBQTtBQUFBLE1BNEJBLFdBQUEsSUFBbUIsQ0FBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUEvQixHQUEwQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUF0RSxHQUFpRiw4QkFBbEYsQ0E1Qm5CLENBQUE7QUFBQSxNQTZCQSxXQUFBLElBQWUsUUE3QmYsQ0FBQTtBQWdDQSxNQUFBLDZEQUFtQyxDQUFFLGdCQUFsQyxHQUEyQyxDQUE5QztBQUNJLFFBQUEsV0FBQSxJQUFlLHVCQUFmLENBQUE7QUFBQSxRQUNBLFdBQUEsSUFBbUIsc0JBRG5CLENBQUE7QUFBQSxRQUVBLFdBQUEsSUFBbUIsT0FBQSxHQUFVLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQXRDLEdBQTZDLFFBRmhFLENBQUE7QUFBQSxRQUdBLFdBQUEsSUFBZSxRQUhmLENBREo7T0FoQ0E7QUFzQ0EsYUFBTyxXQUFQLENBdkNlO0lBQUEsQ0FSbkIsQ0FBQTs7QUFpREE7QUFBQTs7Ozs7O09BakRBOztBQUFBLDRCQXdEQSxvQkFBQSxHQUFzQixTQUFDLEtBQUQsR0FBQTtBQUNsQixhQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsS0FBbEMsQ0FBUCxDQURrQjtJQUFBLENBeER0QixDQUFBOztBQTJEQTtBQUFBOzs7O09BM0RBOztBQUFBLDRCQWdFQSw2QkFBQSxHQUErQixTQUFDLFFBQUQsR0FBQTtBQUczQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsQ0FBRCxDQUFHLFFBQUgsQ0FBWSxDQUFDLE9BQWIsQ0FBQSxDQUFSLENBQUE7QUFDQSxhQUFPLEtBQU0sQ0FBQSxLQUFLLENBQUMsTUFBTixHQUFlLENBQWYsQ0FBYixDQUoyQjtJQUFBLENBaEUvQixDQUFBOzt5QkFBQTs7S0FEd0IsaUJBUDVCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/tooltip/class-provider.coffee
