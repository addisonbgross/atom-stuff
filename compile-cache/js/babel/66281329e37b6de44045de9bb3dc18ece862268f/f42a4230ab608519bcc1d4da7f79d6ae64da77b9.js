Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
  The following hack clears the require cache of all the paths to the minimap when this file is laoded. It should prevents errors of partial reloading after an update.
 */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsPluginManagement = require('./mixins/plugin-management');

var _mixinsPluginManagement2 = _interopRequireDefault(_mixinsPluginManagement);

'use babel';
if (!atom.inSpecMode()) {
  Object.keys(require.cache).filter(function (p) {
    return p !== __filename && p.indexOf(_path2['default'].resolve(__dirname, '..') + _path2['default'].sep) > -1;
  }).forEach(function (p) {
    delete require.cache[p];
  });
}

var Minimap = undefined,
    MinimapElement = undefined,
    MinimapPluginGeneratorElement = undefined;

/**
 * The `Minimap` package provides an eagle-eye view of text buffers.
 *
 * It also provides API for plugin packages that want to interact with the
 * minimap and be available to the user through the minimap settings.
 */

var Main = (function () {
  /**
   * Used only at export time.
   *
   * @access private
   */

  function Main() {
    _classCallCheck(this, _Main);

    /**
     * The activation state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.active = false;
    /**
     * The toggle state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.toggled = false;
    /**
     * The `Map` where Minimap instances are stored with the text editor they
     * target as key.
     *
     * @type {Map}
     * @access private
     */
    this.editorsMinimaps = null;
    /**
     * The composite disposable that stores the package's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = null;
    /**
     * The disposable that stores the package's commands subscription.
     *
     * @type {Disposable}
     * @access private
     */
    this.subscriptionsOfCommands = null;
    /**
     * The package's config object.
     *
     * @type {Object}
     * @access private
     */
    this.config = require('./config-schema.json');
    /**
     * The package's events emitter.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();

    this.initializePlugins();
  }

  /**
   * The exposed instance of the `Main` class.
   *
   * @access private
   */

  /**
   * Activates the minimap package.
   */

  _createClass(Main, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      if (this.active) {
        return;
      }

      if (!Minimap) {
        Minimap = require('./minimap');
      }
      if (!MinimapElement) {
        MinimapElement = require('./minimap-element');
      }

      MinimapElement.registerViewProvider(Minimap);

      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': function minimapToggle() {
          _this.toggle();
        },
        'minimap:generate-coffee-plugin': function minimapGenerateCoffeePlugin() {
          _this.generatePlugin('coffee');
        },
        'minimap:generate-javascript-plugin': function minimapGenerateJavascriptPlugin() {
          _this.generatePlugin('javascript');
        },
        'minimap:generate-babel-plugin': function minimapGenerateBabelPlugin() {
          _this.generatePlugin('babel');
        }
      });

      this.editorsMinimaps = new Map();
      this.subscriptions = new _atom.CompositeDisposable();
      this.active = true;

      if (atom.config.get('minimap.autoToggle')) {
        this.toggle();
      }
    }

    /**
     * Deactivates the minimap package.
     */
  }, {
    key: 'deactivate',
    value: function deactivate() {
      var _this2 = this;

      if (!this.active) {
        return;
      }

      this.deactivateAllPlugins();

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (value, key) {
          value.destroy();
          _this2.editorsMinimaps['delete'](key);
        });
      }

      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = undefined;
      this.toggled = false;
      this.active = false;
    }

    /**
     * Toggles the minimap display.
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this3 = this;

      if (!this.active) {
        return;
      }

      if (this.toggled) {
        this.toggled = false;

        if (this.editorsMinimaps) {
          this.editorsMinimaps.forEach(function (value, key) {
            value.destroy();
            _this3.editorsMinimaps['delete'](key);
          });
        }
        this.subscriptions.dispose();
      } else {
        this.toggled = true;
        this.initSubscriptions();
      }
    }

    /**
     * Opens the plugin generation view.
     *
     * @param  {string} template the name of the template to use
     */
  }, {
    key: 'generatePlugin',
    value: function generatePlugin(template) {
      if (!MinimapPluginGeneratorElement) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      var view = new MinimapPluginGeneratorElement();
      view.template = template;
      view.attach();
    }

    /**
     * Registers a callback to listen to the `did-activate` event of the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivate',
    value: function onDidActivate(callback) {
      return this.emitter.on('did-activate', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivate',
    value: function onDidDeactivate(callback) {
      return this.emitter.on('did-deactivate', callback);
    }

    /**
     * Registers a callback to listen to the `did-create-minimap` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidCreateMinimap',
    value: function onDidCreateMinimap(callback) {
      return this.emitter.on('did-create-minimap', callback);
    }

    /**
     * Registers a callback to listen to the `did-add-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddPlugin',
    value: function onDidAddPlugin(callback) {
      return this.emitter.on('did-add-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-remove-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemovePlugin',
    value: function onDidRemovePlugin(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-activate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivatePlugin',
    value: function onDidActivatePlugin(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivatePlugin',
    value: function onDidDeactivatePlugin(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-change-plugin-order` event of
     * the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangePluginOrder',
    value: function onDidChangePluginOrder(callback) {
      return this.emitter.on('did-change-plugin-order', callback);
    }

    /**
     * Returns the `Minimap` class
     *
     * @return {Function} the `Minimap` class constructor
     */
  }, {
    key: 'minimapClass',
    value: function minimapClass() {
      return Minimap;
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditorElement`.
     *
     * @param  {TextEditorElement} editorElement a text editor element
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditorElement',
    value: function minimapForEditorElement(editorElement) {
      if (!editorElement) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditor',
    value: function minimapForEditor(textEditor) {
      var _this4 = this;

      if (!textEditor) {
        return;
      }

      var minimap = this.editorsMinimaps.get(textEditor);

      if (!minimap) {
        minimap = new Minimap({ textEditor: textEditor });
        this.editorsMinimaps.set(textEditor, minimap);

        var editorSubscription = textEditor.onDidDestroy(function () {
          var minimaps = _this4.editorsMinimaps;
          if (minimaps) {
            minimaps['delete'](textEditor);
          }
          editorSubscription.dispose();
        });
      }

      return minimap;
    }

    /**
     * Returns a new stand-alone {Minimap} for the passed-in `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor instance to create
     *                                 a minimap for
     * @return {Minimap} a new stand-alone Minimap for the passed-in editor
     */
  }, {
    key: 'standAloneMinimapForEditor',
    value: function standAloneMinimapForEditor(textEditor) {
      if (!textEditor) {
        return;
      }

      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    }

    /**
     * Returns the `Minimap` associated to the active `TextEditor`.
     *
     * @return {Minimap} the active Minimap
     */
  }, {
    key: 'getActiveMinimap',
    value: function getActiveMinimap() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    }

    /**
     * Calls a function for each present and future minimaps.
     *
     * @param  {function(minimap:Minimap):void} iterator a function to call with
     *                                                   the existing and future
     *                                                   minimaps
     * @return {Disposable} a disposable to unregister the observer
     */
  }, {
    key: 'observeMinimaps',
    value: function observeMinimaps(iterator) {
      if (!iterator) {
        return;
      }

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (minimap) {
          iterator(minimap);
        });
      }
      return this.onDidCreateMinimap(function (minimap) {
        iterator(minimap);
      });
    }

    /**
     * Registers to the `observeTextEditors` method.
     *
     * @access private
     */
  }, {
    key: 'initSubscriptions',
    value: function initSubscriptions() {
      var _this5 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        var minimap = _this5.minimapForEditor(textEditor);
        var minimapElement = atom.views.getView(minimap);

        _this5.emitter.emit('did-create-minimap', minimap);

        minimapElement.attach();
      }));
    }
  }]);

  var _Main = Main;
  Main = (0, _decoratorsInclude2['default'])(_mixinsPluginManagement2['default'])(Main) || Main;
  return Main;
})();

