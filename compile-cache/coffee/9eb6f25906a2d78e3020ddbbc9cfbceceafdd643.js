(function() {
  var Path, head, mocks, pathToRepoFile;

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/some/repository/directory/file");

  head = jasmine.createSpyObj('head', ['replace']);

  module.exports = mocks = {
    pathToRepoFile: pathToRepoFile,
    repo: {
      getPath: function() {
        return Path.join(this.getWorkingDirectory(), ".git");
      },
      getWorkingDirectory: function() {
        return Path.get("~/some/repository");
      },
      refreshStatus: function() {
        return void 0;
      },
      relativize: function(path) {
        if (path === pathToRepoFile) {
          return "directory/file";
        }
      },
      getReferences: function() {
        return {
          heads: [head]
        };
      },
      getShortHead: function() {
        return 'short head';
      },
      repo: {
        submoduleForPath: function(path) {
          return void 0;
        }
      }
    },
    currentPane: {
      isAlive: function() {
        return true;
      },
      activate: function() {
        return void 0;
      },
      destroy: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return pathToRepoFile;
            }
          }
        ];
      }
    },
    commitPane: {
      isAlive: function() {
        return true;
      },
      destroy: function() {
        return mocks.textEditor.destroy();
      },
      splitRight: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return Path.join(mocks.repo.getPath(), 'COMMIT_EDITMSG');
            }
          }
        ];
      }
    },
    textEditor: {
      getPath: function() {
        return pathToRepoFile;
      },
      getURI: function() {
        return pathToRepoFile;
      },
      onDidDestroy: function(destroy) {
        this.destroy = destroy;
        return {
          dispose: function() {}
        };
      },
      onDidSave: function(save) {
        this.save = save;
        return {
          dispose: function() {
            return void 0;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9maXh0dXJlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLGtDQUFULENBRmpCLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBTyxDQUFDLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxTQUFELENBQTdCLENBSlAsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsR0FDZjtBQUFBLElBQUEsY0FBQSxFQUFnQixjQUFoQjtBQUFBLElBRUEsSUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFWLEVBQXNDLE1BQXRDLEVBQUg7TUFBQSxDQUFUO0FBQUEsTUFDQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsR0FBTCxDQUFTLG1CQUFULEVBQUg7TUFBQSxDQURyQjtBQUFBLE1BRUEsYUFBQSxFQUFlLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQUZmO0FBQUEsTUFHQSxVQUFBLEVBQVksU0FBQyxJQUFELEdBQUE7QUFBVSxRQUFBLElBQW9CLElBQUEsS0FBUSxjQUE1QjtpQkFBQSxpQkFBQTtTQUFWO01BQUEsQ0FIWjtBQUFBLE1BSUEsYUFBQSxFQUFlLFNBQUEsR0FBQTtlQUNiO0FBQUEsVUFBQSxLQUFBLEVBQU8sQ0FBQyxJQUFELENBQVA7VUFEYTtNQUFBLENBSmY7QUFBQSxNQU1BLFlBQUEsRUFBYyxTQUFBLEdBQUE7ZUFBRyxhQUFIO01BQUEsQ0FOZDtBQUFBLE1BT0EsSUFBQSxFQUNFO0FBQUEsUUFBQSxnQkFBQSxFQUFrQixTQUFDLElBQUQsR0FBQTtpQkFBVSxPQUFWO1FBQUEsQ0FBbEI7T0FSRjtLQUhGO0FBQUEsSUFhQSxXQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxLQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQURWO0FBQUEsTUFFQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRlQ7QUFBQSxNQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRztVQUNYO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3FCQUFHLGVBQUg7WUFBQSxDQUFSO1dBRFc7VUFBSDtNQUFBLENBSFY7S0FkRjtBQUFBLElBcUJBLFVBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLEtBQUg7TUFBQSxDQUFUO0FBQUEsTUFDQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFqQixDQUFBLEVBQUg7TUFBQSxDQURUO0FBQUEsTUFFQSxVQUFBLEVBQVksU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRlo7QUFBQSxNQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRztVQUNYO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3FCQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFYLENBQUEsQ0FBVixFQUFnQyxnQkFBaEMsRUFBSDtZQUFBLENBQVI7V0FEVztVQUFIO01BQUEsQ0FIVjtLQXRCRjtBQUFBLElBNkJBLFVBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLGVBQUg7TUFBQSxDQUFUO0FBQUEsTUFDQSxNQUFBLEVBQVEsU0FBQSxHQUFBO2VBQUcsZUFBSDtNQUFBLENBRFI7QUFBQSxNQUVBLFlBQUEsRUFBYyxTQUFFLE9BQUYsR0FBQTtBQUNaLFFBRGEsSUFBQyxDQUFBLFVBQUEsT0FDZCxDQUFBO2VBQUE7QUFBQSxVQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUEsQ0FBVDtVQURZO01BQUEsQ0FGZDtBQUFBLE1BSUEsU0FBQSxFQUFXLFNBQUUsSUFBRixHQUFBO0FBQ1QsUUFEVSxJQUFDLENBQUEsT0FBQSxJQUNYLENBQUE7ZUFBQTtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTttQkFBRyxPQUFIO1VBQUEsQ0FBVDtVQURTO01BQUEsQ0FKWDtLQTlCRjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/git-plus/spec/fixtures.coffee
