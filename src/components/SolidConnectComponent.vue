<template>
    <div class="solid-connect-component">
        <h3>Connexion au serveur Solid</h3>

        <!-- État de connexion -->
        <div class="connection-status">
            <span :class="['status-indicator', connectionStatus]">
                {{ connectionStatusText }}
            </span>
        </div>

        <!-- Formulaire de connexion -->
        <div v-if="!isLoggedIn" class="login-form">
            <div class="form-group">
                <label for="solidUrl">URL du serveur Solid :</label>
                <input id="solidUrl" v-model="solidUrl" type="url" placeholder="https://academy-cdr.solidcommunity.net"
                    class="form-input" />
            </div>

            <div class="form-group">
                <label for="username">Nom d'utilisateur :</label>
                <input id="username" v-model="username" type="text" placeholder="Votre nom d'utilisateur"
                    class="form-input" />
            </div>

            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <input id="password" v-model="password" type="password" placeholder="Votre mot de passe"
                    class="form-input" />
            </div>

            <button @click="simulateLogin" :disabled="isLoggingIn" class="login-button">
                {{ isLoggingIn ? 'Connexion en cours...' : 'Se connecter' }}
            </button>

            <div v-if="loginError" class="error-message">
                {{ loginError }}
            </div>
        </div>

        <!-- Interface après connexion -->
        <div v-else class="connected-section">
            <div class="user-info">
                <p>Connecté en tant que : <strong>{{ username }}</strong></p>
                <p>Server : <strong>{{ solidUrl }}</strong></p>
            </div>

            <button @click="logout" class="logout-button">
                Se déconnecter
            </button>

            <div class="actions">
                <button @click="listPublicGraphs" class="action-button">
                    Lister les graphes publics
                </button>

                <button @click="loadGraphFromSolid" class="action-button">
                    Charger un graphe depuis Solid
                </button>
            </div>

            <!-- Liste des graphes -->
            <div v-if="publicGraphs.length > 0" class="graphs-list">
                <h4>Graphes publics disponibles :</h4>
                <ul>
                    <li v-for="graph in publicGraphs" :key="graph.url">
                        <span @click="selectGraph(graph)" class="graph-item">
                            {{ graph.name }}
                        </span>
                        <button @click="downloadGraph(graph)" class="download-button">
                            Télécharger
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Message d'erreur pour les graphes -->
            <div v-if="graphsError" class="error-message">
                {{ graphsError }}
            </div>
        </div>
    </div>
</template>

<script>
// import { login, logout, fetch } from '@inrupt/solid-client'
// Utilisation simplifiée pour éviter les erreurs d'importation

