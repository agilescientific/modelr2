<template>
  <div class="model">
    <v-row>
      
      <v-col>
        <history />
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

export default {
  name: 'Model',
  components: {
    Preview,
    History
  }
}
</script>