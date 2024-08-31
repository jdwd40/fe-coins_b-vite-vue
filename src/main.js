import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'; // Import the CSS file
import { ElTable, ElTableColumn } from 'element-plus';
import 'element-plus/dist/index.css'

const app = createApp(App);

app.use(router);
app.use(ElTable);
app.use(ElTableColumn);
app.use(store);
app.mount('#app');