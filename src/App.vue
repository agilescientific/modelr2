<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        modelr
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="primary">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer padless light class="white">
      <v-card flat tile class="text-center mx-auto white">
        <v-card-text>
          <a href="https://twitter.com/agilegeo">
            <v-btn icon>
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
          </a>
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

<style scoped>


</style>