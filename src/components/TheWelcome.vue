<template>
    <div id="3d-graph" width="100px" ref="graph">Loading graph...</div>
</template>
<script>
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
export default {
    name: "WelcomeView",
    mounted() {
        // this.$graphInit({ domElement: this.$refs.graph })
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

        const graph = new ForceGraph3D(document.getElementById('3d-graph'))
            .graphData(gData);

        const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
        mesh.position.set(-100, -200, -100);
        mesh.rotation.set(0.5 * Math.PI, 0, 0);



        // const Graph = new ForceGraph3D(document.getElementById('graph'))
        //     .graphData(gData);
        graph.scene().add(mesh);
    },
    methods: {
        update() {
            if (this.graph != undefined) {
                let nodes = this.nodes.map(a => { return { ...a } })
                let links = this.links.map(a => { return { ...a } })
                this.graph.graphData({ nodes: nodes, links: links })
                console.log(this.graph.graphData())
            }
        }
    },
    watch: {
        nodes() {
            this.update()
        },
        links() {
            this.update()
        },
        graph() {
            this.update()
        }
    },
    computed: {
        nodes() {
            return this.$store.state.core.nodes
        },
        links() {
            return this.$store.state.core.links
        },
        graph() {
            return this.$store.state.core.graph
        }
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