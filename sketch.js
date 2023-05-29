// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/geometries/ParametricGeometry.js");

const dat = require("dat.gui");

//require("./src/event_ball.js");

const canvasSketch = require("canvas-sketch");
const { MeshPhysicalMaterial } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  duration: 60, /// 5, //60, for rotation
};

let eventBalls = [];

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
  // const geometry = new THREE.IcosahedronGeometry(1, 1); // radius , detail 1,5 1,32

  function Helicoid(u, v, target) {
    let alpha = Math.PI * 2 * (u - 0.5); // transformer u en (u-0.5) double
    let theta = Math.PI * 2 * (v - 0.5); // multiplie le couches (v - 0.5); sympa : (v - 0.1);

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
    let z = (Math.sinh(theta) * Math.sin(params.torsion * alpha)) / bottom;
    let y = (Math.cosh(theta) * Math.sinh(alpha)) / bottom;
    //console.log(x,y,z)

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

  let geometry = new THREE.ParametricGeometry(Helicoid, 360, 254); // cake : sphere avec 5,5 ! function , slices, stacks, https://threejs.org/docs/#examples/en/geometries/ParametricGeometry

  // Setup a material
  // const materialWireRed = new THREE.MeshBasicMaterial({
  //   color: "red",
  //   wireframe: true,
  // });

  function getMaterial() {
    let material = new MeshPhysicalMaterial({
      color: 0xcc0000,
      emissive: 0x26a269,
      // color: 0xffff00,
      roughness: 0,
      metalness: 0.5,
      reflectivity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
      // flatShading: true,
      side: THREE.DoubleSide,
      //fog: true,
      //wireframe: true
    });

    material.onBeforeComplete = function (shader) {
      console.log(shader, "hello");
      shader.uniforms.playhead = { value: 0 };
      // minute 36 dans video ? necessaire ?
      // shader.fragmentShader = shader.fragmentShader.replace(
      //   "#include <logdepthbuf_fragment>",
      //   `
      //   diffuseColor.rgb = vec3(1.,0.,0.)
      //   ` + "#include <logdepthbuf_fragment>"
      // );
    };

    return material;
  }

  let material = getMaterial();

  // Setup a mesh with geometry + material
  const helicoidMesh = new THREE.Mesh(geometry, material);
  scene.add(helicoidMesh);

  scene.add(new THREE.AmbientLight(0xcccccc));

  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.x = 0;
  light.position.x = 1;
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  //light.shadow.bias = 0.00001

  scene.add(light);

  //////////////BALL EVENT

  createBallEvent = function (decalage = 0) {
    let created = Date.now() + decalage;
    let ball_event_material = new MeshPhysicalMaterial({
      //color: 0xcc0000,
      emissive: 0x26a269,
      color: decalage > 0 ? 0x00ff00 : 0x0000ff,
      roughness: 0,
      metalness: 0.5,
      reflectivity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
      flatShading: true,
      side: THREE.DoubleSide,
      //fog: true,
      //wireframe: true
    });
    let ball_event_geom = new THREE.IcosahedronGeometry(0.2, 5);
    let ball_event = new THREE.Mesh(ball_event_geom, ball_event_material);
    ball_event.userData.created = created;
    ball_event.position.x = 2;

    return ball_event;
  };

  let ball_now_geom = new THREE.IcosahedronGeometry(0.1, 5);

  let ball_now_material = new MeshPhysicalMaterial({
    // color: 0xcc0000,
    // emissive: 0x26a269,
    color: 0xff0000,
    roughness: 0,
    metalness: 0.5,
    reflectivity: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.4,
    // flatShading: true,
    side: THREE.DoubleSide,
    //fog: true,
    //wireframe: true
  });

  let ball_balance_material = new MeshPhysicalMaterial({
    //color: 0xcc0000,
    emissive: 0x26a269,
    color: 0x00ff00,
    roughness: 0,
    metalness: 0.5,
    reflectivity: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.4,
    flatShading: true,
    side: THREE.DoubleSide,
    //fog: true,
    //wireframe: true
  });

  let ball_now = new THREE.Mesh(ball_now_geom, ball_now_material);
  scene.add(ball_now);

  let ball_geom = new THREE.IcosahedronGeometry(0.1, 5);
  let ball1 = new THREE.Mesh(ball_geom, ball_balance_material);
  //let ball2 = new THREE.Mesh(ball_geom, ball_event_material);

  scene.add(ball1);
  //scene.add(ball2);

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

  var obj = {
    add: function () {
      console.log("clicked");
      let ball_event = createBallEvent();
      scene.add(ball_event);
      eventBalls.push(ball_event);
    },
  };

  var objFutur = {
    add: function () {
      console.log("clicked");
      let ball_event = createBallEvent(20000);
      scene.add(ball_event);
      eventBalls.push(ball_event);
    },
  };

  gui.add(obj, "add").name("Add an event now");

  gui.add(objFutur, "add").name("Add an event in 20 s futur");
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
    render({ time, playhead }) {
      if (ball1) {
        let theta1 = playhead * 2 * Math.PI;

        ball1.position.x = 1 * Math.sin(theta1);
        ball1.position.z = 2 * Math.cos(theta1);
      }

      eventBalls.forEach(function (b_e) {
        //console.log(b_e)
        // https://stackoverflow.com/questions/53108802/generate-a-random-number-in-interval-0-360-which-is-divisible-by-number-15

        //let theta2 = playhead * 2 * Math.PI - b_e.userData.created/360;
        let passed = Date.now() - b_e.userData.created;
        // console.log(passed)
        // b_e.position.x = 0.5 * Math.sin(theta2);
        // b_e.position.z = 0.5 * Math.cos(theta2);
        // b_e.position.y = - passed // 0.5 * Math.cos(theta2);

        // test avec playhead et passed
        //let step = Math.abs(passed) > 10 ? playhead/10 : playhead
        //let factor = Math.abs(passed) > 10 ? 5 : 1

        // console.log(passed, playhead);
        //let u = passed / settings.duration /100* (1/ Math.log(passed))
        // let step = parseInt(passed / 60)

        let u = passed / settings.duration / 1000;
        let v = playhead;
        //console.log(u, v);

        let alpha = Math.PI * 2 * u; //(u - 0.5); // transformer u en (u-0.5) double
        let theta = Math.PI * 2 * (v + 0.5); // distance du centre //(v - 0.5); // multiplie le couches (v - 0.5); sympa : (v - 0.1);

        let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);
        // selon wolfram // hyperbole
        b_e.position.x =
          (Math.sinh(theta) * Math.cos(params.torsion * alpha)) / bottom;
        b_e.position.z =
          (Math.sinh(theta) * Math.sin(params.torsion * alpha)) / bottom;
        b_e.position.y = (Math.cosh(theta) * Math.sinh(alpha)) / bottom;

        // without scale, balls follow the helicoid but not with scale
        let scale = 1 - Math.abs(b_e.position.y) + 0.01;
        b_e.scale.set(scale, scale, scale);

        //console.log(b_e.position.y);
        // if (b_e.position.y > 0.9999) {
        //   console.log("bip");
        // }
      });

      helicoidMesh.rotation.y = playhead * Math.PI * 2;

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
