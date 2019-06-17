<template>
<section>
  <Header></Header>
  <div class="main-container container-fluid">
    <h1>Admin</h1>
    <router-link tag="b-button" class="button btnStyle" to="/users">
      <font-awesome-icon icon="users" /> Usuarios
    </router-link>
    <router-link tag="b-button" class="button btnStyle" to="/challenges">
      <font-awesome-icon icon="th-large" /> Retos
    </router-link>
  </div>
</section>
</template>

<script>
import Header from './Header'
export default {
  components: {
    Header
  },
  data(){
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.btnStyle {
  margin: 10px;
  width: 130px;
}
.main-container{
  margin-top: 90px;
}
</style>


