<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Market</h1>
      <el-table
        :data="coins"
        border
        style="width: 100%"
        @row-click="handleRowClick"
        :default-sort="{ prop: 'name', order: 'ascending' }"
      >
        <el-table-column
          prop="name"
          label="Name"
          sortable
          width="200"
        />
        <el-table-column
          prop="symbol"
          label="Symbol"
          width="100"
        />
        <el-table-column
          prop="current_price"
          label="Current Price"
          sortable
          width="150"
        />
        <el-table-column
          prop="supply"
          label="Supply"
          width="150"
        />
        <el-table-column
          prop="market_cap"
          label="Market Cap"
          width="150"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCoins } from '../services/coinService';

export default {
  name: 'MarketView',
  data() {
    return {
      coins: [],
      loading: true,
    };
  },
  created() {
    this.loadCoins();
  },
  methods: {
    async loadCoins() {
      try {
        this.coins = await getCoins();
      } catch (error) {
        console.error('Error loading coin data:', error);
      } finally {
        this.loading = false;
      }
    },
    handleRowClick(row) {
      this.$router.push(`/coin/${row.coin_id}`);
    },
  },
};
</script>

<style scoped>
/* Element UI Custom Styling */
.el-table {
  background-color: #ffffff; /* Table background color */
}

.el-table th {
  background-color: #4A5568; /* Darker header background for better contrast */
  color: #f7fafc; /* Light header text color */
}

.el-table td {
  background-color: #f7fafc; /* Light cell background */
  color: #2D3748; /* Dark text color for better readability */
}

.el-table .cell {
  padding: 12px; /* Adjusted cell padding for better spacing */
}

.el-table__header-wrapper {
  border-bottom: 2px solid #CBD5E0; /* Light border for header */
}

/* Optional: Hover effect for rows */
.el-table-row:hover {
  background-color: #E2E8F0; /* Slightly darker background on hover */
}
</style>
