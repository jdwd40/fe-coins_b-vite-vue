<template>
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="container mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ coin.name }} ({{ coin.symbol }})</h1>
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p class="text-gray-700 mb-2">Current Price: ${{ coin.current_price }}</p>
          <p class="text-gray-700 mb-2">Supply: {{ coin.supply }}</p>
          <p class="text-gray-700 mb-2">Market Cap: ${{ coin.market_cap }}</p>
          <p class="text-gray-700 mb-2">Date Added: {{ new Date(coin.date_added).toLocaleDateString() }}</p>
          <p class="text-gray-700 mb-4">{{ coin.description }}</p>
          <canvas id="priceChart"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getCoinDetails } from '../services/coinService';
  import { nextTick } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'CoinDetailsView',
    data() {
      return {
        coin: null,
        loading: true,
      };
    },
    async created() {
      const coinId = this.$route.params.id;
      try {
        this.coin = await getCoinDetails(coinId);
        await nextTick();
        this.renderChart();
      } catch (error) {
        console.error('Error loading coin details:', error);
      } finally {
        this.loading = false;
      }
    },
    methods: {
      renderChart() {
        if (this.coin && this.coin.priceHistory) {
          const ctx = document.getElementById('priceChart').getContext('2d');
          const labels = this.coin.priceHistory.map(entry => new Date(entry.timestamp).toLocaleTimeString());
          const data = this.coin.priceHistory.map(entry => parseFloat(entry.price));
  
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Price History',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
              }],
            },
            options: {
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'minute',
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      },
    },
  };
  </script>
  