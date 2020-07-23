<template>
  <div class="model">
    <v-row>
      
      <v-col>
        <history />
<!--        <convolution class="mt-5" />-->
      </v-col>
      <v-col>
        <preview />
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