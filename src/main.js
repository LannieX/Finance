import { createApp } from 'vue'
import './assets/tailwind.css'
import './style.css'
import './assets/fonts.css'
import router from './router'
import App from './App.vue'
import './assets/tailwind.css';

const app = createApp(App)
app.use(router)
app.mount('#app')
