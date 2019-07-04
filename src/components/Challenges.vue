<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <b-row>
        <b-col>
          <h1>Retos</h1>
        </b-col>
        <b-col align="right">
          <h4 v-if="challengesReceived">{{challenges.length}} retos publicados</h4>
        </b-col>
      </b-row>
      <div class="input-group">
        <input
          type="text"
          class="form-control inputStyles"
          placeholder="Buscar"
          v-model="search"
        >
      </div>
      <router-link v-if="currentStage.number == 0" tag="b-button" class="button btnStyle" to="/add_edit_challenge/new">
        <font-awesome-icon icon="plus"/>   Agregar
      </router-link>
      <b-row>
        <b-col align="center">
          <br>
          <b v-if="currentStage.number != 0">Etapa {{currentStage.number}}: En esta etapa no se pueden crear, modificar ni eliminar retos.</b>
        </b-col>
      </b-row>
    </div>
    <div class="main-container container-fluid listStyle">
      <b-button-group v-for="challenge in filter()" :key="challenge.id" class="list-item">
        <router-link tag="b-button" class="challenge" :to='"/add_edit_challenge/" + challenge.id'>
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="getImage(challenge.challenge_pictures[0])"
          ></b-img>
          {{upCase(challenge.title)}}
        </router-link>

        <b-button v-if="currentStage.number == 0" class="option" @click="deleteChallenge(challenge.id)">
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <b v-if="filter().length == 0 && challenges != ''">No hay retos que coincidan con la búsqueda</b>
      <b v-if="challenges == '' && challengesReceived">No hay retos registrados</b>
      <b-row v-else>
        <b-col align="center">
          <b-spinner v-if="challenges == ''" class="d-flex align-items-center" label="Loading..."></b-spinner>
        </b-col>
      </b-row>
      <b-button class="next" @click="nextPage()" v-if="pagination()">Mas resultados</b-button>
    </div>
    <Alert ref="alert"></Alert >
  </section>
</template>

<script>
import Header from "./Header";
import api from "../requests.js";
import Alert from "./Alert.vue"

export default {
  components: {
    Header,
    Alert
  },
  data() {
    return {
      challenges: [],
      challenge: {},
      currentStage: '',
      search: "",
      page: 1,
      size: 10,
      challengesReceived: false
    };
  },
  methods: {
    getChallenges() {
      api.challenges
      .index()
      .then(response => {
        this.challenges = response.data;
      })
      .catch(err => {
        this.$refs.alert.network_error();
      });
    },
    filter() {
      var list = [];
      if (this.search != "" && this.search != null) {
        var here = this;
        list = here.challenges.filter(function(challenge) {
          return (
            challenge.title.toLowerCase().includes(here.search.toLowerCase())
          );
        });
      } else {
        list = this.challenges;
      }
      return list.slice(0, this.page * this.size);
    },
    showChallenge(challenge) {
      this.challenge = challenge;
      this.$bvModal.show("showChallenge");
    },
    getImage(picture) {
      if (picture != null) {
        return picture.url;
      } else {
        return "https://via.placeholder.com/150";
      }
    },
    pagination() {
      return this.page * this.size < this.challenges.length;
    },
    nextPage() {
      this.page = this.page + 1;
    },
    upCase(str) {
      return api.utils.upcase(str);
    },
    deleteChallenge(challengeID) {
      this.$refs.alert.confirm(
        "Eliminar",
        "¿Estás seguro que desea eliminar este reto?",
        () => {
          api.challenges.delete(challengeID).then(response => {
            this.getChallenges();
          }).catch((err) => {
            this.$refs.alert.network_error();
          });
        },
        function() {}
      );
    },
  },
  created() {
    this.$snotify.clear()
    this.getChallenges();

    api.stages
    .getCurrent()
    .then((response) => {
      this.currentStage = response.data
      this.challengesReceived = true
    })
    .catch((err) => {
      this.$refs.alert.network_error();
    })
  }
};
</script>

<style lang="scss" scoped>
.btnStyle {
  height: 50px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
} 
.btnStyle {
  margin-top: 10px;
  margin-bottom: 10px;
}
.fixed {
  position: fixed;
  z-index: 100;
  background-color: white;
  width: 100vw !important;
  padding-bottom: 5px;
  padding-top: 90px;
  padding-left: 15px;
  padding-right: 15px;
  .input-group {
    width: calc(100vw - 30px) !important;
  }
  .btnBack {
    margin-top: 10px;
  }
}
.main-container {
  padding-top: 340px;
  padding-bottom: 15px;
  .list-item {
    width: 100%;
    border: 1px solid #0e2469;
    border-radius: 5px;
    color: #0e2469;
    margin-top: 7px;
    .challenge {
      width: 100%;
      background-color: transparent;
      color: #0e2469;
      flex: 0 1 auto;
      text-align: left;
    }
    .option {
      width: 50px;
      background-color: #c7161c;
      color: white;
    }
    .edit-icon {
      width: 50px;
      background-color: #0e2469;
      color: white;
    }
    .block {
      width: 50px;
      background-color: transparent;
      color: #6a6a6a;
    }
    .avatar {
      width: 34px;
      height: 34px;
    }
    .extra {
      color: #6a6a6a;
      font-size: 12px;
    }
  }
  .imageStyle {
    height: 130px;
    width: 130px;
  }
  .modalStyle {
    width: 500px;
    background: red;
  }
}
.next {
  width: 100%;
  background: transparent;
  border: 1px solid #0e2469;
  border-radius: 5px;
  color: #0e2469;
  margin: 10px 0px;
}
.modal-container {
  text-align: center;
  .picture {
    width: 150px;
    height: 150px;
    margin-bottom: 12px;
  }
  p {
    color: #0e2469;
  }
}
.modal-title {
  color: #0e2469;
}
</style>


