(function() {
  var $, $$, ProfileEditPane, ProfileInfoPane, ProfileModifier, Profiles, TextEditorView, View, XRegExp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  Profiles = require('../profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  module.exports = {
    name: 'Highlighting Profile',
    info: ProfileInfoPane = (function() {
      function ProfileInfoPane(command, config) {
        var key, value, _ref1;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Profile:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = (_ref1 = Profiles.profiles[config.profile]) != null ? _ref1.profile_name : void 0;
        this.element.appendChild(key);
        this.element.appendChild(value);
      }

      return ProfileInfoPane;

    })(),
    edit: ProfileEditPane = (function(_super) {
      __extends(ProfileEditPane, _super);

      function ProfileEditPane() {
        return ProfileEditPane.__super__.constructor.apply(this, arguments);
      }

      ProfileEditPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Profile');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Select Highlighting Profile');
                });
              });
              return _this.select({
                "class": 'form-control',
                outlet: 'profile'
              });
            });
          };
        })(this));
      };

      ProfileEditPane.prototype.set = function(command, config) {
        this.populateProfiles();
        if (config != null) {
          return this.selectProfile(config.profile);
        }
      };

      ProfileEditPane.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'profile',
          config: {
            profile: this.profile.children()[this.profile[0].selectedIndex].attributes.getNamedItem('value').nodeValue
          }
        });
        return null;
      };

      ProfileEditPane.prototype.populateProfiles = function() {
        var createitem, gcc_index, id, key, _i, _len, _ref1;
        createitem = function(key, profile) {
          return $$(function() {
            return this.option({
              value: key
            }, profile);
          });
        };
        this.profile.empty();
        gcc_index = 0;
        _ref1 = Object.keys(Profiles.profiles);
        for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
          key = _ref1[id];
          this.profile.append(createitem(key, Profiles.profiles[key].profile_name));
          if (key === 'gcc_clang') {
            gcc_index = id;
          }
        }
        return this.profile[0].selectedIndex = gcc_index;
      };

      ProfileEditPane.prototype.selectProfile = function(profile) {
        var id, option, _i, _len, _ref1, _results;
        _ref1 = this.profile.children();
        _results = [];
        for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
          option = _ref1[id];
          if (option.attributes.getNamedItem('value').nodeValue === profile) {
            this.profile[0].selectedIndex = id;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return ProfileEditPane;

    })(View),
    modifier: ProfileModifier = (function() {
      function ProfileModifier(config, command, output) {
        var _base, _base1, _name, _ref1;
        this.config = config;
        this.command = command;
        this.output = output;
        this.profile = typeof (_base = Profiles.profiles)[_name = this.config.profile] === "function" ? new _base[_name](this.output) : void 0;
        if (this.profile == null) {
          if ((_ref1 = atom.notifications) != null) {
            _ref1.addError("Could not find highlighting profile: " + this.config.profile);
          }
          return;
        }
        if (typeof (_base1 = this.profile).clear === "function") {
          _base1.clear();
        }
        this.modify = this['modify' + Profiles.versions[this.config.profile]];
      }

      ProfileModifier.prototype.modify = function() {
        return null;
      };

      ProfileModifier.prototype.modify1 = function(_arg) {
        var temp;
        temp = _arg.temp;
        this.profile["in"](temp.input);
        return 1;
      };

      ProfileModifier.prototype.modify2 = function(_arg) {
        var perm, temp;
        temp = _arg.temp, perm = _arg.perm;
        return this.profile["in"](temp, perm);
      };

      ProfileModifier.prototype.getFiles = function(_arg) {
        var perm, temp;
        temp = _arg.temp, perm = _arg.perm;
        if (this.profile != null) {
          return this.profile.files(temp.input);
        } else {
          return [];
        }
      };

      return ProfileModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3N0cmVhbS1tb2RpZmllcnMvcHJvZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWdDLE9BQUEsQ0FBUSxzQkFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsRUFBd0IsWUFBQSxJQUF4QixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxzQkFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxPQUY3QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLHNCQUFOO0FBQUEsSUFFQSxJQUFBLEVBQ1E7QUFDUyxNQUFBLHlCQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDWCxZQUFBLGlCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGTixDQUFBO0FBQUEsUUFHQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsYUFBbEIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxHQUFHLENBQUMsU0FBSixHQUFnQixVQUpoQixDQUFBO0FBQUEsUUFLQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FMUixD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/stream-modifiers/profile.coffee
