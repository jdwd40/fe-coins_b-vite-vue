<template>
  <div class="min-h-screen bg-gray-900 p-4 font-sans">
    <div class="container mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-100 mb-6">Market</h1>
      
      <!-- Search input -->
      <div class="mb-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search coins..." 
          class="w-full p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 text-gray-300 placeholder-gray-500"
        >
      </div>

      <!-- Coin list -->
      <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
        <!-- Table header (visible on md screens and up) -->
        <div class="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-700 font-semibold text-gray-300">
          <div>Name</div>
          <div>Symbol</div>
          <div class="text-right">Price</div>
          <div class="text-right">Market Cap</div>
          <div class="text-right">Supply</div>
        </div>

        <!-- Coin rows -->
        <div v-for="coin in filteredCoins" :key="coin.coin_id" @click="handleRowClick(coin)" class="border-b border-gray-600 cursor-pointer hover:bg-gray-700">
          <!-- Mobile view -->
          <div class="md:hidden p-4">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-lg font-semibold text-gray-300">{{ coin.name }}</h2>
                <p class="text-sm text-purple-400">{{ coin.symbol }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-green-400">£{{ formatPrice(coin.current_price) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Desktop view -->
          <div class="hidden md:grid grid-cols-5 gap-4 p-4 items-center">
            <div class="font-semibold text-gray-300">{{ coin.name }}</div>
            <div class="text-purple-400">{{ coin.symbol }}</div>
            <div class="text-right font-semibold text-green-400">£{{ formatPrice(coin.current_price) }}</div>
            <div class="text-right text-gray-400">£{{ formatLargeNumber(coin.market_cap) }}</div>
            <div class="text-right text-gray-400">{{ formatLargeNumber(coin.supply) }}</div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="text-center py-4">
        <p class="text-gray-400">Loading...</p>
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
      searchQuery: '',
    };
  },
  computed: {
    filteredCoins() {
      return this.coins.filter(coin => 
        coin.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
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
    handleRowClick(coin) {
      this.$router.push(`/coin/${coin.coin_id}`);
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    formatLargeNumber(number) {
      return new Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(number);
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}

/* Add any additional custom styles here */
</style>