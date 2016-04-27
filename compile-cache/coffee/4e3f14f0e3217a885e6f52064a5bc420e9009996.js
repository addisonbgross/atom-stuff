(function() {
  exports.getInsertIndex = function(sortedArray, object) {
    var curObject, index;
    if (sortedArray.length === 0) {
      return 0;
    }
    for (index in sortedArray) {
      curObject = sortedArray[index];
      if (object.isLessThan(curObject)) {
        return index;
      }
    }
    return sortedArray.length;
  };

  exports.insertOrdered = function(sortedArray, object) {
    var index;
    index = exports.getInsertIndex(sortedArray, object);
    return sortedArray.splice(index, 0, object);
  };

  exports.escapeValue = function(object) {
    if (typeof object === "string") {
      return "\"" + object.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
    return object;
  };

  exports.escapeHtml = function(string) {
    var entityMap, result;
    entityMap = {
      "<": "&lt;",
      ">": "&gt;"
    };
    result = String(string).replace(/[<>]/g, function(s) {
      return entityMap[s];
    });
    return result;
  };

  exports.arraySearch = function(array, object) {
    var curObject, index;
    if (array.length === 0) {
      return false;
    }
    for (index in array) {
      curObject = array[index];
      if (object.isEqual(curObject)) {
        return index;
      }
    }
    return false;
  };

  exports.arrayRemove = function(array, object) {
    var index, removed;
    index = exports.arraySearch(array, object);
    if (index === false) {
      return;
    }
    removed = array.splice(index, 1);
    if (removed.length > 0) {
      return removed[0];
    }
  };

  exports.serializeArray = function(array) {
    var curObject, index, object, ret;
    ret = [];
    for (index in array) {
      curObject = array[index];
      object = curObject.serialize();
      if (object === void 0) {
        continue;
      }
      ret.push(object);
    }
    return ret;
  };

  exports.deserializeArray = function(array) {
    var curObject, error, index, object, ret;
    ret = [];
    for (index in array) {
      curObject = array[index];
      try {
        object = atom.deserializers.deserialize(curObject);
        if (object === void 0) {
          continue;
        }
        ret.push(object);
      } catch (_error) {
        error = _error;
        console.error("Could not deserialize object");
        console.dir(curObject);
      }
    }
    return ret;
  };

  exports.localPathToRemote = function(localPath) {
    var local, path, pathMap, pathMaps, remote, _i, _len;
    pathMaps = atom.config.get('php-debug.PathMaps');
    for (_i = 0, _len = pathMaps.length; _i < _len; _i++) {
      pathMap = pathMaps[_i];
      remote = pathMap.substring(0, pathMap.indexOf(";"));
      local = pathMap.substring(pathMap.indexOf(";") + 1);
      if (localPath.indexOf(local) === 0) {
        path = localPath.replace(local, remote);
        if (remote.indexOf('/') !== null) {
          path = path.replace(/\\/g, '/');
        } else if (remote.indexOf('\\') !== null) {
          path = path.replace(/\//g, '\\');
        }
        return path.replace('file://', '');
      }
    }
    return localPath.replace('file://', '');
  };

  exports.remotePathToLocal = function(remotePath) {
    var adjustedPath, local, pathMap, pathMaps, remote, _i, _len;
    pathMaps = atom.config.get('php-debug.PathMaps');
    remotePath = decodeURI(remotePath);
    for (_i = 0, _len = pathMaps.length; _i < _len; _i++) {
      pathMap = pathMaps[_i];
      remote = pathMap.substring(0, pathMap.indexOf(";"));
      local = pathMap.substring(pathMap.indexOf(";") + 1);
      if (remotePath.indexOf('/') !== null && remotePath.indexOf('/') !== 0) {
        adjustedPath = '/' + remotePath;
        if (adjustedPath.indexOf(remote) === 0) {
          return adjustedPath.replace(remote, local);
          break;
        }
      } else {
        if (remotePath.indexOf(remote) === 0) {
          return remotePath.replace(remote, local);
          break;
        }
      }
    }
    return remotePath.replace('file://', '');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxPQUFPLENBQUMsY0FBUixHQUEwQixTQUFDLFdBQUQsRUFBYyxNQUFkLEdBQUE7QUFDeEIsUUFBQSxnQkFBQTtBQUFBLElBQUEsSUFBRyxXQUFXLENBQUMsTUFBWixLQUFzQixDQUF6QjtBQUNFLGFBQU8sQ0FBUCxDQURGO0tBQUE7QUFFQSxTQUFBLG9CQUFBO3FDQUFBO0FBQ0UsTUFBQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBQUg7QUFDRSxlQUFPLEtBQVAsQ0FERjtPQURGO0FBQUEsS0FGQTtBQUtBLFdBQU8sV0FBVyxDQUFDLE1BQW5CLENBTndCO0VBQUEsQ0FBMUIsQ0FBQTs7QUFBQSxFQVFBLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLFNBQUMsV0FBRCxFQUFjLE1BQWQsR0FBQTtBQUN0QixRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsY0FBUixDQUF1QixXQUF2QixFQUFvQyxNQUFwQyxDQUFSLENBQUE7V0FDQSxXQUFXLENBQUMsTUFBWixDQUFtQixLQUFuQixFQUEwQixDQUExQixFQUE2QixNQUE3QixFQUZzQjtFQUFBLENBUnhCLENBQUE7O0FBQUEsRUFZQSxPQUFPLENBQUMsV0FBUixHQUFzQixTQUFDLE1BQUQsR0FBQTtBQUNwQixJQUFBLElBQUksTUFBQSxDQUFBLE1BQUEsS0FBaUIsUUFBckI7QUFDRSxhQUFPLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsRUFBb0IsTUFBcEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxJQUFwQyxFQUF5QyxNQUF6QyxDQUFQLEdBQTBELElBQWpFLENBREY7S0FBQTtBQUVB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/helpers.coffee
