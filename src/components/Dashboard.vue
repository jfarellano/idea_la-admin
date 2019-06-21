<template>
  <section>
    <Header></Header>
    <div class="main-container container-fluid">
      <h1>Admin</h1>
      <router-link tag="b-button" class="button btnStyle" to="/users">
        <font-awesome-icon icon="users"/>Usuarios
      </router-link>
      <router-link tag="b-button" class="button btnStyle" to="/challenges">
        <font-awesome-icon icon="th-large"/>Retos
      </router-link>
      <router-link tag="b-button" class="button btnStyle" to="/ideas/all">
        <font-awesome-icon icon="lightbulb"/>Ideas
      </router-link>
      <!-- <router-link v-if="currentStage.number == 1 && currentStage.number == 2" tag="b-button" class="button btnStyle" to="/comments/all"> -->
      <router-link tag="b-button" class="button btnStyle" to="/comments/all">
        <font-awesome-icon icon="comments" /> Comentarios
      </router-link>
      <router-link tag="b-button" class="button btnStyle" to="/stages">
        <font-awesome-icon icon="project-diagram"/>Etapas
      </router-link>
    </div>
  </section>
</template>

<script>
import Header from "./Header";
export default {
  components: {
    Header
  },
  data() {
    return {
      currentStage: {}
    };
  },
  created(){
    api.stages
    .getCurrent()
    .then((response) => {
      this.currentStage = response.data
    })
    .catch((err) => {
      console.log(err)
      this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
    })
  }
};
</script>

<style lang="scss" scoped>
.btnStyle {
  margin: 10px;
  width: 150px;
}
.main-container {
  margin-top: 90px;
}
</style>