exports['default'] = new Main();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBS2lCLE1BQU07Ozs7b0JBU29CLE1BQU07O2lDQUM3QixzQkFBc0I7Ozs7c0NBQ2IsNEJBQTRCOzs7O0FBaEJ6RCxXQUFXLENBQUE7QUFNWCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLFFBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUN2QyxXQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLGtCQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0dBQ3BGLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDaEIsV0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3hCLENBQUMsQ0FBQTtDQUNIOztBQU1ELElBQUksT0FBTyxZQUFBO0lBQUUsY0FBYyxZQUFBO0lBQUUsNkJBQTZCLFlBQUEsQ0FBQTs7Ozs7Ozs7O0lBU3BELElBQUk7Ozs7Ozs7QUFNSSxXQU5SLElBQUksR0FNTzs7Ozs7Ozs7O0FBT2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7Ozs7Ozs7QUFPbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7Ozs7Ozs7O0FBUXBCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBOzs7Ozs7O0FBTzNCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBOzs7Ozs7O0FBT3pCLFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7QUFPbkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMs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LE9BQU8sQ0FBQyxDQUFBOztBQUVoRCxlQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRWhELHNCQUFjLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDeEIsQ0FBQyxDQUFDLENBQUE7S0FDSjs7O2NBdFZHLElBQUk7QUFBSixNQUFJLEdBRFQsd0VBQXlCLENBQ3BCLElBQUksS0FBSixJQUFJO1NBQUosSUFBSTs7O3FCQThWSyxJQUFJLElBQUksRUFBRSIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLypcbiAgVGhlIGZvbGxvd2luZyBoYWNrIGNsZWFycyB0aGUgcmVxdWlyZSBjYWNoZSBvZiBhbGwgdGhlIHBhdGhzIHRvIHRoZSBtaW5pbWFwIHdoZW4gdGhpcyBmaWxlIGlzIGxhb2RlZC4gSXQgc2hvdWxkIHByZXZlbnRzIGVycm9ycyBvZiBwYXJ0aWFsIHJlbG9hZGluZyBhZnRlciBhbiB1cGRhdGUuXG4gKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZpbHRlcigocCkgPT4ge1xuICAgIHJldHVybiBwICE9PSBfX2ZpbGVuYW1lICYmIHAuaW5kZXhPZihwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nKSArIHBhdGguc2VwKSA+IC0xXG4gIH0pLmZvckVhY2goKHApID0+IHtcbiAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtwXVxuICB9KVxufVxuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBQbHVnaW5NYW5hZ2VtZW50IGZyb20gJy4vbWl4aW5zL3BsdWdpbi1tYW5hZ2VtZW50J1xuXG5sZXQgTWluaW1hcCwgTWluaW1hcEVsZW1lbnQsIE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50XG5cbi8qKlxuICogVGhlIGBNaW5pbWFwYCBwYWNrYWdlIHByb3ZpZGVzIGFuIGVhZ2xlLWV5ZSB2aWV3IG9mIHRleHQgYnVmZmVycy5cbiAqXG4gKiBJdCBhbHNvIHByb3ZpZGVzIEFQSSBmb3IgcGx1Z2luIHBhY2thZ2VzIHRoYXQgd2FudCB0byBpbnRlcmFjdCB3aXRoIHRoZVxuICogbWluaW1hcCBhbmQgYmUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIHRocm91Z2ggdGhlIG1pbmltYXAgc2V0dGluZ3MuXG4gKi9cbkBpbmNsdWRlKFBsdWdpbk1hbmFnZW1lbnQpXG5jbGFzcyBNYWluIHtcbiAgLyoqXG4gICAqIFVzZWQgb25seSBhdCBleHBvcnQgdGltZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGFjdGl2YXRpb24gc3RhdGUgb2YgdGhlIHBhY2thZ2UuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogVGhlIHRvZ2dsZSBzdGF0ZSBvZiB0aGUgcGFja2FnZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudG9nZ2xlZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogVGhlIGBNYXBgIHdoZXJlIE1pbmltYXAgaW5zdGFuY2VzIGFyZSBzdG9yZWQgd2l0aCB0aGUgdGV4dCBlZGl0b3IgdGhleVxuICAgICAqIHRhcmdldCBhcyBrZXkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZWRpdG9yc01pbmltYXBzID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjb21wb3NpdGUgZGlzcG9zYWJsZSB0aGF0IHN0b3JlcyB0aGUgcGFja2FnZSdzIHN1YnNjcmlwdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Q29tcG9zaXRlRGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3Bvc2FibGUgdGhhdCBzdG9yZXMgdGhlIHBhY2thZ2UncyBjb21tYW5kcyBzdWJzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBwYWNrYWdlJ3MgY29uZmlnIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy1zY2hlbWEuanNvbicpXG4gICAgLyoqXG4gICAgICogVGhlIHBhY2thZ2UncyBldmVudHMgZW1pdHRlci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbWl0dGVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMuaW5pdGlhbGl6ZVBsdWdpbnMoKVxuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlcyB0aGUgbWluaW1hcCBwYWNrYWdlLlxuICAgKi9cbiAgYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkgeyByZXR1cm4gfVxuXG4gICAgaWYgKCFNaW5pbWFwKSB7IE1pbmltYXAgPSByZXF1aXJlKCcuL21pbmltYXAnKSB9XG4gICAgaWYgKCFNaW5pbWFwRWxlbWVudCkgeyBNaW5pbWFwRWxlbWVudCA9IHJlcXVpcmUoJy4vbWluaW1hcC1lbGVtZW50JykgfVxuXG4gICAgTWluaW1hcEVsZW1lbnQucmVnaXN0ZXJWaWV3UHJvdmlkZXIoTWluaW1hcClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uc09mQ29tbWFuZHMgPSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnbWluaW1hcDp0b2dnbGUnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH0sXG4gICAgICAnbWluaW1hcDpnZW5lcmF0ZS1jb2ZmZWUtcGx1Z2luJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGx1Z2luKCdjb2ZmZWUnKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWphdmFzY3JpcHQtcGx1Z2luJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGx1Z2luKCdqYXZhc2NyaXB0JylcbiAgICAgIH0sXG4gICAgICAnbWluaW1hcDpnZW5lcmF0ZS1iYWJlbC1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2JhYmVsJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5lZGl0b3JzTWluaW1hcHMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlXG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmF1dG9Ub2dnbGUnKSkgeyB0aGlzLnRvZ2dsZSgpIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWFjdGl2YXRlcyB0aGUgbWluaW1hcCBwYWNrYWdlLlxuICAgKi9cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsUGx1Z2lucygpXG5cbiAgICBpZiAodGhpcy5lZGl0b3JzTWluaW1hcHMpIHtcbiAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgdmFsdWUuZGVzdHJveSgpXG4gICAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmRlbGV0ZShrZXkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzID0gbnVsbFxuICAgIHRoaXMuZWRpdG9yc01pbmltYXBzID0gdW5kZWZpbmVkXG4gICAgdGhpcy50b2dnbGVkID0gZmFsc2VcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgbWluaW1hcCBkaXNwbGF5LlxuICAgKi9cbiAgdG9nZ2xlICgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7IHJldHVybiB9XG5cbiAgICBpZiAodGhpcy50b2dnbGVkKSB7XG4gICAgICB0aGlzLnRvZ2dsZWQgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5lZGl0b3JzTWluaW1hcHMpIHtcbiAgICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIHZhbHVlLmRlc3Ryb3koKVxuICAgICAgICAgIHRoaXMuZWRpdG9yc01pbmltYXBzLmRlbGV0ZShrZXkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlZCA9IHRydWVcbiAgICAgIHRoaXMuaW5pdFN1YnNjcmlwdGlvbnMoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgcGx1Z2luIGdlbmVyYXRpb24gdmlldy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0ZW1wbGF0ZSB0aGUgbmFtZSBvZiB0aGUgdGVtcGxhdGUgdG8gdXNlXG4gICAqL1xuICBnZW5lcmF0ZVBsdWdpbiAodGVtcGxhdGUpIHtcbiAgICBpZiAoIU1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50KSB7XG4gICAgICBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCA9IHJlcXVpcmUoJy4vbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yLWVsZW1lbnQnKVxuICAgIH1cbiAgICB2YXIgdmlldyA9IG5ldyBNaW5pbWFwUGx1Z2luR2VuZXJhdG9yRWxlbWVudCgpXG4gICAgdmlldy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdmlldy5hdHRhY2goKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1hY3RpdmF0ZWAgZXZlbnQgb2YgdGhlIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFjdGl2YXRlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGVgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlYWN0aXZhdGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlYWN0aXZhdGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtY3JlYXRlLW1pbmltYXBgIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENyZWF0ZU1pbmltYXAgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNyZWF0ZS1taW5pbWFwJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWFkZC1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZEFkZFBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1yZW1vdmUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRSZW1vdmVQbHVnaW4gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXJlbW92ZS1wbHVnaW4nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRBY3RpdmF0ZVBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWN0aXZhdGUtcGx1Z2luJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWRlYWN0aXZhdGUtcGx1Z2luYCBldmVudCBvZiB0aGVcbiAgICogcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZWFjdGl2YXRlUGx1Z2luIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZWFjdGl2YXRlLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1jaGFuZ2UtcGx1Z2luLW9yZGVyYCBldmVudCBvZlxuICAgKiB0aGUgcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VQbHVnaW5PcmRlciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXBsdWdpbi1vcmRlcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBjbGFzc1xuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGBNaW5pbWFwYCBjbGFzcyBjb25zdHJ1Y3RvclxuICAgKi9cbiAgbWluaW1hcENsYXNzICgpIHsgcmV0dXJuIE1pbmltYXAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgTWluaW1hcGAgb2JqZWN0IGFzc29jaWF0ZWQgdG8gdGhlIHBhc3NlZC1pblxuICAgKiBgVGV4dEVkaXRvckVsZW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yRWxlbWVudH0gZWRpdG9yRWxlbWVudCBhIHRleHQgZWRpdG9yIGVsZW1lbnRcbiAgICogQHJldHVybiB7TWluaW1hcH0gdGhlIGFzc29jaWF0ZWQgbWluaW1hcFxuICAgKi9cbiAgbWluaW1hcEZvckVkaXRvckVsZW1lbnQgKGVkaXRvckVsZW1lbnQpIHtcbiAgICBpZiAoIWVkaXRvckVsZW1lbnQpIHsgcmV0dXJuIH1cbiAgICByZXR1cm4gdGhpcy5taW5pbWFwRm9yRWRpdG9yKGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgTWluaW1hcGAgb2JqZWN0IGFzc29jaWF0ZWQgdG8gdGhlIHBhc3NlZC1pblxuICAgKiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgYSB0ZXh0IGVkaXRvclxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGUgYXNzb2NpYXRlZCBtaW5pbWFwXG4gICAqL1xuICBtaW5pbWFwRm9yRWRpdG9yICh0ZXh0RWRpdG9yKSB7XG4gICAgaWYgKCF0ZXh0RWRpdG9yKSB7IHJldHVybiB9XG5cbiAgICBsZXQgbWluaW1hcCA9IHRoaXMuZWRpdG9yc01pbmltYXBzLmdldCh0ZXh0RWRpdG9yKVxuXG4gICAgaWYgKCFtaW5pbWFwKSB7XG4gICAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3J9KVxuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuc2V0KHRleHRFZGl0b3IsIG1pbmltYXApXG5cbiAgICAgIHZhciBlZGl0b3JTdWJzY3JpcHRpb24gPSB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIGxldCBtaW5pbWFwcyA9IHRoaXMuZWRpdG9yc01pbmltYXBzXG4gICAgICAgIGlmIChtaW5pbWFwcykgeyBtaW5pbWFwcy5kZWxldGUodGV4dEVkaXRvcikgfVxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBtaW5pbWFwXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzdGFuZC1hbG9uZSB7TWluaW1hcH0gZm9yIHRoZSBwYXNzZWQtaW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIGEgdGV4dCBlZGl0b3IgaW5zdGFuY2UgdG8gY3JlYXRlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBtaW5pbWFwIGZvclxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSBhIG5ldyBzdGFuZC1hbG9uZSBNaW5pbWFwIGZvciB0aGUgcGFzc2VkLWluIGVkaXRvclxuICAgKi9cbiAgc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IgKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IpIHsgcmV0dXJuIH1cblxuICAgIHJldHVybiBuZXcgTWluaW1hcCh7XG4gICAgICB0ZXh0RWRpdG9yOiB0ZXh0RWRpdG9yLFxuICAgICAgc3RhbmRBbG9uZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYE1pbmltYXBgIGFzc29jaWF0ZWQgdG8gdGhlIGFjdGl2ZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoZSBhY3RpdmUgTWluaW1hcFxuICAgKi9cbiAgZ2V0QWN0aXZlTWluaW1hcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWluaW1hcEZvckVkaXRvcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYSBmdW5jdGlvbiBmb3IgZWFjaCBwcmVzZW50IGFuZCBmdXR1cmUgbWluaW1hcHMuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gaXRlcmF0b3IgYSBmdW5jdGlvbiB0byBjYWxsIHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhpc3RpbmcgYW5kIGZ1dHVyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltYXBzXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byB1bnJlZ2lzdGVyIHRoZSBvYnNlcnZlclxuICAgKi9cbiAgb2JzZXJ2ZU1pbmltYXBzIChpdGVyYXRvcikge1xuICAgIGlmICghaXRlcmF0b3IpIHsgcmV0dXJuIH1cblxuICAgIGlmICh0aGlzLmVkaXRvcnNNaW5pbWFwcykge1xuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgobWluaW1hcCkgPT4geyBpdGVyYXRvcihtaW5pbWFwKSB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZENyZWF0ZU1pbmltYXAoKG1pbmltYXApID0+IHsgaXRlcmF0b3IobWluaW1hcCkgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdG8gdGhlIGBvYnNlcnZlVGV4dEVkaXRvcnNgIG1ldGhvZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbml0U3Vic2NyaXB0aW9ucyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIGxldCBtaW5pbWFwID0gdGhpcy5taW5pbWFwRm9yRWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICBsZXQgbWluaW1hcEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcobWluaW1hcClcblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtbWluaW1hcCcsIG1pbmltYXApXG5cbiAgICAgIG1pbmltYXBFbGVtZW50LmF0dGFjaCgpXG4gICAgfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBpbnN0YW5jZSBvZiB0aGUgYE1haW5gIGNsYXNzLlxuICpcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFpbigpXG4iXX0=
//# sourceURL=/home/champ/.atom/packages/minimap/lib/main.js