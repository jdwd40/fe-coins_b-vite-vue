import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'; // Import the CSS file

createApp(App).use(router).use(store).mount('#app');
