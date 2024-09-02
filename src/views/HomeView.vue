<template>
  <div class="min-h-screen bg-gray-100 p-4 font-sans">
    <div v-if="loading" class="container mx-auto">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else class="container mx-auto">
      <!-- Quick Stats Banner -->
      <div class="overflow-x-auto whitespace-nowrap mb-4 py-2 bg-white rounded-lg shadow">
        <div class="inline-block px-3 py-1" v-for="(stat, index) in quickStats" :key="index">
          <span class="font-semibold text-purple-700">{{ stat.label }}:</span>
          <span class="text-gray-800">{{ stat.value }}</span>
        </div>
      </div>

      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Market Stats</h1>

      <!-- Market Event Card -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 @click="toggleSection('event')" class="text-xl font-semibold text-purple-700 cursor-pointer flex justify-between items-center">
          Current Market Event
          <svg :class="{'rotate-180': openSections.event}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </h2>
        <div v-if="openSections.event" class="mt-4">
          <p v-for="(item, index) in eventDetails" :key="index" class="mb-2">
            <span class="font-semibold text-gray-700">{{ item.label }}:</span>
            <span class="text-gray-800">{{ item.value }}</span>
          </p>
        </div>
      </div>

      <!-- Market Details Card -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 @click="toggleSection('details')" class="text-xl font-semibold text-purple-700 cursor-pointer flex justify-between items-center">
          Market Details
          <svg :class="{'rotate-180': openSections.details}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </h2>
        <div v-if="openSections.details" class="mt-4">
          <p v-for="(item, index) in marketDetails" :key="index" class="mb-2">
            <span class="font-semibold text-gray-700">{{ item.label }}:</span>
            <span class="text-gray-800">{{ item.value }}</span>
          </p>
        </div>
      </div>

      <!-- Top 3 Coins Card -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <h2 @click="toggleSection('topCoins')" class="text-xl font-semibold text-purple-700 cursor-pointer flex justify-between items-center">
          Top 5 Coins
          <svg :class="{'rotate-180': openSections.topCoins}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </h2>
        <div v-if="openSections.topCoins" class="mt-4">
          <div v-for="(coin, index) in top3Coins" :key="index" class="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
            <span class="font-semibold text-gray-800">{{ coin.name }}</span>
            <span class="text-green-600">{{ coin.price }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMarketStats } from '../services/coinService';

export default {
  name: 'HomeView',
  data() {
    return {
      marketStats: null,
      loading: true,
      openSections: {
        event: true,
        details: false,
        topCoins: false
      }
    };
  },
  computed: {
    quickStats() {
      return [
        { label: 'Market Value', value: `£${this.marketStats.marketValue}` },
        { label: '5m Change', value: this.marketStats.percentage5mins },
        { label: 'All-Time High', value: `£${this.marketStats.allTimeHigh}` },
      ];
    },
    eventDetails() {
      return [
        { label: 'Event Type', value: this.marketStats.event.type },
        { label: 'Start Time', value: this.marketStats.event.start_time },
        { label: 'End Time', value: this.marketStats.event.end_time },
        { label: 'Time Left', value: `${this.marketStats.event.time_left.toFixed(2)} minutes` },
      ];
    },
    marketDetails() {
      return [
        { label: 'Market Value', value: `£${this.marketStats.marketValue}` },
        { label: 'Last 5 Minutes', value: `£${this.marketStats.last5minsMarketValue} (${this.marketStats.percentage5mins})` },
        { label: 'Last 10 Minutes', value: `£${this.marketStats.last10minsMarketValue} (${this.marketStats.percentage10mins})` },
        { label: 'Last 30 Minutes', value: `£${this.marketStats.last30minsMarketValue} (${this.marketStats.percentage30mins})` },
        { label: 'All-Time High', value: `£${this.marketStats.allTimeHigh}` },
        { label: 'Market Total', value: `£${this.marketStats.marketTotal}` }
      ];
    },
    top3Coins() {
      return this.marketStats.top3Coins.map(coin => ({
        name: coin.name,
        price: `£${coin.price}`
      }));
    }
  },
  methods: {
    toggleSection(section) {
      this.openSections[section] = !this.openSections[section];
    }
  },
  async created() {
    try {
      this.marketStats = await getMarketStats();
      this.loading = false;
    } catch (error) {
      console.error('Error loading market stats:', error);
      this.loading = false;
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