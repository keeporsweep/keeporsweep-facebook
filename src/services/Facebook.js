/*global FB*/
import { flatten } from "lodash";

export default class FacebookService {
  init() {
    return new Promise(resolve => {
      this._injectLib();
      window.fbAsyncInit = () => {
        FB.init({
          appId: process.env.VUE_APP_FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: false,
          version: "v3.2"
        });
        resolve();
      };
    });
  }

  getLoginStatus() {
    return new Promise(resolve => {
      FB.getLoginStatus(response => resolve(response));
    });
  }

  login() {
    return new Promise(resolve => {
      FB.login(response => resolve(response));
    });
  }

  logout() {
    return new Promise(resolve => {
      FB.logout(response => resolve(response));
    });
  }

  api(path, method, params) {
    return new Promise(resolve => {
      FB.api(path, method, params, response => resolve(response));
    });
  }

  async fetchFeed() {
    const response = await this.api("/me/feed", "get", {
      fields: [
        "type",
        "created_time",
        "message",
        "picture",
        "link",
        "attachments"
      ],
      limit: 1000
    });
    return response.data;
  }

  async fetchLikes() {
    const response = await this.api("me/likes", "get", {
      fields: ["created_time", "picture", "link"],
      limit: 1000
    });
    const items = response.data;
    return items.map(item => {
      item.type = "like";
      return item;
    });
  }

  async fetchAll() {
    const calls = [this.fetchFeed(), this.fetchLikes()];
    const itemLists = await Promise.all(calls);
    return flatten(itemLists);
  }

  _injectLib() {
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
  }
}
