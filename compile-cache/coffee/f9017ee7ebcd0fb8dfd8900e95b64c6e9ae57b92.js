(function() {
  module.exports = {
    screenShake: {
      type: "object",
      properties: {
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        },
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        }
      }
    },
    particles: {
      type: "object",
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsV0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLE1BQ0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxZQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxrQ0FBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLGtEQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLENBSFQ7QUFBQSxVQUlBLE9BQUEsRUFBUyxDQUpUO0FBQUEsVUFLQSxPQUFBLEVBQVMsR0FMVDtTQURGO0FBQUEsUUFRQSxZQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxrQ0FBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLGtEQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLENBSFQ7QUFBQSxVQUlBLE9BQUEsRUFBUyxDQUpUO0FBQUEsVUFLQSxPQUFBLEVBQVMsR0FMVDtTQVRGO0FBQUEsUUFnQkEsT0FBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sd0JBQVA7QUFBQSxVQUNBLFdBQUEsRUFBYSwwQkFEYjtBQUFBLFVBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxVQUdBLFNBQUEsRUFBUyxJQUhUO1NBakJGO09BRkY7S0FERjtBQUFBLElBeUJBLFNBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxNQUNBLFVBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8scUJBQVA7QUFBQSxVQUNBLFdBQUEsRUFBYSw0QkFEYjtBQUFBLFVBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxVQUdBLFNBQUEsRUFBUyxJQUhUO1NBREY7QUFBQSxRQU1BLFVBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxVQUNBLFVBQUEsRUFDRTtBQUFBLFlBQUEsR0FBQSxFQUNFO0FBQUEsY0FBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxjQUNBLFdBQUEsRUFBYSxzREFEYjtBQUFBLGNBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxjQUdBLFNBQUEsRUFBUyxHQUhUO0FBQUEsY0FJQSxPQUFBLEVBQVMsQ0FKVDthQURGO1dBRkY7U0FQRjtBQUFBLFFBZ0JBLFVBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxVQUNBLFVBQUEsRUFDRTtBQUFBLFlBQUEsR0FBQSxFQUNFO0FBQUEsY0FBQSxLQUFBLEVBQU8sNkJBQVA7QUFBQSxjQUNBLFdBQUEsRUFBYSxnRUFEYjtBQUFBLGNBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxjQUdBLFNBQUEsRUFBUyxDQUhUO2FBREY7QUFBQSxZQU1BLEdBQUEsRUFDRTtBQUFBLGNBQUEsS0FBQSxFQUFPLDZCQUFQO0FBQUEsY0FDQSxXQUFBLEVBQWEsZ0VBRGI7QUFBQSxjQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsY0FHQSxTQUFBLEVBQVMsRUFIVDthQVBGO1dBRkY7U0FqQkY7QUFBQSxRQStCQSxJQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsVUFDQSxVQUFBLEVBQ0U7QUFBQSxZQUFBLEdBQUEsRUFDRTtBQUFBLGNBQUEsS0FBQSxFQUFPLDBCQUFQO0FBQUEsY0FDQSxXQUFBLEVBQWEsaURBRGI7QUFBQSxjQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsY0FHQSxTQUFBLEVBQVMsQ0FIVDtBQUFBLGNBSUEsT0FBQSxFQUFTLENBSlQ7YUFERjtBQUFBLFlBT0EsR0FBQSxFQUNFO0FBQUEsY0FBQSxLQUFBLEVBQU8sMEJBQVA7QUFBQSxjQUNBLFdBQUEsRUFBYSxpREFEYjtBQUFBLGNBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxjQUdBLFNBQUEsRUFBUyxDQUhUO0FBQUEsY0FJQSxPQUFBLEVBQVMsQ0FKVDthQVJGO1dBRkY7U0FoQ0Y7T0FGRjtLQTFCRjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/activate-power-mode/lib/config-schema.coffee
