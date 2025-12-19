<template>
    <div id="3d-graph" width="100px" ref="graph">Loading graph...</div>
</template>
<script>
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
export default {
    name: "WelcomeView",
    // data() {
    //     // return {
    //     //     graph: null
    //     // }
    // },
    mounted() {
        // this.$graphInit({ domElement: this.$refs.graph })
        this.initGraph()
        this.addPlane()
        this.addSphere()
        this.addHelicoid()
    },
    methods: {
        initGraph() {
            const N = 300;
            const gData = {
                nodes: [...Array(N).keys()].map(i => ({ id: i })),
                links: [...Array(N).keys()]
                    .filter(id => id)
                    .map(id => ({
                        source: id,
                        target: Math.round(Math.random() * (id - 1))
                    }))
            };

            this.graph = new ForceGraph3D(document.getElementById('3d-graph'))
                .graphData(gData);
        },
        addPlane() {
            const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
            mesh.position.set(-100, -200, -100);
            mesh.rotation.set(0.5 * Math.PI, 0, 0);
            this.graph.scene().add(mesh);
        },
        addSphere() {
            const sphereGeometry = new THREE.SphereGeometry(100, 32, 16)
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: "blue",
                wireframe: true
            })

            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
            sphereMesh.position.set(-500, 400, -100);


            // const Graph = new ForceGraph3D(document.getElementById('graph'))
            //     .graphData(gData);

            this.graph.scene().add(sphereMesh)
        },
        addHelicoid() {
            // let params = { torsion: 5, speed: 1000 };
            let geometry = new ParametricGeometry(this.Helicoid, 360, 254);
            let material = this.getMaterial();

            // Setup a mesh with geometry + material
            const helicoidMesh = new THREE.Mesh(geometry, material);
            helicoidMesh.scale.set(100, 100, 100)

            scene.add(helicoidMesh).add(helicoidMesh);


        },
        Helicoid(u, v, target) {
            let alpha = Math.PI * 2 * (u - 0.5); // transformer u en (u-0.5) double
            let theta = Math.PI * 2 * (v - 0.5); // multiplie le couches (v - 0.5); sympa : (v - 0.1);
            let torsion = 5
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
            let x = (Math.sinh(theta) * Math.cos(torsion * alpha)) / bottom;
            let z = (Math.sinh(theta) * Math.sin(torsion * alpha)) / bottom;
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
        },
        getMaterial() {
            let material = new THREE.MeshPhysicalMaterial({
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
        // update() {
        //     if (this.graph != undefined) {
        //         let nodes = this.nodes.map(a => { return { ...a } })
        //         let links = this.links.map(a => { return { ...a } })
        //         this.graph.graphData({ nodes: nodes, links: links })
        //         console.log(this.graph.graphData())
        //     }
        // }
    },
    watch: {
        // nodes() {
        //     this.update()
        // },
        // links() {
        //     this.update()
        // },
        // graph() {
        //     this.update()
        // }
    },
    computed: {
        // nodes() {
        //     return this.$store.state.core.nodes
        // },
        // links() {
        //     return this.$store.state.core.links
        // },
        // graph() {
        //     return this.$store.state.core.graph
        // }
    },
}
</script>

<style>
.node-label {
    font-size: 12px;
    padding: 1px 4px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    user-select: none;
}
</style>