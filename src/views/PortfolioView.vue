<template>
  <div class="min-h-screen bg-gray-100 p-4 font-sans">
    <div class="container mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-purple-700 mb-6">Portfolio</h1>
      <div v-if="loading" class="text-gray-700">Loading...</div>
      <div v-else>
        <!-- User Info -->
        <div class="bg-white shadow-md rounded-lg px-6 py-4 mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">User Information</h2>
          <p class="text-gray-700"><strong>Username:</strong> {{ user.username }}</p>
          <p class="text-gray-700"><strong>Available Funds:</strong> £{{ formattedFunds }}</p>
        </div>
        
        <!-- Portfolio Table -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <h2 class="text-xl font-semibold text-gray-800 px-6 py-4 bg-gray-50">Your Coins</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-purple-100">
                  <th class="py-3 px-4 text-left text-purple-700">Coin</th>
                  <th class="py-3 px-4 text-left text-purple-700">Amount</th>
                  <th class="py-3 px-4 text-left text-purple-700">Current Price</th>
                  <th class="py-3 px-4 text-left text-purple-700">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coin in portfolio" :key="coin.portfolio_id" class="border-b border-gray-200">
                  <td class="py-3 px-4 text-gray-800">{{ coin.name }}</td>
                  <td class="py-3 px-4 text-gray-800">{{ formatCoinAmount(coin.amount) }}</td>
                  <td class="py-3 px-4 text-gray-800">£{{ formatPrice(coin.current_price) }}</td>
                  <td class="py-3 px-4 text-gray-800">£{{ formatPrice(coin.amount * coin.current_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg px-6 py-4 mb-6">
          <p class="text-xl font-semibold text-gray-800">Total Portfolio Value: £{{ formatPrice(totalValue) }}</p>
        </div>

        <!-- Sell Form -->
        <div class="bg-white shadow-md rounded-lg px-6 py-4 mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Sell Coins</h2>
          <form @submit.prevent="confirmSell">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="coin">Coin</label>
              <select v-model="selectedCoin" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" id="coin" required>
                <option v-for="coin in portfolio" :key="coin.portfolio_id" :value="coin">{{ coin.name }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Amount</label>
              <input v-model.number="sellAmount" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" id="amount" type="number" :max="selectedCoin ? selectedCoin.amount : 0" min="1" required>
            </div>
            <div class="mb-4">
              <p class="text-gray-700">Total Sale Value: £{{ selectedCoin ? formatPrice(sellAmount * selectedCoin.current_price) : '0.00' }}</p>
            </div>
            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Sell
            </button>
          </form>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white rounded-lg p-8">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirm Sale</h3>
            <p class="mb-4 text-gray-700">Are you sure you want to sell {{ formatCoinAmount(sellAmount) }} of {{ selectedCoin ? selectedCoin.name : '' }}?</p>
            <p class="mb-4 text-gray-700">Price per coin: £{{ selectedCoin ? formatPrice(selectedCoin.current_price) : '' }}</p>
            <p class="mb-4 text-gray-700">Total Sale Value: £{{ selectedCoin ? formatPrice(sellAmount * selectedCoin.current_price) : '0.00' }}</p>
            <div class="flex justify-end">
              <button @click="executeSell" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Confirm</button>
              <button @click="cancelSell" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPortfolio } from '../services/portfolioService';
import { sellCoin } from '../services/coinService';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PortfolioView',
  data() {
    return {
      portfolio: [],
      totalValue: 0,
      loading: true,
      selectedCoin: null,
      sellAmount: 1,
      showConfirmation: false,
    };
  },
  computed: {
    ...mapState(['user']),
    formattedFunds() {
      return this.user && this.user.funds ? this.formatPrice(this.user.funds) : '0.00';
    },
  },
  methods: {
    ...mapMutations(['setUser']),
    formatCoinAmount(amount) {
      return parseFloat(amount).toString();
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    confirmSell() {
      if (this.selectedCoin) {
        this.showConfirmation = true;
      }
    },
    async executeSell() {
      if (!this.selectedCoin) return;
      
      try {
        const transactionData = {
          user_id: this.user.userId,
          coin_id: this.selectedCoin.coin_id,
          type: 'sell',
          amount: this.sellAmount,
        };
        await sellCoin(transactionData);
        this.showConfirmation = false;
        // Update user's funds
        const updatedFunds = parseFloat(this.user.funds) + parseFloat((this.sellAmount * this.selectedCoin.current_price).toFixed(2));
        this.setUser({ ...this.user, funds: updatedFunds });
        alert('Sale successful!');
        this.loadPortfolio(); // Reload the portfolio after successful sale
      } catch (error) {
        this.showConfirmation = false;
        alert(`Sale failed: ${error.message}`);
      }
    },
    cancelSell() {
      this.showConfirmation = false;
    },
    async loadPortfolio() {
      try {
        const portfolioData = await getPortfolio(this.user.userId);
        this.totalValue = portfolioData.pop().totalValue;
        this.portfolio = portfolioData;
        this.loading = false;
      } catch (error) {
        console.error('Error loading portfolio:', error);
        this.loading = false;
      }
    },
  },
  async created() {
    await this.loadPortfolio();
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
</style>