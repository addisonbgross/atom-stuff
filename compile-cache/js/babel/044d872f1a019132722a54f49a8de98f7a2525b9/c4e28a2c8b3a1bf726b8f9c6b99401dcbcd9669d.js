Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomUtils = require('atom-utils');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

var _mixinsDomStylesReader = require('./mixins/dom-styles-reader');

var _mixinsDomStylesReader2 = _interopRequireDefault(_mixinsDomStylesReader);

var _mixinsCanvasDrawer = require('./mixins/canvas-drawer');

var _mixinsCanvasDrawer2 = _interopRequireDefault(_mixinsCanvasDrawer);

var _minimapQuickSettingsElement = require('./minimap-quick-settings-element');

var _minimapQuickSettingsElement2 = _interopRequireDefault(_minimapQuickSettingsElement);

'use babel';

var SPEC_MODE = atom.inSpecMode();

/**
 * Public: The MinimapElement is the view meant to render a {@link Minimap}
 * instance in the DOM.
 *
 * You can retrieve the MinimapElement associated to a Minimap
 * using the `atom.views.getView` method.
 *
 * Note that most interactions with the Minimap package is done through the
 * Minimap model so you should never have to access MinimapElement
 * instances.
 *
 * @example
 * let minimapElement = atom.views.getView(minimap)
 */

