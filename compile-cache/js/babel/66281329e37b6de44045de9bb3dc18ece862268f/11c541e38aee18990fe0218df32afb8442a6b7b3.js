"use babel";

describe('Configuration function tests', function () {
  var main = require('../lib/main');
  var utility = require('../lib/utility.js');
  var settings = require("../lib/config").settings;

  beforeEach(function () {
    waitsForPromise(function () {
      atom.config.set('linter-gcc.execPath', '/usr/bin/g++');
      atom.config.set('linter-gcc.gccDefaultCFlags', '-Wall');
      atom.config.set('linter-gcc.gccDefaultCppFlags', '-Wall -std=c++11');
      atom.config.set('linter-gcc.gccErrorLimit', 15);
      atom.config.set('linter-gcc.gccIncludePaths', ' ');
      atom.config.set('linter-gcc.gccSuppressWarnings', true);
      main.messages = {};
      return atom.packages.activatePackage('linter-gcc');
    });
  });

  it('Uses default settings when no config file is found', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/comment.cpp').then(function () {
        var config = settings();
        expect(config.execPath).toEqual("/usr/bin/g++");
        expect(config.gccDefaultCFlags).toEqual("-Wall");
        expect(config.gccDefaultCppFlags).toEqual("-Wall -std=c++11");
        expect(config.gccErrorLimit).toEqual(15);
        expect(config.gccIncludePaths).toEqual(" ");
        expect(config.gccSuppressWarnings).toEqual(true);
      });
    });
  });

  it('Uses file-specific config file when it exists', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/project_test/sub1/subsub1/file.cpp').then(function () {
        var config = settings();
        expect(config.execPath).toEqual("exec_file");
        expect(config.gccDefaultCFlags).toEqual("cflags_file");
        expect(config.gccDefaultCppFlags).toEqual("cppflags_file");
        expect(config.gccErrorLimit).toEqual(1);
        expect(config.gccIncludePaths).toEqual("includepath_file");
        expect(config.gccSuppressWarnings).toEqual(true);
      });
    });
  });

  it('Uses directory-specific config file when it exists', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/project_test/sub2/file.cpp').then(function () {
        var config = settings();
        expect(config.execPath).toEqual("exec_subdir");
        expect(config.gccDefaultCFlags).toEqual("cflags_subdir");
        expect(config.gccDefaultCppFlags).toEqual("cppflags_subdir");
        expect(config.gccErrorLimit).toEqual(2);
        expect(config.gccIncludePaths).toEqual("includepath_subdir");
        expect(config.gccSuppressWarnings).toEqual(true);
      });
    });
  });

  it('Uses current directory config file when it exists', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/project_test/sub2/file.cpp').then(function () {
        var config = settings();
        expect(config.execPath).toEqual("exec_subdir");
        expect(config.gccDefaultCFlags).toEqual("cflags_subdir");
        expect(config.gccDefaultCppFlags).toEqual("cppflags_subdir");
        expect(config.gccErrorLimit).toEqual(2);
        expect(config.gccIncludePaths).toEqual("includepath_subdir");
        expect(config.gccSuppressWarnings).toEqual(true);
      });
    });
  });

  it('Uses upper-level config file when it exists', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/project_test/sub4/subsub2/file.cpp').then(function () {
        var config = settings();
        expect(config.execPath).toEqual("exec_updir");
        expect(config.gccDefaultCFlags).toEqual("cflags_updir");
        expect(config.gccDefaultCppFlags).toEqual("cppflags_updir");
        expect(config.gccErrorLimit).toEqual(5);
        expect(config.gccIncludePaths).toEqual("includepath_updir");
        expect(config.gccSuppressWarnings).toEqual(true);
      });
    });
  });

  it('Uses project-specific config file when it exists', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/project_test').then(function () {
        return atom.workspace.open(__dirname + '/files/project_test/sub3/file.cpp').then(function () {
          var config = settings();
          expect(config.execPath).toEqual("exec_project");
          expect(config.gccDefaultCFlags).toEqual("cflags_project");
          expect(config.gccDefaultCppFlags).toEqual("cppflags_project");
          expect(config.gccErrorLimit).toEqual(3);
          expect(config.gccIncludePaths).toEqual("includepath_project");
          expect(config.gccSuppressWarnings).toEqual(false);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2Mvc3BlYy9jb25maWctc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7O0FBRVosUUFBUSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDN0MsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ25DLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQzVDLE1BQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUE7O0FBRWhELFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3RELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDcEUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDbEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDdkQsVUFBSSxDQUFDLFFBQVEsR0FBQyxFQUFFLENBQUM7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUNuRCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLG9EQUFvRCxFQUFFLFlBQU07QUFDN0QsbUJBQWUsQ0FB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LENBQUMsQ0FBQTtBQUN2QyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUM3RCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNsRCxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGludGVyLWdjYy9zcGVjL2NvbmZpZy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZGVzY3JpYmUoJ0NvbmZpZ3VyYXRpb24gZnVuY3Rpb24gdGVzdHMnLCAoKSA9PiB7XG4gIGNvbnN0IG1haW4gPSByZXF1aXJlKCcuLi9saWIvbWFpbicpXG4gIGNvbnN0IHV0aWxpdHkgPSByZXF1aXJlKCcuLi9saWIvdXRpbGl0eS5qcycpXG4gIHZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCIuLi9saWIvY29uZmlnXCIpLnNldHRpbmdzXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWdjYy5leGVjUGF0aCcsICcvdXNyL2Jpbi9nKysnKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZ2NjLmdjY0RlZmF1bHRDRmxhZ3MnLCAnLVdhbGwnKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZ2NjLmdjY0RlZmF1bHRDcHBGbGFncycsICctV2FsbCAtc3RkPWMrKzExJylcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWdjYy5nY2NFcnJvckxpbWl0JywgMTUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1nY2MuZ2NjSW5jbHVkZVBhdGhzJywgJyAnKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZ2NjLmdjY1N1cHByZXNzV2FybmluZ3MnLCB0cnVlKVxuICAgICAgbWFpbi5tZXNzYWdlcz17fTtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyLWdjYycpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnVXNlcyBkZWZhdWx0IHNldHRpbmdzIHdoZW4gbm8gY29uZmlnIGZpbGUgaXMgZm91bmQnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZGlybmFtZSArICcvZmlsZXMvY29tbWVudC5jcHAnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB2YXIgY29uZmlnID0gc2V0dGluZ3MoKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZXhlY1BhdGgpLnRvRXF1YWwoXCIvdXNyL2Jpbi9nKytcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY0RlZmF1bHRDRmxhZ3MpLnRvRXF1YWwoXCItV2FsbFwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENwcEZsYWdzKS50b0VxdWFsKFwiLVdhbGwgLXN0ZD1jKysxMVwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRXJyb3JMaW1pdCkudG9FcXVhbCgxNSlcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY0luY2x1ZGVQYXRocykudG9FcXVhbChcIiBcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY1N1cHByZXNzV2FybmluZ3MpLnRvRXF1YWwodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBpdCgnVXNlcyBmaWxlLXNwZWNpZmljIGNvbmZpZyBmaWxlIHdoZW4gaXQgZXhpc3RzJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpbGVzL3Byb2plY3RfdGVzdC9zdWIxL3N1YnN1YjEvZmlsZS5jcHAnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB2YXIgY29uZmlnID0gc2V0dGluZ3MoKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZXhlY1BhdGgpLnRvRXF1YWwoXCJleGVjX2ZpbGVcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY0RlZmF1bHRDRmxhZ3MpLnRvRXF1YWwoXCJjZmxhZ3NfZmlsZVwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENwcEZsYWdzKS50b0VxdWFsKFwiY3BwZmxhZ3NfZmlsZVwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRXJyb3JMaW1pdCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjSW5jbHVkZVBhdGhzKS50b0VxdWFsKFwiaW5jbHVkZXBhdGhfZmlsZVwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjU3VwcHJlc3NXYXJuaW5ncykudG9FcXVhbCh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdVc2VzIGRpcmVjdG9yeS1zcGVjaWZpYyBjb25maWcgZmlsZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9wcm9qZWN0X3Rlc3Qvc3ViMi9maWxlLmNwcCcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHZhciBjb25maWcgPSBzZXR0aW5ncygpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5leGVjUGF0aCkudG9FcXVhbChcImV4ZWNfc3ViZGlyXCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NEZWZhdWx0Q0ZsYWdzKS50b0VxdWFsKFwiY2ZsYWdzX3N1YmRpclwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENwcEZsYWdzKS50b0VxdWFsKFwiY3BwZmxhZ3Nfc3ViZGlyXCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NFcnJvckxpbWl0KS50b0VxdWFsKDIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NJbmNsdWRlUGF0aHMpLnRvRXF1YWwoXCJpbmNsdWRlcGF0aF9zdWJkaXJcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY1N1cHByZXNzV2FybmluZ3MpLnRvRXF1YWwodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBpdCgnVXNlcyBjdXJyZW50IGRpcmVjdG9yeSBjb25maWcgZmlsZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9wcm9qZWN0X3Rlc3Qvc3ViMi9maWxlLmNwcCcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHZhciBjb25maWcgPSBzZXR0aW5ncygpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5leGVjUGF0aCkudG9FcXVhbChcImV4ZWNfc3ViZGlyXCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NEZWZhdWx0Q0ZsYWdzKS50b0VxdWFsKFwiY2ZsYWdzX3N1YmRpclwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENwcEZsYWdzKS50b0VxdWFsKFwiY3BwZmxhZ3Nfc3ViZGlyXCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NFcnJvckxpbWl0KS50b0VxdWFsKDIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NJbmNsdWRlUGF0aHMpLnRvRXF1YWwoXCJpbmNsdWRlcGF0aF9zdWJkaXJcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY1N1cHByZXNzV2FybmluZ3MpLnRvRXF1YWwodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBpdCgnVXNlcyB1cHBlci1sZXZlbCBjb25maWcgZmlsZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9wcm9qZWN0X3Rlc3Qvc3ViNC9zdWJzdWIyL2ZpbGUuY3BwJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdmFyIGNvbmZpZyA9IHNldHRpbmdzKClcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmV4ZWNQYXRoKS50b0VxdWFsKFwiZXhlY191cGRpclwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENGbGFncykudG9FcXVhbChcImNmbGFnc191cGRpclwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENwcEZsYWdzKS50b0VxdWFsKFwiY3BwZmxhZ3NfdXBkaXJcIilcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY0Vycm9yTGltaXQpLnRvRXF1YWwoNSlcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmdjY0luY2x1ZGVQYXRocykudG9FcXVhbChcImluY2x1ZGVwYXRoX3VwZGlyXCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NTdXBwcmVzc1dhcm5pbmdzKS50b0VxdWFsKHRydWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ1VzZXMgcHJvamVjdC1zcGVjaWZpYyBjb25maWcgZmlsZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9wcm9qZWN0X3Rlc3QnKS50aGVuKCAoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpbGVzL3Byb2plY3RfdGVzdC9zdWIzL2ZpbGUuY3BwJykudGhlbiggKCkgPT4ge1xuICAgICAgICAgIHZhciBjb25maWcgPSBzZXR0aW5ncygpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5leGVjUGF0aCkudG9FcXVhbChcImV4ZWNfcHJvamVjdFwiKVxuICAgICAgICAgIGV4cGVjdChjb25maWcuZ2NjRGVmYXVsdENGbGFncykudG9FcXVhbChcImNmbGFnc19wcm9qZWN0XCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NEZWZhdWx0Q3BwRmxhZ3MpLnRvRXF1YWwoXCJjcHBmbGFnc19wcm9qZWN0XCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NFcnJvckxpbWl0KS50b0VxdWFsKDMpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NJbmNsdWRlUGF0aHMpLnRvRXF1YWwoXCJpbmNsdWRlcGF0aF9wcm9qZWN0XCIpXG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5nY2NTdXBwcmVzc1dhcm5pbmdzKS50b0VxdWFsKGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/home/champ/.atom/packages/linter-gcc/spec/config-spec.js