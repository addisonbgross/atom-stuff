(function() {
  var Model, View;

  Model = require('../lib/console/console');

  View = require('../lib/console/console-element');

  describe('Output Module - Console Element', function() {
    var model, tab, view, _ref;
    _ref = [], model = _ref[0], view = _ref[1], tab = _ref[2];
    beforeEach(function() {
      model = new Model();
      view = new View(model);
      view.show = jasmine.createSpy('show');
      view.hide = jasmine.createSpy('hide');
      tab = model.getTab({
        project: 'foo',
        name: 'bar'
      });
      tab.focus();
      return jasmine.attachToDOM(view.element);
    });
    afterEach(function() {
      model.destroy();
      return view.detach();
    });
    it('has an active tab', function() {
      expect(view.tabs.children()[0]).toEqual(tab.header[0]);
      expect(view.output.children()[0]).toEqual(tab.view[0]);
      return expect(view.name.text()).toBe('bar of foo');
    });
    describe('when clicking the close button', function() {
      return it('closes the view', function() {
        view.find('.icon-x').click();
        return expect(view.hide).toHaveBeenCalled();
      });
    });
    return describe('when adding another tab', function() {
      var tab2;
      tab2 = null;
      beforeEach(function() {
        return tab2 = model.getTab({
          project: 'foo',
          name: 'bar2'
        });
      });
      it('adds a new tab header', function() {
        return expect(view.tabs.children()[1]).toEqual(tab2.header[0]);
      });
      describe('when clicking on the header', function() {
        beforeEach(function() {
          return tab2.header.find('.name').click();
        });
        it('focuses the new tab', function() {
          expect(view.active).toBe(tab2);
          return expect(view.name.text()).toBe('bar2 of foo');
        });
        return it('highlights the new tab', function() {
          return expect(view.tabs.children()[1].classList.contains('active')).toBe(true);
        });
      });
      return describe('when removing the new tab', function() {
        beforeEach(function() {
          tab2.focus();
          return tab2.header.find('.close').click();
        });
        return it('focuses the old tab', function() {
          expect(view.tabs.children().length).toBe(1);
          expect(view.output.children()[0]).toEqual(tab.view[0]);
          return expect(view.active).toBe(tab);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb25zb2xlLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsd0JBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxnQ0FBUixDQURQLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFFBQUEsc0JBQUE7QUFBQSxJQUFBLE9BQXFCLEVBQXJCLEVBQUMsZUFBRCxFQUFRLGNBQVIsRUFBYyxhQUFkLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxLQUFMLENBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUZaLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxJQUFMLEdBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FIWixDQUFBO0FBQUEsTUFJQSxHQUFBLEdBQU0sS0FBSyxDQUFDLE1BQU4sQ0FBYTtBQUFBLFFBQUEsT0FBQSxFQUFTLEtBQVQ7QUFBQSxRQUFnQixJQUFBLEVBQU0sS0FBdEI7T0FBYixDQUpOLENBQUE7QUFBQSxNQUtBLEdBQUcsQ0FBQyxLQUFKLENBQUEsQ0FMQSxDQUFBO2FBTUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLE9BQXpCLEVBUFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBV0EsU0FBQSxD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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/console-element-spec.coffee
