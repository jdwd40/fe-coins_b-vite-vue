<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div v-if="loading" class="container mx-auto">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Market Stats</h1>
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" v-if="marketStats">
        <h2 class="text-xl font-bold mb-2">Current Market Event</h2>
        <p class="text-gray-700 mb-2">Event Type: {{ marketStats.event.type }}</p>
        <p class="text-gray-700 mb-2">Start Time: {{ marketStats.event.start_time }}</p>
        <p class="text-gray-700 mb-2">End Time: {{ marketStats.event.end_time }}</p>
        <p class="text-gray-700 mb-2">Time Left: {{ marketStats.event.time_left.toFixed(2) }} minutes</p>

        <h2 class="text-xl font-bold mb-2">Market Details</h2>
        <p class="text-gray-700 mb-2">Market Value: ${{ marketStats.marketValue }}</p>
        <p class="text-gray-700 mb-2">Last 5 Minutes Market Value: ${{ marketStats.last5minsMarketValue }} ({{ marketStats.percentage5mins }})</p>
        <p class="text-gray-700 mb-2">Last 10 Minutes Market Value: ${{ marketStats.last10minsMarketValue }} ({{ marketStats.percentage10mins }})</p>
        <p class="text-gray-700 mb-2">Last 30 Minutes Market Value: ${{ marketStats.last30minsMarketValue }} ({{ marketStats.percentage30mins }})</p>
        <p class="text-gray-700 mb-2">All-Time High: ${{ marketStats.allTimeHigh }}</p>
        <p class="text-gray-700 mb-2">Market Total: ${{ marketStats.marketTotal }}</p>
        
        <h3 class="text-lg font-bold mb-2">Top 3 Coins</h3>
        <ul>
          <li v-for="coin in marketStats.top3Coins" :key="coin.name" class="text-gray-700 mb-2">{{ coin.name }}: ${{ coin.price }}</li>
        </ul>
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
    };
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
