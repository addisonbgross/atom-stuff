(function() {
  var CompositeDisposable, PacmanfyView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = PacmanfyView = (function() {
    function PacmanfyView() {
      this.turndown = __bind(this.turndown, this);
      this.turnup = __bind(this.turnup, this);
      this.turnright = __bind(this.turnright, this);
      this.turnleft = __bind(this.turnleft, this);
      this.move = __bind(this.move, this);
      this.subscribeToActiveTextEditor = __bind(this.subscribeToActiveTextEditor, this);
      this.debounceDestroyPacmanfy = __bind(this.debounceDestroyPacmanfy, this);
      this.debounceCreatePacmanfy = __bind(this.debounceCreatePacmanfy, this);
      this.destroyPacman = __bind(this.destroyPacman, this);
      this.createPacman = __bind(this.createPacman, this);
      this.disable = __bind(this.disable, this);
      this.enable = __bind(this.enable, this);
      this.init = __bind(this.init, this);
      this.init();
      this.disable();
      this.listenConfigChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.init();
          if (_this.disabled) {
            return _this.debounceDestroyPacmanfy();
          } else {
            return _this.debounceCreatePacmanfy();
          }
        };
      })(this));
    }

    PacmanfyView.prototype.init = function() {
      var _ref;
      this.subscribeToActiveTextEditor();
      this.editorElement = atom.views.getView(this.editor);
      return this.pacmanSubscription = (_ref = this.editor) != null ? _ref.onDidChangeSelectionRange((function(_this) {
        return function() {
          var _ref1;
          if ((_ref1 = _this.moveSubscription) != null) {
            _ref1.dispose();
          }
          if (!_this.disabled) {
            return _this.debounceCreatePacmanfy();
          }
        };
      })(this)) : void 0;
    };

    PacmanfyView.prototype.enable = function() {
      this.disabled = false;
      return this.createPacman();
    };

    PacmanfyView.prototype.disable = function() {
      this.disabled = true;
      return this.destroyPacman();
    };

    PacmanfyView.prototype.createPacman = function() {
      var bottom, top, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.cursorElement = (_ref = this.editorElement) != null ? _ref.shadowRoot.querySelector(".cursor") : void 0;
      if ((_ref1 = this.cursorElement) != null) {
        _ref1.style.opacity = atom.config.get('pacmanfy.opacity');
      }
      top = document.createElement("div");
      bottom = document.createElement("div");
      if (!((_ref2 = this.cursorElement) != null ? _ref2.hasChildNodes() : void 0)) {
        top.classList.add("pac-top");
        bottom.classList.add("pac-bottom");
        if ((_ref3 = this.cursorElement) != null) {
          _ref3.classList.add("pacmanfy");
        }
        if ((_ref4 = this.cursorElement) != null) {
          _ref4.appendChild(top);
        }
        if ((_ref5 = this.cursorElement) != null) {
          _ref5.appendChild(bottom);
        }
      }
      return this.moveSubscription = (_ref6 = this.editor) != null ? _ref6.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.move(event);
        };
      })(this)) : void 0;
    };

    PacmanfyView.prototype.destroyPacman = function() {
      var bottom, top, _ref, _ref1, _ref2, _ref3, _ref4;
      this.cursorElement = (_ref = this.editorElement) != null ? _ref.shadowRoot.querySelector(".cursor") : void 0;
      if ((_ref1 = this.cursorElement) != null ? _ref1.hasChildNodes() : void 0) {
        top = this.editorElement.shadowRoot.querySelector(".pac-top");
        bottom = this.editorElement.shadowRoot.querySelector(".pac-bottom");
        top.classList.remove("pac-top");
        bottom.classList.remove("pac-bottom");
        if ((_ref2 = this.cursorElement) != null) {
          _ref2.classList.remove("pacmanfy");
        }
        if ((_ref3 = this.cursorElement) != null) {
          _ref3.removeChild(top);
        }
        return (_ref4 = this.cursorElement) != null ? _ref4.removeChild(bottom) : void 0;
      }
    };

    PacmanfyView.prototype.debounceCreatePacmanfy = function() {
      clearTimeout(this.handleCreateTimeout);
      return this.handleCreateTimeout = setTimeout((function(_this) {
        return function() {
          return _this.createPacman();
        };
      })(this), 10);
    };

    PacmanfyView.prototype.debounceDestroyPacmanfy = function() {
      clearTimeout(this.handleDestroyTimeout);
      return this.handleDestroyTimeout = setTimeout((function(_this) {
        return function() {
          return _this.destroyPacman();
        };
      })(this), 10);
    };

    PacmanfyView.prototype.subscribeToActiveTextEditor = function() {
      return this.editor = this.getActiveTextEditor();
    };

    PacmanfyView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    PacmanfyView.prototype.move = function(event) {
      var bottom, top, _ref, _ref1;
      this.cursorElement = (_ref = this.editorElement) != null ? _ref.shadowRoot.querySelector(".cursor") : void 0;
      if ((_ref1 = this.cursorElement) != null ? _ref1.hasChildNodes() : void 0) {
        top = this.editorElement.shadowRoot.querySelector(".pac-top");
        bottom = this.editorElement.shadowRoot.querySelector(".pac-bottom");
      }
      while (!(top && bottom)) {
        return;
      }
      if (event.newScreenPosition.row > event.oldScreenPosition.row) {
        this.turndown(top, bottom);
        return;
      }
      if (event.newScreenPosition.row < event.oldScreenPosition.row) {
        this.turnup(top, bottom);
        return;
      }
      if (event.newScreenPosition.column > event.oldScreenPosition.column) {
        this.turnright(top, bottom);
      }
      if (event.newScreenPosition.column < event.oldScreenPosition.column) {
        return this.turnleft(top, bottom);
      }
    };

    PacmanfyView.prototype.turnleft = function(top, bottom) {
      top.style.webkitAnimationName = 'spin-top-left';
      return bottom.style.webkitAnimationName = 'spin-bottom-left';
    };

    PacmanfyView.prototype.turnright = function(top, bottom) {
      top.style.webkitAnimationName = 'spin-top-right';
      return bottom.style.webkitAnimationName = 'spin-bottom-right';
    };

    PacmanfyView.prototype.turnup = function(top, bottom) {
      top.style.webkitAnimationName = 'spin-top-up';
      return bottom.style.webkitAnimationName = 'spin-bottom-up';
    };

    PacmanfyView.prototype.turndown = function(top, bottom) {
      top.style.webkitAnimationName = 'spin-top-down';
      return bottom.style.webkitAnimationName = 'spin-bottom-down';
    };

    PacmanfyView.prototype.listenConfigChange = function() {
      return atom.config.onDidChange('pacmanfy.opacity', (function(_this) {
        return function() {
          if (!_this.disabled) {
            return _this.debounceCreatePacmanfy();
          }
        };
      })(this));
    };

    return PacmanfyView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGFjbWFuZnkvbGliL3BhY21hbmZ5LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLHNCQUFBLEdBQUE7QUFDWCxpREFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLG1EQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLHVGQUFBLENBQUE7QUFBQSwrRUFBQSxDQUFBO0FBQUEsNkVBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqRSxVQUFBLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQ0EsVUFBQSxJQUFHLEtBQUMsQ0FBQSxRQUFKO21CQUNFLEtBQUMsQ0FBQSx1QkFBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBSEY7V0FGaUU7UUFBQSxFQUFBO01BQUEsQ0FB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

//# sourceURL=/home/champ/.atom/packages/pacmanfy/lib/pacmanfy-view.coffee
