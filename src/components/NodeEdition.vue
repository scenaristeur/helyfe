<template>
    <div class="node-edition">
        <b-card v-if="currentNode != null" class="node-card">
            <b-card-title>{{ currentNode.name }}</b-card-title>
            <b-card-text>
                <p><strong>ID:</strong> {{ currentNode.id }}</p>
                <p><strong>Type:</strong> {{ currentNode.type }}</p>
                <p><strong>Created:</strong> {{ currentNode.created }}</p>
                <p><strong>Updated:</strong> {{ currentNode.updated }}</p>
                <p><strong>Description:</strong> {{ currentNode.description }}</p>
                <p><strong>Properties:</strong></p>
                <ul>
                    <li v-for="(value, key) in currentNode.properties" :key="key">
                        <strong>{{ key }}:</strong> {{ value }}
                    </li>
                </ul>
            </b-card-text>
            <b-button variant="primary" @click="editNode">Edit Node</b-button>
            <b-button variant="danger" @click="deleteNode">Delete Node</b-button>
        </b-card>
        <div v-else>
            <p>No node selected</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "NodeEdition",
    computed: {
        currentNode() {
            return this.$store.state.core.currentNode
        }
    },
    methods: {
        editNode() {
            // Logic to edit the node
            console.log("Editing node:", this.currentNode)
            // You would typically open an edit modal or navigate to an edit page
        },
        deleteNode() {
            // Logic to delete the node
            console.log("Deleting node:", this.currentNode)
            // You would typically show a confirmation dialog
            this.$store.dispatch('core/deleteNode', this.currentNode.id)
        }
    }
}
</script>

<style scoped>
.node-edition {
    padding: 20px;
}

.node-card {
    margin-bottom: 20px;
}
</style>
