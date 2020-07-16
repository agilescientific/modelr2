<template>
  <v-btn
    color="white red--text text--lighten-4"
    class="elevation-0"
    x-small
    absolute
    :style="{'margin-right': '105px', 'margin-top': '12px', 'right': 0, 'top': 0}"
    @click="deleteEvent()"
  >
    <v-icon>mdi-delete-forever</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'DeleteEvent',
    props: ['eventIndex'],
    methods: {
      deleteEvent() {
        this.$store.dispatch('history/updateEventDelete', {
          index: this.eventIndex
        })
      }
    }
  }
</script>