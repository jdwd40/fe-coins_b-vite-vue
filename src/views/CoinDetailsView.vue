<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div v-if="loading" class="container mx-auto">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ coin.name }} ({{ coin.symbol }})</h1>
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p class="text-gray-700 mb-2">Current Price: ${{ coin.current_price }}</p>
        <canvas id="priceChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { getCoinDetails, getCoinHistory } from '../services/coinService';
import { nextTick, watch } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export default {
  name: 'CoinDetailsView',
  data() {
    return {
      coin: null,
      history: [],
      loading: true,
    };
  },
  async created() {
    const coinId = this.$route.params.id;
    try {
      this.coin = await getCoinDetails(coinId);
      this.history = await getCoinHistory(coinId);
      this.loading = false;
    } catch (error) {
      console.error('Error loading coin details:', error);
      this.loading = false;
    }
  },
  mounted() {
    watch(
      () => this.loading,
      (newValue) => {
        if (!newValue) {
          this.renderChart();
        }
      },
    );
  },
  methods: {
    renderChart() {
      if (this.history.length) {
        nextTick(() => {
          const ctx = document.getElementById('priceChart').getContext('2d');
          const labels = this.history.map(entry => new Date(entry.timestamp));
          const data = this.history.map(entry => parseFloat(entry.price));

          new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Price History (Last Hour)',
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
                    stepSize: 5, // Show time segments every 5 minutes
                    tooltipFormat: 'HH:mm',
                    displayFormats: {
                      minute: 'HH:mm',
                    },
                  },
                  title: {
                    display: true,
                    text: 'Time',
                  },
                },
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: 'Price',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      label += context.parsed.y.toFixed(2);
                      return label;
                    },
                  },
                },
              },
            },
          });
        });
      }
    },
  },
};
</script>
