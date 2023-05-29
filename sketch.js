// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/geometries/ParametricGeometry.js");

const dat = require("dat.gui");

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

  let params = { torsion: 5 }; // torsion

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
    let alpha = Math.PI * 2* (u - 0.5); // transformer u en (u-0.5) double
    let theta = Math.PI * 2 * v; //(v - 0.5); //

    // sphere
    // let x = Math.sin(alpha)*Math.cos(theta)
    // let y = Math.sin(alpha)*Math.sin(theta)
    // let z = Math.cos(alpha)

    // test
    //  let x = Math.sin(alpha)*Math.cos(theta)
    //  let y = Math.sin(alpha/4)*Math.sin(theta)
    //  let z = Math.cos(alpha)

    // test
    // let x = Math.sin(alpha)*Math.cos(theta)
    // let y = Math.sin(alpha*4)*Math.sin(theta)
    // let z = Math.cos(alpha)

    // hyperbola
    let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);
    // selon wolfram // hyperbole
    let x = (Math.sinh(theta) * Math.cos(params.torsion * alpha)) / bottom;
    let y = (Math.sinh(theta) * Math.sin(params.torsion * alpha)) / bottom;
    let z = (Math.cosh(theta) * Math.sinh(alpha)) / bottom;

    // selon video à 24 mins // pyramide
    // let x = Math.sinh(alpha) * Math.cos(params.torsion * theta)/bottom
    // let y = Math.sinh(alpha) * Math.sin(params.torsion * theta)/bottom
    // let z = Math.sinh(alpha) * Math.cosh(theta)/bottom

    // selon video à 27 mins // pyramide
    // let x = (Math.sinh(alpha) * Math.cos(params.torsion * theta)) / bottom;
    // let y = (Math.sinh(alpha) * Math.sin(params.torsion * theta)) / bottom;
    // let z = (2 * Math.cosh(theta) * Math.sinh(alpha)) / bottom;

    target.set(x, y, z);
  }

  let geometry = new THREE.ParametricGeometry(Helicoid, 100, 100); // cake : sphere avec 5,5 ! function , slices, stacks, https://threejs.org/docs/#examples/en/geometries/ParametricGeometry

  // Setup a material
  // const materialWireRed = new THREE.MeshBasicMaterial({
  //   color: "red",
  //   wireframe: true,
  // });

  let material = new MeshPhysicalMaterial({
    color: 0xcc0000,
    emissive: 0x26a269,
    roughness: 0,
    metalness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0,
    clearcoatRoughness: 0.4,
    flatShading: true,
    side: THREE.DoubleSide,
    //fog: true,
    //wireframe: true
  });

  // Setup a mesh with geometry + material
  const helicoidMesh = new THREE.Mesh(geometry, material);
  scene.add(helicoidMesh);

  scene.add(new THREE.AmbientLight(0xcccccc));

  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.x = 0;
  light.position.x = 1;

  scene.add(light);

  const materialParams = {
    helicoidMeshColor: helicoidMesh.material.color.getHex(),
    helicoidMeshEmissive: helicoidMesh.material.emissive.getHex(),
  };
  //dat.GUI
  const gui = new dat.GUI();
  const helicoidFolder = gui.addFolder("Helicoid");
  //helicoidFolder.open();
  // https://www.youtube.com/watch?v=JyhhHhoqK2o&t=224s
  const geometryFolder = helicoidFolder.addFolder("Geometry");
  geometryFolder.add(helicoidMesh.rotation, "x", 0, Math.PI).name("Rotate X");
  geometryFolder.add(helicoidMesh.rotation, "y", 0, Math.PI).name("Rotate Y");
  geometryFolder.add(helicoidMesh.rotation, "z", 0, Math.PI).name("Rotate z");
  //geometryFolder.open()

  const scaleFolder = helicoidFolder.addFolder("scale");
  scaleFolder.add(helicoidMesh.scale, "x", 0, 2).name("Scale x");
  scaleFolder.add(helicoidMesh.scale, "y", 0, 2).name("scale y");
  scaleFolder.add(helicoidMesh.scale, "z", 0, 2).name("scale z");
  scaleFolder.open();
  //color & emissive color
  const materialFolder = helicoidFolder.addFolder("Material");
  materialFolder.add(helicoidMesh.material, "wireframe");
  materialFolder
    .addColor(materialParams, "helicoidMeshColor")
    .name("color")
    .onChange((value) => helicoidMesh.material.color.set(value));
  materialFolder
    .addColor(materialParams, "helicoidMeshEmissive")
    .name("emissive color")
    .onChange((value) => helicoidMesh.material.emissive.set(value));
  materialFolder.open();

  const todoFolder = helicoidFolder.addFolder("todo");
  todoFolder.add(params, "torsion", 0, 5).name("torsion(todo)");
  // const cameraFolder = gui.addFolder('Camera')
  // cameraFolder.add(camera.position, 'z', 0, 10)
  // cameraFolder.open()

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
