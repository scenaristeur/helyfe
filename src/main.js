import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import i18nPlugin from './plugins/i18n'

// app.use(i18nPlugin, {
//     greetings: {
//         hello: 'Bonjour!'
//     }
// })

// import Graph3dPlugin from '@/plugins/grah3d-plugin';


const app = createApp(App)

app.use(router)
app.use(store)
// app.use(Graph3dPlugin, { store: store });

app.mount('#app')
