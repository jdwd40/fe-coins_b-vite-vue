<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto">
      <div class="flex flex-wrap justify-between items-center">
        <div class="text-gray-100 text-lg font-bold mb-2 md:mb-0">
          Fantasy Crypto Exchange
        </div>
        <button @click="toggleMenu" class="md:hidden text-gray-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <div :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}" class="w-full md:flex md:items-center md:w-auto">
          <div class="text-sm md:flex-grow">
            <router-link class="block mt-4 md:inline-block md:mt-0 text-gray-100 hover:text-gray-400 mr-4" to="/">Home</router-link>
            <router-link class="block mt-4 md:inline-block md:mt-0 text-gray-100 hover:text-gray-400 mr-4" to="/market">Market</router-link>
            <router-link v-if="!user" class="block mt-4 md:inline-block md:mt-0 text-gray-100 hover:text-gray-400 mr-4" to="/login">Login</router-link>
            <router-link v-if="!user" class="block mt-4 md:inline-block md:mt-0 text-gray-100 hover:text-gray-400 mr-4" to="/register">Register</router-link>
            <router-link v-if="user" class="block mt-4 md:inline-block md:mt-0 text-gray-100 hover:text-gray-400 mr-4" to="/portfolio">Portfolio</router-link>
          </div>
          <div v-if="user" class="mt-4 md:mt-0">
            <span class="block md:inline-block text-gray-100 mr-4">{{ user.username }} ({{ user.funds ? Number(user.funds).toFixed(2) : '0.00' }})</span>
            <a href="#" class="block md:inline-block text-gray-100 hover:text-gray-400" @click.prevent="logout">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    logout() {
      this.$store.commit('setUser', null);
      this.$router.push('/');
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>