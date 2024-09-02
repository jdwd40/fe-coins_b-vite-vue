<template>
  <div class="min-h-screen bg-gray-100 p-4 font-sans">
    <div v-if="loading" class="container mx-auto text-center">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else-if="coin" class="container mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-purple-700 mb-6">{{ coin.name }} ({{ coin.symbol }})</h1>
      
      <!-- Current Price Card -->
      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Current Price</h2>
        <p class="text-3xl font-bold text-green-600">£{{ formatPrice(coin.current_price) }}</p>
        <p :class="getChangeClass(changes.fiveMin)" class="text-lg mt-2">
          Last 5 mins: {{ formatPercentage(changes.fiveMin) }}
        </p>
      </div>

      <!-- Price Chart -->
      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Price History (30mins)</h2>
        <div class="chart-container" style="position: relative; height:300px; width:100%">
          <canvas id="priceChart"></canvas>
        </div>
      </div>

      <!-- Current Coin Event -->
      <div v-if="event" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Current Coin Event</h2>
        <div class="flex items-center mb-4">
          <span :class="event.is_positive ? 'bg-green-500' : 'bg-red-500'" class="px-3 py-1 rounded-full text-white font-semibold mr-2">
            {{ event.is_positive ? 'POSITIVE' : 'NEGATIVE' }}
          </span>
          <span class="text-gray-700 font-semibold">{{ event.type }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p class="text-gray-700"><span class="font-semibold">Impact:</span> {{ event.impact }}</p>
          <p class="text-gray-700"><span class="font-semibold">Duration:</span> {{ event.duration }}</p>
        </div>
      </div>

      <!-- Market Details -->
      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Market Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p class="text-gray-700"><span class="font-semibold">Market Value:</span> £{{ formatLargeNumber(coin.market_cap) }}</p>
          <p :class="getChangeClass(changes.fiveMin)">
            <span class="font-semibold">Last 5 Minutes:</span> £{{ formatPrice(changes.fiveMinPrice) }} ({{ formatPercentage(changes.fiveMin) }})
          </p>
          <p :class="getChangeClass(changes.tenMin)">
            <span class="font-semibold">Last 10 Minutes:</span> £{{ formatPrice(changes.tenMinPrice) }} ({{ formatPercentage(changes.tenMin) }})
          </p>
          <p :class="getChangeClass(changes.thirtyMin)">
            <span class="font-semibold">Last 30 Minutes:</span> £{{ formatPrice(changes.thirtyMinPrice) }} ({{ formatPercentage(changes.thirtyMin) }})
          </p>
          <p class="text-gray-700"><span class="font-semibold">All-Time High:</span> £{{ formatPrice(coin.ath) }}</p>
          <p class="text-gray-700"><span class="font-semibold">24h Volume:</span> £{{ formatLargeNumber(coin.total_volume) }}</p>
        </div>
      </div>

      <!-- Buy Form and Confirmation Modal remain unchanged -->

    </div>
    <div v-else class="container mx-auto">
      <p class="text-red-500">Error: Coin not found</p>
    </div>
  </div>
</template>

<script>
import { getCoinDetails, getCoinHistory, getCoinEvents, buyCoin } from '../services/coinService';
import { nextTick } from 'vue';
import { mapState, mapMutations } from 'vuex';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export default {
  name: 'CoinDetailsView',
  data() {
    return {
      coin: null,
      history: [],
      event: null,
      loading: true,
      buyAmount: 1,
      showConfirmation: false,
      changes: {
        fiveMin: 0,
        tenMin: 0,
        thirtyMin: 0,
        fiveMinPrice: 0,
        tenMinPrice: 0,
        thirtyMinPrice: 0,
      },
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['setUser']),
    renderChart() {
      if (this.history.length) {
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
              borderColor: 'rgba(109, 40, 217, 1)',  // Purple color
              borderWidth: 2,
              fill: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute',
                  stepSize: 5,
                  tooltipFormat: 'HH:mm',
                  displayFormats: {
                    minute: 'HH:mm',
                  },
                },
                title: {
                  display: true,
                  text: 'Time',
                },
                ticks: {
                  maxTicksLimit: 13, // Show a tick every 5 minutes (60 minutes / 5 = 12 intervals + 1 for the start)
                },
              },
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Price',
                },
                ticks: {
                  callback: function(value, index, values) {
                    return '£' + value.toFixed(2);
                  }
                }
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `£${context.parsed.y.toFixed(2)}`;
                  },
                },
              },
            },
          },
        });
      }
    },
    calculateChanges() {
      if (this.history.length > 0) {
        const currentPrice = this.history[this.history.length - 1].price;
        const fiveMinAgo = this.getPriceAtTime(5);
        const tenMinAgo = this.getPriceAtTime(10);
        const thirtyMinAgo = this.getPriceAtTime(30);

        this.changes.fiveMin = this.calculatePercentageChange(fiveMinAgo, currentPrice);
        this.changes.tenMin = this.calculatePercentageChange(tenMinAgo, currentPrice);
        this.changes.thirtyMin = this.calculatePercentageChange(thirtyMinAgo, currentPrice);

        this.changes.fiveMinPrice = currentPrice - fiveMinAgo;
        this.changes.tenMinPrice = currentPrice - tenMinAgo;
        this.changes.thirtyMinPrice = currentPrice - thirtyMinAgo;
      }
    },
    getPriceAtTime(minutesAgo) {
      const targetTime = new Date(Date.now() - minutesAgo * 60000);
      for (let i = this.history.length - 1; i >= 0; i--) {
        if (new Date(this.history[i].timestamp) <= targetTime) {
          return this.history[i].price;
        }
      }
      return this.history[0].price; // Return earliest price if not found
    },
    calculatePercentageChange(oldPrice, newPrice) {
      return ((newPrice - oldPrice) / oldPrice) * 100;
    },
    confirmBuy() {
      this.showConfirmation = true;
    },
    async executeBuy() {
      try {
        const transactionData = {
          user_id: this.user.userId,
          coin_id: this.coin.coin_id,
          type: 'buy',
          amount: this.buyAmount,
        };
        const result = await buyCoin(transactionData);
        this.showConfirmation = false;
        // Update user's funds
        const updatedFunds = parseFloat(this.user.funds) - parseFloat((this.buyAmount * this.coin.current_price).toFixed(2));
        this.setUser({ ...this.user, funds: updatedFunds });
        alert('Transaction successful!');
        this.$router.push('/portfolio');
      } catch (error) {
        this.showConfirmation = false;
        alert(`Transaction failed: ${error.message}`);
      }
    },
    cancelBuy() {
      this.showConfirmation = false;
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    formatLargeNumber(number) {
      return new Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(number);
    },
    formatPercentage(value) {
      return `${value.toFixed(2)}%`;
    },
    getChangeClass(change) {
      return change < 0 ? 'text-red-600' : 'text-green-600';
    },
  },
  async created() {
    const coinId = this.$route.params.id;
    try {
      this.coin = await getCoinDetails(coinId);
      this.history = await getCoinHistory(coinId);
      const events = await getCoinEvents(coinId);
      this.event = events.length > 0 ? events[0] : null;
      this.loading = false;
      this.calculateChanges();
      await nextTick();
      this.renderChart();
    } catch (error) {
      console.error('Error loading coin details:', error);
      this.loading = false;
    }
  },
};
</script>

<style>
/* Styles remain unchanged */
</style>