import './assets/keyframes.css';
import './assets/main.css'
import "./@iconify/icons-bundle.cjs"
import "overlayscrollbars/overlayscrollbars.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import registerPlugins from './plugins'

const app = createApp(App)

app.use(router)
registerPlugins(app);

app.mount('#app')
