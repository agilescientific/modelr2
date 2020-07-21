<template>
<div>
  <v-tabs grow v-model="tab" x-small class="mb-10">
    <v-tab href="#tab1" class="text-overline pa-0">Edit</v-tab>
    <v-tab href="#tab2" class="text-overline pa-0">Random Generator</v-tab>
    <v-tab href="#tab3" class="text-overline pa-0">Load</v-tab>
  </v-tabs>
  <v-tabs-items v-model="tab">
    <v-tab-item :key="1" value="tab1">
      <StratigraphyEdit :eventIndex="eventIndex" />
    </v-tab-item>
    <v-tab-item :key="2" value="tab2">
      <v-card flat>
        <RandomStratigraphyGenerator />
      </v-card>
    </v-tab-item>
    <v-tab-item :key="3" value="tab3">
      <v-card flat>Load</v-card>
    </v-tab-item>
  </v-tabs-items>
</div>

</template>

<script>
import StratigraphyEdit from '@/components/Events/StratigraphyEdit.vue'
import RandomStratigraphyGenerator from "../RandomStratigraphyGenerator";

export default {
  name: 'EventStratigraphy',
  props: ['eventIndex'],
  components: {
      RandomStratigraphyGenerator,
      StratigraphyEdit
  },
  computed: {
    event: function () {
      return this.$store.state.history.events[this.eventIndex];
    }
  },
  data() {
    return {
      tab: 'tab1'
    }
  }
}
</script>

