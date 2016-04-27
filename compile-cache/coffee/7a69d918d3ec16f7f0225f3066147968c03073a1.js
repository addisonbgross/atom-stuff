(function() {
  window.initCards = function() {
    return $('.card .back').each(function() {
      var $card, $toggle;
      $card = $(this).parents('.card');
      $toggle = $('<i class="icon-refresh"></i>');
      $toggle.click(function() {
        return $card.toggleClass('flipped');
      });
      return $card.append($toggle);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9jYXJkcy5qcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsU0FBQSxHQUFBO1dBQ2pCLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsU0FBQSxHQUFBO0FBRXBCLFVBQUEsY0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxJQUFGLENBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixDQUFSLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxDQUFBLENBQUUsOEJBQUYsQ0FEVixDQUFBO0FBQUEsTUFFQSxPQUFPLENBQUMsS0FBUixDQUFjLFNBQUEsR0FBQTtlQUFHLEtBQUssQ0FBQyxXQUFOLENBQWtCLFNBQWxCLEVBQUg7TUFBQSxDQUFkLENBRkEsQ0FBQTthQUdBLEtBQUssQ0FBQyxNQUFOLENBQWEsT0FBYixFQUxvQjtJQUFBLENBQXRCLEVBRGlCO0VBQUEsQ0FBbkIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/cards.js.coffee
