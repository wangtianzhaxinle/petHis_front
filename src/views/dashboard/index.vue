<template>
  <div class="dashboard-container">
    <div>
      <div class="dashboard-text">欢迎登录,{{ name }}</div>
      <!-- <div class="dashboard-text">email: {{ email }}</div>
      <div class="dashboard-text">userid: {{ userId }}</div>
      <div class="dashboard-text">username: {{ username }}</div>
      <div class="dashboard-text">sex: {{ sex }}</div>
      <div class="dashboard-text">age: {{ age }}</div>
      <div class="dashboard-text">address: {{ address }}</div>
      <div class="dashboard-text">createtime: {{ createtime }}</div>
      <div class="dashboard-text">phoneNumber: {{ phoneNumber }}</div> -->

    </div>

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
      'userId',
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
  //   background:url("../../assets/welcome.jpeg");
  // width:100%;
  // height:100%;
  // position:fixed;
  // background-size:100% 100%;

    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
// .black{
//   background:url("../../assets/welcome.jpeg");
// }
</style>
