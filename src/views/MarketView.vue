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

      <!-- Quick Stats Banner -->
      <div class="overflow-x-auto whitespace-nowrap mb-4 py-2 bg-gray-800 rounded-lg shadow">
        <div class="inline-block px-3 py-1" v-for="(stat, index) in quickStats" :key="index">
          <span class="font-semibold text-purple-400">{{ stat.label }}:</span>
          <span :class="stat.class">{{ stat.value }}</span>
        </div>
      </div>

      <!-- Market Event Card -->
      <div class="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h2 @click="toggleSection('event')" class="text-xl font-semibold text-purple-400 cursor-pointer flex justify-between items-center">
          Current Market Event
          <svg :class="{'rotate-180': openSections.event}" class="w-5 h-5 transition-transform text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </h2>
        <div v-if="openSections.event" class="mt-4">
          <p v-for="(item, index) in eventDetails" :key="index" class="mb-2">
            <span class="font-semibold text-gray-300">{{ item.label }}: </span>
            <span :class="item.class">{{ item.value }}</span>
          </p>
        </div>
      </div>

      <!-- Market Details Card -->
      <div class="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h2 @click="toggleSection('details')" class="text-xl font-semibold text-purple-400 cursor-pointer flex justify-between items-center">
          Market Details
          <svg :class="{'rotate-180': openSections.details}" class="w-5 h-5 transition-transform text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </h2>
        <div v-if="openSections.details" class="mt-4">
          <p v-for="(item, index) in marketDetails" :key="index" class="mb-2">
            <span class="font-semibold text-gray-300">{{ item.label }}: </span>
            <span :class="item.class">{{ item.value }}</span>
          </p>
        </div>
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
import { getMarketStats, getCoins } from '../services/coinService';

export default {
  name: 'MarketView',
  data() {
    return {
      coins: [],
      marketStats: null,
      loading: true,
      searchQuery: '',
      openSections: {
        event: true,
        details: false,
      },
    };
  },
  computed: {
    filteredCoins() {
      return this.coins.filter(coin =>
        coin.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    quickStats() {
      if (!this.marketStats) return [];
      const changeClass = this.getChangeClass(this.marketStats.percentage5mins);
      return [
        { label: 'Market Value', value: `£${this.marketStats.marketValue}`, class: 'text-gray-300' },
        { label: '5m Change', value: this.marketStats.percentage5mins, class: changeClass },
        { label: 'All-Time High', value: `£${this.marketStats.allTimeHigh}`, class: 'text-gray-300' },
      ];
    },
    eventDetails() {
      if (!this.marketStats) return [];
      const eventType = this.marketStats.event.type;
      const eventClass = eventType.toLowerCase() === 'bust' ? 'text-red-400 uppercase text-sm' : 'text-green-400 uppercase text-sm';
      return [
        { label: 'Event Type', value: eventType, class: eventClass },
        { label: 'Time Left', value: `${this.marketStats.event.time_left.toFixed(2)} minutes`, class: 'text-gray-300' },
      ];
    },
    marketDetails() {
      if (!this.marketStats) return [];
      return [
        { label: 'Market Value', value: `£${this.marketStats.marketValue}`, class: 'text-gray-300' },
        { label: 'Last 5 Minutes', value: `£${this.marketStats.last5minsMarketValue} (${this.marketStats.percentage5mins})`, class: this.getChangeClass(this.marketStats.percentage5mins) },
        { label: 'Last 10 Minutes', value: `£${this.marketStats.last10minsMarketValue} (${this.marketStats.percentage10mins})`, class: this.getChangeClass(this.marketStats.percentage10mins) },
        { label: 'Last 30 Minutes', value: `£${this.marketStats.last30minsMarketValue} (${this.marketStats.percentage30mins})`, class: this.getChangeClass(this.marketStats.percentage30mins) },
        { label: 'All-Time High', value: `£${this.marketStats.allTimeHigh}`, class: 'text-gray-300' },
        { label: 'Market Total', value: `£${this.marketStats.marketTotal}`, class: 'text-gray-300' }
      ];
    }
  },
  created() {
    this.loadCoins();
    this.loadMarketStats();
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
    async loadMarketStats() {
      try {
        this.marketStats = await getMarketStats();
      } catch (error) {
        console.error('Error loading market stats:', error);
      }
    },
    toggleSection(section) {
      this.openSections[section] = !this.openSections[section];
    },
    handleRowClick(coin) {
      this.$router.push(`/coin/${coin.coin_id}`);
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    formatLargeNumber(number) {
      return new Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(number);
    },
    getChangeClass(change) {
      const numChange = parseFloat(change);
      return numChange < 0 ? 'text-red-400' : 'text-green-400';
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