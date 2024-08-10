<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div v-if="loading" class="container mx-auto">
      <p class="text-gray-700">Loading...</p>
    </div>
    <div v-else-if="coin" class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ coin.name }} ({{ coin.symbol }})</h1>
      
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" v-if="marketStats">
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

      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" v-if="event">
        <h2 class="text-xl font-bold mb-2">Current Coin Event</h2>
        <p class="text-gray-700 mb-2">Type: {{ event.type }}</p>
        <p class="text-gray-700 mb-2">Impact: {{ event.impact }}</p>
        <p class="text-gray-700 mb-2">Start Time: {{ event.start_time }}</p>
        <p class="text-gray-700 mb-2">End Time: {{ event.end_time }}</p>
        <p class="text-gray-700 mb-2">Duration: {{ event.duration }}</p>
        <p class="text-gray-700 mb-2">Positive Impact: {{ event.is_positive ? 'Yes' : 'No' }}</p>
      </div>
      
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p class="text-gray-700 mb-2">Current Price: ${{ coin.current_price }}</p>
        <canvas id="priceChart"></canvas>
      </div>

      <div v-if="user" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-2">Buy {{ coin.name }}</h2>
        <div class="mb-4">
          <p class="text-gray-700">Your Funds: ${{ user.funds ? Number(user.funds).toFixed(2) : '0.00' }}</p>
        </div>
        <form @submit.prevent="confirmBuy">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Amount</label>
            <input v-model.number="buyAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" min="1" required>
          </div>
          <div class="mb-4">
            <p class="text-gray-700">Total Cost: ${{ (buyAmount * coin.current_price).toFixed(2) }}</p>
          </div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Buy
          </button>
        </form>
      </div>

      <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white rounded-lg p-8">
          <p class="mb-4">Are you sure you want to buy {{ buyAmount }} of {{ coin.name }}?</p>
          <p class="mb-4">Each: ${{ coin.current_price }}</p>
          <p class="mb-4">Total Cost: ${{ (buyAmount * coin.current_price).toFixed(2) }}</p>
          <button @click="executeBuy" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Confirm</button>
          <button @click="cancelBuy" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
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
