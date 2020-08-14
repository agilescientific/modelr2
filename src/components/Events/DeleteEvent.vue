<template>
  <v-btn
    color="grey lighten-3 red--text text--lighten-2"
    class="elevation-0"
    small
    absolute
    :style="{'margin-right': '105px', 'margin-top': '10px', 'margin-right': '9px', 'right': 0, 'top': 0}"
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