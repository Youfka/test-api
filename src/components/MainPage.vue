<template>
  <div class="wrapper">
    <textarea name="" id="" cols="30" rows="10" @change="getJSON($event)" value=""></textarea>
  </div>
</template>

<script>
export default {
  name: 'GetUserJSON',
  props: {
    msg: String
  },
  methods: {
    getJSON(ev){
      console.log(JSON.parse(ev.target.value), ev.target.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
