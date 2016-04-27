
/*≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

	CONFIG DIRECTORY

	_Variables
	_DistractionFree

 * ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
 */

(function() {
  module.exports = {
    apply: function() {
      var hideIdleStatus, hideIdleTabs, hideInactiveFiles, hideSpotifiedPackage, root;
      root = document.documentElement;
      hideInactiveFiles = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-tree-items');
        } else {
          return root.classList.remove('hide-tree-items');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideFiles', function() {
        return hideInactiveFiles(atom.config.get('genesis-ui.distractionFree.hideFiles'));
      });
      hideInactiveFiles(atom.config.get('genesis-ui.distractionFree.hideFiles'));
      hideIdleTabs = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-idle-tabs');
        } else {
          return root.classList.remove('hide-idle-tabs');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideTabs', function() {
        return hideIdleTabs(atom.config.get('genesis-ui.distractionFree.hideTabs'));
      });
      hideIdleTabs(atom.config.get('genesis-ui.distractionFree.hideTabs'));
      hideIdleStatus = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-status-bar');
        } else {
          return root.classList.remove('hide-status-bar');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideBottom', function() {
        return hideIdleStatus(atom.config.get('genesis-ui.distractionFree.hideBottom'));
      });
      hideIdleStatus(atom.config.get('genesis-ui.distractionFree.hideBottom'));
      hideSpotifiedPackage = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-spotified');
        } else {
          return root.classList.remove('hide-spotified');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideSpotified', function() {
        return hideSpotifiedPackage(atom.config.get('genesis-ui.distractionFree.hideSpotified'));
      });
      return hideSpotifiedPackage(atom.config.get('genesis-ui.distractionFree.hideSpotified'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvZ2VuZXNpcy11aS9saWIvY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNDO0FBQUEsSUFBQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBTU4sVUFBQSwyRUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxlQUFoQixDQUFBO0FBQUEsTUFZQSxpQkFBQSxHQUFvQixTQUFDLE9BQUQsR0FBQTtBQUNuQixRQUFBLElBQUcsT0FBSDtpQkFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsaUJBQW5CLEVBREQ7U0FBQSxNQUFBO2lCQUdDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixDQUFzQixpQkFBdEIsRUFIRDtTQURtQjtNQUFBLENBWnBCLENBQUE7QUFBQSxNQWtCQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0Isc0NBQXhCLEVBQWdFLFNBQUEsR0FBQTtlQUMvRCxpQkFBQSxDQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQWxCLEVBRCtEO01BQUEsQ0FBaEUsQ0FsQkEsQ0FBQTtBQUFBLE1BcUJBLGlCQUFBLENBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBbEIsQ0FyQkEsQ0FBQTtBQUFBLE1Bd0JBLFlBQUEsR0FBZSxTQUFDLE9BQUQsR0FBQTtBQUNkLFFBQUEsSUFBRyxPQUFIO2lCQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixnQkFBbkIsRUFERDtTQUFBLE1BQUE7aUJBR0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFmLENBQXNCLGdCQUF0QixFQUhEO1NBRGM7TUFBQSxDQXhCZixDQUFBO0FBQUEsTUE4QkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHFDQUF4QixFQUErRCxTQUFBLEdBQUE7ZUFDOUQsWUFBQSxDQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBYixFQUQ4RDtNQUFBLENBQS9ELENBOUJBLENBQUE7QUFBQSxNQWlDQSxZQUFBLENBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQixDQUFiLENBakNBLENBQUE7QUFBQSxNQW9DQSxjQUFBLEdBQWlCLFNBQUMsT0FBRCxHQUFBO0FBQ2hCLFFBQUEsSUFBRyxPQUFIO2lCQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixpQkFBbkIsRUFERDtTQUFBLE1BQUE7aUJBR0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFmLENBQXNCLGlCQUF0QixFQUhEO1NBRGdCO01BQUEsQ0FwQ2pCLENBQUE7QUFBQSxNQTBDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsdUNBQXhCLEVBQWlFLFNBQUEsR0FBQTtlQUNoRSxjQUFBLENBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixDQUFmLEVBRGdFO01BQUEsQ0FBakUsQ0ExQ0EsQ0FBQTtBQUFBLE1BNkNBLGNBQUEsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQWYsQ0E3Q0EsQ0FBQTtBQUFBLE1BZ0RBLG9CQUFBLEdBQXVCLFNBQUMsT0FBRCxHQUFBO0FBQ3RCLFFBQUEsSUFBRyxPQUFIO2lCQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixDQUFtQixnQkFBbkIsRUFERDtTQUFBLE1BQUE7aUJBR0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFmLENBQXNCLGdCQUF0QixFQUhEO1NBRHNCO01BQUEsQ0FoRHZCLENBQUE7QUFBQSxNQXNEQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsMENBQXhCLEVBQW9FLFNBQUEsR0FBQTtlQUNuRSxvQkFBQSxDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMENBQWhCLENBQXJCLEVBRG1FO01BQUEsQ0FBcEUsQ0F0REEsQ0FBQTthQXlEQSxvQkFBQSxDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMENBQWhCLENBQXJCLEVBL0RNO0lBQUEsQ0FBUDtHQVZELENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/genesis-ui/lib/config.coffee
