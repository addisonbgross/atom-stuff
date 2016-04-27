(function() {
  var CompositeDisposable, InputView, TextEditorView, View, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      this.searchCallback = __bind(this.searchCallback, this);
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div({
        "class": "atom-cscope-input"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "inline-block",
            id: "form-container"
          }, function() {
            _this.select({
              id: "cscope-options"
            }, function() {
              _this.option({
                value: '0'
              }, "Find this C symbol");
              _this.option({
                value: '1'
              }, "Find this global definition");
              _this.option({
                value: '2'
              }, "Find functions called by this");
              _this.option({
                value: '3'
              }, "Find functions calling this");
              _this.option({
                value: '4'
              }, "Find this text string");
              _this.option({
                value: '6'
              }, "Find this egrep pattern");
              _this.option({
                value: '7'
              }, "Find this file");
              _this.option({
                value: '8'
              }, "Find files #including this file");
              return _this.option({
                value: '9'
              }, "Find assignments to this symbol");
            });
            _this.subview('findEditor', new TextEditorView({
              mini: true,
              placeholderText: 'Input query here...'
            }));
            _this.select({
              id: "path-options",
              outlet: 'projectSelector'
            }, function() {
              var index, project, _i, _len, _ref, _results;
              _this.option({
                value: '-1'
              }, "All Projects");
              _ref = atom.project.getPaths();
              _results = [];
              for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                project = _ref[index];
                _results.push(_this.option({
                  value: index.toString()
                }, path.basename(project)));
              }
              return _results;
            });
            return _this.button({
              "class": "btn icon icon-search",
              id: "search"
            }, "Scope It!");
          });
        };
      })(this));
    };

    InputView.prototype.initialize = function(params) {
      this.subscriptions = new CompositeDisposable;
      this.resetPrevSearch();
      this.subscriptions.add(atom.config.observe('atom-cscope.LiveSearchDelay', (function(_this) {
        return function(newValue) {
          return _this.findEditor.getModel().getBuffer().stoppedChangingDelay = newValue;
        };
      })(this)));
      this.on('click', 'button#search', this.searchCallback);
      this.on('change', 'select#cscope-options', this.searchCallback);
      this.on('change', 'select#path-options', (function(_this) {
        return function() {
          return _this.findEditor.focus();
        };
      })(this));
      this.on('core:confirm', this.findEditor, (function(_this) {
        return function(event) {
          if (!_this.isSamePreviousSearch()) {
            return _this.searchCallback(event);
          }
        };
      })(this));
      this.setupLiveSearchListener();
      return this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function(projects) {
          var index, prevSelection, project, _i, _len;
          prevSelection = _this.projectSelector.val();
          _this.projectSelector.empty();
          _this.projectSelector.append(new Option("All", "-1"));
          for (index = _i = 0, _len = projects.length; _i < _len; index = ++_i) {
            project = projects[index];
            _this.projectSelector.append(new Option(path.basename(project), index.toString()));
          }
          return _this.projectSelector.val(prevSelection);
        };
      })(this)));
    };

    InputView.prototype.resetPrevSearch = function() {
      return this.prevSearch = {
        keyword: null,
        option: null,
        projectPath: null
      };
    };

    InputView.prototype.searchCallback = function(event) {
      this.parentView.showLoading();
      if (typeof this.customSearchCallback === "function") {
        this.customSearchCallback(this.getCurrentSearch());
      }
      this.prevSearch = this.getCurrentSearch();
      this.parentView.removeLoading();
      if (event != null) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
      }
      return false;
    };

    InputView.prototype.openSelectBox = function(element) {
      var event;
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      return element.dispatchEvent(event);
    };

    InputView.prototype.openProjectSelector = function() {
      var dropdown, error;
      dropdown = document.getElementById('path-options');
      try {
        this.openSelectBox(dropdown);
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      return false;
    };

    InputView.prototype.getSearchKeyword = function() {
      return this.findEditor.getText();
    };

    InputView.prototype.getSelectedOption = function() {
      return parseInt(this.find('select#cscope-options').val());
    };

    InputView.prototype.getSelectedProjectPath = function() {
      return parseInt(this.find('select#path-options').val());
    };

    InputView.prototype.setSelectedOption = function(option) {
      return this.find('select#cscope-options').val(option.toString());
    };

    InputView.prototype.getCurrentSearch = function() {
      return {
        keyword: this.getSearchKeyword(),
        option: this.getSelectedOption(),
        projectPath: this.getSelectedProjectPath()
      };
    };

    InputView.prototype.isCurrentSearchSameAs = function(search) {
      var currentSearch;
      currentSearch = this.getCurrentSearch();
      return _.isEqual(search, currentSearch);
    };

    InputView.prototype.isSamePreviousSearch = function() {
      return this.isCurrentSearchSameAs(this.prevSearch);
    };

    InputView.prototype.setupLiveSearchListener = function() {
      return this.subscriptions.add(atom.config.observe('atom-cscope.LiveSearch', (function(_this) {
        return function(newValue) {
          var _ref;
          if (newValue) {
            _this.liveSearchListener = _this.findEditor.getModel().onDidStopChanging(_this.searchCallback);
          }
          if (!newValue) {
            return (_ref = _this.liveSearchListener) != null ? typeof _ref.dispose === "function" ? _ref.dispose() : void 0 : void 0;
          }
        };
      })(this)));
    };

    InputView.prototype.onSearch = function(callback) {
      return this.customSearchCallback = callback;
    };

    InputView.prototype.autoFill = function(option, keyword) {
      this.findEditor.setText(keyword);
      return this.find('select#cscope-options').val(option.toString());
    };

    InputView.prototype.invokeSearch = function(option, keyword) {
      this.autoFill(option, keyword);
      return this.searchCallback();
    };

    InputView.prototype.redoSearch = function() {
      this.resetPrevSearch();
      return this.searchCallback();
    };

    InputView.prototype.serialize = function() {};

    InputView.prototype.destroy = function() {
      this.element.remove();
      return this.subscriptions.dispose();
    };

    InputView.prototype.getElement = function() {
      return this.element;
    };

    return InputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL3ZpZXdzL2lucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsV0FBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLGlCQUFtQixPQUFBLENBQVEsc0JBQVIsRUFBbkIsY0FERCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO09BQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDL0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxZQUF1QixFQUFBLEVBQUksZ0JBQTNCO1dBQUwsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsRUFBQSxFQUFJLGdCQUFKO2FBQVIsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLGNBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxHQUFQO2VBQVIsRUFBb0Isb0JBQXBCLENBQUEs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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/views/input-view.coffee
