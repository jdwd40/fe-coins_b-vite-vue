<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div v-if="loading" class="container mx-auto">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Market Stats</h1>

      <!-- Market Event -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-2">Current Market Event</h2>
        <el-table :data="[{ label: 'Event Type', value: marketStats.event.type }, { label: 'Start Time', value: marketStats.event.start_time }, { label: 'End Time', value: marketStats.event.end_time }, { label: 'Time Left', value: marketStats.event.time_left.toFixed(2) + ' minutes' }]" border>
          <el-table-column prop="label" label="Description" width="200"></el-table-column>
          <el-table-column prop="value" label="Value"></el-table-column>
        </el-table>
      </div>

      <!-- Market Details -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-2">Market Details</h2>
        <el-table :data="marketDetails" border>
          <el-table-column prop="label" label="Description" width="300"></el-table-column>
          <el-table-column prop="value" label="Value"></el-table-column>
        </el-table>
      </div>

      <!-- Top 3 Coins -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 class="text-lg font-bold mb-2">Top 3 Coins</h3>
        <el-table :data="top3Coins" border>
          <el-table-column prop="name" label="Coin Name" width="200"></el-table-column>
          <el-table-column prop="price" label="Price"></el-table-column>
        </el-table>
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
  computed: {
    marketDetails() {
      return [
        { label: 'Market Value', value: `£${this.marketStats.marketValue}` },
        { label: 'Last 5 Minutes Market Value', value: `£${this.marketStats.last5minsMarketValue} (${this.marketStats.percentage5mins})` },
        { label: 'Last 10 Minutes Market Value', value: `£${this.marketStats.last10minsMarketValue} (${this.marketStats.percentage10mins})` },
        { label: 'Last 30 Minutes Market Value', value: `£${this.marketStats.last30minsMarketValue} (${this.marketStats.percentage30mins})` },
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

<style scoped>
/* Add any additional styling here */
</style>
