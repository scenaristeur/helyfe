<template>
    <div class="json-upload-component">
        <h3>Charger un groupe de noeuds/liens</h3>

        <!-- Bouton pour télécharger un fichier -->
        <div class="upload-area">
            <input type="file" ref="fileInput" @change="handleFileUpload" accept=".json" style="display: none;" />
            <button @click="$refs.fileInput.click()" class="upload-button">
                Sélectionner un fichier JSON
            </button>
            <p v-if="fileName" class="file-name">{{ fileName }}</p>
        </div>

        <!-- Zone de prévisualisation -->
        <div v-if="previewData" class="preview-section">
            <h4>Prévisualisation des données :</h4>
            <pre>{{ JSON.stringify(previewData, null, 2) }}</pre>
        </div>

        <!-- Bouton pour intégrer les données -->
        <div v-if="previewData" class="action-buttons">
            <button @click="integrateData" class="integrate-button">
                Intégrer les données au graphe
            </button>
        </div>

        <!-- Exemples -->
        <div class="examples-section">
            <h4>Exemples de groupes de données :</h4>
            <div class="example-buttons">
                <button v-for="(example, index) in examples" :key="index" @click="loadExample(index)"
                    class="example-button">
                    Exemple {{ index + 1 }}
                </button>
            </div>

            <div v-if="selectedExample" class="example-preview">
                <h5>Contenu de l'exemple {{ selectedExampleIndex + 1 }} :</h5>
                <pre>{{ JSON.stringify(selectedExample, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "JsonUploadComponent",
    data() {
        return {
            fileName: '',
            previewData: null,
            examples: [
                {
                    name: "Groupe simple",
                    data: {
                        nodes: [
                            { id: "node1", x: 0, y: 0, z: 0 },
                            { id: "node2", x: 100, y: 0, z: 0 },
                            { id: "node3", x: 0, y: 100, z: 0 }
                        ],
                        links: [
                            { source: "node1", target: "node2" },
                            { source: "node2", target: "node3" }
                        ]
                    }
                },
                {
                    name: "Groupe complexe",
                    data: {
                        nodes: [
                            { id: "nodeA", x: 0, y: 0, z: 0 },
                            { id: "nodeB", x: 200, y: 0, z: 0 },
                            { id: "nodeC", x: 0, y: 200, z: 0 },
                            { id: "nodeD", x: 200, y: 200, z: 0 },
                            { id: "nodeE", x: 100, y: 100, z: 0 }
                        ],
                        links: [
                            { source: "nodeA", target: "nodeB" },
                            { source: "nodeB", target: "nodeC" },
                            { source: "nodeC", target: "nodeD" },
                            { source: "nodeD", target: "nodeA" },
                            { source: "nodeA", target: "nodeE" },
                            { source: "nodeB", target: "nodeE" },
                            { source: "nodeC", target: "nodeE" },
                            { source: "nodeD", target: "nodeE" }
                        ]
                    }
                },
                {
                    name: "Réseau en étoile",
                    data: {
                        nodes: [
                            { id: "center", x: 0, y: 0, z: 0 },
                            { id: "node1", x: 150, y: 0, z: 0 },
                            { id: "node2", x: 0, y: 150, z: 0 },
                            { id: "node3", x: -150, y: 0, z: 0 },
                            { id: "node4", x: 0, y: -150, z: 0 }
                        ],
                        links: [
                            { source: "center", target: "node1" },
                            { source: "center", target: "node2" },
                            { source: "center", target: "node3" },
                            { source: "center", target: "node4" }
                        ]
                    }
                }
            ],
            selectedExample: null,
            selectedExampleIndex: null
        }
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.fileName = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        this.previewData = jsonData;
                    } catch (error) {
                        console.error("Erreur lors de la lecture du fichier JSON:", error);
                        alert("Erreur : Le fichier n'est pas un JSON valide.");
                    }
                };
                reader.readAsText(file);
            }
        },
        integrateData() {
            if (this.previewData) {
                // Envoyer les données au store
                this.$store.dispatch('core/integrateGraphData', this.previewData)
                    .then(() => {
                        alert("Données intégrées avec succès !");
                        this.previewData = null;
                        this.fileName = '';
                        this.$refs.fileInput.value = '';
                    })
                    .catch(error => {
                        console.error("Erreur lors de l'intégration des données:", error);
                        alert("Erreur lors de l'intégration des données.");
                    });
            }
        },
        loadExample(index) {
            this.selectedExample = this.examples[index].data;
            this.selectedExampleIndex = index;
        }
    }
}
</script>

<style scoped>
.json-upload-component {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 20px 0;
    background-color: #f9f9f9;
}

.upload-area {
    margin-bottom: 20px;
}

.upload-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.upload-button:hover {
    background-color: #45a049;
}

.file-name {
    margin-top: 10px;
    font-style: italic;
    color: #666;
}

.preview-section {
    margin: 20px 0;
    padding: 15px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #eee;
}

.action-buttons {
    margin: 20px 0;
}

.integrate-button {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.integrate-button:hover {
    background-color: #1976D2;
}

.examples-section {
    margin-top: 30px;
}

.example-buttons {
    margin: 15px 0;
}

.example-button {
    background-color: #FF9800;
    color: white;
    padding: 8px 16px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.example-button:hover {
    background-color: #F57C00;
}

.example-preview {
    margin-top: 15px;
    padding: 15px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #eee;
}
</style>