var MinimapElement = (function () {
  function MinimapElement() {
    _classCallCheck(this, _MinimapElement);
  }

  _createClass(MinimapElement, [{
    key: 'createdCallback',

    //    ##     ##  #######   #######  ##    ##  ######
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ## ##     ## ##     ## ##  ##   ##
    //    ######### ##     ## ##     ## #####     ######
    //    ##     ## ##     ## ##     ## ##  ##         ##
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ##  #######   #######  ##    ##  ######

    /**
     * DOM callback invoked when a new MinimapElement is created.
     *
     * @access private
     */
    value: function createdCallback() {
      var _this = this;

      // Core properties

      /**
       * @access private
       */
      this.minimap = undefined;
      /**
       * @access private
       */
      this.editorElement = undefined;
      /**
       * @access private
       */
      this.width = undefined;
      /**
       * @access private
       */
      this.height = undefined;

      // Subscriptions

      /**
       * @access private
       */
      this.subscriptions = new _atom.CompositeDisposable();
      /**
       * @access private
       */
      this.visibleAreaSubscription = undefined;
      /**
       * @access private
       */
      this.quickSettingsSubscription = undefined;
      /**
       * @access private
       */
      this.dragSubscription = undefined;
      /**
       * @access private
       */
      this.openQuickSettingSubscription = undefined;

      // Configs

      /**
      * @access private
      */
      this.displayMinimapOnLeft = false;
      /**
      * @access private
      */
      this.minimapScrollIndicator = undefined;
      /**
      * @access private
      */
      this.displayMinimapOnLeft = undefined;
      /**
      * @access private
      */
      this.displayPluginsControls = undefined;
      /**
      * @access private
      */
      this.textOpacity = undefined;
      /**
      * @access private
      */
      this.displayCodeHighlights = undefined;
      /**
      * @access private
      */
      this.adjustToSoftWrap = undefined;
      /**
      * @access private
      */
      this.useHardwareAcceleration = undefined;
      /**
      * @access private
      */
      this.absoluteMode = undefined;

      // Elements

      /**
       * @access private
       */
      this.shadowRoot = undefined;
      /**
       * @access private
       */
      this.visibleArea = undefined;
      /**
       * @access private
       */
      this.controls = undefined;
      /**
       * @access private
       */
      this.scrollIndicator = undefined;
      /**
       * @access private
       */
      this.openQuickSettings = undefined;
      /**
       * @access private
       */
      this.quickSettingsElement = undefined;

      // States

      /**
      * @access private
      */
      this.attached = undefined;
      /**
      * @access private
      */
      this.attachedToTextEditor = undefined;
      /**
      * @access private
      */
      this.standAlone = undefined;
      /**
       * @access private
       */
      this.wasVisible = undefined;

      // Other

      /**
       * @access private
       */
      this.offscreenFirstRow = undefined;
      /**
       * @access private
       */
      this.offscreenLastRow = undefined;
      /**
       * @access private
       */
      this.frameRequested = undefined;
      /**
       * @access private
       */
      this.flexBasis = undefined;

      this.initializeContent();

      return this.observeConfig({
        'minimap.displayMinimapOnLeft': function minimapDisplayMinimapOnLeft(displayMinimapOnLeft) {
          _this.displayMinimapOnLeft = displayMinimapOnLeft;

          _this.updateMinimapFlexPosition();
        },

        'minimap.minimapScrollIndicator': function minimapMinimapScrollIndicator(minimapScrollIndicator) {
          _this.minimapScrollIndicator = minimapScrollIndicator;

          if (_this.minimapScrollIndicator && !(_this.scrollIndicator != null) && !_this.standAlone) {
            _this.initializeScrollIndicator();
          } else if (_this.scrollIndicator != null) {
            _this.disposeScrollIndicator();
          }

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.displayPluginsControls': function minimapDisplayPluginsControls(displayPluginsControls) {
          _this.displayPluginsControls = displayPluginsControls;

          if (_this.displayPluginsControls && !(_this.openQuickSettings != null) && !_this.standAlone) {
            _this.initializeOpenQuickSettings();
          } else if (_this.openQuickSettings != null) {
            _this.disposeOpenQuickSettings();
          }
        },

        'minimap.textOpacity': function minimapTextOpacity(textOpacity) {
          _this.textOpacity = textOpacity;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.displayCodeHighlights': function minimapDisplayCodeHighlights(displayCodeHighlights) {
          _this.displayCodeHighlights = displayCodeHighlights;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.adjustMinimapWidthToSoftWrap': function minimapAdjustMinimapWidthToSoftWrap(adjustToSoftWrap) {
          _this.adjustToSoftWrap = adjustToSoftWrap;

          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'minimap.useHardwareAcceleration': function minimapUseHardwareAcceleration(useHardwareAcceleration) {
          _this.useHardwareAcceleration = useHardwareAcceleration;

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.absoluteMode': function minimapAbsoluteMode(absoluteMode) {
          _this.absoluteMode = absoluteMode;

          return _this.classList.toggle('absolute', _this.absoluteMode);
        },

        'editor.preferredLineLength': function editorPreferredLineLength() {
          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'editor.softWrap': function editorSoftWrap() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'editor.softWrapAtPreferredLineLength': function editorSoftWrapAtPreferredLineLength() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        }
      });
    }

    /**
     * DOM callback invoked when a new MinimapElement is attached to the DOM.
     *
     * @access private
     */
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      var _this2 = this;

      this.subscriptions.add(atom.views.pollDocument(function () {
        _this2.pollDOM();
      }));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();

      /*
        We use `atom.styles.onDidAddStyleElement` instead of
        `atom.themes.onDidChangeActiveThemes`.
        Why? Currently, The style element will be removed first, and then re-added
        and the `change` event has not be triggered in the process.
      */
      return this.subscriptions.add(atom.styles.onDidAddStyleElement(function () {
        _this2.invalidateDOMStylesCache();
        _this2.requestForcedUpdate();
      }));
    }

    /**
     * DOM callback invoked when a new MinimapElement is detached from the DOM.
     *
     * @access private
     */
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }

    //       ###    ######## ########    ###     ######  ##     ##
    //      ## ##      ##       ##      ## ##   ##    ## ##     ##
    //     ##   ##     ##       ##     ##   ##  ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##       #########
    //    #########    ##       ##    ######### ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##    ## ##     ##
    //    ##     ##    ##       ##    ##     ##  ######  ##     ##

    /**
     * Returns whether the MinimapElement is currently visible on screen or not.
     *
     * The visibility of the minimap is defined by testing the size of the offset
     * width and height of the element.
     *
     * @return {boolean} whether the MinimapElement is currently visible or not
     */
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    }

    /**
     * Attaches the MinimapElement to the DOM.
     *
     * The position at which the element is attached is defined by the
     * `displayMinimapOnLeft` setting.
     *
     * @param  {HTMLElement} [parent] the DOM node where attaching the minimap
     *                                element
     */
  }, {
    key: 'attach',
    value: function attach(parent) {
      if (this.attached) {
        return;
      }
      (parent || this.getTextEditorElementRoot()).appendChild(this);
    }

    /**
     * Detaches the MinimapElement from the DOM.
     */
  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached || this.parentNode == null) {
        return;
      }
      this.parentNode.removeChild(this);
    }

    /**
     * Toggles the minimap left/right position based on the value of the
     * `displayMinimapOnLeft` setting.
     *
     * @access private
     */
  }, {
    key: 'updateMinimapFlexPosition',
    value: function updateMinimapFlexPosition() {
      this.classList.toggle('left', this.displayMinimapOnLeft);
    }

    /**
     * Destroys this MinimapElement
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.detach();
      this.minimap = null;
    }

    //     ######   #######  ##    ## ######## ######## ##    ## ########
    //    ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
    //    ##       ##     ## ####  ##    ##    ##       ####  ##    ##
    //    ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
    //    ##       ##     ## ##  ####    ##    ##       ##  ####    ##
    //    ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
    //     ######   #######  ##    ##    ##    ######## ##    ##    ##

    /**
     * Creates the content of the MinimapElement and attaches the mouse control
     * event listeners.
     *
     * @access private
     */
  }, {
    key: 'initializeContent',
    value: function initializeContent() {
      var _this3 = this;

      this.initializeCanvas();

      this.shadowRoot = this.createShadowRoot();
      this.attachCanvases(this.shadowRoot);

      this.createVisibleArea();
      this.createControls();

      this.subscriptions.add(this.subscribeTo(this, {
        'mousewheel': function mousewheel(e) {
          if (!_this3.standAlone) {
            _this3.relayMousewheelEvent(e);
          }
        }
      }));

      this.subscriptions.add(this.subscribeTo(this.getFrontCanvas(), {
        'mousedown': function mousedown(e) {
          _this3.canvasPressed(_this3.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this3.canvasPressed(_this3.extractTouchEventData(e));
        }
      }));
    }

    /**
     * Initializes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'createVisibleArea',
    value: function createVisibleArea() {
      var _this4 = this;

      if (this.visibleArea) {
        return;
      }

      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.visibleAreaSubscription = this.subscribeTo(this.visibleArea, {
        'mousedown': function mousedown(e) {
          _this4.startDrag(_this4.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this4.startDrag(_this4.extractTouchEventData(e));
        }
      });

      this.subscriptions.add(this.visibleAreaSubscription);
    }

    /**
     * Removes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'removeVisibleArea',
    value: function removeVisibleArea() {
      if (!this.visibleArea) {
        return;
      }

      this.subscriptions.remove(this.visibleAreaSubscription);
      this.visibleAreaSubscription.dispose();
      this.shadowRoot.removeChild(this.visibleArea);
      delete this.visibleArea;
    }

    /**
     * Creates the controls container div.
     *
     * @access private
     */
  }, {
    key: 'createControls',
    value: function createControls() {
      if (this.controls || this.standAlone) {
        return;
      }

      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
    }

    /**
     * Removes the controls container div.
     *
     * @access private
     */
  }, {
    key: 'removeControls',
    value: function removeControls() {
      if (!this.controls) {
        return;
      }

      this.shadowRoot.removeChild(this.controls);
      delete this.controls;
    }

    /**
     * Initializes the scroll indicator div when the `minimapScrollIndicator`
     * settings is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeScrollIndicator',
    value: function initializeScrollIndicator() {
      if (this.scrollIndicator || this.standAlone) {
        return;
      }

      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      this.controls.appendChild(this.scrollIndicator);
    }

    /**
     * Disposes the scroll indicator div when the `minimapScrollIndicator`
     * settings is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeScrollIndicator',
    value: function disposeScrollIndicator() {
      if (!this.scrollIndicator) {
        return;
      }

      this.controls.removeChild(this.scrollIndicator);
      delete this.scrollIndicator;
    }

    /**
     * Initializes the quick settings openener div when the
     * `displayPluginsControls` setting is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeOpenQuickSettings',
    value: function initializeOpenQuickSettings() {
      var _this5 = this;

      if (this.openQuickSettings || this.standAlone) {
        return;
      }

      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);

      this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          e.stopPropagation();

          if (_this5.quickSettingsElement != null) {
            _this5.quickSettingsElement.destroy();
            _this5.quickSettingsSubscription.dispose();
          } else {
            _this5.quickSettingsElement = new _minimapQuickSettingsElement2['default']();
            _this5.quickSettingsElement.setModel(_this5);
            _this5.quickSettingsSubscription = _this5.quickSettingsElement.onDidDestroy(function () {
              _this5.quickSettingsElement = null;
            });

            var _getFrontCanvas$getBoundingClientRect = _this5.getFrontCanvas().getBoundingClientRect();

            var _top = _getFrontCanvas$getBoundingClientRect.top;
            var left = _getFrontCanvas$getBoundingClientRect.left;
            var right = _getFrontCanvas$getBoundingClientRect.right;

            _this5.quickSettingsElement.style.top = _top + 'px';
            _this5.quickSettingsElement.attach();

            if (_this5.displayMinimapOnLeft) {
              _this5.quickSettingsElement.style.left = right + 'px';
            } else {
              _this5.quickSettingsElement.style.left = left - _this5.quickSettingsElement.clientWidth + 'px';
            }
          }
        }
      });
    }

    /**
     * Disposes the quick settings openener div when the `displayPluginsControls`
     * setting is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeOpenQuickSettings',
    value: function disposeOpenQuickSettings() {
      if (!this.openQuickSettings) {
        return;
      }

      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      delete this.openQuickSettings;
    }

    /**
     * Returns the target `TextEditor` of the Minimap.
     *
     * @return {TextEditor} the minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.minimap.getTextEditor();
    }

    /**
     * Returns the `TextEditorElement` for the Minimap's `TextEditor`.
     *
     * @return {TextEditorElement} the minimap's text editor element
     */
  }, {
    key: 'getTextEditorElement',
    value: function getTextEditorElement() {
      if (this.editorElement) {
        return this.editorElement;
      }

      this.editorElement = atom.views.getView(this.getTextEditor());
      return this.editorElement;
    }

    /**
     * Returns the root of the `TextEditorElement` content.
     *
     * This method is mostly used to ensure compatibility with the `shadowDom`
     * setting.
     *
     * @return {HTMLElement} the root of the `TextEditorElement` content
     */
  }, {
    key: 'getTextEditorElementRoot',
    value: function getTextEditorElementRoot() {
      var editorElement = this.getTextEditorElement();

      if (editorElement.shadowRoot) {
        return editorElement.shadowRoot;
      } else {
        return editorElement;
      }
    }

    /**
     * Returns the root where to inject the dummy node used to read DOM styles.
     *
     * @param  {boolean} shadowRoot whether to use the text editor shadow DOM
     *                              or not
     * @return {HTMLElement} the root node where appending the dummy node
     * @access private
     */
  }, {
    key: 'getDummyDOMRoot',
    value: function getDummyDOMRoot(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    }

    //    ##     ##  #######  ########  ######## ##
    //    ###   ### ##     ## ##     ## ##       ##
    //    #### #### ##     ## ##     ## ##       ##
    //    ## ### ## ##     ## ##     ## ######   ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ##  #######  ########  ######## ########

    /**
     * Returns the Minimap for which this MinimapElement was created.
     *
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'getModel',
    value: function getModel() {
      return this.minimap;
    }

    /**
     * Defines the Minimap model for this MinimapElement instance.
     *
     * @param  {Minimap} minimap the Minimap model for this instance.
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'setModel',
    value: function setModel(minimap) {
      var _this6 = this;

      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidDestroy(function () {
        _this6.destroy();
      }));
      this.subscriptions.add(this.minimap.onDidChangeConfig(function () {
        if (_this6.attached) {
          return _this6.requestForcedUpdate();
        }
      }));

      this.subscriptions.add(this.minimap.onDidChangeStandAlone(function () {
        _this6.setStandAlone(_this6.minimap.isStandAlone());
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChange(function (change) {
        _this6.pendingChanges.push(change);
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChangeDecorationRange(function (change) {
        var type = change.type;

        if (type === 'line' || type === 'highlight-under') {
          _this6.pendingBackDecorationChanges.push(change);
        } else {
          _this6.pendingFrontDecorationChanges.push(change);
        }
        _this6.requestUpdate();
      }));

      this.setStandAlone(this.minimap.isStandAlone());

      if (this.width != null && this.height != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      return this.minimap;
    }

    /**
     * Sets the stand-alone mode for this MinimapElement.
     *
     * @param {boolean} standAlone the new mode for this MinimapElement
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      this.standAlone = standAlone;

      if (this.standAlone) {
        this.setAttribute('stand-alone', true);
        this.disposeScrollIndicator();
        this.disposeOpenQuickSettings();
        this.removeControls();
        this.removeVisibleArea();
      } else {
        this.removeAttribute('stand-alone');
        this.createVisibleArea();
        this.createControls();
        if (this.minimapScrollIndicator) {
          this.initializeScrollIndicator();
        }
        if (this.displayPluginsControls) {
          this.initializeOpenQuickSettings();
        }
      }
    }

    //    ##     ## ########  ########     ###    ######## ########
    //    ##     ## ##     ## ##     ##   ## ##      ##    ##
    //    ##     ## ##     ## ##     ##  ##   ##     ##    ##
    //    ##     ## ########  ##     ## ##     ##    ##    ######
    //    ##     ## ##        ##     ## #########    ##    ##
    //    ##     ## ##        ##     ## ##     ##    ##    ##
    //     #######  ##        ########  ##     ##    ##    ########

    /**
     * Requests an update to be performed on the next frame.
     */
  }, {
    key: 'requestUpdate',
    value: function requestUpdate() {
      var _this7 = this;

      if (this.frameRequested) {
        return;
      }

      this.frameRequested = true;
      requestAnimationFrame(function () {
        _this7.update();
        _this7.frameRequested = false;
      });
    }

    /**
     * Requests an update to be performed on the next frame that will completely
     * redraw the minimap.
     */
  }, {
    key: 'requestForcedUpdate',
    value: function requestForcedUpdate() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      this.requestUpdate();
    }

    /**
     * Performs the actual MinimapElement update.
     *
     * @access private
     */
  }, {
    key: 'update',
    value: function update() {
      if (!(this.attached && this.isVisible() && this.minimap)) {
        return;
      }
      var minimap = this.minimap;
      minimap.enableCache();
      var canvas = this.getFrontCanvas();

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var visibleAreaLeft = minimap.getTextEditorScaledScrollLeft();
      var visibleAreaTop = minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop();
      var visibleWidth = Math.min(canvas.width / devicePixelRatio, this.width);

      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }

      if (SPEC_MODE) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }

      this.applyStyles(this.controls, { width: visibleWidth + 'px' });

      var canvasTop = minimap.getFirstVisibleScreenRow() * minimap.getLineHeight() - minimap.getScrollTop();

      var canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += ' ' + this.makeScale(1 / devicePixelRatio);
      }

      if (SPEC_MODE) {
        this.applyStyles(this.backLayer.canvas, { top: canvasTop + 'px' });
        this.applyStyles(this.tokensLayer.canvas, { top: canvasTop + 'px' });
        this.applyStyles(this.frontLayer.canvas, { top: canvasTop + 'px' });
      } else {
        this.applyStyles(this.backLayer.canvas, { transform: canvasTransform });
        this.applyStyles(this.tokensLayer.canvas, { transform: canvasTransform });
        this.applyStyles(this.frontLayer.canvas, { transform: canvasTransform });
      }

      if (this.minimapScrollIndicator && minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }

      if (this.scrollIndicator != null) {
        var minimapScreenHeight = minimap.getScreenHeight();
        var indicatorHeight = minimapScreenHeight * (minimapScreenHeight / minimap.getHeight());
        var indicatorScroll = (minimapScreenHeight - indicatorHeight) * minimap.getCapedTextEditorScrollRatio();

        if (SPEC_MODE) {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            top: indicatorScroll + 'px'
          });
        } else {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            transform: this.makeTranslate(0, indicatorScroll)
          });
        }

        if (!minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }

      this.updateCanvas();
      minimap.clearCache();
    }

    /**
     * Defines whether to render the code highlights or not.
     *
     * @param {Boolean} displayCodeHighlights whether to render the code
     *                                        highlights or not
     */
  }, {
    key: 'setDisplayCodeHighlights',
    value: function setDisplayCodeHighlights(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        this.requestForcedUpdate();
      }
    }

    /**
     * Polling callback used to detect visibility and size changes.
     *
     * @access private
     */
  }, {
    key: 'pollDOM',
    value: function pollDOM() {
      var visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }

        this.measureHeightAndWidth(visibilityChanged, false);
      }
    }

    /**
     * A method that checks for visibility changes in the MinimapElement.
     * The method returns `true` when the visibility changed from visible to
     * hidden or from hidden to visible.
     *
     * @return {boolean} whether the visibility changed or not since the last call
     * @access private
     */
  }, {
    key: 'checkForVisibilityChange',
    value: function checkForVisibilityChange() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          this.wasVisible = true;
          return this.wasVisible;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          this.wasVisible = false;
          return this.wasVisible;
        }
      }
    }

    /**
     * A method used to measure the size of the MinimapElement and update internal
     * components based on the new size.
     *
     * @param  {boolean} visibilityChanged did the visibility changed since last
     *                                     measurement
     * @param  {[type]} [forceUpdate=true] forces the update even when no changes
     *                                     were detected
     * @access private
     */
  }, {
    key: 'measureHeightAndWidth',
    value: function measureHeightAndWidth(visibilityChanged) {
      var forceUpdate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!this.minimap) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;

      this.height = this.clientHeight;
      this.width = this.clientWidth;
      var canvasWidth = this.width;

      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }

      if (!this.isVisible()) {
        return;
      }

      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          var lineLength = atom.config.get('editor.preferredLineLength');
          var softWrap = atom.config.get('editor.softWrap');
          var softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          var width = lineLength * this.minimap.getCharWidth();

          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
        }

        var canvas = this.getFrontCanvas();
        if (canvasWidth !== canvas.width || this.height !== canvas.height) {
          this.setCanvasesSize(canvasWidth * devicePixelRatio, (this.height + this.minimap.getLineHeight()) * devicePixelRatio);
        }
      }
    }

    //    ######## ##     ## ######## ##    ## ########  ######
    //    ##       ##     ## ##       ###   ##    ##    ##    ##
    //    ##       ##     ## ##       ####  ##    ##    ##
    //    ######   ##     ## ######   ## ## ##    ##     ######
    //    ##        ##   ##  ##       ##  ####    ##          ##
    //    ##         ## ##   ##       ##   ###    ##    ##    ##
    //    ########    ###    ######## ##    ##    ##     ######

    /**
     * Helper method to register config observers.
     *
     * @param  {Object} configs={} an object mapping the config name to observe
     *                             with the function to call back when a change
     *                             occurs
     * @access private
     */
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var configs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      for (var config in configs) {
        this.subscriptions.add(atom.config.observe(config, configs[config]));
      }
    }

    /**
     * Callback triggered when the mouse is pressed on the MinimapElement canvas.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'canvasPressed',
    value: function canvasPressed(_ref) {
      var y = _ref.y;
      var isLeftMouse = _ref.isLeftMouse;
      var isMiddleMouse = _ref.isMiddleMouse;

      if (this.minimap.isStandAlone()) {
        return;
      }
      if (isLeftMouse) {
        this.canvasLeftMousePressed(y);
      } else if (isMiddleMouse) {
        this.canvasMiddleMousePressed(y);

        var _visibleArea$getBoundingClientRect = this.visibleArea.getBoundingClientRect();

        var _top2 = _visibleArea$getBoundingClientRect.top;
        var height = _visibleArea$getBoundingClientRect.height;

        this.startDrag({ y: _top2 + height / 2, isLeftMouse: false, isMiddleMouse: true });
      }
    }

    /**
     * Callback triggered when the mouse left button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @param  {HTMLElement} e.target the source of the event
     * @access private
     */
  }, {
    key: 'canvasLeftMousePressed',
    value: function canvasLeftMousePressed(y) {
      var _this8 = this;

      var deltaY = y - this.getBoundingClientRect().top;
      var row = Math.floor(deltaY / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();

      var textEditor = this.minimap.getTextEditor();

      var scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;

      if (atom.config.get('minimap.scrollAnimation')) {
        var from = this.minimap.getTextEditorScrollTop();
        var to = scrollTop;
        var step = function step(now) {
          return _this8.minimap.setTextEditorScrollTop(now);
        };
        var duration = atom.config.get('minimap.scrollAnimationDuration');
        this.animate({ from: from, to: to, duration: duration, step: step });
      } else {
        this.minimap.setTextEditorScrollTop(scrollTop);
      }
    }

    /**
     * Callback triggered when the mouse middle button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @access private
     */
  }, {
    key: 'canvasMiddleMousePressed',
    value: function canvasMiddleMousePressed(y) {
      var _getBoundingClientRect = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect.top;

      var deltaY = y - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * A method that relays the `mousewheel` events received by the MinimapElement
     * to the `TextEditorElement`.
     *
     * @param  {MouseEvent} e the mouse event object
     * @access private
     */
  }, {
    key: 'relayMousewheelEvent',
    value: function relayMousewheelEvent(e) {
      this.getTextEditorElement().component.onMouseWheel(e);
    }

    /**
     * A method that extracts data from a `MouseEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractTouchEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {MouseEvent} mouseEvent the mouse event object
     * @access private
     */
  }, {
    key: 'extractMouseEventData',
    value: function extractMouseEventData(mouseEvent) {
      return {
        x: mouseEvent.pageX,
        y: mouseEvent.pageY,
        isLeftMouse: mouseEvent.which === 1,
        isMiddleMouse: mouseEvent.which === 2
      };
    }

    /**
     * A method that extracts data from a `TouchEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractMouseEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {TouchEvent} touchEvent the touch event object
     * @access private
     */
  }, {
    key: 'extractTouchEventData',
    value: function extractTouchEventData(touchEvent) {
      // Use the first touch on the target area. Other touches will be ignored in
      // case of multi-touch.
      var touch = touchEvent.changedTouches[0];

      return {
        x: touch.pageX,
        y: touch.pageY,
        isLeftMouse: true, // Touch is treated like a left mouse button click
        isMiddleMouse: false
      };
    }

    //    ########    ####    ########
    //    ##     ##  ##  ##   ##     ##
    //    ##     ##   ####    ##     ##
    //    ##     ##  ####     ##     ##
    //    ##     ## ##  ## ## ##     ##
    //    ##     ## ##   ##   ##     ##
    //    ########   ####  ## ########

    /**
     * A method triggered when the mouse is pressed over the visible area that
     * starts the dragging gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'startDrag',
    value: function startDrag(_ref2) {
      var _this9 = this;

      var y = _ref2.y;
      var isLeftMouse = _ref2.isLeftMouse;
      var isMiddleMouse = _ref2.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }

      var _visibleArea$getBoundingClientRect2 = this.visibleArea.getBoundingClientRect();

      var top = _visibleArea$getBoundingClientRect2.top;

      var _getBoundingClientRect2 = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect2.top;

      var dragOffset = y - top;

      var initial = { dragOffset: dragOffset, offsetTop: offsetTop };

      var mousemoveHandler = function mousemoveHandler(e) {
        return _this9.drag(_this9.extractMouseEventData(e), initial);
      };
      var mouseupHandler = function mouseupHandler(e) {
        return _this9.endDrag();
      };

      var touchmoveHandler = function touchmoveHandler(e) {
        return _this9.drag(_this9.extractTouchEventData(e), initial);
      };
      var touchendHandler = function touchendHandler(e) {
        return _this9.endDrag();
      };

      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);

      document.body.addEventListener('touchmove', touchmoveHandler);
      document.body.addEventListener('touchend', touchendHandler);
      document.body.addEventListener('touchcancel', touchendHandler);

      this.dragSubscription = new _atom.Disposable(function () {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);

        document.body.removeEventListener('touchmove', touchmoveHandler);
        document.body.removeEventListener('touchend', touchendHandler);
        document.body.removeEventListener('touchcancel', touchendHandler);
      });
    }

    /**
     * The method called during the drag gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @param  {number} initial.dragOffset the mouse offset within the visible
     *                                     area
     * @param  {number} initial.offsetTop the MinimapElement offset at the moment
     *                                    of the drag start
     * @access private
     */
  }, {
    key: 'drag',
    value: function drag(_ref3, initial) {
      var y = _ref3.y;
      var isLeftMouse = _ref3.isLeftMouse;
      var isMiddleMouse = _ref3.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }
      var deltaY = y - initial.offsetTop - initial.dragOffset;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * The method that ends the drag gesture.
     *
     * @access private
     */
  }, {
    key: 'endDrag',
    value: function endDrag() {
      if (!this.minimap) {
        return;
      }
      this.dragSubscription.dispose();
    }

    //     ######   ######   ######
    //    ##    ## ##    ## ##    ##
    //    ##       ##       ##
    //    ##        ######   ######
    //    ##             ##       ##
    //    ##    ## ##    ## ##    ##
    //     ######   ######   ######

    /**
     * Applies the passed-in styles properties to the specified element
     *
     * @param  {HTMLElement} element the element onto which apply the styles
     * @param  {Object} styles the styles to apply
     * @access private
     */
  }, {
    key: 'applyStyles',
    value: function applyStyles(element, styles) {
      if (!element) {
        return;
      }

      var cssText = '';
      for (var property in styles) {
        cssText += property + ': ' + styles[property] + '; ';
      }

      element.style.cssText = cssText;
    }

    /**
     * Returns a string with a CSS translation tranform value.
     *
     * @param  {number} [x = 0] the x offset of the translation
     * @param  {number} [y = 0] the y offset of the translation
     * @return {string} the CSS translation string
     * @access private
     */
  }, {
    key: 'makeTranslate',
    value: function makeTranslate() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.useHardwareAcceleration) {
        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      } else {
        return 'translate(' + x + 'px, ' + y + 'px)';
      }
    }

    /**
     * Returns a string with a CSS scaling tranform value.
     *
     * @param  {number} [x = 0] the x scaling factor
     * @param  {number} [y = 0] the y scaling factor
     * @return {string} the CSS scaling string
     * @access private
     */
  }, {
    key: 'makeScale',
    value: function makeScale() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? x : arguments[1];
      return (function () {
        if (this.useHardwareAcceleration) {
          return 'scale3d(' + x + ', ' + y + ', 1)';
        } else {
          return 'scale(' + x + ', ' + y + ')';
        }
      }).apply(this, arguments);
    }

    /**
     * A method that return the current time as a Date.
     *
     * That method exist so that we can mock it in tests.
     *
     * @return {Date} the current time as Date
     * @access private
     */
  }, {
    key: 'getTime',
    value: function getTime() {
      return new Date();
    }

    /**
     * A method that mimic the jQuery `animate` method and used to animate the
     * scroll when clicking on the MinimapElement canvas.
     *
     * @param  {Object} param the animation data object
     * @param  {[type]} param.from the start value
     * @param  {[type]} param.to the end value
     * @param  {[type]} param.duration the animation duration
     * @param  {[type]} param.step the easing function for the animation
     * @access private
     */
  }, {
    key: 'animate',
    value: function animate(_ref4) {
      var _this10 = this;

      var from = _ref4.from;
      var to = _ref4.to;
      var duration = _ref4.duration;
      var step = _ref4.step;

      var progress = undefined;
      var start = this.getTime();

      var swing = function swing(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };

      var update = function update() {
        if (!_this10.minimap) {
          return;
        }

        var passed = _this10.getTime() - start;
        if (duration === 0) {
          progress = 1;
        } else {
          progress = passed / duration;
        }
        if (progress > 1) {
          progress = 1;
        }
        var delta = swing(progress);
        step(from + (to - from) * delta);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      update();
    }
  }], [{
    key: 'registerViewProvider',

    /**
     * The method that registers the MinimapElement factory in the
     * `atom.views` registry with the Minimap model.
     */
    value: function registerViewProvider(Minimap) {
      atom.views.addViewProvider(Minimap, function (model) {
        var element = new MinimapElement();
        element.setModel(model);
        return element;
      });
    }
  }]);

  var _MinimapElement = MinimapElement;
  MinimapElement = (0, _decoratorsInclude2['default'])(_mixinsDomStylesReader2['default'], _mixinsCanvasDrawer2['default'], _atomUtils.EventsDelegation, _atomUtils.AncestorsMethods)(MinimapElement) || MinimapElement;
  MinimapElement = (0, _decoratorsElement2['default'])('atom-text-editor-minimap')(MinimapElement) || MinimapElement;
  return MinimapElement;
})();

