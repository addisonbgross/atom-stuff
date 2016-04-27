(function() {
  $(function() {
    var animate, bloom, camera, composer, container, distance, geometry, h, material, mesh, playing, renderPass, renderer, scene, shader, uniforms, w;
    container = document.getElementById('stage');
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;
    w = 640;
    h = 380;
    distance = 1000;
    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
    camera.position.z = distance;
    scene = new THREE.Scene();
    geometry = new THREE.SphereGeometry(200, 40, 30);
    uniforms = {
      texture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('/images/0.png')
      }
    };
    shader = {
      vertexShader: 'varying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  vNormal = normalize( normalMatrix * normal );\n  vUv = uv;\n}',
      fragmentShader: 'uniform sampler2D texture;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 diffuse = texture2D( texture, vUv ).xyz;\n  float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );\n  vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );\n  gl_FragColor = vec4( diffuse + atmosphere, 1.0 );\n}'
    };
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 0.0);
    renderer.setSize(w, h);
    composer = new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloom = new THREE.BloomPass();
    bloom.renderToScreen = true;
    composer.addPass(bloom);
    container.appendChild(composer.renderTarget.domElement);
    playing = true;
    animate = function() {
      composer.render(0.1);
      mesh.rotation.y += 0.002;
      return setTimeout((function() {
        if (playing) {
          return requestAnimationFrame(animate);
        }
      }), 0);
    };
    return animate();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy90aHJlZV9ib290LmpzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUlBO0FBQUEsRUFBQSxDQUFBLENBQUUsU0FBQSxHQUFBO0FBQ0EsUUFBQSw2SUFBQTtBQUFBLElBQUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLENBQVosQ0FBQTtBQUFBLElBRUEsQ0FBQSxHQUFJLFNBQVMsQ0FBQyxXQUFWLElBQXlCLE1BQU0sQ0FBQyxVQUZwQyxDQUFBO0FBQUEsSUFHQSxDQUFBLEdBQUksU0FBUyxDQUFDLFlBQVYsSUFBMEIsTUFBTSxDQUFDLFdBSHJDLENBQUE7QUFBQSxJQUtBLENBQUEsR0FBSSxHQUxKLENBQUE7QUFBQSxJQU1BLENBQUEsR0FBSSxHQU5KLENBQUE7QUFBQSxJQVFBLFFBQUEsR0FBVyxJQVJYLENBQUE7QUFBQSxJQVVBLE1BQUEsR0FBYSxJQUFBLEtBQUssQ0FBQyxpQkFBTixDQUF3QixFQUF4QixFQUE0QixDQUFBLEdBQUksQ0FBaEMsRUFBbUMsQ0FBbkMsRUFBc0MsS0FBdEMsQ0FWYixDQUFBO0FBQUEsSUFXQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQWhCLEdBQW9CLFFBWHBCLENBQUE7QUFBQSxJQWFBLEtBQUEsR0FBWSxJQUFBLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FiWixDQUFBO0FBQUEsSUFlQSxRQUFBLEdBQWUsSUFBQSxLQUFLLENBQUMsY0FBTixDQUFxQixHQUFyQixFQUEwQixFQUExQixFQUE4QixFQUE5QixDQWZmLENBQUE7QUFBQSxJQWlCQSxRQUFBLEdBQVc7QUFBQSxNQUFBLE9BQUEsRUFBUztBQUFBLFFBQUUsSUFBQSxFQUFNLEdBQVI7QUFBQSxRQUFhLEtBQUEsRUFBTyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQWpCLENBQTZCLGVBQTdCLENBQXBCO09BQVQ7S0FqQlgsQ0FBQTtBQUFBLElBbUJBLE1BQUEsR0FDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLHlNQUFkO0FBQUEsTUFVQSxjQUFBLEVBQWdCLHlVQVZoQjtLQXBCRixDQUFBO0FBQUEsSUE0Q0EsUUFBQSxHQUFlLElBQUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUI7QUFBQSxNQUNsQyxRQUFBLEVBQVUsUUFEd0I7QUFBQSxNQUVsQyxZQUFBLEVBQWMsTUFBTSxDQUFDLFlBRmE7QUFBQSxNQUdsQyxjQUFBLEVBQWdCLE1BQU0sQ0FBQyxjQUhXO0tBQXJCLENBNUNmLENBQUE7QUFBQSxJQWtEQSxJQUFBLEdBQVcsSUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFFBQVgsRUFBcUIsUUFBckIsQ0FsRFgsQ0FBQTtBQUFBLElBb0RBLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixDQXBEQSxDQUFBO0FBQUEsSUFzREEsUUFBQSxHQUFlLElBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0I7QUFBQSxNQUFDLFNBQUEsRUFBVyxJQUFaO0tBQXBCLENBdERmLENBQUE7QUFBQSxJQXVEQSxRQUFRLENBQUMsU0FBVCxHQUFxQixJQXZEckIsQ0FBQTtBQUFBLElBd0RBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLEVBQWlDLEdBQWpDLENBeERBLENBQUE7QUFBQSxJQXlEQSxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFqQixFQUFvQixDQUFwQixDQXpEQSxDQUFBO0FBQUEsSUEyREEsUUFBQSxHQUFlLElBQUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsUUFBckIsQ0EzRGYsQ0FBQTtBQUFBLElBNERBLFVBQUEsR0FBaUIsSUFBQSxLQUFLLENBQUMsVUFBTixDQUFpQixLQUFqQixFQUF3QixNQUF4QixDQTVEakIsQ0FBQTtBQUFBLElBOERBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFVBQWpCLENBOURBLENBQUE7QUFBQSxJQWdFQSxLQUFBLEdBQVksSUFBQSxLQUFLLENBQUMsU0FBTixDQUFBLENBaEVaLENBQUE7QUFBQSxJQWlFQSxLQUFLLENBQUMsY0FBTixHQUF1QixJQWpFdkIsQ0FBQTtBQUFBLElBa0VBLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLENBbEVBLENBQUE7QUFBQSxJQXNFQSxTQUFTLENBQUMsV0FBVixDQUFzQixRQUFRLENBQUMsWUFBWSxDQUFDLFVBQTVDLENBdEVBLENBQUE7QUFBQSxJQXlFQSxPQUFBLEdBQVUsSUF6RVYsQ0FBQTtBQUFBLElBMkVBLE9BQUEsR0FBVSxTQUFBLEdBQUE7QUFHUixNQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLEdBQWhCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFkLElBQW1CLEtBRG5CLENBQUE7YUFHQSxVQUFBLENBQVcsQ0FBQyxTQUFBLEdBQUE7QUFBRyxRQUFBLElBQWlDLE9BQWpDO2lCQUFBLHFCQUFBLENBQXNCLE9BQXRCLEVBQUE7U0FBSDtNQUFBLENBQUQsQ0FBWCxFQUEwRCxDQUExRCxFQU5RO0lBQUEsQ0EzRVYsQ0FBQTtXQW1GQSxPQUFBLENBQUEsRUFwRkE7RUFBQSxDQUFGLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/test/exoplanets/app/assets/javascripts/three_boot.js.coffee
