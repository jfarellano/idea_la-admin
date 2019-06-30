<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Resultados de Votaciones</h1>
      <br>
      <b-row>
        <b-col align="center" class="chart-col">
          <h3>Resultados por Reto</h3>
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

          <apexchart v-if="readyToRender" type=pie width=550 :options="chartOptions" :series="series" />
        </b-col>
        <b-col align="center" class="chart-col" v-if="challengeFilter != 0">
          <h3>Resultados por Localidad</h3>
          <b-form-select
            class="mb-2 mr-sm-2 mb-sm-0 dropdown-challenges"
            :value="null"
            id="inline-form-custom-select-pref"
            v-model="locationFilter"
            name="challenge"
            @change="filterByLocation(locationFilter)"
            place
          >
            <option
              slot="first"
              v-for="(location, index) in locations"
              v-bind:value="location.id"
              :key="index"
            >{{ location.title }}</option>
          </b-form-select>

          <p v-if="sumVotes == 0 && locationFilter != ''">0 votos registrados.</p>
          <apexchart v-if="readyToRenderLoc && locationFilter != '' && sumVotes > 0" type=pie width=550 :options="chartOptionsLoc" :series="seriesLoc" />
        </b-col>
      </b-row>
    </div>
    <Alert ref="alert"></Alert >
  </section>
</template>

<script>
import Header from "./Header";
import auth from "../authentication.js";
import api from "../requests.js";
import Alert from "./Alert.vue"

export default {
  components: {
    Header,
    Alert
  },
  data() {
    return {
      locations: [
        {title: 'Seleccionar Localidad', id: 0},
        {title: 'Suroccidente', id: 1},
        {title: 'Suroriente', id: 2},
        {title: 'Norte – Centro Histórico', id: 3},
        {title: 'Metropolitana', id: 4},
        {title: 'Riomar', id: 5},
      ],
      readyToRender: false,
      readyToRenderLoc: false,
      series: [],
      chartOptions: {
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
      seriesLoc: [],
      chartOptionsLoc: {
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
      challengeFilter: '',
      locationFilter: '',
      challenges: [],
      ideas: [],
      ideasLoc: [],
      ideasByChal: [],
      idea: {},
      currentStage: {},
      sumVotes: 0
    };
  },
  methods: {
    filterByLocation(id) {
      this.readyToRenderLoc = false

      var apiLocation = this.getLocationById(id);

      api.ideas
      .indexVotesByLocation({hood: apiLocation}, this.challengeFilter)
      .then((response) => {
        this.ideasLoc = response.data
        this.seriesLoc = []
        this.chartOptionsLoc.labels = []
        this.sumVotes = 0
        for (var key in this.ideasLoc) {
          this.seriesLoc.push(this.ideasLoc[key].idea_votes)
          this.chartOptionsLoc.labels.push(this.ideasLoc[key].idea.title)
          this.sumVotes = this.sumVotes + this.ideasLoc[key].idea_votes
        }
        console.log('ideasLoc',this.ideasLoc)
        console.log('seriesLoc',this.seriesLoc)
        console.log('chartOptionsLoc.labels',this.chartOptionsLoc.labels)


        this.readyToRenderLoc = true
      })
      .catch((err) => {
        this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
      })
    },
    getLocationById(id){
      switch(id) {
        case 0:
          break;
        case 1:
          return 'suroccidente'
        break;
        case 2:
          return 'suroriente'
        break;
        case 3:
          return 'norte_centro_historico'
        break;
        case 4:
          return 'metropolitana'
        break;
        case 5:
          return 'riomar'
        break;
      } 
    },
    filterByChallenge(id) {
      this.readyToRender = false
      if (id == 0) {
        this.getPickedIdeas();
      } else {
        api.ideas
        .indexPickedByChallenge(id)
        .then((response) => {
          this.ideas = response.data
          this.series = []
          this.chartOptions.labels = []
          for (var key in this.ideas) {
            this.series.push(this.ideas[key].votes)
            this.chartOptions.labels.push(this.ideas[key].title)
          }
          this.readyToRender = true
          if (this.locationFilter != 0) this.filterByLocation(this.locationFilter)
        })
        .catch((err) => {
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        })
      }
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
      this.readyToRender = false
      api.ideas
        .indexPicked()
        .then((response) => {
          this.ideas = response.data
          this.series = []
          this.chartOptions.labels = []
          for (var key in this.ideas) {
            this.series.push(this.ideas[key].votes)
            this.chartOptions.labels.push(this.ideas[key].title)
          }
          this.readyToRender = true
        })
        .catch(err => {
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        });
    },
    pagination() {
      return this.page * this.size < this.ideas.length;
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
        this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
      });
    },
    getCurrentStage(){
      api.stages
      .getCurrent()
      .then((response) => {
        this.currentStage = response.data
        if (this.currentStage.number < 3) this.$router.push('/dashboard')
      })
      .catch((err) => {
        this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
      })
    }
  },
  created() {
    this.getCurrentStage();
    this.getPickedIdeas();

    api.challenges
    .index()
    .then(response => {
      this.challenges = response.data;
      this.challenges.push({
        title: 'Todos',
        id: 0
      })
    })
    .catch(err => {
      this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
    });

    this.locationFilter = 0
    this.challengeFilter = 0
  }
};
</script>

<style lang="scss" scoped>
.chart-col {
  padding-right: 15px;
  padding-left: 15px;
}
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