exports['default'] = MinimapElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUU4QyxNQUFNOzt5QkFDSCxZQUFZOztpQ0FDekMsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7cUNBQ2QsNEJBQTRCOzs7O2tDQUMvQix3QkFBd0I7Ozs7MkNBQ1Qsa0NBQWtDOzs7O0FBUjFFLFdBQVcsQ0FBQTs7QUFVWCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JkLGNBQWM7V0FBZCxjQUFjOzs7O2VBQWQsY0FBYzs7Ozs7Ozs7Ozs7Ozs7OztXQTJCakIsMkJBQUc7Ozs7Ozs7O0FBTWpCLFVBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXhCLFVBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTlCLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXRCLFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBOzs7Ozs7O0FBT3ZCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7Ozs7QUFJOUMsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQTs7OztBQUl4QyxVQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTFDLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJakMsVUFBSSxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQTs7Ozs7OztBQU83QyxVQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFBOzs7O0FBSWpDLFVBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJdkMsVUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQTs7OztBQUlyQyxVQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFB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QTtLQUNUOzs7Ozs7OztXQWhyQzJCLDhCQUFDLE9BQU8sRUFBRTtBQUNwQyxVQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDbkQsWUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQTtBQUNsQyxlQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3ZCLGVBQU8sT0FBTyxDQUFBO09BQ2YsQ0FBQyxDQUFBO0tBQ0g7Ozt3QkFaa0IsY0FBYztBQUFkLGdCQUFjLEdBRGxDLGtLQUEwRSxDQUN0RCxjQUFjLEtBQWQsY0FBYztBQUFkLGdCQUFjLEdBRmxDLG9DQUFRLDBCQUEwQixDQUFDLENBRWYsY0FBYyxLQUFkLGNBQWM7U0FBZCxjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0V2ZW50c0RlbGVnYXRpb24sIEFuY2VzdG9yc01ldGhvZHN9IGZyb20gJ2F0b20tdXRpbHMnXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBlbGVtZW50IGZyb20gJy4vZGVjb3JhdG9ycy9lbGVtZW50J1xuaW1wb3J0IERPTVN0eWxlc1JlYWRlciBmcm9tICcuL21peGlucy9kb20tc3R5bGVzLXJlYWRlcidcbmltcG9ydCBDYW52YXNEcmF3ZXIgZnJvbSAnLi9taXhpbnMvY2FudmFzLWRyYXdlcidcbmltcG9ydCBNaW5pbWFwUXVpY2tTZXR0aW5nc0VsZW1lbnQgZnJvbSAnLi9taW5pbWFwLXF1aWNrLXNldHRpbmdzLWVsZW1lbnQnXG5cbmNvbnN0IFNQRUNfTU9ERSA9IGF0b20uaW5TcGVjTW9kZSgpXG5cbi8qKlxuICogUHVibGljOiBUaGUgTWluaW1hcEVsZW1lbnQgaXMgdGhlIHZpZXcgbWVhbnQgdG8gcmVuZGVyIGEge0BsaW5rIE1pbmltYXB9XG4gKiBpbnN0YW5jZSBpbiB0aGUgRE9NLlxuICpcbiAqIFlvdSBjYW4gcmV0cmlldmUgdGhlIE1pbmltYXBFbGVtZW50IGFzc29jaWF0ZWQgdG8gYSBNaW5pbWFwXG4gKiB1c2luZyB0aGUgYGF0b20udmlld3MuZ2V0Vmlld2AgbWV0aG9kLlxuICpcbiAqIE5vdGUgdGhhdCBtb3N0IGludGVyYWN0aW9ucyB3aXRoIHRoZSBNaW5pbWFwIHBhY2thZ2UgaXMgZG9uZSB0aHJvdWdoIHRoZVxuICogTWluaW1hcCBtb2RlbCBzbyB5b3Ugc2hvdWxkIG5ldmVyIGhhdmUgdG8gYWNjZXNzIE1pbmltYXBFbGVtZW50XG4gKiBpbnN0YW5jZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuICovXG5AZWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJylcbkBpbmNsdWRlKERPTVN0eWxlc1JlYWRlciwgQ2FudmFzRHJhd2VyLCBFdmVudHNEZWxlZ2F0aW9uLCBBbmNlc3RvcnNNZXRob2RzKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRoYXQgcmVnaXN0ZXJzIHRoZSBNaW5pbWFwRWxlbWVudCBmYWN0b3J5IGluIHRoZVxuICAgKiBgYXRvbS52aWV3c2AgcmVnaXN0cnkgd2l0aCB0aGUgTWluaW1hcCBtb2RlbC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlclZpZXdQcm92aWRlciAoTWluaW1hcCkge1xuICAgIGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKE1pbmltYXAsIGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSBuZXcgTWluaW1hcEVsZW1lbnQoKVxuICAgICAgZWxlbWVudC5zZXRNb2RlbChtb2RlbClcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfSlcbiAgfVxuXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyMjIyAgICMjIyMjIyMgICMjICAgICMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAjIyAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICMjICAgIyNcbiAgLy8gICAgIyMjIyMjIyMjICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMgICAgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgIyMgICAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICMjICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAgIyMjIyMjXG5cbiAgLyoqXG4gICAqIERPTSBjYWxsYmFjayBpbnZva2VkIHdoZW4gYSBuZXcgTWluaW1hcEVsZW1lbnQgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2sgKCkge1xuICAgIC8vIENvcmUgcHJvcGVydGllc1xuXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5taW5pbWFwID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lZGl0b3JFbGVtZW50ID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gdW5kZWZpbmVkXG5cbiAgICAvLyBTdWJzY3JpcHRpb25zXG5cbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub3BlblF1aWNrU2V0dGluZ1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuXG4gICAgLy8gQ29uZmlnc1xuXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuZGlzcGxheU1pbmltYXBPbkxlZnQgPSBmYWxzZVxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLm1pbmltYXBTY3JvbGxJbmRpY2F0b3IgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy50ZXh0T3BhY2l0eSA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmFkanVzdFRvU29mdFdyYXAgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy51c2VIYXJkd2FyZUFjY2VsZXJhdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmFic29sdXRlTW9kZSA9IHVuZGVmaW5lZFxuXG4gICAgLy8gRWxlbWVudHNcblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2hhZG93Um9vdCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudmlzaWJsZUFyZWEgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbnRyb2xzID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zY3JvbGxJbmRpY2F0b3IgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudCA9IHVuZGVmaW5lZFxuXG4gICAgLy8gU3RhdGVzXG5cbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5hdHRhY2hlZCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmF0dGFjaGVkVG9UZXh0RWRpdG9yID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuc3RhbmRBbG9uZSA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2FzVmlzaWJsZSA9IHVuZGVmaW5lZFxuXG4gICAgLy8gT3RoZXJcblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuRmlyc3RSb3cgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9mZnNjcmVlbkxhc3RSb3cgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lUmVxdWVzdGVkID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5mbGV4QmFzaXMgPSB1bmRlZmluZWRcblxuICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRlbnQoKVxuXG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZUNvbmZpZyh7XG4gICAgICAnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCc6IChkaXNwbGF5TWluaW1hcE9uTGVmdCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlNaW5pbWFwT25MZWZ0ID0gZGlzcGxheU1pbmltYXBPbkxlZnRcblxuICAgICAgICB0aGlzLnVwZGF0ZU1pbmltYXBGbGV4UG9zaXRpb24oKVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAubWluaW1hcFNjcm9sbEluZGljYXRvcic6IChtaW5pbWFwU2Nyb2xsSW5kaWNhdG9yKSA9PiB7XG4gICAgICAgIHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvciA9IG1pbmltYXBTY3JvbGxJbmRpY2F0b3JcblxuICAgICAgICBpZiAodGhpcy5taW5pbWFwU2Nyb2xsSW5kaWNhdG9yICYmICEodGhpcy5zY3JvbGxJbmRpY2F0b3IgIT0gbnVsbCkgJiYgIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvcigpXG4gICAgICAgIH0gZWxzZSBpZiAoKHRoaXMuc2Nyb2xsSW5kaWNhdG9yICE9IG51bGwpKSB7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlU2Nyb2xsSW5kaWNhdG9yKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMucmVxdWVzdFVwZGF0ZSgpIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnOiAoZGlzcGxheVBsdWdpbnNDb250cm9scykgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMgPSBkaXNwbGF5UGx1Z2luc0NvbnRyb2xzXG5cbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBsdWdpbnNDb250cm9scyAmJiAhKHRoaXMub3BlblF1aWNrU2V0dGluZ3MgIT0gbnVsbCkgJiYgIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9wZW5RdWlja1NldHRpbmdzKClcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5vcGVuUXVpY2tTZXR0aW5ncyAhPSBudWxsKSkge1xuICAgICAgICAgIHRoaXMuZGlzcG9zZU9wZW5RdWlja1NldHRpbmdzKClcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAudGV4dE9wYWNpdHknOiAodGV4dE9wYWNpdHkpID0+IHtcbiAgICAgICAgdGhpcy50ZXh0T3BhY2l0eSA9IHRleHRPcGFjaXR5XG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKCkgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAuZGlzcGxheUNvZGVIaWdobGlnaHRzJzogKGRpc3BsYXlDb2RlSGlnaGxpZ2h0cykgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA9IGRpc3BsYXlDb2RlSGlnaGxpZ2h0c1xuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLmFkanVzdE1pbmltYXBXaWR0aFRvU29mdFdyYXAnOiAoYWRqdXN0VG9Tb2Z0V3JhcCkgPT4ge1xuICAgICAgICB0aGlzLmFkanVzdFRvU29mdFdyYXAgPSBhZGp1c3RUb1NvZnRXcmFwXG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5tZWFzdXJlSGVpZ2h0QW5kV2lkdGgoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC51c2VIYXJkd2FyZUFjY2VsZXJhdGlvbic6ICh1c2VIYXJkd2FyZUFjY2VsZXJhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uID0gdXNlSGFyZHdhcmVBY2NlbGVyYXRpb25cblxuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC5hYnNvbHV0ZU1vZGUnOiAoYWJzb2x1dGVNb2RlKSA9PiB7XG4gICAgICAgIHRoaXMuYWJzb2x1dGVNb2RlID0gYWJzb2x1dGVNb2RlXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWJzb2x1dGUnLCB0aGlzLmFic29sdXRlTW9kZSlcbiAgICAgIH0sXG5cbiAgICAgICdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCc6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5tZWFzdXJlSGVpZ2h0QW5kV2lkdGgoKSB9XG4gICAgICB9LFxuXG4gICAgICAnZWRpdG9yLnNvZnRXcmFwJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnZWRpdG9yLnNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBET00gY2FsbGJhY2sgaW52b2tlZCB3aGVuIGEgbmV3IE1pbmltYXBFbGVtZW50IGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnZpZXdzLnBvbGxEb2N1bWVudCgoKSA9PiB7IHRoaXMucG9sbERPTSgpIH0pKVxuICAgIHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKClcbiAgICB0aGlzLnVwZGF0ZU1pbmltYXBGbGV4UG9zaXRpb24oKVxuICAgIHRoaXMuYXR0YWNoZWQgPSB0cnVlXG4gICAgdGhpcy5hdHRhY2hlZFRvVGV4dEVkaXRvciA9IHRoaXMucGFyZW50Tm9kZSA9PT0gdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudFJvb3QoKVxuXG4gICAgLypcbiAgICAgIFdlIHVzZSBgYXRvbS5zdHlsZXMub25EaWRBZGRTdHlsZUVsZW1lbnRgIGluc3RlYWQgb2ZcbiAgICAgIGBhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lc2AuXG4gICAgICBXaHk/IEN1cnJlbnRseSwgVGhlIHN0eWxlIGVsZW1lbnQgd2lsbCBiZSByZW1vdmVkIGZpcnN0LCBhbmQgdGhlbiByZS1hZGRlZFxuICAgICAgYW5kIHRoZSBgY2hhbmdlYCBldmVudCBoYXMgbm90IGJlIHRyaWdnZXJlZCBpbiB0aGUgcHJvY2Vzcy5cbiAgICAqL1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uc3R5bGVzLm9uRGlkQWRkU3R5bGVFbGVtZW50KCgpID0+IHtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZURPTVN0eWxlc0NhY2hlKClcbiAgICAgIHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpXG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogRE9NIGNhbGxiYWNrIGludm9rZWQgd2hlbiBhIG5ldyBNaW5pbWFwRWxlbWVudCBpcyBkZXRhY2hlZCBmcm9tIHRoZSBET00uXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZGV0YWNoZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlXG4gIH1cblxuICAvLyAgICAgICAjIyMgICAgIyMjIyMjIyMgIyMjIyMjIyMgICAgIyMjICAgICAjIyMjIyMgICMjICAgICAjI1xuICAvLyAgICAgICMjICMjICAgICAgIyMgICAgICAgIyMgICAgICAjIyAjIyAgICMjICAgICMjICMjICAgICAjI1xuICAvLyAgICAgIyMgICAjIyAgICAgIyMgICAgICAgIyMgICAgICMjICAgIyMgICMjICAgICAgICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjIyMjIyMjI1xuICAvLyAgICAjIyMjIyMjIyMgICAgIyMgICAgICAgIyMgICAgIyMjIyMjIyMjICMjICAgICAgICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICMjICMjICAgICMjICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgIyMgICAgICMjICAjIyMjIyMgICMjICAgICAjI1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIE1pbmltYXBFbGVtZW50IGlzIGN1cnJlbnRseSB2aXNpYmxlIG9uIHNjcmVlbiBvciBub3QuXG4gICAqXG4gICAqIFRoZSB2aXNpYmlsaXR5IG9mIHRoZSBtaW5pbWFwIGlzIGRlZmluZWQgYnkgdGVzdGluZyB0aGUgc2l6ZSBvZiB0aGUgb2Zmc2V0XG4gICAqIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIE1pbmltYXBFbGVtZW50IGlzIGN1cnJlbnRseSB2aXNpYmxlIG9yIG5vdFxuICAgKi9cbiAgaXNWaXNpYmxlICgpIHsgcmV0dXJuIHRoaXMub2Zmc2V0V2lkdGggPiAwIHx8IHRoaXMub2Zmc2V0SGVpZ2h0ID4gMCB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBNaW5pbWFwRWxlbWVudCB0byB0aGUgRE9NLlxuICAgKlxuICAgKiBUaGUgcG9zaXRpb24gYXQgd2hpY2ggdGhlIGVsZW1lbnQgaXMgYXR0YWNoZWQgaXMgZGVmaW5lZCBieSB0aGVcbiAgICogYGRpc3BsYXlNaW5pbWFwT25MZWZ0YCBzZXR0aW5nLlxuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gW3BhcmVudF0gdGhlIERPTSBub2RlIHdoZXJlIGF0dGFjaGluZyB0aGUgbWluaW1hcFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFxuICAgKi9cbiAgYXR0YWNoIChwYXJlbnQpIHtcbiAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyByZXR1cm4gfVxuICAgIChwYXJlbnQgfHwgdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudFJvb3QoKSkuYXBwZW5kQ2hpbGQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRhY2hlcyB0aGUgTWluaW1hcEVsZW1lbnQgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgZGV0YWNoICgpIHtcbiAgICBpZiAoIXRoaXMuYXR0YWNoZWQgfHwgdGhpcy5wYXJlbnROb2RlID09IG51bGwpIHsgcmV0dXJuIH1cbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBtaW5pbWFwIGxlZnQvcmlnaHQgcG9zaXRpb24gYmFzZWQgb24gdGhlIHZhbHVlIG9mIHRoZVxuICAgKiBgZGlzcGxheU1pbmltYXBPbkxlZnRgIHNldHRpbmcuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlTWluaW1hcEZsZXhQb3NpdGlvbiAoKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdsZWZ0JywgdGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdClcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGlzIE1pbmltYXBFbGVtZW50XG4gICAqL1xuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5kZXRhY2goKVxuICAgIHRoaXMubWluaW1hcCA9IG51bGxcbiAgfVxuXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAjIyAjIyMjIyMjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMjICAgIyMgICAgIyMgICAgIyMgICAgICAgIyMjICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjIyMgICMjICAgICMjICAgICMjICAgICAgICMjIyMgICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAjIyAjIyAgICAjIyAgICAjIyMjIyMgICAjIyAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICMjIyMgICAgIyMgICAgIyMgICAgICAgIyMgICMjIyMgICAgIyNcbiAgLy8gICAgIyMgICAgIyMgIyMgICAgICMjICMjICAgIyMjICAgICMjICAgICMjICAgICAgICMjICAgIyMjICAgICMjXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAgICAjIyAgICAjIyMjIyMjIyAjIyAgICAjIyAgICAjI1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBNaW5pbWFwRWxlbWVudCBhbmQgYXR0YWNoZXMgdGhlIG1vdXNlIGNvbnRyb2xcbiAgICogZXZlbnQgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemVDb250ZW50ICgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVDYW52YXMoKVxuXG4gICAgdGhpcy5zaGFkb3dSb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KClcbiAgICB0aGlzLmF0dGFjaENhbnZhc2VzKHRoaXMuc2hhZG93Um9vdClcblxuICAgIHRoaXMuY3JlYXRlVmlzaWJsZUFyZWEoKVxuICAgIHRoaXMuY3JlYXRlQ29udHJvbHMoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMsIHtcbiAgICAgICdtb3VzZXdoZWVsJzogKGUpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUpIHsgdGhpcy5yZWxheU1vdXNld2hlZWxFdmVudChlKSB9XG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcy5nZXRGcm9udENhbnZhcygpLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHsgdGhpcy5jYW52YXNQcmVzc2VkKHRoaXMuZXh0cmFjdE1vdXNlRXZlbnREYXRhKGUpKSB9LFxuICAgICAgJ3RvdWNoc3RhcnQnOiAoZSkgPT4geyB0aGlzLmNhbnZhc1ByZXNzZWQodGhpcy5leHRyYWN0VG91Y2hFdmVudERhdGEoZSkpIH1cbiAgICB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgdmlzaWJsZSBhcmVhIGRpdi5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVWaXNpYmxlQXJlYSAoKSB7XG4gICAgaWYgKHRoaXMudmlzaWJsZUFyZWEpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMudmlzaWJsZUFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMudmlzaWJsZUFyZWEuY2xhc3NMaXN0LmFkZCgnbWluaW1hcC12aXNpYmxlLWFyZWEnKVxuICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0aGlzLnZpc2libGVBcmVhKVxuICAgIHRoaXMudmlzaWJsZUFyZWFTdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZVRvKHRoaXMudmlzaWJsZUFyZWEsIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4geyB0aGlzLnN0YXJ0RHJhZyh0aGlzLmV4dHJhY3RNb3VzZUV2ZW50RGF0YShlKSkgfSxcbiAgICAgICd0b3VjaHN0YXJ0JzogKGUpID0+IHsgdGhpcy5zdGFydERyYWcodGhpcy5leHRyYWN0VG91Y2hFdmVudERhdGEoZSkpIH1cbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHZpc2libGUgYXJlYSBkaXYuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlVmlzaWJsZUFyZWEgKCkge1xuICAgIGlmICghdGhpcy52aXNpYmxlQXJlYSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZSh0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uKVxuICAgIHRoaXMudmlzaWJsZUFyZWFTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgdGhpcy5zaGFkb3dSb290LnJlbW92ZUNoaWxkKHRoaXMudmlzaWJsZUFyZWEpXG4gICAgZGVsZXRlIHRoaXMudmlzaWJsZUFyZWFcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBjb250cm9scyBjb250YWluZXIgZGl2LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNyZWF0ZUNvbnRyb2xzICgpIHtcbiAgICBpZiAodGhpcy5jb250cm9scyB8fCB0aGlzLnN0YW5kQWxvbmUpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuY29udHJvbHMuY2xhc3NMaXN0LmFkZCgnbWluaW1hcC1jb250cm9scycpXG4gICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHMpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgY29udHJvbHMgY29udGFpbmVyIGRpdi5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICByZW1vdmVDb250cm9scyAoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnNoYWRvd1Jvb3QucmVtb3ZlQ2hpbGQodGhpcy5jb250cm9scylcbiAgICBkZWxldGUgdGhpcy5jb250cm9sc1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBzY3JvbGwgaW5kaWNhdG9yIGRpdiB3aGVuIHRoZSBgbWluaW1hcFNjcm9sbEluZGljYXRvcmBcbiAgICogc2V0dGluZ3MgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbml0aWFsaXplU2Nyb2xsSW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxJbmRpY2F0b3IgfHwgdGhpcy5zdGFuZEFsb25lKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnNjcm9sbEluZGljYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5zY3JvbGxJbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnbWluaW1hcC1zY3JvbGwtaW5kaWNhdG9yJylcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsSW5kaWNhdG9yKVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoZSBzY3JvbGwgaW5kaWNhdG9yIGRpdiB3aGVuIHRoZSBgbWluaW1hcFNjcm9sbEluZGljYXRvcmBcbiAgICogc2V0dGluZ3MgaXMgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZGlzcG9zZVNjcm9sbEluZGljYXRvciAoKSB7XG4gICAgaWYgKCF0aGlzLnNjcm9sbEluZGljYXRvcikgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5jb250cm9scy5yZW1vdmVDaGlsZCh0aGlzLnNjcm9sbEluZGljYXRvcilcbiAgICBkZWxldGUgdGhpcy5zY3JvbGxJbmRpY2F0b3JcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgcXVpY2sgc2V0dGluZ3Mgb3BlbmVuZXIgZGl2IHdoZW4gdGhlXG4gICAqIGBkaXNwbGF5UGx1Z2luc0NvbnRyb2xzYCBzZXR0aW5nIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZU9wZW5RdWlja1NldHRpbmdzICgpIHtcbiAgICBpZiAodGhpcy5vcGVuUXVpY2tTZXR0aW5ncyB8fCB0aGlzLnN0YW5kQWxvbmUpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMub3BlblF1aWNrU2V0dGluZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMub3BlblF1aWNrU2V0dGluZ3MuY2xhc3NMaXN0LmFkZCgnb3Blbi1taW5pbWFwLXF1aWNrLXNldHRpbmdzJylcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMub3BlblF1aWNrU2V0dGluZ3MpXG5cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdTdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZVRvKHRoaXMub3BlblF1aWNrU2V0dGluZ3MsIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgIGlmICgodGhpcy5xdWlja1NldHRpbmdzRWxlbWVudCAhPSBudWxsKSkge1xuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQuZGVzdHJveSgpXG4gICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgPSBuZXcgTWluaW1hcFF1aWNrU2V0dGluZ3NFbGVtZW50KClcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LnNldE1vZGVsKHRoaXMpXG4gICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzU3Vic2NyaXB0aW9uID0gdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudCA9IG51bGxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgbGV0IHt0b3AsIGxlZnQsIHJpZ2h0fSA9IHRoaXMuZ2V0RnJvbnRDYW52YXMoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQuc3R5bGUudG9wID0gdG9wICsgJ3B4J1xuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQuYXR0YWNoKClcblxuICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlNaW5pbWFwT25MZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LnN0eWxlLmxlZnQgPSAocmlnaHQpICsgJ3B4J1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LnN0eWxlLmxlZnQgPSAobGVmdCAtIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQuY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhlIHF1aWNrIHNldHRpbmdzIG9wZW5lbmVyIGRpdiB3aGVuIHRoZSBgZGlzcGxheVBsdWdpbnNDb250cm9sc2BcbiAgICogc2V0dGluZyBpcyBkaXNhYmxlZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkaXNwb3NlT3BlblF1aWNrU2V0dGluZ3MgKCkge1xuICAgIGlmICghdGhpcy5vcGVuUXVpY2tTZXR0aW5ncykgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5jb250cm9scy5yZW1vdmVDaGlsZCh0aGlzLm9wZW5RdWlja1NldHRpbmdzKVxuICAgIHRoaXMub3BlblF1aWNrU2V0dGluZ1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBkZWxldGUgdGhpcy5vcGVuUXVpY2tTZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRhcmdldCBgVGV4dEVkaXRvcmAgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge1RleHRFZGl0b3J9IHRoZSBtaW5pbWFwJ3MgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3IgKCkgeyByZXR1cm4gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3IoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAgZm9yIHRoZSBNaW5pbWFwJ3MgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yRWxlbWVudH0gdGhlIG1pbmltYXAncyB0ZXh0IGVkaXRvciBlbGVtZW50XG4gICAqL1xuICBnZXRUZXh0RWRpdG9yRWxlbWVudCAoKSB7XG4gICAgaWYgKHRoaXMuZWRpdG9yRWxlbWVudCkgeyByZXR1cm4gdGhpcy5lZGl0b3JFbGVtZW50IH1cblxuICAgIHRoaXMuZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmdldFRleHRFZGl0b3IoKSlcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JFbGVtZW50XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBvZiB0aGUgYFRleHRFZGl0b3JFbGVtZW50YCBjb250ZW50LlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBtb3N0bHkgdXNlZCB0byBlbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBgc2hhZG93RG9tYFxuICAgKiBzZXR0aW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gdGhlIHJvb3Qgb2YgdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAgY29udGVudFxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvckVsZW1lbnRSb290ICgpIHtcbiAgICBsZXQgZWRpdG9yRWxlbWVudCA9IHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnQoKVxuXG4gICAgaWYgKGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWRpdG9yRWxlbWVudFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IHdoZXJlIHRvIGluamVjdCB0aGUgZHVtbXkgbm9kZSB1c2VkIHRvIHJlYWQgRE9NIHN0eWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gc2hhZG93Um9vdCB3aGV0aGVyIHRvIHVzZSB0aGUgdGV4dCBlZGl0b3Igc2hhZG93IERPTVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIG5vdFxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gdGhlIHJvb3Qgbm9kZSB3aGVyZSBhcHBlbmRpbmcgdGhlIGR1bW15IG5vZGVcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBnZXREdW1teURPTVJvb3QgKHNoYWRvd1Jvb3QpIHtcbiAgICBpZiAoc2hhZG93Um9vdCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnRSb290KClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnQoKVxuICAgIH1cbiAgfVxuXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMjICMjXG4gIC8vICAgICMjIyAgICMjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjXG4gIC8vICAgICMjIyMgIyMjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjXG4gIC8vICAgICMjICMjIyAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIE1pbmltYXAgZm9yIHdoaWNoIHRoaXMgTWluaW1hcEVsZW1lbnQgd2FzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoaXMgZWxlbWVudCdzIE1pbmltYXBcbiAgICovXG4gIGdldE1vZGVsICgpIHsgcmV0dXJuIHRoaXMubWluaW1hcCB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIE1pbmltYXAgbW9kZWwgZm9yIHRoaXMgTWluaW1hcEVsZW1lbnQgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSAge01pbmltYXB9IG1pbmltYXAgdGhlIE1pbmltYXAgbW9kZWwgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoaXMgZWxlbWVudCdzIE1pbmltYXBcbiAgICovXG4gIHNldE1vZGVsIChtaW5pbWFwKSB7XG4gICAgdGhpcy5taW5pbWFwID0gbWluaW1hcFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKCgpID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm1pbmltYXAub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KCgpID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm1pbmltYXAub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm1pbmltYXAub25EaWRDaGFuZ2VDb25maWcoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgcmV0dXJuIHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpIH1cbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlU3RhbmRBbG9uZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YW5kQWxvbmUodGhpcy5taW5pbWFwLmlzU3RhbmRBbG9uZSgpKVxuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlKChjaGFuZ2UpID0+IHtcbiAgICAgIHRoaXMucGVuZGluZ0NoYW5nZXMucHVzaChjaGFuZ2UpXG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm1pbmltYXAub25EaWRDaGFuZ2VEZWNvcmF0aW9uUmFuZ2UoKGNoYW5nZSkgPT4ge1xuICAgICAgY29uc3Qge3R5cGV9ID0gY2hhbmdlXG4gICAgICBpZiAodHlwZSA9PT0gJ2xpbmUnIHx8IHR5cGUgPT09ICdoaWdobGlnaHQtdW5kZXInKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0JhY2tEZWNvcmF0aW9uQ2hhbmdlcy5wdXNoKGNoYW5nZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0Zyb250RGVjb3JhdGlvbkNoYW5nZXMucHVzaChjaGFuZ2UpXG4gICAgICB9XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zZXRTdGFuZEFsb25lKHRoaXMubWluaW1hcC5pc1N0YW5kQWxvbmUoKSlcblxuICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwgJiYgdGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5taW5pbWFwLnNldFNjcmVlbkhlaWdodEFuZFdpZHRoKHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1pbmltYXBcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGZvciB0aGlzIE1pbmltYXBFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YW5kQWxvbmUgdGhlIG5ldyBtb2RlIGZvciB0aGlzIE1pbmltYXBFbGVtZW50XG4gICAqL1xuICBzZXRTdGFuZEFsb25lIChzdGFuZEFsb25lKSB7XG4gICAgdGhpcy5zdGFuZEFsb25lID0gc3RhbmRBbG9uZVxuXG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3N0YW5kLWFsb25lJywgdHJ1ZSlcbiAgICAgIHRoaXMuZGlzcG9zZVNjcm9sbEluZGljYXRvcigpXG4gICAgICB0aGlzLmRpc3Bvc2VPcGVuUXVpY2tTZXR0aW5ncygpXG4gICAgICB0aGlzLnJlbW92ZUNvbnRyb2xzKClcbiAgICAgIHRoaXMucmVtb3ZlVmlzaWJsZUFyZWEoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnc3RhbmQtYWxvbmUnKVxuICAgICAgdGhpcy5jcmVhdGVWaXNpYmxlQXJlYSgpXG4gICAgICB0aGlzLmNyZWF0ZUNvbnRyb2xzKClcbiAgICAgIGlmICh0aGlzLm1pbmltYXBTY3JvbGxJbmRpY2F0b3IpIHsgdGhpcy5pbml0aWFsaXplU2Nyb2xsSW5kaWNhdG9yKCkgfVxuICAgICAgaWYgKHRoaXMuZGlzcGxheVBsdWdpbnNDb250cm9scykgeyB0aGlzLmluaXRpYWxpemVPcGVuUXVpY2tTZXR0aW5ncygpIH1cbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMjICAgICAjIyMgICAgIyMjIyMjIyMgIyMjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgICAjIyAjIyAgICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICAjIyAgICMjICAgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyMgICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAgIyMgICAgICMjICMjIyMjIyMjIyAgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyMgICAgIyNcbiAgLy8gICAgICMjIyMjIyMgICMjICAgICAgICAjIyMjIyMjIyAgIyMgICAgICMjICAgICMjICAgICMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGFuIHVwZGF0ZSB0byBiZSBwZXJmb3JtZWQgb24gdGhlIG5leHQgZnJhbWUuXG4gICAqL1xuICByZXF1ZXN0VXBkYXRlICgpIHtcbiAgICBpZiAodGhpcy5mcmFtZVJlcXVlc3RlZCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5mcmFtZVJlcXVlc3RlZCA9IHRydWVcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy5mcmFtZVJlcXVlc3RlZCA9IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0cyBhbiB1cGRhdGUgdG8gYmUgcGVyZm9ybWVkIG9uIHRoZSBuZXh0IGZyYW1lIHRoYXQgd2lsbCBjb21wbGV0ZWx5XG4gICAqIHJlZHJhdyB0aGUgbWluaW1hcC5cbiAgICovXG4gIHJlcXVlc3RGb3JjZWRVcGRhdGUgKCkge1xuICAgIHRoaXMub2Zmc2NyZWVuRmlyc3RSb3cgPSBudWxsXG4gICAgdGhpcy5vZmZzY3JlZW5MYXN0Um93ID0gbnVsbFxuICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIGFjdHVhbCBNaW5pbWFwRWxlbWVudCB1cGRhdGUuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlICgpIHtcbiAgICBpZiAoISh0aGlzLmF0dGFjaGVkICYmIHRoaXMuaXNWaXNpYmxlKCkgJiYgdGhpcy5taW5pbWFwKSkgeyByZXR1cm4gfVxuICAgIGxldCBtaW5pbWFwID0gdGhpcy5taW5pbWFwXG4gICAgbWluaW1hcC5lbmFibGVDYWNoZSgpXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuZ2V0RnJvbnRDYW52YXMoKVxuXG4gICAgY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHRoaXMubWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvKClcbiAgICBsZXQgdmlzaWJsZUFyZWFMZWZ0ID0gbWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsTGVmdCgpXG4gICAgbGV0IHZpc2libGVBcmVhVG9wID0gbWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsVG9wKCkgLSBtaW5pbWFwLmdldFNjcm9sbFRvcCgpXG4gICAgbGV0IHZpc2libGVXaWR0aCA9IE1hdGgubWluKGNhbnZhcy53aWR0aCAvIGRldmljZVBpeGVsUmF0aW8sIHRoaXMud2lkdGgpXG5cbiAgICBpZiAodGhpcy5hZGp1c3RUb1NvZnRXcmFwICYmIHRoaXMuZmxleEJhc2lzKSB7XG4gICAgICB0aGlzLnN0eWxlLmZsZXhCYXNpcyA9IHRoaXMuZmxleEJhc2lzICsgJ3B4J1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0eWxlLmZsZXhCYXNpcyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoU1BFQ19NT0RFKSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMudmlzaWJsZUFyZWEsIHtcbiAgICAgICAgd2lkdGg6IHZpc2libGVXaWR0aCArICdweCcsXG4gICAgICAgIGhlaWdodDogbWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkgKyAncHgnLFxuICAgICAgICB0b3A6IHZpc2libGVBcmVhVG9wICsgJ3B4JyxcbiAgICAgICAgbGVmdDogdmlzaWJsZUFyZWFMZWZ0ICsgJ3B4J1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnZpc2libGVBcmVhLCB7XG4gICAgICAgIHdpZHRoOiB2aXNpYmxlV2lkdGggKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCgpICsgJ3B4JyxcbiAgICAgICAgdHJhbnNmb3JtOiB0aGlzLm1ha2VUcmFuc2xhdGUodmlzaWJsZUFyZWFMZWZ0LCB2aXNpYmxlQXJlYVRvcClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmNvbnRyb2xzLCB7d2lkdGg6IHZpc2libGVXaWR0aCArICdweCd9KVxuXG4gICAgbGV0IGNhbnZhc1RvcCA9IG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkgKiBtaW5pbWFwLmdldExpbmVIZWlnaHQoKSAtIG1pbmltYXAuZ2V0U2Nyb2xsVG9wKClcblxuICAgIGxldCBjYW52YXNUcmFuc2Zvcm0gPSB0aGlzLm1ha2VUcmFuc2xhdGUoMCwgY2FudmFzVG9wKVxuICAgIGlmIChkZXZpY2VQaXhlbFJhdGlvICE9PSAxKSB7XG4gICAgICBjYW52YXNUcmFuc2Zvcm0gKz0gJyAnICsgdGhpcy5tYWtlU2NhbGUoMSAvIGRldmljZVBpeGVsUmF0aW8pXG4gICAgfVxuXG4gICAgaWYgKFNQRUNfTU9ERSkge1xuICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmJhY2tMYXllci5jYW52YXMsIHt0b3A6IGNhbnZhc1RvcCArICdweCd9KVxuICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnRva2Vuc0xheWVyLmNhbnZhcywge3RvcDogY2FudmFzVG9wICsgJ3B4J30pXG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuZnJvbnRMYXllci5jYW52YXMsIHt0b3A6IGNhbnZhc1RvcCArICdweCd9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuYmFja0xheWVyLmNhbnZhcywge3RyYW5zZm9ybTogY2FudmFzVHJhbnNmb3JtfSlcbiAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy50b2tlbnNMYXllci5jYW52YXMsIHt0cmFuc2Zvcm06IGNhbnZhc1RyYW5zZm9ybX0pXG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuZnJvbnRMYXllci5jYW52YXMsIHt0cmFuc2Zvcm06IGNhbnZhc1RyYW5zZm9ybX0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvciAmJiBtaW5pbWFwLmNhblNjcm9sbCgpICYmICF0aGlzLnNjcm9sbEluZGljYXRvcikge1xuICAgICAgdGhpcy5pbml0aWFsaXplU2Nyb2xsSW5kaWNhdG9yKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxJbmRpY2F0b3IgIT0gbnVsbCkge1xuICAgICAgbGV0IG1pbmltYXBTY3JlZW5IZWlnaHQgPSBtaW5pbWFwLmdldFNjcmVlbkhlaWdodCgpXG4gICAgICBsZXQgaW5kaWNhdG9ySGVpZ2h0ID0gbWluaW1hcFNjcmVlbkhlaWdodCAqIChtaW5pbWFwU2NyZWVuSGVpZ2h0IC8gbWluaW1hcC5nZXRIZWlnaHQoKSlcbiAgICAgIGxldCBpbmRpY2F0b3JTY3JvbGwgPSAobWluaW1hcFNjcmVlbkhlaWdodCAtIGluZGljYXRvckhlaWdodCkgKiBtaW5pbWFwLmdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvKClcblxuICAgICAgaWYgKFNQRUNfTU9ERSkge1xuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuc2Nyb2xsSW5kaWNhdG9yLCB7XG4gICAgICAgICAgaGVpZ2h0OiBpbmRpY2F0b3JIZWlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogaW5kaWNhdG9yU2Nyb2xsICsgJ3B4J1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnNjcm9sbEluZGljYXRvciwge1xuICAgICAgICAgIGhlaWdodDogaW5kaWNhdG9ySGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMubWFrZVRyYW5zbGF0ZSgwLCBpbmRpY2F0b3JTY3JvbGwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghbWluaW1hcC5jYW5TY3JvbGwoKSkgeyB0aGlzLmRpc3Bvc2VTY3JvbGxJbmRpY2F0b3IoKSB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDYW52YXMoKVxuICAgIG1pbmltYXAuY2xlYXJDYWNoZSgpXG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRvIHJlbmRlciB0aGUgY29kZSBoaWdobGlnaHRzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwbGF5Q29kZUhpZ2hsaWdodHMgd2hldGhlciB0byByZW5kZXIgdGhlIGNvZGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyBvciBub3RcbiAgICovXG4gIHNldERpc3BsYXlDb2RlSGlnaGxpZ2h0cyAoZGlzcGxheUNvZGVIaWdobGlnaHRzKSB7XG4gICAgdGhpcy5kaXNwbGF5Q29kZUhpZ2hsaWdodHMgPSBkaXNwbGF5Q29kZUhpZ2hsaWdodHNcbiAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG4gIH1cblxuICAvKipcbiAgICogUG9sbGluZyBjYWxsYmFjayB1c2VkIHRvIGRldGVjdCB2aXNpYmlsaXR5IGFuZCBzaXplIGNoYW5nZXMuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcG9sbERPTSAoKSB7XG4gICAgbGV0IHZpc2liaWxpdHlDaGFuZ2VkID0gdGhpcy5jaGVja0ZvclZpc2liaWxpdHlDaGFuZ2UoKVxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICBpZiAoIXRoaXMud2FzVmlzaWJsZSkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG5cbiAgICAgIHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKHZpc2liaWxpdHlDaGFuZ2VkLCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCBjaGVja3MgZm9yIHZpc2liaWxpdHkgY2hhbmdlcyBpbiB0aGUgTWluaW1hcEVsZW1lbnQuXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgdmlzaWJpbGl0eSBjaGFuZ2VkIGZyb20gdmlzaWJsZSB0b1xuICAgKiBoaWRkZW4gb3IgZnJvbSBoaWRkZW4gdG8gdmlzaWJsZS5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGUgdmlzaWJpbGl0eSBjaGFuZ2VkIG9yIG5vdCBzaW5jZSB0aGUgbGFzdCBjYWxsXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2hlY2tGb3JWaXNpYmlsaXR5Q2hhbmdlICgpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgaWYgKHRoaXMud2FzVmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud2FzVmlzaWJsZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMud2FzVmlzaWJsZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy53YXNWaXNpYmxlKSB7XG4gICAgICAgIHRoaXMud2FzVmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndhc1Zpc2libGUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gdGhpcy53YXNWaXNpYmxlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHVzZWQgdG8gbWVhc3VyZSB0aGUgc2l6ZSBvZiB0aGUgTWluaW1hcEVsZW1lbnQgYW5kIHVwZGF0ZSBpbnRlcm5hbFxuICAgKiBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBuZXcgc2l6ZS5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gdmlzaWJpbGl0eUNoYW5nZWQgZGlkIHRoZSB2aXNpYmlsaXR5IGNoYW5nZWQgc2luY2UgbGFzdFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlbWVudFxuICAgKiBAcGFyYW0gIHtbdHlwZV19IFtmb3JjZVVwZGF0ZT10cnVlXSBmb3JjZXMgdGhlIHVwZGF0ZSBldmVuIHdoZW4gbm8gY2hhbmdlc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZXJlIGRldGVjdGVkXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgbWVhc3VyZUhlaWdodEFuZFdpZHRoICh2aXNpYmlsaXR5Q2hhbmdlZCwgZm9yY2VVcGRhdGUgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgbGV0IHdhc1Jlc2l6ZWQgPSB0aGlzLndpZHRoICE9PSB0aGlzLmNsaWVudFdpZHRoIHx8IHRoaXMuaGVpZ2h0ICE9PSB0aGlzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNsaWVudEhlaWdodFxuICAgIHRoaXMud2lkdGggPSB0aGlzLmNsaWVudFdpZHRoXG4gICAgbGV0IGNhbnZhc1dpZHRoID0gdGhpcy53aWR0aFxuXG4gICAgaWYgKCh0aGlzLm1pbmltYXAgIT0gbnVsbCkpIHsgdGhpcy5taW5pbWFwLnNldFNjcmVlbkhlaWdodEFuZFdpZHRoKHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoKSB9XG5cbiAgICBpZiAod2FzUmVzaXplZCB8fCB2aXNpYmlsaXR5Q2hhbmdlZCB8fCBmb3JjZVVwZGF0ZSkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG5cbiAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHsgcmV0dXJuIH1cblxuICAgIGlmICh3YXNSZXNpemVkIHx8IGZvcmNlVXBkYXRlKSB7XG4gICAgICBpZiAodGhpcy5hZGp1c3RUb1NvZnRXcmFwKSB7XG4gICAgICAgIGxldCBsaW5lTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcpXG4gICAgICAgIGxldCBzb2Z0V3JhcCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRXcmFwJylcbiAgICAgICAgbGV0IHNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFdyYXBBdFByZWZlcnJlZExpbmVMZW5ndGgnKVxuICAgICAgICBsZXQgd2lkdGggPSBsaW5lTGVuZ3RoICogdGhpcy5taW5pbWFwLmdldENoYXJXaWR0aCgpXG5cbiAgICAgICAgaWYgKHNvZnRXcmFwICYmIHNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoICYmIGxpbmVMZW5ndGggJiYgd2lkdGggPD0gdGhpcy53aWR0aCkge1xuICAgICAgICAgIHRoaXMuZmxleEJhc2lzID0gd2lkdGhcbiAgICAgICAgICBjYW52YXNXaWR0aCA9IHdpZHRoXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZmxleEJhc2lzXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmZsZXhCYXNpc1xuICAgICAgfVxuXG4gICAgICBsZXQgY2FudmFzID0gdGhpcy5nZXRGcm9udENhbnZhcygpXG4gICAgICBpZiAoY2FudmFzV2lkdGggIT09IGNhbnZhcy53aWR0aCB8fCB0aGlzLmhlaWdodCAhPT0gY2FudmFzLmhlaWdodCkge1xuICAgICAgICB0aGlzLnNldENhbnZhc2VzU2l6ZShcbiAgICAgICAgICBjYW52YXNXaWR0aCAqIGRldmljZVBpeGVsUmF0aW8sXG4gICAgICAgICAgKHRoaXMuaGVpZ2h0ICsgdGhpcy5taW5pbWFwLmdldExpbmVIZWlnaHQoKSkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAjIyAgICAgIyMgIyMjIyMjIyMgIyMgICAgIyMgIyMjIyMjIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMjICAgIyMgICAgIyMgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjIyMgICMjICAgICMjICAgICMjXG4gIC8vICAgICMjIyMjIyAgICMjICAgICAjIyAjIyMjIyMgICAjIyAjIyAjIyAgICAjIyAgICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICMjICAjIyAgICAgICAjIyAgIyMjIyAgICAjIyAgICAgICAgICAjI1xuICAvLyAgICAjIyAgICAgICAgICMjICMjICAgIyMgICAgICAgIyMgICAjIyMgICAgIyMgICAgIyMgICAgIyNcbiAgLy8gICAgIyMjIyMjIyMgICAgIyMjICAgICMjIyMjIyMjICMjICAgICMjICAgICMjICAgICAjIyMjIyNcblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byByZWdpc3RlciBjb25maWcgb2JzZXJ2ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ3M9e30gYW4gb2JqZWN0IG1hcHBpbmcgdGhlIGNvbmZpZyBuYW1lIHRvIG9ic2VydmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGZ1bmN0aW9uIHRvIGNhbGwgYmFjayB3aGVuIGEgY2hhbmdlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY2N1cnNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBvYnNlcnZlQ29uZmlnIChjb25maWdzID0ge30pIHtcbiAgICBmb3IgKGxldCBjb25maWcgaW4gY29uZmlncykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGNvbmZpZywgY29uZmlnc1tjb25maWddKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vdXNlIGlzIHByZXNzZWQgb24gdGhlIE1pbmltYXBFbGVtZW50IGNhbnZhcy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5IHRoZSB2ZXJ0aWNhbCBjb29yZGluYXRlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpc0xlZnRNb3VzZSB3YXMgdGhlIGxlZnQgbW91c2UgYnV0dG9uIHByZXNzZWQ/XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTWlkZGxlTW91c2Ugd2FzIHRoZSBtaWRkbGUgbW91c2UgYnV0dG9uIHByZXNzZWQ/XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2FudmFzUHJlc3NlZCAoe3ksIGlzTGVmdE1vdXNlLCBpc01pZGRsZU1vdXNlfSkge1xuICAgIGlmICh0aGlzLm1pbmltYXAuaXNTdGFuZEFsb25lKCkpIHsgcmV0dXJuIH1cbiAgICBpZiAoaXNMZWZ0TW91c2UpIHtcbiAgICAgIHRoaXMuY2FudmFzTGVmdE1vdXNlUHJlc3NlZCh5KVxuICAgIH0gZWxzZSBpZiAoaXNNaWRkbGVNb3VzZSkge1xuICAgICAgdGhpcy5jYW52YXNNaWRkbGVNb3VzZVByZXNzZWQoeSlcbiAgICAgIGxldCB7dG9wLCBoZWlnaHR9ID0gdGhpcy52aXNpYmxlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgdGhpcy5zdGFydERyYWcoe3k6IHRvcCArIGhlaWdodCAvIDIsIGlzTGVmdE1vdXNlOiBmYWxzZSwgaXNNaWRkbGVNb3VzZTogdHJ1ZX0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRyaWdnZXJlZCB3aGVuIHRoZSBtb3VzZSBsZWZ0IGJ1dHRvbiBpcyBwcmVzc2VkIG9uIHRoZVxuICAgKiBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGUucGFnZVkgdGhlIG1vdXNlIHkgcG9zaXRpb24gaW4gcGFnZVxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZS50YXJnZXQgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnRcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjYW52YXNMZWZ0TW91c2VQcmVzc2VkICh5KSB7XG4gICAgbGV0IGRlbHRhWSA9IHkgLSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGRlbHRhWSAvIHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkpICsgdGhpcy5taW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG5cbiAgICBsZXQgdGV4dEVkaXRvciA9IHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yKClcblxuICAgIGxldCBzY3JvbGxUb3AgPSByb3cgKiB0ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JIZWlnaHQoKSAvIDJcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuc2Nyb2xsQW5pbWF0aW9uJykpIHtcbiAgICAgIGxldCBmcm9tID0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxUb3AoKVxuICAgICAgbGV0IHRvID0gc2Nyb2xsVG9wXG4gICAgICBsZXQgc3RlcCA9IChub3cpID0+IHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKG5vdylcbiAgICAgIGxldCBkdXJhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5zY3JvbGxBbmltYXRpb25EdXJhdGlvbicpXG4gICAgICB0aGlzLmFuaW1hdGUoe2Zyb206IGZyb20sIHRvOiB0bywgZHVyYXRpb246IGR1cmF0aW9uLCBzdGVwOiBzdGVwfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW5pbWFwLnNldFRleHRFZGl0b3JTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0cmlnZ2VyZWQgd2hlbiB0aGUgbW91c2UgbWlkZGxlIGJ1dHRvbiBpcyBwcmVzc2VkIG9uIHRoZVxuICAgKiBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGUucGFnZVkgdGhlIG1vdXNlIHkgcG9zaXRpb24gaW4gcGFnZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNhbnZhc01pZGRsZU1vdXNlUHJlc3NlZCAoeSkge1xuICAgIGxldCB7dG9wOiBvZmZzZXRUb3B9ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGxldCBkZWx0YVkgPSB5IC0gb2Zmc2V0VG9wIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSAvIDJcblxuICAgIGxldCByYXRpbyA9IGRlbHRhWSAvICh0aGlzLm1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSlcblxuICAgIHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKHJhdGlvICogdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IHJlbGF5cyB0aGUgYG1vdXNld2hlZWxgIGV2ZW50cyByZWNlaXZlZCBieSB0aGUgTWluaW1hcEVsZW1lbnRcbiAgICogdG8gdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHJlbGF5TW91c2V3aGVlbEV2ZW50IChlKSB7XG4gICAgdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudCgpLmNvbXBvbmVudC5vbk1vdXNlV2hlZWwoZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IGV4dHJhY3RzIGRhdGEgZnJvbSBhIGBNb3VzZUV2ZW50YCB3aGljaCBjYW4gdGhlbiBiZSB1c2VkIHRvXG4gICAqIHByb2Nlc3MgY2xpY2tzIGFuZCBkcmFncyBvZiB0aGUgbWluaW1hcC5cbiAgICpcbiAgICogVXNlZCB0b2dldGhlciB3aXRoIGBleHRyYWN0VG91Y2hFdmVudERhdGFgIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZVxuICAgKiBmb3IgYE1vdXNlRXZlbnRgcyBhbmQgYFRvdWNoRXZlbnRgcy5cbiAgICpcbiAgICogQHBhcmFtICB7TW91c2VFdmVudH0gbW91c2VFdmVudCB0aGUgbW91c2UgZXZlbnQgb2JqZWN0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZXh0cmFjdE1vdXNlRXZlbnREYXRhIChtb3VzZUV2ZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1vdXNlRXZlbnQucGFnZVgsXG4gICAgICB5OiBtb3VzZUV2ZW50LnBhZ2VZLFxuICAgICAgaXNMZWZ0TW91c2U6IG1vdXNlRXZlbnQud2hpY2ggPT09IDEsXG4gICAgICBpc01pZGRsZU1vdXNlOiBtb3VzZUV2ZW50LndoaWNoID09PSAyXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgZXh0cmFjdHMgZGF0YSBmcm9tIGEgYFRvdWNoRXZlbnRgIHdoaWNoIGNhbiB0aGVuIGJlIHVzZWQgdG9cbiAgICogcHJvY2VzcyBjbGlja3MgYW5kIGRyYWdzIG9mIHRoZSBtaW5pbWFwLlxuICAgKlxuICAgKiBVc2VkIHRvZ2V0aGVyIHdpdGggYGV4dHJhY3RNb3VzZUV2ZW50RGF0YWAgdG8gcHJvdmlkZSBhIHVuaWZpZWQgaW50ZXJmYWNlXG4gICAqIGZvciBgTW91c2VFdmVudGBzIGFuZCBgVG91Y2hFdmVudGBzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUb3VjaEV2ZW50fSB0b3VjaEV2ZW50IHRoZSB0b3VjaCBldmVudCBvYmplY3RcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBleHRyYWN0VG91Y2hFdmVudERhdGEgKHRvdWNoRXZlbnQpIHtcbiAgICAvLyBVc2UgdGhlIGZpcnN0IHRvdWNoIG9uIHRoZSB0YXJnZXQgYXJlYS4gT3RoZXIgdG91Y2hlcyB3aWxsIGJlIGlnbm9yZWQgaW5cbiAgICAvLyBjYXNlIG9mIG11bHRpLXRvdWNoLlxuICAgIGxldCB0b3VjaCA9IHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF1cblxuICAgIHJldHVybiB7XG4gICAgICB4OiB0b3VjaC5wYWdlWCxcbiAgICAgIHk6IHRvdWNoLnBhZ2VZLFxuICAgICAgaXNMZWZ0TW91c2U6IHRydWUsIC8vIFRvdWNoIGlzIHRyZWF0ZWQgbGlrZSBhIGxlZnQgbW91c2UgYnV0dG9uIGNsaWNrXG4gICAgICBpc01pZGRsZU1vdXNlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8vICAgICMjIyMjIyMjICAgICMjIyMgICAgIyMjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICAjIyAgIyMgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAgIyMjIyAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICAjIyMjICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAjIyAjIyAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgIyMgICAjIyAgICAgIyNcbiAgLy8gICAgIyMjIyMjIyMgICAjIyMjICAjIyAjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0cmlnZ2VyZWQgd2hlbiB0aGUgbW91c2UgaXMgcHJlc3NlZCBvdmVyIHRoZSB2aXNpYmxlIGFyZWEgdGhhdFxuICAgKiBzdGFydHMgdGhlIGRyYWdnaW5nIGdlc3R1cmUuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0geSB0aGUgdmVydGljYWwgY29vcmRpbmF0ZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNMZWZ0TW91c2Ugd2FzIHRoZSBsZWZ0IG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAcGFyYW0gIHtib29sZWFufSBpc01pZGRsZU1vdXNlIHdhcyB0aGUgbWlkZGxlIG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHN0YXJ0RHJhZyAoe3ksIGlzTGVmdE1vdXNlLCBpc01pZGRsZU1vdXNlfSkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG4gICAgaWYgKCFpc0xlZnRNb3VzZSAmJiAhaXNNaWRkbGVNb3VzZSkgeyByZXR1cm4gfVxuXG4gICAgbGV0IHt0b3B9ID0gdGhpcy52aXNpYmxlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGxldCB7dG9wOiBvZmZzZXRUb3B9ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgbGV0IGRyYWdPZmZzZXQgPSB5IC0gdG9wXG5cbiAgICBsZXQgaW5pdGlhbCA9IHtkcmFnT2Zmc2V0LCBvZmZzZXRUb3B9XG5cbiAgICBsZXQgbW91c2Vtb3ZlSGFuZGxlciA9IChlKSA9PiB0aGlzLmRyYWcodGhpcy5leHRyYWN0TW91c2VFdmVudERhdGEoZSksIGluaXRpYWwpXG4gICAgbGV0IG1vdXNldXBIYW5kbGVyID0gKGUpID0+IHRoaXMuZW5kRHJhZygpXG5cbiAgICBsZXQgdG91Y2htb3ZlSGFuZGxlciA9IChlKSA9PiB0aGlzLmRyYWcodGhpcy5leHRyYWN0VG91Y2hFdmVudERhdGEoZSksIGluaXRpYWwpXG4gICAgbGV0IHRvdWNoZW5kSGFuZGxlciA9IChlKSA9PiB0aGlzLmVuZERyYWcoKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmVIYW5kbGVyKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG1vdXNldXBIYW5kbGVyKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmVIYW5kbGVyKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZEhhbmRsZXIpXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRvdWNoZW5kSGFuZGxlcilcblxuICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbiA9IG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgbW91c2V1cEhhbmRsZXIpXG5cbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZEhhbmRsZXIpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdG91Y2hlbmRIYW5kbGVyKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogVGhlIG1ldGhvZCBjYWxsZWQgZHVyaW5nIHRoZSBkcmFnIGdlc3R1cmUuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0geSB0aGUgdmVydGljYWwgY29vcmRpbmF0ZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNMZWZ0TW91c2Ugd2FzIHRoZSBsZWZ0IG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAcGFyYW0gIHtib29sZWFufSBpc01pZGRsZU1vdXNlIHdhcyB0aGUgbWlkZGxlIG1vdXNlIGJ1dHRvbiBwcmVzc2VkP1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGluaXRpYWwuZHJhZ09mZnNldCB0aGUgbW91c2Ugb2Zmc2V0IHdpdGhpbiB0aGUgdmlzaWJsZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhXG4gICAqIEBwYXJhbSAge251bWJlcn0gaW5pdGlhbC5vZmZzZXRUb3AgdGhlIE1pbmltYXBFbGVtZW50IG9mZnNldCBhdCB0aGUgbW9tZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgdGhlIGRyYWcgc3RhcnRcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmFnICh7eSwgaXNMZWZ0TW91c2UsIGlzTWlkZGxlTW91c2V9LCBpbml0aWFsKSB7XG4gICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cbiAgICBpZiAoIWlzTGVmdE1vdXNlICYmICFpc01pZGRsZU1vdXNlKSB7IHJldHVybiB9XG4gICAgbGV0IGRlbHRhWSA9IHkgLSBpbml0aWFsLm9mZnNldFRvcCAtIGluaXRpYWwuZHJhZ09mZnNldFxuXG4gICAgbGV0IHJhdGlvID0gZGVsdGFZIC8gKHRoaXMubWluaW1hcC5nZXRWaXNpYmxlSGVpZ2h0KCkgLSB0aGlzLm1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCgpKVxuXG4gICAgdGhpcy5taW5pbWFwLnNldFRleHRFZGl0b3JTY3JvbGxUb3AocmF0aW8gKiB0aGlzLm1pbmltYXAuZ2V0VGV4dEVkaXRvck1heFNjcm9sbFRvcCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdGhhdCBlbmRzIHRoZSBkcmFnIGdlc3R1cmUuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW5kRHJhZyAoKSB7XG4gICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gIH1cblxuICAvLyAgICAgIyMjIyMjICAgIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICMjICMjICAgICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAgICMjXG4gIC8vICAgICMjICAgICAgICAjIyMjIyMgICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICAgICAgICAgIyMgICAgICAgIyNcbiAgLy8gICAgIyMgICAgIyMgIyMgICAgIyMgIyMgICAgIyNcbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyAgICMjIyMjI1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBwYXNzZWQtaW4gc3R5bGVzIHByb3BlcnRpZXMgdG8gdGhlIHNwZWNpZmllZCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IHRoZSBlbGVtZW50IG9udG8gd2hpY2ggYXBwbHkgdGhlIHN0eWxlc1xuICAgKiBAcGFyYW0gIHtPYmplY3R9IHN0eWxlcyB0aGUgc3R5bGVzIHRvIGFwcGx5XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYXBwbHlTdHlsZXMgKGVsZW1lbnQsIHN0eWxlcykge1xuICAgIGlmICghZWxlbWVudCkgeyByZXR1cm4gfVxuXG4gICAgbGV0IGNzc1RleHQgPSAnJ1xuICAgIGZvciAobGV0IHByb3BlcnR5IGluIHN0eWxlcykge1xuICAgICAgY3NzVGV4dCArPSBgJHtwcm9wZXJ0eX06ICR7c3R5bGVzW3Byb3BlcnR5XX07IGBcbiAgICB9XG5cbiAgICBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBjc3NUZXh0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyB3aXRoIGEgQ1NTIHRyYW5zbGF0aW9uIHRyYW5mb3JtIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFt4ID0gMF0gdGhlIHggb2Zmc2V0IG9mIHRoZSB0cmFuc2xhdGlvblxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFt5ID0gMF0gdGhlIHkgb2Zmc2V0IG9mIHRoZSB0cmFuc2xhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1MgdHJhbnNsYXRpb24gc3RyaW5nXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgbWFrZVRyYW5zbGF0ZSAoeCA9IDAsIHkgPSAwKSB7XG4gICAgaWYgKHRoaXMudXNlSGFyZHdhcmVBY2NlbGVyYXRpb24pIHtcbiAgICAgIHJldHVybiBgdHJhbnNsYXRlM2QoJHt4fXB4LCAke3l9cHgsIDApYFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3h9cHgsICR7eX1weClgXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBhIENTUyBzY2FsaW5nIHRyYW5mb3JtIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFt4ID0gMF0gdGhlIHggc2NhbGluZyBmYWN0b3JcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeSA9IDBdIHRoZSB5IHNjYWxpbmcgZmFjdG9yXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIENTUyBzY2FsaW5nIHN0cmluZ1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1ha2VTY2FsZSAoeCA9IDAsIHkgPSB4KSB7XG4gICAgaWYgKHRoaXMudXNlSGFyZHdhcmVBY2NlbGVyYXRpb24pIHtcbiAgICAgIHJldHVybiBgc2NhbGUzZCgke3h9LCAke3l9LCAxKWBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBzY2FsZSgke3h9LCAke3l9KWBcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCByZXR1cm4gdGhlIGN1cnJlbnQgdGltZSBhcyBhIERhdGUuXG4gICAqXG4gICAqIFRoYXQgbWV0aG9kIGV4aXN0IHNvIHRoYXQgd2UgY2FuIG1vY2sgaXQgaW4gdGVzdHMuXG4gICAqXG4gICAqIEByZXR1cm4ge0RhdGV9IHRoZSBjdXJyZW50IHRpbWUgYXMgRGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldFRpbWUgKCkgeyByZXR1cm4gbmV3IERhdGUoKSB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgbWltaWMgdGhlIGpRdWVyeSBgYW5pbWF0ZWAgbWV0aG9kIGFuZCB1c2VkIHRvIGFuaW1hdGUgdGhlXG4gICAqIHNjcm9sbCB3aGVuIGNsaWNraW5nIG9uIHRoZSBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW0gdGhlIGFuaW1hdGlvbiBkYXRhIG9iamVjdFxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHBhcmFtLmZyb20gdGhlIHN0YXJ0IHZhbHVlXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW0udG8gdGhlIGVuZCB2YWx1ZVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHBhcmFtLmR1cmF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb25cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbS5zdGVwIHRoZSBlYXNpbmcgZnVuY3Rpb24gZm9yIHRoZSBhbmltYXRpb25cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBhbmltYXRlICh7ZnJvbSwgdG8sIGR1cmF0aW9uLCBzdGVwfSkge1xuICAgIGxldCBwcm9ncmVzc1xuICAgIGxldCBzdGFydCA9IHRoaXMuZ2V0VGltZSgpXG5cbiAgICBsZXQgc3dpbmcgPSBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybiAwLjUgLSBNYXRoLmNvcyhwcm9ncmVzcyAqIE1hdGguUEkpIC8gMlxuICAgIH1cblxuICAgIGxldCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMubWluaW1hcCkgeyByZXR1cm4gfVxuXG4gICAgICBsZXQgcGFzc2VkID0gdGhpcy5nZXRUaW1lKCkgLSBzdGFydFxuICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICAgIHByb2dyZXNzID0gMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvZ3Jlc3MgPSBwYXNzZWQgLyBkdXJhdGlvblxuICAgICAgfVxuICAgICAgaWYgKHByb2dyZXNzID4gMSkgeyBwcm9ncmVzcyA9IDEgfVxuICAgICAgbGV0IGRlbHRhID0gc3dpbmcocHJvZ3Jlc3MpXG4gICAgICBzdGVwKGZyb20gKyAodG8gLSBmcm9tKSAqIGRlbHRhKVxuXG4gICAgICBpZiAocHJvZ3Jlc3MgPCAxKSB7IHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoKVxuICB9XG59XG4iXX0=
//# sourceURL=/home/champ/.atom/packages/minimap/lib/minimap-element.js
