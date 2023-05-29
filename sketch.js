// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require('three/examples/js/geometries/ParametricGeometry.js');

const canvasSketch = require("canvas-sketch");
const { MeshPhysicalMaterial } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.IcosahedronBufferGeometry(1, 1); // radius , detail 1,5 1,32

  function Helicoid(u, v, target) {
    let x = u;
    let y = 0;
    let z = v;
    target.set(x, y, z);
  }

  let geometry = new THREE.ParametricGeometry(Helicoid, 25, 25); // function , slices, stacks, https://threejs.org/docs/#examples/en/geometries/ParametricGeometry

  // Setup a material
  const materialWireRed = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true,
  });

  let material = new MeshPhysicalMaterial({
    color: 0xcc0000,
    emissive: 0x26a269,
    roughness: 0,
    metalness: 0.5,
    reflectivity: 1,
    clearcoat: 0,
    clearcoatRoughness: 0.4,
    flatShading: true,
    side: THREE.DoubleSide
    //fog: true,
    //wireframe: true
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xcccccc));

  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.x = 0;
  light.position.x = 1;

  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
