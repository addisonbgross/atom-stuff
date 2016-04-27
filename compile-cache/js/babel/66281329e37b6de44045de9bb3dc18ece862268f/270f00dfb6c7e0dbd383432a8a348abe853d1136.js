"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

exports["default"] = {
  config: {
    // It should be noted that I, Kepler, hate these Config names. However these
    //  are the names in use by many people. Changing them for the sake of clean
    //  of clean code would cause a mess for our users. Because of this we
    //  override the titles the editor gives them in the settings pane.
    execPath: {
      type: "string",
      "default": "clang"
    },
    clangIncludePaths: {
      type: "array",
      "default": ["."]
    },
    clangSuppressWarnings: {
      type: "boolean",
      "default": false
    },
    clangDefaultCFlags: {
      type: "string",
      "default": "-Wall"
    },
    clangDefaultCppFlags: {
      type: "string",
      "default": "-Wall -std=c++11"
    },
    clangDefaultObjCFlags: {
      type: "string",
      "default": ""
    },
    clangDefaultObjCppFlags: {
      type: "string",
      "default": ""
    },
    clangErrorLimit: {
      type: "integer",
      "default": 0
    },
    verboseDebug: {
      type: "boolean",
      "default": false
    }
  },

  activate: function activate() {
    require("atom-package-deps").install("linter-clang");
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var clangFlags = require("clang-flags");
    var regex = "(?<file>.+):(?<line>\\d+):(?<col>\\d+):(\{(?<lineStart>\\d+):(?<colStart>\\d+)\-(?<lineEnd>\\d+):(?<colEnd>\\d+)}.*:)? (?<type>[\\w \\-]+): (?<message>.*)";
    return {
      name: "clang",
      grammarScopes: ["source.c", "source.cpp", "source.objc", "source.objcpp"],
      scope: "file",
      lintOnFly: false,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-clang.execPath");
        var file = activeEditor.getPath();
        var args = ["-fsyntax-only", "-fno-caret-diagnostics", "-fno-diagnostics-fixit-info", "-fdiagnostics-print-source-range-info", "-fexceptions"];

        var grammar = activeEditor.getGrammar().name;

        if (/^C\+\+/.test(grammar)) {
          //const language = "c++";
          args.push("-xc++");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultCppFlags").split(/\s+/)));
        }
        if (grammar === "Objective-C++") {
          //const language = "objective-c++";
          args.push("-xobjective-c++");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultObjCppFlags").split(/\s+/)));
        }
        if (grammar === "C") {
          //const language = "c";
          args.push("-xc");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultCFlags").split(/\s+/)));
        }
        if (grammar === "Objective-C") {
          //const language = "objective-c";
          args.push("-xobjective-c");
          args.push.apply(args, _toConsumableArray(atom.config.get("linter-clang.clangDefaultObjCFlags").split(/\s+/)));
        }

        args.push("-ferror-limit=" + atom.config.get("linter-clang.clangErrorLimit"));
        if (atom.config.get("linter-clang.clangSuppressWarnings")) {
          args.push("-w");
        }
        if (atom.config.get("linter-clang.verboseDebug")) {
          args.push("--verbose");
        }

        atom.config.get("linter-clang.clangIncludePaths").forEach(function (path) {
          return args.push("-I" + path);
        });

        try {
          flags = clangFlags.getClangFlags(activeEditor.getPath());
          if (flags) {
            args.push.apply(args, flags);
          }
        } catch (error) {
          if (atom.config.get("linter-clang.verboseDebug")) {
            console.log(error);
          }
        }

        // The file is added to the arguments last.
        args.push(file);
        return helpers.exec(command, args, { stream: "stderr" }).then(function (output) {
          return helpers.parse(output, regex);
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jbGFuZy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFOzs7OztBQUtOLFlBQVEsRUFBRTtBQUNSLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsT0FBTztLQUNqQjtBQUNELHFCQUFpQixFQUFFO0FBQ2pCLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVMsQ0FBQyxHQUFHLENBQUM7S0FDZjtBQUNELHlCQUFxQixFQUFFO0FBQ3JCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0Qsc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxPQUFPO0tBQ2pCO0FBQ0Qsd0JBQW9CLEVBQUU7QUFDcEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxrQkFBa0I7S0FDNUI7QUFDRCx5QkFBcUIsRUFBRTtBQUNyQixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLEVBQUU7S0FDWjtBQUNELDJCQUF1QixFQUFFO0FBQ3ZCLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsRUFBRTtLQUNaO0FBQ0QsbUJBQWUsRUFBRTtBQUNmLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsQ0FBQztLQUNYO0FBQ0QsZ0JBQVksRUFBRTtBQUNaLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNO0FBQ2QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0dBQ3REOztBQUVELGVBQWEsRUFBRSx5QkFBTTtBQUNuQixRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkMsUUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLFFB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LENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1dBQzlCO1NBQ0YsQ0FDRCxPQUFPLEtBQUssRUFBRTtBQUNaLGNBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsRUFBRTtBQUMvQyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNwQjtTQUNGOzs7QUFHRCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtpQkFDaEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1NBQUEsQ0FDN0IsQ0FBQztPQUNIO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGludGVyLWNsYW5nL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICAvLyBJdCBzaG91bGQgYmUgbm90ZWQgdGhhdCBJLCBLZXBsZXIsIGhhdGUgdGhlc2UgQ29uZmlnIG5hbWVzLiBIb3dldmVyIHRoZXNlXG4gICAgLy8gIGFyZSB0aGUgbmFtZXMgaW4gdXNlIGJ5IG1hbnkgcGVvcGxlLiBDaGFuZ2luZyB0aGVtIGZvciB0aGUgc2FrZSBvZiBjbGVhblxuICAgIC8vICBvZiBjbGVhbiBjb2RlIHdvdWxkIGNhdXNlIGEgbWVzcyBmb3Igb3VyIHVzZXJzLiBCZWNhdXNlIG9mIHRoaXMgd2VcbiAgICAvLyAgb3ZlcnJpZGUgdGhlIHRpdGxlcyB0aGUgZWRpdG9yIGdpdmVzIHRoZW0gaW4gdGhlIHNldHRpbmdzIHBhbmUuXG4gICAgZXhlY1BhdGg6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcImNsYW5nXCJcbiAgICB9LFxuICAgIGNsYW5nSW5jbHVkZVBhdGhzOiB7XG4gICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICBkZWZhdWx0OiBbXCIuXCJdXG4gICAgfSxcbiAgICBjbGFuZ1N1cHByZXNzV2FybmluZ3M6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGNsYW5nRGVmYXVsdENGbGFnczoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiLVdhbGxcIlxuICAgIH0sXG4gICAgY2xhbmdEZWZhdWx0Q3BwRmxhZ3M6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi1XYWxsIC1zdGQ9YysrMTFcIlxuICAgIH0sXG4gICAgY2xhbmdEZWZhdWx0T2JqQ0ZsYWdzOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJcIlxuICAgIH0sXG4gICAgY2xhbmdEZWZhdWx0T2JqQ3BwRmxhZ3M6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgfSxcbiAgICBjbGFuZ0Vycm9yTGltaXQ6IHtcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG4gICAgdmVyYm9zZURlYnVnOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJsaW50ZXItY2xhbmdcIik7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcjogKCkgPT4ge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKFwiYXRvbS1saW50ZXJcIik7XG4gICAgY29uc3QgY2xhbmdGbGFncyA9IHJlcXVpcmUoXCJjbGFuZy1mbGFnc1wiKTtcbiAgICBjb25zdCByZWdleCA9IFwiKD88ZmlsZT4uKyk6KD88bGluZT5cXFxcZCspOig/PGNvbD5cXFxcZCspOihcXHsoPzxsaW5lU3RhcnQ+XFxcXGQrKTooPzxjb2xTdGFydD5cXFxcZCspXFwtKD88bGluZUVuZD5cXFxcZCspOig/PGNvbEVuZD5cXFxcZCspfS4qOik/ICg/PHR5cGU+W1xcXFx3IFxcXFwtXSspOiAoPzxtZXNzYWdlPi4qKVwiO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcImNsYW5nXCIsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXCJzb3VyY2UuY1wiLCBcInNvdXJjZS5jcHBcIiwgXCJzb3VyY2Uub2JqY1wiLCBcInNvdXJjZS5vYmpjcHBcIl0sXG4gICAgICBzY29wZTogXCJmaWxlXCIsXG4gICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgbGludDogKGFjdGl2ZUVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLmV4ZWNQYXRoXCIpO1xuICAgICAgICBjb25zdCBmaWxlID0gYWN0aXZlRWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgYXJncyA9IFtcIi1mc3ludGF4LW9ubHlcIixcbiAgICAgICAgICBcIi1mbm8tY2FyZXQtZGlhZ25vc3RpY3NcIixcbiAgICAgICAgICBcIi1mbm8tZGlhZ25vc3RpY3MtZml4aXQtaW5mb1wiLFxuICAgICAgICAgIFwiLWZkaWFnbm9zdGljcy1wcmludC1zb3VyY2UtcmFuZ2UtaW5mb1wiLFxuICAgICAgICAgIFwiLWZleGNlcHRpb25zXCJdO1xuXG4gICAgICAgIGNvbnN0IGdyYW1tYXIgPSBhY3RpdmVFZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWU7XG5cbiAgICAgICAgaWYoL15DXFwrXFwrLy50ZXN0KGdyYW1tYXIpKSB7XG4gICAgICAgICAgLy9jb25zdCBsYW5ndWFnZSA9IFwiYysrXCI7XG4gICAgICAgICAgYXJncy5wdXNoKFwiLXhjKytcIik7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLmF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRDcHBGbGFnc1wiKS5zcGxpdCgvXFxzKy8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZihncmFtbWFyID09PSBcIk9iamVjdGl2ZS1DKytcIikge1xuICAgICAgICAgIC8vY29uc3QgbGFuZ3VhZ2UgPSBcIm9iamVjdGl2ZS1jKytcIjtcbiAgICAgICAgICBhcmdzLnB1c2goXCIteG9iamVjdGl2ZS1jKytcIik7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLmF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRPYmpDcHBGbGFnc1wiKS5zcGxpdCgvXFxzKy8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZihncmFtbWFyID09PSBcIkNcIikge1xuICAgICAgICAgIC8vY29uc3QgbGFuZ3VhZ2UgPSBcImNcIjtcbiAgICAgICAgICBhcmdzLnB1c2goXCIteGNcIik7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLmF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy5jbGFuZ0RlZmF1bHRDRmxhZ3NcIikuc3BsaXQoL1xccysvKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZ3JhbW1hciA9PT0gXCJPYmplY3RpdmUtQ1wiKSB7XG4gICAgICAgICAgLy9jb25zdCBsYW5ndWFnZSA9IFwib2JqZWN0aXZlLWNcIjtcbiAgICAgICAgICBhcmdzLnB1c2goXCIteG9iamVjdGl2ZS1jXCIpO1xuICAgICAgICAgIGFyZ3MucHVzaCguLi5hdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcuY2xhbmdEZWZhdWx0T2JqQ0ZsYWdzXCIpLnNwbGl0KC9cXHMrLykpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJncy5wdXNoKGAtZmVycm9yLWxpbWl0PSR7YXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLmNsYW5nRXJyb3JMaW1pdFwiKX1gKTtcbiAgICAgICAgaWYoYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLmNsYW5nU3VwcHJlc3NXYXJuaW5nc1wiKSkge1xuICAgICAgICAgIGFyZ3MucHVzaChcIi13XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGF0b20uY29uZmlnLmdldChcImxpbnRlci1jbGFuZy52ZXJib3NlRGVidWdcIikpIHtcbiAgICAgICAgICBhcmdzLnB1c2goXCItLXZlcmJvc2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItY2xhbmcuY2xhbmdJbmNsdWRlUGF0aHNcIikuZm9yRWFjaCgocGF0aCkgPT5cbiAgICAgICAgICBhcmdzLnB1c2goYC1JJHtwYXRofWApXG4gICAgICAgICk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmbGFncyA9IGNsYW5nRmxhZ3MuZ2V0Q2xhbmdGbGFncyhhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgICBpZihmbGFncykge1xuICAgICAgICAgICAgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIGZsYWdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaWYoYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWNsYW5nLnZlcmJvc2VEZWJ1Z1wiKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBmaWxlIGlzIGFkZGVkIHRvIHRoZSBhcmd1bWVudHMgbGFzdC5cbiAgICAgICAgYXJncy5wdXNoKGZpbGUpO1xuICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQsIGFyZ3MsIHtzdHJlYW06IFwic3RkZXJyXCJ9KS50aGVuKG91dHB1dCA9PlxuICAgICAgICAgIGhlbHBlcnMucGFyc2Uob3V0cHV0LCByZWdleClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19
//# sourceURL=/home/champ/.atom/packages/linter-clang/lib/main.js
