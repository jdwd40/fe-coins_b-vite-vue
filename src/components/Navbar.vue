<template>
  <nav class="bg-blue-500 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-bold">
        Fantasy Crypto Exchange
      </div>
      <div>
        <router-link class="text-white mr-4" to="/">Home</router-link>
        <router-link class="text-white mr-4" to="/market">Market</router-link>
        <router-link v-if="!user" class="text-white mr-4" to="/login">Login</router-link>
        <router-link v-if="!user" class="text-white mr-4" to="/register">Register</router-link>
        <router-link v-if="user" class="text-white mr-4" to="/portfolio">Portfolio</router-link>
        <span v-if="user" class="text-white mr-4">{{ user.username }} ({{ user.funds ? Number(user.funds).toFixed(2) : '0.00' }})</span>
        <a v-if="user" href="#" class="text-white" @click.prevent="logout">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapState(['user']),
  },
  methods: {
    logout() {
      this.$store.commit('setUser', null);
      this.$router.push('/');
    },
  },
};
</script>
