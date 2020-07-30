<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>AppName</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small color="primary" @click="historyToClipboard()">Export History</v-btn>
      <v-snackbar v-model="snackbar">
        History copied to clipboard.
        <template v-slot:action="{ attrs }">
          <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list nav dense>
        <v-list-item-group
          active-class="primary--text text--accent-4"
        >
          <v-list-item
            v-for="route in routes" :key="route.name" :to="{path: route.path}">
            <v-list-item-icon>
              <v-icon>{{ route.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ route.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="grey darken-2">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer padless light class="white">
      <v-card flat tile class="text-center mx-auto white">
        <v-card-text>
          <v-btn icon>
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-slack</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text>
          <a
            href="https://agilescientific.com/"
            class="text-decoration-none"
          >2020 Agile*</a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    drawer: false,
    snackbar: false,
  }),
    computed: {
      routes() {
          return this.$router.options.routes
      }
    }
    ,
  methods: {
    getHistory: function() {
      return JSON.stringify(this.$store.state.history.events, null, 4)
    },
    historyToClipboard: function() {
      let dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.getHistory();
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbar = true;
    }
  }
};
</script>
