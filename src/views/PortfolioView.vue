<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Portfolio</h1>
      <div v-if="loading" class="text-gray-700">Loading...</div>
      <div v-else>
        <!-- User Info -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 text-gray-800">
          <p><strong>User:</strong> {{ user.username }}</p>
          <p><strong>Funds:</strong> ${{ formattedFunds }}</p>
        </div>
        
        <!-- Portfolio Table -->
        <table class="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-blue-500 text-white">Coin</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Amount</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Current Price</th>
              <th class="py-2 px-4 bg-blue-500 text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coin in portfolio" :key="coin.portfolio_id">
              <td class="border px-4 py-2 text-gray-800">{{ coin.name }}</td>
              <td class="border px-4 py-2 text-gray-800">{{ coin.amount }}</td>
              <td class="border px-4 py-2 text-gray-800">${{ coin.current_price }}</td>
              <td class="border px-4 py-2 text-gray-800">${{ (coin.amount * coin.current_price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="text-gray-800 font-bold mb-6">
          Total Value: ${{ totalValue.toFixed(2) }}
        </div>

        <!-- Sell Form -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 class="text-xl font-bold mb-2">Sell Coins</h2>
          <form @submit.prevent="confirmSell">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="coin">Coin</label>
              <select v-model="selectedCoin" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="coin" required>
                <option v-for="coin in portfolio" :key="coin.portfolio_id" :value="coin">{{ coin.name }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">Amount</label>
              <input v-model.number="sellAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" :max="selectedCoin ? selectedCoin.amount : 0" min="1" required>
            </div>
            <div class="mb-4">
              <p class="text-gray-700">Total Sale Value: ${{ selectedCoin ? (sellAmount * selectedCoin.current_price).toFixed(2) : '0.00' }}</p>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Sell
            </button>
          </form>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white rounded-lg p-8">
            <p class="mb-4 text-gray-800">Are you sure you want to sell {{ sellAmount }} of {{ selectedCoin ? selectedCoin.name : '' }}?</p>
            <p class="mb-4 text-gray-800">Each: ${{ selectedCoin ? selectedCoin.current_price : '' }}</p>
            <p class="mb-4 text-gray-800">Total Sale Value: ${{ selectedCoin ? (sellAmount * selectedCoin.current_price).toFixed(2) : '0.00' }}</p>
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
      return this.user && this.user.funds ? Number(this.user.funds).toFixed(2) : '0.00';
    },
  },
  methods: {
    ...mapMutations(['setUser']),
    confirmSell() {
      if (this.selectedCoin) {
        this.showConfirmation = true;
      }
    },
    async executeSell() {
      if (!this.selectedCoin) return; // Ensure selectedCoin is not null
      
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
        this.$router.push('/portfolio');
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

<style scoped>
/* Custom styles for improved readability */
table {
  color: #333; /* Darker text color for better readability */
}
select, input {
  color: #333; /* Darker text color for better readability */
  background-color: #f7f7f7; /* Lighter background for better visibility */
}
.bg-white {
  background-color: #ffffff; /* Ensure background is white for better contrast */
}
.text-gray-800 {
  color: #333; /* Darker text color for better readability */
}
</style>
