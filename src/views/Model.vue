<template>
  <div class="model">
    <v-row class="container-sticky">
      <v-col cols="12" sm="12" lg="5">
        <v-card class="mx-auto">
          <v-tabs grow v-model="tab" x-small>
            <v-tab href="#tab1" class="text-overline pa-0">History</v-tab>
            <v-tab href="#tab2" class="text-overline pa-0">Rocks</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="1" value="tab1">
              <History />
            </v-tab-item>
            <v-tab-item :key="2" value="tab2">
              <RockLibrary />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col class="preview-sticky">
        <preview class="preview-sticky"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import Preview from '@/components/Preview.vue'
import History from '@/components/History.vue'
import RockLibrary from "@/views/RockLibrary";
// import Convolution from "../components/Convolution";

export default {
  name: 'Model',
  components: {
    RockLibrary,
    Preview,
    History
  },
  data() {
    return {
      tab: 'tab1'
    }
  }
}
</script>

<style scoped>
.container-sticky {
  align-items: flex-start;
}
.preview-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

</style>