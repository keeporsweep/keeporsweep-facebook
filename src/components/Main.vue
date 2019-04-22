<template>
  <div v-if="initializingDone">
    <div v-if="!(loginStatus && loginStatus.status === 'connected')">
      <button v-on:click="login" :disabled="isLoggingIn">
        Login with Facebook
      </button>
    </div>
    <div v-else>
      <button v-on:click="logout">Logout</button>
      <div v-if="isLoadingItems">
        <div>Loading…</div>
      </div>
      <div v-else-if="item">
        <button v-on:click="keep">Keep</button>
        <button v-on:click="sweep">Sweep</button>
        <div>{{ new Date(item.created_time).toLocaleString() }}</div>
        <div v-if="item && item.message">{{ item.message }}</div>
        <div v-if="item && item.picture">
          <img :key="item.full_picture" :src="item.full_picture" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookService from "../services/Facebook";

const facebookService = new FacebookService();

export default {
  name: "Main",
  data() {
    return {
      initializingDone: false,
      isLoggingIn: false,
      loginStatus: null,
      isLoadingItems: false,
      items: [],
      itemsToSweep: [],
      itemsToKeep: []
    };
  },
  async created() {
    await facebookService.init();
    const loginStatus = await facebookService.getLoginStatus();
    this.loginStatus = loginStatus;
    this.initializingDone = true;
  },
  methods: {
    async loadItems() {
      this.isLoadingItems = true;
      this.items = await facebookService.fetchRandomFromFeed();
      this.isLoadingItems = false;
    },
    keep() {
      this.itemsToKeep.push(this.items.shift());
    },
    sweep() {
      this.itemsToSweep.push(this.items.shift());
    },
    async login() {
      this.isLoggingIn = true;
      const loginStatus = await facebookService.login();
      this.loginStatus = loginStatus;
      this.isLoggingIn = false;
    },
    async logout() {
      const logingStatus = await facebookService.logout();
      this.loginStatus = logingStatus;
    }
  },
  computed: {
    item() {
      return this.items[0];
    }
  },
  watch: {
    loginStatus(newStatus, oldStatus) {
      console.log("login status:", newStatus, oldStatus);
      if (
        newStatus &&
        newStatus.status === "connected" &&
        (!oldStatus || oldStatus.status !== "connected")
      ) {
        this.loadItems();
      }
    }
  }
};
</script>

<style scoped></style>
