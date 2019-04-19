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
        <button v-on:click="pick">Next</button>
        <div v-if="item">{{ item.message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/*global FB*/
import { random } from "lodash";

export default {
  name: "Main",
  data() {
    return {
      initializingDone: false,
      isLoggingIn: false,
      loginStatus: null,
      isLoadingItems: false,
      items: [],
      item: null
    };
  },
  created() {
    window.fbAsyncInit = () => {
      FB.init({
        appId: process.env.VUE_APP_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: false,
        version: "v3.2"
      });

      FB.getLoginStatus(response => {
        this.loginStatus = response;
        this.initializingDone = true;
      });
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  methods: {
    loadItems() {
      this.isLoadingItems = true;
      FB.api(
        "/me/feed",
        "get",
        {
          limit: 1000
        },
        response => {
          this.isLoadingItems = false;
          const posts = response.data.filter(item => !!item.message);
          this.items = this.items.concat(posts);
          this.pick();
        }
      );
    },
    pick() {
      const randomIndex = random(this.items.length - 1);
      this.item = this.items[randomIndex];
    },
    login() {
      this.isLoggingIn = true;
      FB.login(response => {
        this.loginStatus = response;
        this.isLoggingIn = false;
      });
    },
    logout() {
      FB.logout(response => (this.loginStatus = response));
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
