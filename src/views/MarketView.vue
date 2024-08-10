<template>
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="container mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Market</h1>
        <div v-if="loading" class="text-gray-700">Loading...</div>
        <div v-else>
          <div v-for="coin in coins" :key="coin.coin_id" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-xl font-bold mb-2">{{ coin.name }} ({{ coin.symbol }})</h2>
            <p class="text-gray-700 mb-2">Current Price: ${{ coin.current_price }}</p>
            <p class="text-gray-700 mb-2">Supply: {{ coin.supply }}</p>
            <p class="text-gray-700 mb-2">Market Cap: ${{ coin.market_cap }}</p>
            <router-link :to="`/coin/${coin.coin_id}`" class="text-blue-500 hover:underline">View Details</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getCoins } from '../services/coinService';
  
  export default {
    name: 'MarketView',
    data() {
      return {
        coins: [],
        loading: true,
      };
    },
    created() {
      this.loadCoins();
    },
    methods: {
      async loadCoins() {
        try {
          this.coins = await getCoins();
        } catch (error) {
          console.error('Error loading coin data:', error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  