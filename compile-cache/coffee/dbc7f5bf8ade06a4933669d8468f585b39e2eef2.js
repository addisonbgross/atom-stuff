(function() {
  var BufferedProcess, crypto, debug, fs, hmacSecret, http, launch, net, os, path, port, prepare, querystring, request, reset, url, utility, ycmdProcess;

  crypto = require('crypto');

  fs = require('fs');

  http = require('http');

  net = require('net');

  os = require('os');

  path = require('path');

  querystring = require('querystring');

  url = require('url');

  BufferedProcess = require('atom').BufferedProcess;

  utility = require('./utility');

  debug = require('./debug');

  ycmdProcess = null;

  port = null;

  hmacSecret = null;

  launch = function() {
    var findUnusedPort, generateRandomSecret, processData, readDefaultOptions, startServer;
    findUnusedPort = new Promise(function(fulfill, reject) {
      return net.createServer().listen(0, function() {
        var result;
        result = this.address().port;
        this.close();
        return fulfill(result);
      }).on('error', function(error) {
        return reject(error);
      });
    });
    generateRandomSecret = new Promise(function(fulfill, reject) {
      return crypto.randomBytes(16, function(error, data) {
        if (error == null) {
          return fulfill(data);
        } else {
          return reject(error);
        }
      });
    });
    readDefaultOptions = new Promise(function(fulfill, reject) {
      var defaultOptionsFile;
      defaultOptionsFile = path.resolve(atom.config.get('you-complete-me.ycmdPath'), 'ycmd', 'default_settings.json');
      return fs.readFile(defaultOptionsFile, {
        encoding: 'utf8'
      }, function(error, data) {
        if (error == null) {
          return fulfill(JSON.parse(data));
        } else {
          return reject(error);
        }
      });
    });
    processData = function(_arg) {
      var options, randomSecret, unusedPort;
      unusedPort = _arg[0], randomSecret = _arg[1], options = _arg[2];
      return new Promise(function(fulfill, reject) {
        var optionsFile;
        port = unusedPort;
        hmacSecret = randomSecret;
        options.hmac_secret = hmacSecret.toString('base64');
        options.global_ycm_extra_conf = atom.config.get('you-complete-me.globalExtraConfig');
        options.rust_src_path = atom.config.get('you-complete-me.rustSrcPath');
        optionsFile = path.resolve(os.tmpdir(), "AtomYcmOptions-" + (Date.now()));
        return fs.writeFile(optionsFile, JSON.stringify(options), {
          encoding: 'utf8'
        }, function(error) {
          if (error == null) {
            return fulfill(optionsFile);
          } else {
            return reject(error);
          }
        });
      });
    };
    startServer = function(optionsFile) {
      return new Promise(function(fulfill, reject) {
        var parameters;
        parameters = {
          command: atom.config.get('you-complete-me.pythonExecutable'),
          args: [path.resolve(atom.config.get('you-complete-me.ycmdPath'), 'ycmd'), "--port=" + port, "--options_file=" + optionsFile, '--idle_suicide_seconds=600'],
          options: {},
          exit: function(status) {
            return ycmdProcess = null;
          }
        };
        parameters.stdout = function(output) {
          return debug.log('CONSOLE', output);
        };
        parameters.stderr = function(output) {
          return debug.log('CONSOLE', output);
        };
        ycmdProcess = new BufferedProcess(parameters);
        return setTimeout(fulfill, 1000);
      });
    };
    return Promise.all([findUnusedPort, generateRandomSecret, readDefaultOptions]).then(processData).then(startServer);
  };

  prepare = function() {
    if ((ycmdProcess != null ? ycmdProcess.killed : void 0) === false) {
      return Promise.resolve();
    } else {
      return launch();
    }
  };

  reset = function() {
    if (ycmdProcess != null) {
      ycmdProcess.kill();
    }
    ycmdProcess = null;
    port = null;
    hmacSecret = null;
    return Promise.resolve();
  };

  request = function(method, endpoint, parameters) {
    if (parameters == null) {
      parameters = null;
    }
    return prepare().then(function() {
      var escapeUnicode, generateHmac, handleException, secureCompare, signMessage, verifyHmac, verifyMessage;
      generateHmac = function(data, encoding) {
        return crypto.createHmac('sha256', hmacSecret).update(data).digest(encoding);
      };
      verifyHmac = function(data, hmac, encoding) {
        return secureCompare(generateHmac(data, encoding), hmac);
      };
      secureCompare = function(string1, string2) {
        if (!(typeof string1 === 'string' && typeof string2 === 'string')) {
          return false;
        }
        if (string1.length !== string2.length) {
          return false;
        }
        return Buffer.compare(generateHmac(string1), generateHmac(string2)) === 0;
      };
      signMessage = function(message, payload) {
        return message.headers['X-Ycm-Hmac'] = generateHmac(Buffer.concat([generateHmac(message.method), generateHmac(message.path), generateHmac(payload)]), 'base64');
      };
      verifyMessage = function(message, payload) {
        return verifyHmac(payload, message.headers['x-ycm-hmac'], 'base64');
      };
      escapeUnicode = function(string) {
        var char, charCode, escapedString, i, _i, _ref;
        escapedString = '';
        for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          char = string.charAt(i);
          charCode = string.charCodeAt(i);
          escapedString += charCode < 0x80 ? char : '\\u' + ('0000' + charCode.toString(16)).substr(-4);
        }
        return escapedString;
      };
      handleException = function(response) {
        var confirmExtraConfig, notifyException, shouldIgnore;
        notifyException = function() {
          return atom.notifications.addError("[YCM] " + response.exception.TYPE + " " + response.message, {
            detail: atom.inDevMode() ? "" + response.traceback : null
          });
        };
        confirmExtraConfig = function() {
          var filepath, message;
          filepath = response.exception.extra_conf_file;
          message = response.message;
          return atom.confirm({
            message: '[YCM] Unknown Extra Config',
            detailedMessage: message,
            buttons: {
              Load: function() {
                return request('POST', 'load_extra_conf_file', {
                  filepath: filepath
                });
              },
              Ignore: function() {
                return request('POST', 'ignore_extra_conf_file', {
                  filepath: filepath
                });
              }
            }
          });
        };
        shouldIgnore = function() {
          return response.message === 'File already being parsed.';
        };
        if ((response != null ? response.exception : void 0) != null) {
          switch (response.exception.TYPE) {
            case 'UnknownExtraConf':
              return confirmExtraConfig();
            default:
              if (!shouldIgnore) {
                return notifyException();
              }
          }
        }
      };
      return Promise.resolve().then(function() {
        var isPost, requestMessage, requestPayload;
        requestMessage = {
          hostname: 'localhost',
          port: port,
          method: method,
          path: url.resolve('/', endpoint),
          headers: {}
        };
        isPost = method === 'POST';
        requestPayload = '';
        if (isPost) {
          if (parameters != null) {
            requestPayload = escapeUnicode(JSON.stringify(parameters));
          }
          requestMessage.headers['Content-Type'] = 'application/json';
          requestMessage.headers['Content-Length'] = requestPayload.length;
        } else {
          if (parameters != null) {
            requestMessage.path += "?" + (querystring.stringify(parameters));
          }
        }
        signMessage(requestMessage, requestPayload);
        return [requestMessage, isPost, requestPayload];
      }).then(function(_arg) {
        var isPost, requestMessage, requestPayload;
        requestMessage = _arg[0], isPost = _arg[1], requestPayload = _arg[2];
        return new Promise(function(fulfill, reject) {
          var requestHandler;
          requestHandler = http.request(requestMessage, function(responseMessage) {
            var responsePayload;
            responseMessage.setEncoding('utf8');
            responsePayload = '';
            responseMessage.on('data', function(chunk) {
              return responsePayload += chunk;
            });
            return responseMessage.on('end', function() {
              var error, responseObject;
              if (verifyMessage(responseMessage, responsePayload)) {
                responseObject = (function() {
                  try {
                    return JSON.parse(responsePayload);
                  } catch (_error) {
                    error = _error;
                    return responsePayload;
                  }
                })();
                debug.log('REQUEST', method, endpoint, parameters);
                debug.log('RESPONSE', responseObject);
                handleException(responseObject);
                return fulfill(responseObject);
              } else {
                return reject(new Error('Bad Hmac'));
              }
            });
          });
          requestHandler.on('error', function(error) {
            return reject(error);
          });
          if (isPost) {
            requestHandler.write(requestPayload);
          }
          return requestHandler.end();
        });
      });
    });
  };

  module.exports = {
    prepare: prepare,
    reset: reset,
    request: request
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQU5kLENBQUE7O0FBQUEsRUFPQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FQTixDQUFBOztBQUFBLEVBUUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBUkQsQ0FBQTs7QUFBQSxFQVVBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQVZWLENBQUE7O0FBQUEsRUFXQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FYUixDQUFBOztBQUFBLEVBYUEsV0FBQSxHQUFjLElBYmQsQ0FBQTs7QUFBQSxFQWNBLElBQUEsR0FBTyxJQWRQLENBQUE7O0FBQUEsRUFlQSxVQUFBLEdBQWEsSUFmYixDQUFBOztBQUFBLEVBaUJBLE1BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxRQUFBLGtGQUFBO0FBQUEsSUFBQSxjQUFBLEdBQXFCLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTthQUMzQixHQUFHLENBQUMsWUFBSixDQUFBLENBQ0UsQ0FBQyxNQURILENBQ1UsQ0FEVixFQUNhLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBYyxDQUFDLElBQXhCLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FEQSxDQUFBO2VBRUEsT0FBQSxDQUFRLE1BQVIsRUFIUztNQUFBLENBRGIsQ0FLRSxDQUFDLEVBTEgsQ0FLTSxPQUxOLEVBS2UsU0FBQyxLQUFELEdBQUE7ZUFDWCxNQUFBLENBQU8sS0FBUCxFQURXO01BQUEsQ0FMZixFQUQyQjtJQUFBLENBQVIsQ0FBckIsQ0FBQTtBQUFBLElBU0Esb0JBQUEsR0FBMkIsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO2FBQ2pDLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEVBQW5CLEVBQXVCLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNyQixRQUFBLElBQU8sYUFBUDtpQkFDRSxPQUFBLENBQVEsSUFBUixFQURGO1NBQUEsTUFBQTtpQkFHRSxNQUFBLENBQU8sS0FBUCxFQUhGO1NBRHFCO01BQUEsQ0FBdkIsRUFEaUM7SUFBQSxDQUFSLENBVDNCLENBQUE7QUFBQSxJQWdCQSxrQkFBQSxHQUF5QixJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDL0IsVUFBQSxrQkFBQTtBQUFBLE1BQUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQWIsRUFBMEQsTUFBMUQsRUFBa0UsdUJBQWxFLENBQXJCLENBQUE7YUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLGtCQUFaLEVBQWdDO0FBQUEsUUFBQSxRQUFBLEVBQVUsTUFBVjtPQUFoQyxFQUFrRCxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDaEQsUUFBQSxJQUFPLGFBQVA7aUJBQ0UsT0FBQSxDQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFSLEVBREY7U0FBQSxNQUFBO2lCQUdFLE1BQUEsQ0FBTyxLQUFQLEVBSEY7U0FEZ0Q7TUFBQSxDQUFsRCxFQUYrQjtJQUFBLENBQVIsQ0FoQnpCLENBQUE7QUFBQSxJQXdCQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFBeUMsVUFBQSxpQ0FBQTtBQUFBLE1BQXZDLHNCQUFZLHdCQUFjLGlCQUFhLENBQUE7YUFBSSxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDakUsWUFBQSxXQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sVUFBUCxDQUFBO0FBQUEsUUFDQSxVQUFBLEdBQWEsWUFEYixDQUFBO0FBQUEsUUFFQSxPQUFPLENBQUMsV0FBUixHQUFzQixVQUFVLENBQUMsUUFBWCxDQUFvQixRQUFwQixDQUZ0QixDQUFBO0FBQUEsUUFHQSxPQUFPLENBQUMscUJBQVIsR0FBZ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQUhoQyxDQUFBO0FBQUEsUUFJQSxPQUFPLENBQUMsYUFBUixHQUF3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBSnhCLENBQUE7QUFBQSxRQUtBLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBYixFQUEyQixpQkFBQSxHQUFnQixDQUFDLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FBRCxDQUEzQyxDQUxkLENBQUE7ZUFNQSxFQUFFLENBQUMsU0FBSCxDQUFhLFdBQWIsRUFBMEIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLENBQTFCLEVBQW1EO0FBQUEsVUFBQSxRQUFBLEVBQVUsTUFBVjtTQUFuRCxFQUFxRSxTQUFDLEtBQUQsR0FBQTtBQUNuRSxVQUFBLElBQU8sYUFBUDttQkFDRSxPQUFBLENBQVEsV0FBUixFQURGO1dBQUEsTUFBQTttQkFHRSxNQUFBLENBQU8sS0FBUCxFQUhGO1dBRG1FO1FBQUEsQ0FBckUsRUFQaUU7TUFBQSxDQUFSLEVBQTdDO0lBQUEsQ0F4QmQsQ0FBQTtBQUFBLElBcUNBLFdBQUEsR0FBYyxTQUFDLFdBQUQsR0FBQTthQUFxQixJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDekMsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQ0U7QUFBQSxVQUFBLE9BQUEsRUFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQVQ7QUFBQSxVQUNBLElBQUEsRUFBTSxDQUNKLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixDQUFiLEVBQTBELE1BQTFELENBREksRUFFSCxTQUFBLEdBQVMsSUFGTixFQUdILGlCQUFBLEdBQWlCLFdBSGQsRUFJSiw0QkFKSSxDQUROO0FBQUEsVUFPQSxPQUFBLEVBQVMsRUFQVDtBQUFBLFVBUUEsSUFBQSxFQUFNLFNBQUMsTUFBRCxHQUFBO21CQUFZLFdBQUEsR0FBYyxLQUExQjtVQUFBLENBUk47U0FERixDQUFBO0FBQUEsUUFVQSxVQUFVLENBQUMsTUFBWCxHQUFvQixTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFLLENBQUMsR0FBTixDQUFVLFNBQVYsRUFBcUIsTUFBckIsRUFBWjtRQUFBLENBVnBCLENBQUE7QUFBQSxRQVdBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUssQ0FBQyxHQUFOLENBQVUsU0FBVixFQUFxQixNQUFyQixFQUFaO1FBQUEsQ0FYcEIsQ0FBQTtBQUFBLFFBWUEsV0FBQSxHQUFrQixJQUFBLGVBQUEsQ0FBZ0IsVUFBaEIsQ0FabEIsQ0FBQTtlQWFBLFVBQUEsQ0FBVyxPQUFYLEVBQW9CLElBQXBCLEVBZHlDO01BQUEsQ0FBUixFQUFyQjtJQUFBLENBckNkLENBQUE7V0FxREEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLGNBQUQsRUFBaUIsb0JBQWpCLEVBQXVDLGtCQUF2QyxDQUFaLENBQ0UsQ0FBQyxJQURILENBQ1EsV0FEUixDQUVFLENBQUMsSUFGSCxDQUVRLFdBRlIsRUF0RE87RUFBQSxDQWpCVCxDQUFBOztBQUFBLEVBMkVBLE9BQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixJQUFBLDJCQUFHLFdBQVcsQ0FBRSxnQkFBYixLQUF1QixLQUExQjthQUNFLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFERjtLQUFBLE1BQUE7YUFHRSxNQUFBLENBQUEsRUFIRjtLQURRO0VBQUEsQ0EzRVYsQ0FBQTs7QUFBQSxFQWlGQSxLQUFBLEdBQVEsU0FBQSxHQUFBOztNQUNOLFdBQVcsQ0FBRSxJQUFiLENBQUE7S0FBQTtBQUFBLElBQ0EsV0FBQSxHQUFjLElBRGQsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUFPLElBRlAsQ0FBQTtBQUFBLElBR0EsVUFBQSxHQUFhLElBSGIsQ0FBQTtXQUlBLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFMTTtFQUFBLENBakZSLENBQUE7O0FBQUEsRUF3RkEsT0FBQSxHQUFVLFNBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsVUFBbkIsR0FBQTs7TUFBbUIsYUFBYTtLQUFTO1dBQUEsT0FBQSxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQSxHQUFBO0FBQ2hFLFVBQUEsbUdBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7ZUFDYixNQUFNLENBQUMsVUFBUCxDQUFrQixRQUFsQixFQUE0QixVQUE1QixDQUF1QyxDQUFDLE1BQXhDLENBQStDLElBQS9DLENBQW9ELENBQUMsTUFBckQsQ0FBNEQsUUFBNUQsRUFEYTtNQUFBLENBQWYsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxRQUFiLEdBQUE7ZUFDWCxhQUFBLENBQWMsWUFBQSxDQUFhLElBQWIsRUFBbUIsUUFBbkIsQ0FBZCxFQUE0QyxJQUE1QyxFQURXO01BQUEsQ0FIYixDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTtBQUNkLFFBQUEsSUFBQSxDQUFBLENBQW9CLE1BQUEsQ0FBQSxPQUFBLEtBQWtCLFFBQWxCLElBQStCLE1BQUEsQ0FBQSxPQUFBLEtBQWtCLFFBQXJFLENBQUE7QUFBQSxpQkFBTyxLQUFQLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBb0IsT0FBTyxDQUFDLE1BQVIsS0FBa0IsT0FBTyxDQUFDLE1BQTlDO0FBQUEsaUJBQU8sS0FBUCxDQUFBO1NBREE7QUFFQSxlQUFPLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBQSxDQUFhLE9BQWIsQ0FBZixFQUFzQyxZQUFBLENBQWEsT0FBYixDQUF0QyxDQUFBLEtBQWdFLENBQXZFLENBSGM7TUFBQSxDQU5oQixDQUFBO0FBQUEsTUFXQSxXQUFBLEdBQWMsU0FBQyxPQUFELEVBQVUsT0FBVixHQUFBO2VBQ1osT0FBTyxDQUFDLE9BQVEsQ0FBQSxZQUFBLENBQWhCLEdBQWdDLFlBQUEsQ0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQUMsWUFBQSxDQUFhLE9BQU8sQ0FBQyxNQUFyQixDQUFELEVBQStCLFlBQUEsQ0FBYSxPQUFPLENBQUMsSUFBckIsQ0FBL0IsRUFBMkQsWUFBQSxDQUFhLE9BQWIsQ0FBM0QsQ0FBZCxDQUFiLEVBQStHLFFBQS9HLEVBRHBCO01BQUEsQ0FYZCxDQUFBO0FBQUEsTUFjQSxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTtlQUNkLFVBQUEsQ0FBVyxPQUFYLEVBQW9CLE9BQU8sQ0FBQyxPQUFRLENBQUEsWUFBQSxDQUFwQyxFQUFtRCxRQUFuRCxFQURjO01BQUEsQ0FkaEIsQ0FBQTtBQUFBLE1BaUJBLGFBQUEsR0FBZ0IsU0FBQyxNQUFELEdBQUE7QUFDZCxZQUFBLDBDQUFBO0FBQUEsUUFBQSxhQUFBLEdBQWdCLEVBQWhCLENBQUE7QUFDQSxhQUFTLGdHQUFULEdBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBUCxDQUFBO0FBQUEsVUFDQSxRQUFBLEdBQVcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FEWCxDQUFBO0FBQUEsVUFFQSxhQUFBLElBQW9CLFFBQUEsR0FBVyxJQUFkLEdBQXdCLElBQXhCLEdBQW1DLEtBQUEsR0FBUSxDQUFDLE1BQUEsR0FBUyxRQUFRLENBQUMsUUFBVCxDQUFrQixFQUFsQixDQUFWLENBQStCLENBQUMsTUFBaEMsQ0FBdUMsQ0FBQSxDQUF2QyxDQUY1RCxDQURGO0FBQUEsU0FEQTtBQUtBLGVBQU8sYUFBUCxDQU5jO01BQUEsQ0FqQmhCLENBQUE7QUFBQSxNQXlCQSxlQUFBLEdBQWtCLFNBQUMsUUFBRCxHQUFBO0FBQ2hCLFlBQUEsaURBQUE7QUFBQSxRQUFBLGVBQUEsR0FBa0IsU0FBQSxHQUFBO2lCQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTZCLFFBQUEsR0FBUSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQTNCLEdBQWdDLEdBQWhDLEdBQW1DLFFBQVEsQ0FBQyxPQUF6RSxFQUFvRjtBQUFBLFlBQUEsTUFBQSxFQUFXLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBSCxHQUF5QixFQUFBLEdBQUcsUUFBUSxDQUFDLFNBQXJDLEdBQXNELElBQTlEO1dBQXBGLEVBRGdCO1FBQUEsQ0FBbEIsQ0FBQTtBQUFBLFFBR0Esa0JBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsaUJBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxRQUFRLENBQUMsU0FBUyxDQUFDLGVBQTlCLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsT0FEbkIsQ0FBQTtpQkFFQSxJQUFJLENBQUMsT0FBTCxDQUNFO0FBQUEsWUFBQSxPQUFBLEVBQVMsNEJBQVQ7QUFBQSxZQUNBLGVBQUEsRUFBaUIsT0FEakI7QUFBQSxZQUVBLE9BQUEsRUFDRTtBQUFBLGNBQUEsSUFBQSxFQUFNLFNBQUEsR0FBQTt1QkFBRyxPQUFBLENBQVEsTUFBUixFQUFnQixzQkFBaEIsRUFBd0M7QUFBQSxrQkFBQyxVQUFBLFFBQUQ7aUJBQXhDLEVBQUg7Y0FBQSxDQUFOO0FBQUEsY0FDQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3VCQUFHLE9BQUEsQ0FBUSxNQUFSLEVBQWdCLHdCQUFoQixFQUEwQztBQUFBLGtCQUFDLFVBQUEsUUFBRDtpQkFBMUMsRUFBSDtjQUFBLENBRFI7YUFIRjtXQURGLEVBSG1CO1FBQUEsQ0FIckIsQ0FBQTtBQUFBLFFBYUEsWUFBQSxHQUFlLFNBQUEsR0FBQTtpQkFDYixRQUFRLENBQUMsT0FBVCxLQUFvQiw2QkFEUDtRQUFBLENBYmYsQ0FBQTtBQWdCQSxRQUFBLElBQUcsd0RBQUg7QUFDRSxrQkFBTyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQTFCO0FBQUEsaUJBQ08sa0JBRFA7cUJBQytCLGtCQUFBLENBQUEsRUFEL0I7QUFBQTtBQUVPLGNBQUEsSUFBQSxDQUFBLFlBQUE7dUJBQUEsZUFBQSxDQUFBLEVBQUE7ZUFGUDtBQUFBLFdBREY7U0FqQmdCO01BQUEsQ0F6QmxCLENBQUE7YUErQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUNFLENBQUMsSUFESCxDQUNRLFNBQUEsR0FBQTtBQUNKLFlBQUEsc0NBQUE7QUFBQSxRQUFBLGNBQUEsR0FDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLFdBQVY7QUFBQSxVQUNBLElBQUEsRUFBTSxJQUROO0FBQUEsVUFFQSxNQUFBLEVBQVEsTUFGUjtBQUFBLFVBR0EsSUFBQSxFQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBWixFQUFpQixRQUFqQixDQUhOO0FBQUEsVUFJQSxPQUFBLEVBQVMsRUFKVDtTQURGLENBQUE7QUFBQSxRQU1BLE1BQUEsR0FBUyxNQUFBLEtBQVUsTUFObkIsQ0FBQTtBQUFBLFFBT0EsY0FBQSxHQUFpQixFQVBqQixDQUFBO0FBUUEsUUFBQSxJQUFHLE1BQUg7QUFDRSxVQUFBLElBQTRELGtCQUE1RDtBQUFBLFlBQUEsY0FBQSxHQUFpQixhQUFBLENBQWMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxVQUFmLENBQWQsQ0FBakIsQ0FBQTtXQUFBO0FBQUEsVUFDQSxjQUFjLENBQUMsT0FBUSxDQUFBLGNBQUEsQ0FBdkIsR0FBeUMsa0JBRHpDLENBQUE7QUFBQSxVQUVBLGNBQWMsQ0FBQyxPQUFRLENBQUEsZ0JBQUEsQ0FBdkIsR0FBMkMsY0FBYyxDQUFDLE1BRjFELENBREY7U0FBQSxNQUFBO0FBS0UsVUFBQSxJQUFpRSxrQkFBakU7QUFBQSxZQUFBLGNBQWMsQ0FBQyxJQUFmLElBQXdCLEdBQUEsR0FBRSxDQUFDLFdBQVcsQ0FBQyxTQUFaLENBQXNCLFVBQXRCLENBQUQsQ0FBMUIsQ0FBQTtXQUxGO1NBUkE7QUFBQSxRQWNBLFdBQUEsQ0FBWSxjQUFaLEVBQTRCLGNBQTVCLENBZEEsQ0FBQTtBQWVBLGVBQU8sQ0FBQyxjQUFELEVBQWlCLE1BQWpCLEVBQXlCLGNBQXpCLENBQVAsQ0FoQkk7TUFBQSxDQURSLENBbUJFLENBQUMsSUFuQkgsQ0FtQlEsU0FBQyxJQUFELEdBQUE7QUFBOEMsWUFBQSxzQ0FBQTtBQUFBLFFBQTVDLDBCQUFnQixrQkFBUSx3QkFBb0IsQ0FBQTtlQUFJLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUM5RCxjQUFBLGNBQUE7QUFBQSxVQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxjQUFiLEVBQTZCLFNBQUMsZUFBRCxHQUFBO0FBQzVDLGdCQUFBLGVBQUE7QUFBQSxZQUFBLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixNQUE1QixDQUFBLENBQUE7QUFBQSxZQUNBLGVBQUEsR0FBa0IsRUFEbEIsQ0FBQTtBQUFBLFlBRUEsZUFBZSxDQUFDLEVBQWhCLENBQW1CLE1BQW5CLEVBQTJCLFNBQUMsS0FBRCxHQUFBO3FCQUFXLGVBQUEsSUFBbUIsTUFBOUI7WUFBQSxDQUEzQixDQUZBLENBQUE7bUJBR0EsZUFBZSxDQUFDLEVBQWhCLENBQW1CLEtBQW5CLEVBQTBCLFNBQUEsR0FBQTtBQUN4QixrQkFBQSxxQkFBQTtBQUFBLGNBQUEsSUFBRyxhQUFBLENBQWMsZUFBZCxFQUErQixlQUEvQixDQUFIO0FBQ0UsZ0JBQUEsY0FBQTtBQUFpQjsyQkFBSSxJQUFJLENBQUMsS0FBTCxDQUFXLGVBQVgsRUFBSjttQkFBQSxjQUFBO0FBQWdELG9CQUFYLGNBQVcsQ0FBQTsyQkFBQSxnQkFBaEQ7O29CQUFqQixDQUFBO0FBQUEsZ0JBQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDLFVBQXZDLENBREEsQ0FBQTtBQUFBLGdCQUVBLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBVixFQUFzQixjQUF0QixDQUZBLENBQUE7QUFBQSxnQkFHQSxlQUFBLENBQWdCLGNBQWhCLENBSEEsQ0FBQTt1QkFJQSxPQUFBLENBQVEsY0FBUixFQUxGO2VBQUEsTUFBQTt1QkFPRSxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0sVUFBTixDQUFYLEVBUEY7ZUFEd0I7WUFBQSxDQUExQixFQUo0QztVQUFBLENBQTdCLENBQWpCLENBQUE7QUFBQSxVQWFBLGNBQWMsQ0FBQyxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLFNBQUMsS0FBRCxHQUFBO21CQUFXLE1BQUEsQ0FBTyxLQUFQLEVBQVg7VUFBQSxDQUEzQixDQWJBLENBQUE7QUFjQSxVQUFBLElBQXVDLE1BQXZDO0FBQUEsWUFBQSxjQUFjLENBQUMsS0FBZixDQUFxQixjQUFyQixDQUFBLENBQUE7V0FkQTtpQkFlQSxjQUFjLENBQUMsR0FBZixDQUFBLEVBaEI4RDtRQUFBLENBQVIsRUFBbEQ7TUFBQSxDQW5CUixFQWhEZ0U7SUFBQSxDQUFmLEVBQXpDO0VBQUEsQ0F4RlYsQ0FBQTs7QUFBQSxFQW9NQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLElBQ0EsS0FBQSxFQUFPLEtBRFA7QUFBQSxJQUVBLE9BQUEsRUFBUyxPQUZUO0dBck1GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/handler.coffee
