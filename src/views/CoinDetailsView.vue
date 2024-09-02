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
      </div>

      <!-- Price Chart -->
      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Price History (Last Hour)</h2>
        <div class="chart-container" style="position: relative; height:300px; width:100%">
          <canvas id="priceChart"></canvas>
        </div>
      </div>

      <!-- Current Coin Event -->
      <div v-if="event" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Current Coin Event</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p class="text-gray-700"><span class="font-semibold">Type:</span> {{ event.type }}</p>
          <p class="text-gray-700"><span class="font-semibold">Impact:</span> {{ event.impact }}</p>
          <p class="text-gray-700"><span class="font-semibold">Start Time:</span> {{ formatDate(event.start_time) }}</p>
          <p class="text-gray-700"><span class="font-semibold">End Time:</span> {{ formatDate(event.end_time) }}</p>
          <p class="text-gray-700"><span class="font-semibold">Duration:</span> {{ event.duration }}</p>
          <p class="text-gray-700"><span class="font-semibold">Positive Impact:</span> {{ event.is_positive ? 'Yes' : 'No' }}</p>
        </div>
      </div>

      <!-- Market Details -->
      <div v-if="marketStats" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Market Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p class="text-gray-700"><span class="font-semibold">Market Value:</span> £{{ formatLargeNumber(marketStats.marketValue) }}</p>
          <p class="text-gray-700"><span class="font-semibold">Last 5 Minutes:</span> £{{ formatLargeNumber(marketStats.last5minsMarketValue) }} ({{ marketStats.percentage5mins }})</p>
          <p class="text-gray-700"><span class="font-semibold">Last 10 Minutes:</span> £{{ formatLargeNumber(marketStats.last10minsMarketValue) }} ({{ marketStats.percentage10mins }})</p>
          <p class="text-gray-700"><span class="font-semibold">Last 30 Minutes:</span> £{{ formatLargeNumber(marketStats.last30minsMarketValue) }} ({{ marketStats.percentage30mins }})</p>
          <p class="text-gray-700"><span class="font-semibold">All-Time High:</span> £{{ formatLargeNumber(marketStats.allTimeHigh) }}</p>
          <p class="text-gray-700"><span class="font-semibold">Market Total:</span> £{{ formatLargeNumber(marketStats.marketTotal) }}</p>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">Top 5 Coins</h3>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="topCoin in marketStats.top3Coins" :key="topCoin.name" class="text-center">
            <p class="font-semibold text-gray-800">{{ topCoin.name }}</p>
            <p class="text-green-600">£{{ formatPrice(topCoin.price) }}</p>
          </div>
        </div>
      </div>

      <!-- Buy Form -->
      <div v-if="user" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Buy {{ coin.name }}</h2>
        <p class="text-gray-700 mb-2">Your Funds: £{{ formatPrice(user.funds) }}</p>
        <form @submit.prevent="confirmBuy">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Amount</label>
            <input v-model.number="buyAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" min="1" required>
          </div>
          <div class="mb-4">
            <p class="text-gray-700">Total Cost: £{{ formatPrice(buyAmount * coin.current_price) }}</p>
          </div>
          <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Buy
          </button>
        </form>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white rounded-lg p-8">
          <p class="mb-4 text-gray-800">Are you sure you want to buy {{ buyAmount }} of {{ coin.name }}?</p>
          <p class="mb-4 text-gray-800">Each: £{{ formatPrice(coin.current_price) }}</p>
          <p class="mb-4 text-gray-800">Total Cost: £{{ formatPrice(buyAmount * coin.current_price) }}</p>
          <div class="flex justify-end">
            <button @click="executeBuy" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Confirm</button>
            <button @click="cancelBuy" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </div>
        </div>
      </div>

    </div>
    <div v-else class="container mx-auto">
      <p class="text-red-500">Error: Coin not found</p>
    </div>
  </div>
</template>

<script>
import { getCoinDetails, getCoinHistory, getCoinEvents, getMarketStats, buyCoin } from '../services/coinService';
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
      marketStats: null,
      loading: true,
      buyAmount: 1,
      showConfirmation: false,
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
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
  },
  async created() {
    const coinId = this.$route.params.id;
    try {
      this.coin = await getCoinDetails(coinId);
      this.history = await getCoinHistory(coinId);
      const events = await getCoinEvents(coinId);
      this.event = events.length > 0 ? events[0] : null;
      this.marketStats = await getMarketStats();
      this.loading = false;
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>