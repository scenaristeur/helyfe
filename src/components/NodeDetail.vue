<template>
    <div>
        <!-- <div id="3d-graph" width="100px" ref="graph">Loading graph...</div>
        <JsonUploadComponent /> -->
        s {{ currentNode }} s

    </div>
</template>
<script>
// import ForceGraph3D from '3d-force-graph';
// import * as THREE from 'three';
// import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
// import JsonUploadComponent from './JsonUploadComponent.vue';

export default {
    name: "NodeDetail",
    components: {
        // JsonUploadComponent
    },
    computed: {
        currentNode() {
            return this.$store.state.core.currentNode
        },
        // links() {
        //     return this.$store.state.core.links
        // },
        // graph() {
        //     return this.$store.state.core.graph
        // }
    },
    watch: {
        currentNode() {
            console.log("currentNode", this.currentNode)
        },
    }

}

</script>