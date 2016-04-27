(function() {
  var config, plugins, proxy;

  proxy = require("../services/php-proxy.coffee");

  config = require("../config.coffee");

  plugins = require("../services/plugin-manager.coffee");

  module.exports = {
    structureStartRegex: /(?:abstract class|class|trait|interface)\s+(\w+)/,
    useStatementRegex: /(?:use)(?:[^\w\\])([\w\\]+)(?![\w\\])(?:(?:[ ]+as[ ]+)(\w+))?(?:;)/,
    cache: [],

    /**
     * Retrieves the class the specified term (method or property) is being invoked on.
     *
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     *
     * @return {string}
     *
     * @example Invoking it on MyMethod::foo()->bar() will ask what class 'bar' is invoked on, which will whatever type
     *          foo returns.
     */
    getCalledClass: function(editor, term, bufferPosition) {
      var fullCall;
      fullCall = this.getStackClasses(editor, bufferPosition);
      if ((fullCall != null ? fullCall.length : void 0) === 0 || !term) {
        return;
      }
      return this.parseElements(editor, bufferPosition, fullCall);
    },

    /**
     * Get all variables declared in the current function
     * @param {TextEdutir} editor         Atom text editor
     * @param {Range}      bufferPosition Position of the current buffer
     */
    getAllVariablesInFunction: function(editor, bufferPosition) {
      var isInFunction, matches, regex, startPosition, text;
      isInFunction = this.isInFunction(editor, bufferPosition);
      startPosition = null;
      if (isInFunction) {
        startPosition = this.cache['functionPosition'];
      } else {
        startPosition = [0, 0];
      }
      text = editor.getTextInBufferRange([startPosition, [bufferPosition.row, bufferPosition.column - 1]]);
      regex = /(\$[a-zA-Z_]+)/g;
      matches = text.match(regex);
      if (matches == null) {
        return [];
      }
      if (isInFunction) {
        matches.push("$this");
      }
      return matches;
    },

    /**
     * Retrieves the full class name. If the class name is a FQCN (Fully Qualified Class Name), it already is a full
     * name and it is returned as is. Otherwise, the current namespace and use statements are scanned.
     *
     * @param {TextEditor}  editor    Text editor instance.
     * @param {string|null} className Name of the class to retrieve the full name of. If null, the current class will
     *                                be returned (if any).
     * @param {boolean}     noCurrent Do not use the current class if className is empty
     *
     * @return string
     */
    getFullClassName: function(editor, className, noCurrent) {
      var classNameParts, definitionPattern, found, fullClass, i, importNameParts, isAliasedImport, line, lines, matches, methodsRequest, namespacePattern, text, usePattern, _i, _len;
      if (className == null) {
        className = null;
      }
      if (noCurrent == null) {
        noCurrent = false;
      }
      if (className === null) {
        className = '';
        if (noCurrent) {
          return null;
        }
      } else if (className.charAt(0).toUpperCase() !== className.charAt(0)) {
        return null;
      }
      if (className && className[0] === "\\") {
        return className.substr(1);
      }
      usePattern = /(?:use)(?:[^\w\\\\])([\w\\\\]+)(?![\w\\\\])(?:(?:[ ]+as[ ]+)(\w+))?(?:;)/;
      namespacePattern = /(?:namespace)(?:[^\w\\\\])([\w\\\\]+)(?![\w\\\\])(?:;)/;
      definitionPattern = /(?:abstract class|class|trait|interface)\s+(\w+)/;
      text = editor.getText();
      lines = text.split('\n');
      fullClass = className;
      found = false;
      for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
        line = lines[i];
        matches = line.match(namespacePattern);
        if (matches) {
          fullClass = matches[1] + '\\' + className;
        } else if (className) {
          matches = line.match(usePattern);
          if (matches) {
            classNameParts = className.split('\\');
            importNameParts = matches[1].split('\\');
            isAliasedImport = matches[2] ? true : false;
            if (className === matches[1]) {
              fullClass = className;
              break;
            } else if ((isAliasedImport && matches[2] === classNameParts[0]) || (!isAliasedImport && importNameParts[importNameParts.length - 1] === classNameParts[0])) {
              found = true;
              fullClass = matches[1];
              classNameParts = classNameParts.slice(1, +classNameParts.length + 1 || 9e9);
              if (classNameParts.length > 0) {
                fullClass += '\\' + classNameParts.join('\\');
              }
              break;
            }
          }
        }
        matches = line.match(definitionPattern);
        if (matches) {
          if (!className) {
            found = true;
            fullClass += matches[1];
          }
          break;
        }
      }
      if (fullClass && fullClass[0] === '\\') {
        fullClass = fullClass.substr(1);
      }
      if (!found) {
        methodsRequest = proxy.methods(fullClass);
        if (!(methodsRequest != null ? methodsRequest.filename : void 0)) {
          fullClass = className;
        }
      }
      return fullClass;
    },

    /**
     * Add the use for the given class if not already added.
     *
     * @param {TextEditor} editor                  Atom text editor.
     * @param {string}     className               Name of the class to add.
     * @param {boolean}    allowAdditionalNewlines Whether to allow adding additional newlines to attempt to group use
     *                                             statements.
     *
     * @return {int}       The amount of lines added (including newlines), so you can reliably and easily offset your
     *                     rows. This could be zero if a use statement was already present.
     */
    addUseClass: function(editor, className, allowAdditionalNewlines) {
      var bestScore, bestUse, doNewLine, i, line, lineCount, lineEnding, lineToInsertAt, matches, placeBelow, scopeDescriptor, score, textToInsert, _i, _ref;
      if (className.split('\\').length === 1 || className.indexOf('\\') === 0) {
        return null;
      }
      bestUse = 0;
      bestScore = 0;
      placeBelow = true;
      doNewLine = true;
      lineCount = editor.getLineCount();
      for (i = _i = 0, _ref = lineCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        line = editor.lineTextForBufferRow(i).trim();
        if (line.length === 0) {
          continue;
        }
        scopeDescriptor = editor.scopeDescriptorForBufferPosition([i, line.length]).getScopeChain();
        if (scopeDescriptor.indexOf('.comment') >= 0) {
          continue;
        }
        if (line.match(this.structureStartRegex)) {
          break;
        }
        if (line.indexOf('namespace ') >= 0) {
          bestUse = i;
        }
        matches = this.useStatementRegex.exec(line);
        if ((matches != null) && (matches[1] != null)) {
          if (matches[1] === className) {
            return 0;
          }
          score = this.scoreClassName(className, matches[1]);
          if (score >= bestScore) {
            bestUse = i;
            bestScore = score;
            if (this.doShareCommonNamespacePrefix(className, matches[1])) {
              doNewLine = false;
              placeBelow = className.length >= matches[1].length ? true : false;
            } else {
              doNewLine = true;
              placeBelow = true;
            }
          }
        }
      }
      lineEnding = editor.getBuffer().lineEndingForRow(0);
      if (!allowAdditionalNewlines) {
        doNewLine = false;
      }
      if (!lineEnding) {
        lineEnding = "\n";
      }
      textToInsert = '';
      if (doNewLine && placeBelow) {
        textToInsert += lineEnding;
      }
      textToInsert += ("use " + className + ";") + lineEnding;
      if (doNewLine && !placeBelow) {
        textToInsert += lineEnding;
      }
      lineToInsertAt = bestUse + (placeBelow ? 1 : 0);
      editor.setTextInBufferRange([[lineToInsertAt, 0], [lineToInsertAt, 0]], textToInsert);
      return 1 + (doNewLine ? 1 : 0);
    },

    /**
     * Returns a boolean indicating if the specified class names share a common namespace prefix.
     *
     * @param {string} firstClassName
     * @param {string} secondClassName
     *
     * @return {boolean}
     */
    doShareCommonNamespacePrefix: function(firstClassName, secondClassName) {
      var firstClassNameParts, secondClassNameParts;
      firstClassNameParts = firstClassName.split('\\');
      secondClassNameParts = secondClassName.split('\\');
      firstClassNameParts.pop();
      secondClassNameParts.pop();
      if (firstClassNameParts.join('\\') === secondClassNameParts.join('\\')) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Scores the first class name against the second, indicating how much they 'match' each other. This can be used
     * to e.g. find an appropriate location to place a class in an existing list of classes.
     *
     * @param {string} firstClassName
     * @param {string} secondClassName
     *
     * @return {float}
     */
    scoreClassName: function(firstClassName, secondClassName) {
      var firstClassNameParts, i, maxLength, secondClassNameParts, totalScore, _i, _ref;
      firstClassNameParts = firstClassName.split('\\');
      secondClassNameParts = secondClassName.split('\\');
      maxLength = 0;
      if (firstClassNameParts.length > secondClassNameParts.length) {
        maxLength = secondClassNameParts.length;
      } else {
        maxLength = firstClassNameParts.length;
      }
      totalScore = 0;
      for (i = _i = 0, _ref = maxLength - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (firstClassNameParts[i] === secondClassNameParts[i]) {
          totalScore += 2;
        }
      }
      if (this.doShareCommonNamespacePrefix(firstClassName, secondClassName)) {
        if (firstClassName.length === secondClassName.length) {
          totalScore += 2;
        } else {
          totalScore -= 0.001 * Math.abs(secondClassName.length - firstClassName.length);
        }
      }
      return totalScore;
    },

    /**
     * Checks if the given name is a class or not
     * @param  {string}  name Name to check
     * @return {Boolean}
     */
    isClass: function(name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1) === name;
    },

    /**
     * Checks if the current buffer is in a functon or not
     * @param {TextEditor} editor         Atom text editor
     * @param {Range}      bufferPosition Position of the current buffer
     * @return bool
     */
    isInFunction: function(editor, bufferPosition) {
      var chain, character, closedBlocks, lastChain, line, lineLength, openedBlocks, result, row, rows, text;
      text = editor.getTextInBufferRange([[0, 0], bufferPosition]);
      if (this.cache[text] != null) {
        return this.cache[text];
      }
      this.cache = [];
      row = bufferPosition.row;
      rows = text.split('\n');
      openedBlocks = 0;
      closedBlocks = 0;
      result = false;
      while (row !== -1) {
        line = rows[row];
        if (!line) {
          row--;
          continue;
        }
        character = 0;
        lineLength = line.length;
        lastChain = null;
        while (character <= line.length) {
          chain = editor.scopeDescriptorForBufferPosition([row, character]).getScopeChain();
          if (!(character === line.length && chain === lastChain)) {
            if (chain.indexOf("scope.end") !== -1) {
              closedBlocks++;
            } else if (chain.indexOf("scope.begin") !== -1) {
              openedBlocks++;
            }
          }
          lastChain = chain;
          character++;
        }
        chain = editor.scopeDescriptorForBufferPosition([row, line.length]).getScopeChain();
        if (chain.indexOf("function") !== -1) {
          if (openedBlocks > closedBlocks) {
            result = true;
            this.cache["functionPosition"] = [row, 0];
            break;
          }
        }
        row--;
      }
      this.cache[text] = result;
      return result;
    },

    /**
     * Retrieves the stack of elements in a stack of calls such as "self::xxx->xxxx".
     *
     * @param  {TextEditor} editor
     * @param  {Point}       position
     *
     * @return {Object}
     */
    getStackClasses: function(editor, position) {
      var finished, i, line, lineText, parenthesesClosed, parenthesesOpened, scopeDescriptor, squiggleBracketsClosed, squiggleBracketsOpened, textSlice;
      if (position == null) {
        return;
      }
      line = position.row;
      finished = false;
      parenthesesOpened = 0;
      parenthesesClosed = 0;
      squiggleBracketsOpened = 0;
      squiggleBracketsClosed = 0;
      while (line > 0) {
        lineText = editor.lineTextForBufferRow(line);
        if (!lineText) {
          return;
        }
        if (line !== position.row) {
          i = lineText.length - 1;
        } else {
          i = position.column - 1;
        }
        while (i >= 0) {
          if (lineText[i] === '(') {
            ++parenthesesOpened;
            if (parenthesesOpened > parenthesesClosed) {
              ++i;
              finished = true;
              break;
            }
          } else if (lineText[i] === ')') {
            ++parenthesesClosed;
          } else if (lineText[i] === '{') {
            ++squiggleBracketsOpened;
            if (squiggleBracketsOpened > squiggleBracketsClosed) {
              ++i;
              finished = true;
              break;
            }
          } else if (lineText[i] === '}') {
            ++squiggleBracketsClosed;
          } else if (parenthesesOpened === parenthesesClosed && squiggleBracketsOpened === squiggleBracketsClosed) {
            if (lineText[i] === '$') {
              finished = true;
              break;
            } else if (lineText[i] === ';' || lineText[i] === '=') {
              ++i;
              finished = true;
              break;
            } else {
              scopeDescriptor = editor.scopeDescriptorForBufferPosition([line, i]).getScopeChain();
              if (scopeDescriptor.indexOf('.function.construct') > 0 || scopeDescriptor.indexOf('.comment') > 0) {
                ++i;
                finished = true;
                break;
              }
            }
          }
          --i;
        }
        if (finished) {
          break;
        }
        --line;
      }
      textSlice = editor.getTextInBufferRange([[line, i], position]).trim();
      return this.parseStackClass(textSlice);
    },

    /**
     * Removes content inside parantheses (including nested parantheses).
     * @param {string}  text String to analyze.
     * @param {boolean} keep string inside parenthesis
     * @return String
     */
    stripParanthesesContent: function(text, keepString) {
      var closeCount, content, i, openCount, originalLength, reg, startIndex;
      i = 0;
      openCount = 0;
      closeCount = 0;
      startIndex = -1;
      while (i < text.length) {
        if (text[i] === '(') {
          ++openCount;
          if (openCount === 1) {
            startIndex = i;
          }
        } else if (text[i] === ')') {
          ++closeCount;
          if (closeCount === openCount) {
            originalLength = text.length;
            content = text.substring(startIndex, i + 1);
            reg = /["(][\s]*[\'\"][\s]*([^\"\']+)[\s]*[\"\'][\s]*[")]/g;
            if (openCount === 1 && reg.exec(content)) {
              continue;
            }
            text = text.substr(0, startIndex + 1) + text.substr(i, text.length);
            i -= originalLength - text.length;
            openCount = 0;
            closeCount = 0;
          }
        }
        ++i;
      }
      return text;
    },

    /**
     * Parse stack class elements
     * @param {string} text String of the stack class
     * @return Array
     */
    parseStackClass: function(text) {
      var element, elements, key, regx;
      regx = /\/\/.*\n/g;
      text = text.replace(regx, (function(_this) {
        return function(match) {
          return '';
        };
      })(this));
      regx = /\/\*[^(\*\/)]*\*\//g;
      text = text.replace(regx, (function(_this) {
        return function(match) {
          return '';
        };
      })(this));
      text = this.stripParanthesesContent(text, true);
      if (!text) {
        return [];
      }
      elements = text.split(/(?:\-\>|::)/);
      for (key in elements) {
        element = elements[key];
        element = element.replace(/^\s+|\s+$/g, "");
        if (element[0] === '{' || element[0] === '[') {
          element = element.substring(1);
        } else if (element.indexOf('return ') === 0) {
          element = element.substring('return '.length);
        }
        elements[key] = element;
      }
      return elements;
    },

    /**
     * Get the type of a variable
     *
     * @param {TextEditor} editor
     * @param {Range}      bufferPosition
     * @param {string}     element        Variable to search
     */
    getVariableType: function(editor, bufferPosition, element) {
      var bestMatch, bestMatchRow, chain, elements, funcName, line, lineNumber, matches, matchesCatch, matchesNew, newPosition, params, regexCatch, regexElement, regexFunction, regexNewInstance, regexVar, regexVarWithVarName, typeHint, value;
      if (element.replace(/[\$][a-zA-Z0-9_]+/g, "").trim().length > 0) {
        return null;
      }
      if (element.trim().length === 0) {
        return null;
      }
      bestMatch = null;
      bestMatchRow = null;
      regexElement = new RegExp("\\" + element + "[\\s]*=[\\s]*([^;]+);", "g");
      regexNewInstance = new RegExp("\\" + element + "[\\s]*=[\\s]*new[\\s]*\\\\?([A-Z][a-zA-Z_\\\\]*)+(?:(.+)?);", "g");
      regexCatch = new RegExp("catch[\\s]*\\([\\s]*([A-Za-z0-9_\\\\]+)[\\s]+\\" + element + "[\\s]*\\)", "g");
      lineNumber = bufferPosition.row - 1;
      while (lineNumber > 0) {
        line = editor.lineTextForBufferRow(lineNumber);
        if (!bestMatch) {
          matchesNew = regexNewInstance.exec(line);
          if (null !== matchesNew) {
            bestMatchRow = lineNumber;
            bestMatch = this.getFullClassName(editor, matchesNew[1]);
          }
        }
        if (!bestMatch) {
          matchesCatch = regexCatch.exec(line);
          if (null !== matchesCatch) {
            bestMatchRow = lineNumber;
            bestMatch = this.getFullClassName(editor, matchesCatch[1]);
          }
        }
        if (!bestMatch) {
          matches = regexElement.exec(line);
          if (null !== matches) {
            value = matches[1];
            elements = this.parseStackClass(value);
            elements.push("");
            newPosition = {
              row: lineNumber,
              column: bufferPosition.column
            };
            bestMatchRow = lineNumber;
            bestMatch = this.parseElements(editor, newPosition, elements);
          }
        }
        if (!bestMatch) {
          regexFunction = new RegExp("function(?:[\\s]+([a-zA-Z]+))?[\\s]*[\\(](?:(?![a-zA-Z\\_\\\\]*[\\s]*\\" + element + ").)*[,\\s]?([a-zA-Z\\_\\\\]*)[\\s]*\\" + element + "[a-zA-Z0-9\\s\\$\\\\,=\\\"\\\'\(\)]*[\\s]*[\\)]", "g");
          matches = regexFunction.exec(line);
          if (null !== matches) {
            typeHint = matches[2];
            if (typeHint.length > 0) {
              return this.getFullClassName(editor, typeHint);
            }
            funcName = matches[1];
            if (funcName && funcName.length > 0) {
              params = proxy.docParams(this.getFullClassName(editor), funcName);
              if ((params.params != null) && (params.params[element] != null)) {
                return this.getFullClassName(editor, params.params[element].type, true);
              }
            }
          }
        }
        chain = editor.scopeDescriptorForBufferPosition([lineNumber, line.length]).getScopeChain();
        if (chain.indexOf("comment") !== -1) {
          if (bestMatchRow && lineNumber === (bestMatchRow - 1)) {
            regexVar = /\@var[\s]+([a-zA-Z_\\]+)(?![\w]+\$)/g;
            matches = regexVar.exec(line);
            if (null !== matches) {
              return this.getFullClassName(editor, matches[1]);
            }
          }
          regexVarWithVarName = new RegExp("\\@var[\\s]+([a-zA-Z_\\\\]+)[\\s]+\\" + element, "g");
          matches = regexVarWithVarName.exec(line);
          if (null !== matches) {
            return this.getFullClassName(editor, matches[1]);
          }
          regexVarWithVarName = new RegExp("\\@var[\\s]+\\" + element + "[\\s]+([a-zA-Z_\\\\]+)", "g");
          matches = regexVarWithVarName.exec(line);
          if (null !== matches) {
            return this.getFullClassName(editor, matches[1]);
          }
        }
        if (chain.indexOf("function") !== -1) {
          break;
        }
        --lineNumber;
      }
      return bestMatch;
    },

    /**
     * Retrieves contextual information about the class member at the specified location in the editor.
     *
     * @param {TextEditor} editor         TextEditor to search for namespace of term.
     * @param {string}     term           Term to search for.
     * @param {Point}      bufferPosition The cursor location the term is at.
     * @param {Object}     calledClass    Information about the called class (optional).
     */
    getMemberContext: function(editor, term, bufferPosition, calledClass) {
      var methods, val, value, _i, _len, _ref;
      if (!calledClass) {
        calledClass = this.getCalledClass(editor, term, bufferPosition);
      }
      if (!calledClass) {
        return;
      }
      proxy = require('../services/php-proxy.coffee');
      methods = proxy.methods(calledClass);
      if (!methods) {
        return;
      }
      if ((methods.error != null) && methods.error !== '') {
        if (config.config.verboseErrors) {
          atom.notifications.addError('Failed to get methods for ' + calledClass, {
            'detail': methods.error.message
          });
        } else {
          console.log('Failed to get methods for ' + calledClass + ' : ' + methods.error.message);
        }
        return;
      }
      if (((_ref = methods.values) != null ? _ref.hasOwnProperty(term) : void 0) === -1) {
        return;
      }
      value = methods.values[term];
      if (value instanceof Array) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          val = value[_i];
          if (val.isMethod) {
            value = val;
            break;
          }
        }
      }
      return value;
    },

    /**
     * Parse all elements from the given array to return the last className (if any)
     * @param  Array elements Elements to parse
     * @return string|null full class name of the last element
     */
    parseElements: function(editor, bufferPosition, elements) {
      var className, element, found, loop_index, methods, plugin, _i, _j, _len, _len1, _ref;
      loop_index = 0;
      className = null;
      if (elements == null) {
        return;
      }
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        if (loop_index === 0) {
          if (element[0] === '$') {
            className = this.getVariableType(editor, bufferPosition, element);
            if (element === '$this' && !className) {
              className = this.getFullClassName(editor);
            }
            loop_index++;
            continue;
          } else if (element === 'static' || element === 'self') {
            className = this.getFullClassName(editor);
            loop_index++;
            continue;
          } else if (element === 'parent') {
            className = this.getParentClass(editor);
            loop_index++;
            continue;
          } else {
            className = this.getFullClassName(editor, element);
            loop_index++;
            continue;
          }
        }
        if (loop_index >= elements.length - 1) {
          break;
        }
        if (className === null) {
          break;
        }
        found = null;
        _ref = plugins.plugins;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          plugin = _ref[_j];
          if (plugin.autocomplete == null) {
            continue;
          }
          found = plugin.autocomplete(className, element);
          if (found) {
            break;
          }
        }
        if (found) {
          className = found;
        } else {
          methods = proxy.autocomplete(className, element);
          if ((methods["class"] == null) || !this.isClass(methods["class"])) {
            className = null;
            break;
          }
          className = methods["class"];
        }
        loop_index++;
      }
      if (elements.length > 0 && (elements[elements.length - 1].length === 0 || elements[elements.length - 1].match(/([a-zA-Z0-9]$)/g))) {
        return className;
      }
      return null;
    },

    /**
     * Gets the full words from the buffer position given.
     * E.g. Getting a class with its namespace.
     * @param  {TextEditor}     editor   TextEditor to search.
     * @param  {BufferPosition} position BufferPosition to start searching from.
     * @return {string}  Returns a string of the class.
     */
    getFullWordFromBufferPosition: function(editor, position) {
      var backwardRegex, currentText, endBufferPosition, forwardRegex, foundEnd, foundStart, index, previousText, range, startBufferPosition;
      foundStart = false;
      foundEnd = false;
      startBufferPosition = [];
      endBufferPosition = [];
      forwardRegex = /-|(?:\()[\w\[\$\(\\]|\s|\)|;|'|,|"|\|/;
      backwardRegex = /\(|\s|\)|;|'|,|"|\|/;
      index = -1;
      previousText = '';
      while (true) {
        index++;
        startBufferPosition = [position.row, position.column - index - 1];
        range = [[position.row, position.column], [startBufferPosition[0], startBufferPosition[1]]];
        currentText = editor.getTextInBufferRange(range);
        if (backwardRegex.test(editor.getTextInBufferRange(range)) || startBufferPosition[1] === -1 || currentText === previousText) {
          foundStart = true;
        }
        previousText = editor.getTextInBufferRange(range);
        if (foundStart) {
          break;
        }
      }
      index = -1;
      while (true) {
        index++;
        endBufferPosition = [position.row, position.column + index + 1];
        range = [[position.row, position.column], [endBufferPosition[0], endBufferPosition[1]]];
        currentText = editor.getTextInBufferRange(range);
        if (forwardRegex.test(currentText) || endBufferPosition[1] === 500 || currentText === previousText) {
          foundEnd = true;
        }
        previousText = editor.getTextInBufferRange(range);
        if (foundEnd) {
          break;
        }
      }
      startBufferPosition[1] += 1;
      endBufferPosition[1] -= 1;
      return editor.getTextInBufferRange([startBufferPosition, endBufferPosition]);
    },

    /**
     * Gets the correct selector when a class or namespace is clicked.
     *
     * @param  {jQuery.Event}  event  A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */
    getClassSelectorFromEvent: function(event) {
      var $, selector;
      selector = event.currentTarget;
      $ = require('jquery');
      if ($(selector).hasClass('builtin') || $(selector).children('.builtin').length > 0) {
        return null;
      }
      if ($(selector).parent().hasClass('function argument')) {
        return $(selector).parent().children('.namespace, .class:not(.operator):not(.constant)');
      }
      if ($(selector).prev().hasClass('namespace') && $(selector).hasClass('class')) {
        return $([$(selector).prev()[0], selector]);
      }
      if ($(selector).next().hasClass('class') && $(selector).hasClass('namespace')) {
        return $([selector, $(selector).next()[0]]);
      }
      if ($(selector).prev().hasClass('namespace') || $(selector).next().hasClass('inherited-class')) {
        return $(selector).parent().children('.namespace, .inherited-class');
      }
      return selector;
    },

    /**
     * Gets the parent class of the current class opened in the editor
     * @param  {TextEditor} editor Editor with the class in.
     * @return {string}            The namespace and class of the parent
     */
    getParentClass: function(editor) {
      var extendsIndex, line, lines, text, words, _i, _len;
      text = editor.getText();
      lines = text.split('\n');
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        line = line.trim();
        if (line.indexOf('extends ') !== -1) {
          words = line.split(' ');
          extendsIndex = words.indexOf('extends');
          return this.getFullClassName(editor, words[extendsIndex + 1]);
        }
      }
    },

    /**
     * Finds the buffer position of the word given
     * @param  {TextEditor} editor TextEditor to search
     * @param  {string}     term   The function name to search for
     * @return {mixed}             Either null or the buffer position of the function.
     */
    findBufferPositionOfWord: function(editor, term, regex, line) {
      var lineText, lines, result, row, text, _i, _len;
      if (line == null) {
        line = null;
      }
      if (line !== null) {
        lineText = editor.lineTextForBufferRow(line);
        result = this.checkLineForWord(lineText, term, regex);
        if (result !== null) {
          return [line, result];
        }
      } else {
        text = editor.getText();
        row = 0;
        lines = text.split('\n');
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          result = this.checkLineForWord(line, term, regex);
          if (result !== null) {
            return [row, result];
          }
          row++;
        }
      }
      return null;
    },

    /**
     * Checks the lineText for the term and regex matches
     * @param  {string}   lineText The line of text to check.
     * @param  {string}   term     Term to look for.
     * @param  {regex}    regex    Regex to run on the line to make sure it's valid
     * @return {null|int}          Returns null if nothing was found or an
     *                             int of the column the term is on.
     */
    checkLineForWord: function(lineText, term, regex) {
      var element, propertyIndex, reducedWords, words, _i, _len;
      if (regex.test(lineText)) {
        words = lineText.split(' ');
        propertyIndex = 0;
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          element = words[_i];
          if (element.indexOf(term) !== -1) {
            break;
          }
          propertyIndex++;
        }
        reducedWords = words.slice(0, propertyIndex).join(' ');
        return reducedWords.length + 1;
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSw4QkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsbUNBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsbUJBQUEsRUFBcUIsa0RBQXJCO0FBQUEsSUFDQSxpQkFBQSxFQUFtQixvRUFEbkI7QUFBQSxJQUlBLEtBQUEsRUFBTyxFQUpQO0FBTUE7QUFBQTs7Ozs7Ozs7Ozs7T0FOQTtBQUFBLElBa0JBLGNBQUEsRUFBZ0IsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWYsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCLEVBQXlCLGNBQXpCLENBQVgsQ0FBQTtBQUVBLE1BQUEsd0JBQUcsUUFBUSxDQUFFLGdCQUFWLEtBQW9CLENBQXBCLElBQXlCLENBQUEsSUFBNUI7QUFDSSxjQUFBLENBREo7T0FGQTtBQUtBLGFBQU8sSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQXVDLFFBQXZDLENBQVAsQ0FOWTtJQUFBLENBbEJoQjtBQTBCQTtBQUFBOzs7O09BMUJBO0FBQUEsSUErQkEseUJBQUEsRUFBMkIsU0FBQyxNQUFELEVBQVMsY0FBVCxHQUFBO0FBRXZCLFVBQUEsaURBQUE7QUFBQSxNQUFBLFlBQUEsR0FB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/php-file-parser.coffee