export default {
    name: "SolidConnectComponent",
    data() {
        return {
            solidUrl: 'https://academy-cdr.solidcommunity.net',
            username: '',
            password: '',
            isLoggedIn: false,
            isLoggingIn: false,
            loginError: '',
            connectionStatus: 'disconnected',
            connectionStatusText: 'Déconnecté',
            publicGraphs: [],
            graphsError: '',
            selectedGraph: null
        }
    },
    methods: {
        simulateLogin() {
            if (!this.username || !this.password || !this.solidUrl) {
                this.loginError = 'Veuillez remplir tous les champs';
                return;
            }

            this.isLoggingIn = true;
            this.loginError = '';

            try {
                // Pour l'instant, utilisons une approche simplifiée
                // Dans une version réelle, il faudrait utiliser l'authentification OIDC
                this.isLoggedIn = true;
                this.connectionStatus = 'connected';
                this.connectionStatusText = 'Connecté';

                // Afficher un message temporaire pour indiquer que la connexion est simulée
                console.log(`Connexion simulée à ${this.solidUrl} avec ${this.username}`);
            } catch (error) {
                console.error('Erreur de connexion:', error);
                this.loginError = 'Erreur de connexion : ' + error.message;
                this.connectionStatus = 'error';
                this.connectionStatusText = 'Erreur de connexion';
            } finally {
                this.isLoggingIn = false;
            }
        },

        async logout() {
            try {
                // Simuler la déconnexion
                this.isLoggedIn = false;
                this.connectionStatus = 'disconnected';
                this.connectionStatusText = 'Déconnecté';
                this.publicGraphs = [];
                this.graphsError = '';
                this.selectedGraph = null;
                console.log('Déconnexion simulée');
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            }
        },

        async listPublicGraphs() {
            if (!this.isLoggedIn) {
                this.graphsError = 'Veuillez vous connecter d\'abord';
                return;
            }

            try {
                // Simulation de la liste des graphes
                // Dans une implémentation réelle, cela serait une requête HTTP vers le serveur Solid
                this.graphsError = '';
                this.publicGraphs = [
                    { name: 'exemple_graph.jsonld', url: `${this.solidUrl}/public/exemple_graph.jsonld` },
                    { name: 'mon_graphe.jsonld', url: `${this.solidUrl}/public/mon_graphe.jsonld` },
                    { name: 'data_projet.jsonld', url: `${this.solidUrl}/public/data_projet.jsonld` }
                ];
                console.log('Graphes publics récupérés:', this.publicGraphs);
            } catch (error) {
                console.error('Erreur lors de la récupération des graphes:', error);
                this.graphsError = 'Erreur lors de la récupération des graphes : ' + error.message;
            }
        },

        async downloadGraph(graph) {
            if (!this.isLoggedIn) {
                this.graphsError = 'Veuillez vous connecter d\'abord';
                return;
            }

            try {
                // Simulation du téléchargement
                console.log(`Téléchargement du graphe : ${graph.name}`);
                this.graphsError = '';

                // Ici, on simule le téléchargement d'un fichier JSON-LD
                // Dans une implémentation réelle, on utiliserait fetch() pour récupérer le contenu

                // Pour l'exemple, on va créer un objet JSON-LD de base
                const sampleGraph = {
                    "@context": {
                        "@vocab": "https://schema.org/",
                        "name": "http://xmlns.com/foaf/0.1/name"
                    },
                    "@id": graph.url,
                    "name": graph.name,
                    "type": "Dataset",
                    "description": "Graphe JSON-LD téléchargé depuis Solid Community"
                };

                // Simuler l'intégration dans le store
                this.$store.dispatch('core/integrateGraphData', {
                    nodes: [
                        { id: "node1", name: "Nœud 1", x: 0, y: 0, z: 0 },
                        { id: "node2", name: "Nœud 2", x: 100, y: 0, z: 0 },
                        { id: "node3", name: "Nœud 3", x: 0, y: 100, z: 0 }
                    ],
                    links: [
                        { source: "node1", target: "node2" },
                        { source: "node2", target: "node3" }
                    ]
                });

                alert(`Graphe "${graph.name}" téléchargé et intégré avec succès !`);

            } catch (error) {
                console.error('Erreur lors du téléchargement du graphe:', error);
                this.graphsError = 'Erreur lors du téléchargement du graphe : ' + error.message;
            }
        },

        selectGraph(graph) {
            this.selectedGraph = graph;
            console.log('Graphe sélectionné:', graph);
        },

        async loadGraphFromSolid() {
            if (!this.isLoggedIn) {
                this.graphsError = 'Veuillez vous connecter d\'abord';
                return;
            }

            // Cette méthode pourrait permettre de charger un graphe spécifique
            // depuis Solid Community via une interface plus avancée
            alert('Fonctionnalité de chargement avancé du graphe depuis Solid Community');
        }
    }
}
</script>

<style scoped>
.solid-connect-component {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 20px 0;
    background-color: #f9f9f9;
}

.connection-status {
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
}

.status-indicator {
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: bold;
}

.status-indicator.connected {
    background-color: #4CAF50;
    color: white;
}

.status-indicator.disconnected {
    background-color: #f44336;
    color: white;
}

.status-indicator.error {
    background-color: #ff9800;
    color: white;
}

.login-form {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.login-button,
.logout-button,
.action-button,
.download-button {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;
}

.login-button:hover,
.logout-button:hover,
.action-button:hover,
.download-button:hover {
    background-color: #1976D2;
}

.login-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.logout-button {
    background-color: #f44336;
}

.logout-button:hover {
    background-color: #d32f2f;
}

.actions {
    margin: 20px 0;
}

.graphs-list ul {
    list-style-type: none;
    padding: 0;
}

.graph-item {
    cursor: pointer;
    padding: 5px 10px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-right: 10px;
}

.graph-item:hover {
    background-color: #bdbdbd;
}

.download-button {
    background-color: #4CAF50;
    padding: 5px 10px;
    font-size: 12px;
}

.download-button:hover {
    background-color: #45a049;
}

.error-message {
    color: #f44336;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
    margin-top: 10px;
}

.user-info {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #e3f2fd;
    border-radius: 4px;
}
</style>
