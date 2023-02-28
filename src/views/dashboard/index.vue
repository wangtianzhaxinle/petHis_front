<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">email: {{ email }}</div>
    <div class="dashboard-text">userid: {{ user_id }}</div>
    <div class="dashboard-text">username: {{ username }}</div>
    <div class="dashboard-text">sex: {{ sex }}</div>
    <div class="dashboard-text">age: {{ age }}</div>
    <div class="dashboard-text">address: {{ address }}</div>
    <div class="dashboard-text">createtime: {{ createtime }}</div>
    <div class="dashboard-text">phoneNumber: {{ phoneNumber }}</div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'email',
      'user_id',
      'username',
      'sex',
      'age',
      'address',
      'email',
      'createtime',
      'phoneNumber'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
