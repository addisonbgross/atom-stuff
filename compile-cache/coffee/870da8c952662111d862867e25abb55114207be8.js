(function() {
  module.exports = {
    provider: null,
    ready: false,
    activate: function() {
      return this.ready = true;
    },
    deactivate: function() {
      return this.provider = null;
    },
    getProvider: function() {
      var GlslProvider;
      if (this.provider == null) {
        GlslProvider = require('./glsl-provider');
        this.provider = new GlslProvider();
      }
      return this.provider;
    },
    provide: function() {
      return this.getProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWdsc2wvbGliL2F1dG9jb21wbGV0ZS1nbHNsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsS0FBQSxFQUFPLEtBRFA7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBRCxHQUFTLEtBREQ7SUFBQSxDQUhWO0FBQUEsSUFNQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURGO0lBQUEsQ0FOWjtBQUFBLElBU0EsV0FBQSxFQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBTyxxQkFBUDtBQUNFLFFBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUFmLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsWUFBQSxDQUFBLENBRGhCLENBREY7T0FBQTtBQUdBLGFBQU8sSUFBQyxDQUFBLFFBQVIsQ0FKVztJQUFBLENBVGI7QUFBQSxJQWVBLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsV0FBRCxDQUFBLEVBRE87SUFBQSxDQWZUO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/autocomplete-glsl/lib/autocomplete-glsl.coffee
