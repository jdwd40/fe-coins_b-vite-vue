<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">My Portfolio</h1>
      <div v-if="loading" class="text-gray-700">Loading...</div>
      <div v-else>
        <table class="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-blue-500 text-white">Coin</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Amount</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Current Price</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coin in portfolio" :key="coin.portfolio_id">
              <td class="border px-4 py-2">{{ coin.name }}</td>
              <td class="border px-4 py-2">{{ coin.amount }}</td>
              <td class="border px-4 py-2">{{ coin.current_price }}</td>
              <td class="border px-4 py-2">{{ (coin.amount * coin.current_price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-gray-800 font-bold">
          Total Value: ${{ totalValue.toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPortfolio } from '../services/portfolioService';
import { mapState } from 'vuex';

export default {
  name: 'PortfolioView',
  data() {
    return {
      portfolio: [],
      totalValue: 0,
      loading: true,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  async created() {
    try {
      const portfolioData = await getPortfolio(this.user.userId);
      this.totalValue = portfolioData.pop().totalValue;
      this.portfolio = portfolioData;
      this.loading = false;
    } catch (error) {
      console.error('Error loading portfolio:', error);
      this.loading = false;
    }
  },
};
</script>
