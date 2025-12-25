<template>
    <div>
        <div id="3d-graph" width="100px" ref="graph">Loading graph...</div>
        <JsonUploadComponent />
    </div>
</template>
<script>
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import JsonUploadComponent from './JsonUploadComponent.vue';
import { onDeactivated } from 'vue';

export default {
    name: "BoussoleComponent",
    components: {
        JsonUploadComponent
    },
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

        // Démarrer l'animation des nodes
        this.startNodeAnimation();
    },
    methods: {
        initGraph() {
            const N = 100;

            // Générer les nodes aux positions extrêmes de l'helicoid
            const gData = {
                nodes: [],
                links: []
            };

            // Créer les nodes en utilisant les vertices de l'helicoid
            const geometry = new ParametricGeometry(this.Helicoid, 100, 5);
            const vertices = geometry.attributes.position.array;

            // Prendre les premiers vertices pour positionner les nodes
            for (let i = 0; i < N; i++) {
                const index = (i % (vertices.length / 3)) * 3; // Sélectionner un vertex
                if (index < vertices.length) {
                    const x = vertices[index];
                    const y = vertices[index + 1];
                    const z = vertices[index + 2];

                    gData.nodes.push({
                        id: i,
                        x: x * 100, // Appliquer l'échelle
                        y: y * 100,
                        z: z * 100
                    });
                } else {
                    // Fallback si on dépasse
                    gData.nodes.push({
                        id: i,
                        x: 0,
                        y: 0,
                        z: 0
                    });
                }
            }

            // Créer les liens
            gData.links = [...Array(N).keys()]
                .filter(id => id)
                .map(id => ({
                    source: id,
                    target: Math.round(Math.random() * (id - 1))
                }));

            this.graph = new ForceGraph3D(document.getElementById('3d-graph'))
                .graphData(gData)
                .onNodeClick(node => this.onNodeClick(node))

            // Ajouter des sphères bleues aux mêmes positions que les nodes
            this.addBlueSpheresAtNodePositions(gData.nodes, geometry);
        },
        onNodeClick(node) {
            console.log("node", node)

            // let n = this.$store.state.core.nodes.find(n => n.id == node.id)
            // let n = this.graph.nodes.find(n => n.id == node.id)
            this.$store.commit('core/setCurrentNode', node.id)
            this.nodeFocus(node)
        },
        nodeFocus(node) {


            const distance = 100;
            let pos = { x: distance, y: distance, z: distance }
            if (node.x != 0 && node.y != 0 && node.z != 0) {
                const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                pos = { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            }
            // this.$store.state.core.graph.cameraPosition
            this.graph.cameraPosition(
                pos, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
            // console.log(store.state.core.graph)


        },
        addPlane() {
            const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x46C809, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
            mesh.position.set(-100, -200, -100);
            mesh.rotation.set(0.5 * Math.PI, 0, 0);
            this.graph.scene().add(mesh);
        },
        addSphere() {
            const sphereGeometry = new THREE.SphereGeometry(100, 32, 16)
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xDDF527,
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
            let geometry = new ParametricGeometry(this.Helicoid, 100, 50); // Réduction du nombre de vertices
            let material = this.getMaterial();

            // Setup a mesh with geometry + material
            const helicoidMesh = new THREE.Mesh(geometry, material);
            helicoidMesh.scale.set(100, 100, 100)

            this.graph.scene().add(helicoidMesh);

            // Ajout d'une sphère sur le bord de l'helicoid
            this.addSphereOnHelicoidEdge(geometry);


        },
        Helicoid(u, v, target) {
            let alpha = Math.PI * 2 * (u - 0.5); // transformer u en (u-0.5) double
            let theta = Math.PI * 2 * (v - 0.5); // multiplie le couches (v - 0.5); sympa : (v - 0.1);
            let torsion = 5

            // hyperbola
            let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);
            // selon wolfram // hyperbole
            let x = (Math.sinh(theta) * Math.cos(torsion * alpha)) / bottom;
            let z = (Math.sinh(theta) * Math.sin(torsion * alpha)) / bottom;
            let y = (Math.cosh(theta) * Math.sinh(alpha)) / bottom;
            //console.log(x,y,z)
            target.set(x, y, z);
        },
        getMaterial() {
            let material = new THREE.MeshPhysicalMaterial({
                color: "red",
                // emissive: 0x26a269,
                // color: 0xffff00,
                roughness: 0.5, // Réduction de la rugosité
                metalness: 0.2, // Réduction de la métallicité
                reflectivity: 0.2, // Réduction de la réflectivité
                clearcoat: 0.5, // Réduction du clearcoat
                clearcoatRoughness: 0.7, // Réduction de la rugosité du clearcoat
                // flatShading: true,
                side: THREE.DoubleSide,
                //fog: true,
                wireframe: true
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
        },
        addSphereOnHelicoidEdge(geometry) {
            // Création d'une sphère pour représenter le bord de l'helicoid
            const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Réduction de la taille
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff, // Blanc pour une meilleure contraste avec le rouge
                wireframe: false,
                transparent: true,
                opacity: 0.7 // Réduction de la transparence pour diminuer la luminosité
            });

            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // Positionner la sphère sur le bord de l'helicoid
            // Utilisons u=0 et v=0 pour obtenir un point au bord
            const u = 0;
            const v = 0;
            const target = new THREE.Vector3();

            // Utilisation directe des points de la géométrie plutôt que de recalculer
            if (geometry) {
                // Récupérer le point depuis la géométrie déjà calculée
                const vertices = geometry.attributes.position.array;
                const index = (u * 254 + v) * 3; // Calcul de l'index dans le tableau des sommets
                if (index < vertices.length) {
                    target.set(vertices[index], vertices[index + 1], vertices[index + 2]);
                } else {
                    // Fallback vers le calcul classique si nécessaire
                    this.Helicoid(u, v, target);
                }
            } else {
                // Fallback vers le calcul classique
                this.Helicoid(u, v, target);
            }

            // Appliquer l'échelle et la position
            sphereMesh.position.copy(target);
            sphereMesh.scale.set(100, 100, 100);

            this.graph.scene().add(sphereMesh);
        },
        addBlueSpheresAtNodePositions(nodes, geometry) {
            // Créer des sphères bleues aux positions des nodes
            const sphereGeometry = new THREE.SphereGeometry(2, 16, 16); // Taille plus petite
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0x0000ff, // Bleu pour les sphères
                wireframe: false
            });

            const vertices = geometry.attributes.position.array;

            // Ajouter une sphère bleue pour chaque node
            nodes.forEach((node, index) => {
                const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

                // Positionner la sphère à la position du node
                sphereMesh.position.set(node.x, node.y, node.z);

                // Appliquer l'échelle
                sphereMesh.scale.set(1, 1, 1); // Pas d'échelle supplémentaire ici

                this.graph.scene().add(sphereMesh);
            });
        },
        startNodeAnimation() {
            // Stocker les positions originales des nodes
            this.originalPositions = {};
            const nodes = this.graph.graphData().nodes;

            // Sauvegarder les positions originales
            nodes.forEach(node => {
                this.originalPositions[node.id] = { x: node.x, y: node.y, z: node.z };
            });

            // Démarrer l'animation test pour remettre le noeud à sa place
            // setInterval(() => {
            //     this.animateNodes();
            // }, 10000); // Tous les 10 secondes
        },
        animateNodes() {
            const nodes = this.graph.graphData().nodes;
            const currentTime = Date.now();

            // Choisir le prochain node à animer (en ordre)
            const nodeId = (currentTime / 10000) % nodes.length | 0;

            // Obtenir le node à animer
            const node = nodes.find(n => n.id === nodeId);
            if (!node || !this.originalPositions[nodeId]) return;

            // Calculer la position cible (position originale)
            const targetPosition = this.originalPositions[nodeId];

            // Animer le node vers sa position originale (avec interpolation)
            const animationDuration = 2000; // 2 secondes pour l'animation
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Interpolation linéaire entre la position actuelle et la position cible
                const easedProgress = 1 - Math.pow(1 - progress, 3); // Easing function

                node.x = node.x + (targetPosition.x - node.x) * easedProgress;
                node.y = node.y + (targetPosition.y - node.y) * easedProgress;
                node.z = node.z + (targetPosition.z - node.z) * easedProgress;

                // Mettre à jour le graphique
                this.graph.graphData({ nodes: nodes, links: this.graph.graphData().links });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        },
        updateGraphData() {
            // Mettre à jour le graphique avec les nouveaux nodes et links
            if (this.graph) {
                const graphData = {
                    nodes: this.$store.state.core.nodes,
                    links: this.$store.state.core.links
                };
                this.graph.graphData(graphData);
            }
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
    watch: {
        // Surveiller les changements dans les nodes et links du store
        '$store.state.core.nodes': {
            handler(newNodes) {
                this.updateGraphData();
            },
            deep: true
        },
        '$store.state.core.links': {
            handler(newLinks) {
                this.updateGraphData();
            },
            deep: true
        }
    }
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
