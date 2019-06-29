<template>
  <section>
    <Header></Header>
    <div class="main-container container-fluid">
      <h1>Administrador</h1>
      <router-link v-if="showButton('challenge_texts')" tag="b-button" class="button btnStyle" to="/challenge_texts">
        <font-awesome-icon icon="font"/> Textos Retos
      </router-link>
      <router-link v-if="showButton('users')" tag="b-button" class="button btnStyle" to="/users">
        <font-awesome-icon icon="users"/> Usuarios
      </router-link>
      <router-link v-if="showButton('challenges')" tag="b-button" class="button btnStyle" to="/challenges">
        <font-awesome-icon icon="th-large"/> Retos
      </router-link>
      <router-link v-if="showButton('ideas')" tag="b-button" class="button btnStyle" to="/ideas/all">
        <font-awesome-icon icon="lightbulb"/> Ideas
      </router-link>
      <router-link v-if="showButton('comments')" tag="b-button" class="button btnStyle" to="/comments/all">
        <font-awesome-icon icon="comments" /> Comentarios
      </router-link>
      <router-link v-if="showButton('stages')" tag="b-button" class="button btnStyle" to="/stages">
        <font-awesome-icon icon="project-diagram"/> Etapas
      </router-link>
      <router-link v-if="showButton('votes')" tag="b-button" class="button btnStyle" to="/picked_ideas_results">
        <font-awesome-icon icon="vote-yea"/> Votaciones
      </router-link>
      <router-link v-if="showButton('surveys')" tag="b-button" class="button btnStyle" to="/stages">
        <font-awesome-icon icon="poll"/> Encuestas
      </router-link>
    </div>
  </section>
</template>

<script>
import Header from "./Header";
import api from "../requests.js";

export default {
  components: {
    Header
  },
  data() {
    return {
      currentStage: {}
    };
  },
  methods: {
    showButton(option) {
      switch(option) {
        case 'challenge_texts':
          return true;
        break;

        case 'users':
          return true;
        break;

        case 'challenges':
          return true;
        break;

        case 'ideas':
          if (this.currentStage.number >= 1) return true;
          else return false;
        break;

        case 'comments':
          if (this.currentStage.number >= 1) return true;
          else return false;
        break;

        case 'stages':
          return true;
        break;

        case 'votes':
          if (this.currentStage.number >= 3) return true;
          else return false;
        break;

        case 'surveys':
          if (this.currentStage.number >= 1) return true;
          else return false;
        break;
      }
    }
  },
  created() {
    api.stages
    .getCurrent()
    .then((response) => {
      this.currentStage = response.data
    })
    .catch((err) => {
      this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
    })
  },
  mounted() {
    
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


