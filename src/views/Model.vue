<template>
  <div class="model">
    <v-row class="container-sticky">
      <v-col>
        <history />
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
// import Convolution from "../components/Convolution";

export default {
  name: 'Model',
  components: {
    // Convolution,
    Preview,
    History
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