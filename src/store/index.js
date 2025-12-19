// import Vue from 'vue'
// import Vuex from 'vuex'
import core from './modules/core'
// import solid from './modules/solid'
// import terminal from './modules/terminal'
// import gun from './modules/gun'
// import yjs from './modules/yjs'
// import automerge from './modules/automerge'

// Vue.use(Vuex)

// import { createApp } from 'vue'
import { createStore } from 'vuex'

// // Create a new store instance.
// const store = createStore({
//     state() {
//         return {
//             count: 0
//         }
//     },
//     mutations: {
//         increment(state) {
//             state.count++
//         }
//     }
// })




export default createStore({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        core,
        // solid, terminal, gun, yjs /*automerge*/
    }
})