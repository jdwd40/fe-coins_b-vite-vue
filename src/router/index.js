import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PortfolioView from '../views/PortfolioView.vue';
import MarketView from '../views/MarketView.vue';
import CoinDetailsView from '../views/CoinDetailsView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/portfolio', name: 'Portfolio', component: PortfolioView },
  { path: '/market', name: 'Market', component: MarketView },
  { path: '/coin/:id', name: 'CoinDetails', component: CoinDetailsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
