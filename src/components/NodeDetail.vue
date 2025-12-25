<template>
    <div class="node-detail">
        <h3>Détails du nœud</h3>
        <div v-if="currentNode">
            <p><strong>Nom:</strong> {{ currentNode.name }}</p>
            <p><strong>ID:</strong> {{ currentNode.id }}</p>
            <p><strong>Type:</strong> {{ currentNode.type }}</p>
            <p><strong>Position:</strong> {{ currentNode.x }}, {{ currentNode.y }}, {{ currentNode.z }}</p>
            <p><strong>Description:</strong> {{ currentNode.description }}</p>
            <p><strong>Liens sortants:</strong> {{ currentNode.links ? currentNode.links.length : 0 }}</p>
            <p><strong>Voisins:</strong> {{ currentNode.neighbors ? currentNode.neighbors.length : 0 }}</p>
        </div>
        <div v-else>
            <p>Aucun nœud sélectionné</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "NodeDetail",
    computed: {
        currentNode() {
            return this.$store.state.core.currentNode
        }
    }
}
</script>

<style scoped>
.node-detail {
    padding: 20px;
}
</style>
