<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/ideas/all">Volver</router-link>
      <b-row>
        <b-col>
          <h1>Ideas Seleccionadas</h1>
        </b-col>
        <b-col align="right">
          <h4 v-if="ideasReceived">{{ideas.length}} ideas seleccionadas</h4>
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
      <b-form-select
        class="mb-2 mr-sm-2 mb-sm-0 dropdown-challenges"
        :value="null"
        id="inline-form-custom-select-pref"
        v-model="challengeFilter"
        name="challenge"
        @change="filterByChallenge(challengeFilter)"
      >
        <option
          slot="first"
          v-for="(challenge, index) in challenges"
          v-bind:value="challenge.id"
          :key="index"
        >{{ challenge.title }}</option>
      </b-form-select>
    </div>
    <div class="main-container container-fluid">
      <b-button-group v-for="idea in filter()" :key="idea.id" class="list-item">
        <b-button @click="showIdea(idea)" class="user">
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="idea.idea_pictures[0].url"
            alt="Circle image"
          ></b-img>
          {{idea.title}}
          <span class="extra">{{idea.votes}} voto(s)</span>
        </b-button>
        <div v-if="currentStage.number == 2">
          <b-button v-if="!idea.picked" class="picker-icon" @click="pickIdea(idea.id)">
            <font-awesome-icon icon="square"></font-awesome-icon>
          </b-button>
          <b-button v-else class="pick picker-icon" @click="unpickIdea(idea.id)">
            <font-awesome-icon icon="check-square"></font-awesome-icon>
          </b-button>
        </div>
        <div v-if="currentStage.number == 4 && currentStage.open">
          <b-button v-if="!idea.winner" class="picker-icon" @click="pickWinnerIdea(idea.id)">
            <font-awesome-icon icon="star"></font-awesome-icon>
          </b-button>
          <b-button v-else class="winner picker-icon" @click="unpickWinnerIdea(idea.id)">
            <font-awesome-icon icon="star"></font-awesome-icon>
          </b-button>
        </div>
      </b-button-group>
    </div>
    <strong v-if="filter().length == 0 && ideas != ''">No hay ideas que coincidan con la búsqueda</strong>
    <strong v-if="ideas == '' && ideasReceived">No hay ideas seleccionadas</strong>
    <b-row v-else>
      <b-col align="center">
        <b-spinner v-if="ideas == ''" class="d-flex align-items-center" label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-button class="next" @click="nextPage()" v-if="pagination() && filter().length > 0">Mas resultados</b-button>
    <b-modal id="showIdea" :title="idea.title" hide-footer>
      <div class="modal-container container-fluid">
        <b-img
          v-if="idea.idea_pictures != null"
          rounded="circle"
          class="picture img-responsive"
          :src="idea.idea_pictures[0].url"
          alt="Circle image"
        ></b-img>
        <div class="leftModalContent">
          <p v-if="idea.challenge != null">
            <b>Reto: </b>
            {{idea.challenge.title}}
          </p>
          <p>
            {{idea.votes}} voto(s)
          </p>
            <p v-if="idea.comments > 0">
              <router-link :to='"/comments/" + idea.id'>{{idea.comments}} comentario(s)</router-link>  
            </p>
            <p v-else>{{idea.comments}} comentario(s)</p>
          <p v-if="idea.user != null">
            <b>Por:</b>
            {{upCase(getName(idea.user.name, idea.user.lastname))}}
          </p>
          <p align="justify">
            <b>Descripción:</b><br>
            {{idea.description}}
          </p>
        </div> 
      </div>
    </b-modal>
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
      challengeFilter: '',
      challenges: [],
      ideas: [],
      ideasByChal: [],
      idea: {},
      ideaParam: '',
      currentStage: {},
      search: "",
      page: 1,
      size: 10,
      ideasReceived: false,
      idPicked: 0
    };
  },
  methods: {
    filterByChallenge(id) {
      this.idPicked = id
      if (id == 0) {
        this.getPickedIdeas();
      } else {
        api.ideas
        .indexPickedByChallenge(id)
        .then((response) => {
          this.ideas = response.data
          this.ideasReceived = true
        })
        .catch((err) => {
          this.$refs.alert.network_error();
        })
      }
    },
    pickIdea(id) {
      this.$refs.alert.confirm(
        "Seleccionar idea",
        "¿Estás seguro que quieres seleccionar esta idea?",
        () => {
          api.idea
          .pick(id)
          .then((response) => {
            this.filterByChallenge(this.idPicked)
          })
          .catch((err) => {
            console.log(err)
            this.$refs.alert.network_error();
          })
        },
        function() {}
      );
    },
    unpickIdea(id) {
      this.$refs.alert.confirm(
        "Deseleccionar",
        "¿Estás seguro que quieres deseleccionar esta idea?",
        () => {
          api.idea
          .unpick(id)
          .then((response) => {
            this.filterByChallenge(this.idPicked)
          })
          .catch((err) => {
            this.$refs.alert.network_error();
          })
        },
        function() {}
      );
    },
    pickWinnerIdea(id) {
      this.$refs.alert.confirm(
        "Seleccionar idea",
        "¿Estás seguro que quieres seleccionar esta idea?",
        () => {
          api.idea
          .pickWinner(id)
          .then((response) => {
            this.filterByChallenge(this.idPicked)
          })
          .catch((err) => {
            if (err.response == null) {
              this.$refs.alert.network_error();
            } else {
              this.$refs.alert.picked_winner_in_limit()
            }
          })
        },
        function() {}
      );
    },
    unpickWinnerIdea(id) {
      this.$refs.alert.confirm(
        "Deseleccionar",
        "¿Estás seguro que quieres deseleccionar esta idea?",
        () => {
          api.idea
          .unpickWinner(id)
          .then((response) => {
            this.filterByChallenge(this.idPicked)
          })
          .catch((err) => {
            this.$refs.alert.network_error();
          })
        },
        function() {}
      );
    },
    goToAllIdeas(){
      this.$router.push('/ideas/all')
      this.$router.go()
    },
    getName(name, last) {
      return name + " " + last;
    },
    getImage(picture) {
      if (picture != null) {
        return picture.url;
      } else {
        return "https://via.placeholder.com/150";
      }
    },
    getPickedIdeas() {
      api.ideas
        .indexPicked()
        .then((response) => {
          this.ideas = response.data;
          this.ideasReceived = true
        })
        .catch(err => {
          this.$refs.alert.network_error();
        });
    },
    pagination() {
      return this.page * this.size < this.ideas.length;
    },
    deleteIdea(idea) {
      this.$refs.alert.confirm(
        "Eliminar",
        "¿Estas seguro que quieres eliminar esta idea?",
        () => {
          api.ideas.delete(idea.id).then(response => {
            this.getPickedIdeas();
            this.$refs.alert.success('Idea eliminada eliminada.')
          }).catch((err) => {
            this.$refs.alert.network_error();
          });
        },
        function() {}
      );
    },
    filter() {
      var list = [];
      if (this.search != "" && this.search != null) {
        var here = this;
        list = here.ideas.filter(function(idea) {
          return (
            idea.title.toLowerCase().includes(here.search.toLowerCase())
          );
        });
      } else {
        list = this.ideas;
      }
      return list.slice(0, this.page * this.size);
    },
    nextPage() {
      this.page = this.page + 1;
    },
    showIdea(idea) {
      this.idea = idea;
      this.$bvModal.show("showIdea");
    },
    upCase(str) {
      return api.utils.upcase(str);
    },
    getChallengeIdeas(challengeID) {
      api.ideas
      .indexChallenge(challengeID)
      .then(response => {
        this.ideas = response.data;
      })
      .catch(err => {
        this.$refs.alert.network_error();
      });
    },
    getCurrentStage(){
      api.stages
      .getCurrent()
      .then((response) => {
        this.currentStage = response.data
      })
      .catch((err) => {
        this.$refs.alert.network_error();
      })
    }
  },
  created() {
    this.$snotify.clear()
    this.getCurrentStage();
    this.getPickedIdeas();

    api.challenges
    .index()
    .then(response => {
      this.challenges = response.data;
      this.challenges.push({
        title: 'Todas',
        id: 0
      })
    })
    .catch(err => {
      this.$refs.alert.network_error();
    });

    this.challengeFilter = 0
  }
};
</script>

<style lang="scss" scoped>
.dropdown-challenges {
  margin-top: 10px;
}
.picker-icon {
  width: 100%;
  height: 100%;
  border-radius: 0px;
}
.separator {
  height: 10px;
}
.btnStyle {
  margin-right: 20px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
  background-color: #0E2469;
}
.leftModalContent {
  text-align: left;
}
.fixed {
  position: fixed;
  z-index: 100;
  background-color: white;
  width: 100vw !important;
  padding-bottom: 30px;
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
  padding-top: 310px;
  .list-item {
    width: 100%;
    border: 1px solid #0e2469;
    border-radius: 5px;
    color: #0e2469;
    margin-top: 7px;
    .user {
      width: 100%;
      background-color: transparent;
      color: #0e2469;
      flex: 0 1 auto;
      text-align: left;
    }
    .option {
      background-color: #c7161c;
      color: white;
    }
    .block {
      width: 50px;
      background-color: transparent;
      color: #6a6a6a;
    }
    .pick {
      background-color: #0B6623;
    }
    .winner {
      background-color: #FFCC00;
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


