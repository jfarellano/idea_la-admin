<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Resultados de Votaciones</h1>
      <br>
      <b-row class="row-scroll">
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

          <apexchart class="col chart-pie" v-if="readyToRender" type=pie width=650 :options="chartOptions" :series="series" />
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
          <apexchart class="col chart-pie" v-if="readyToRenderLoc && locationFilter != '' && sumVotes > 0" type=pie width=650 :options="chartOptionsLoc" :series="seriesLoc" />
        </b-col>
      </b-row>
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
      locations: [
        {title: 'Seleccionar Localidad', id: 0},
        {title: 'Suroccidente', id: 1},
        {title: 'Suroriente', id: 2},
        {title: 'Norte – Centro Histórico', id: 3},
        {title: 'Metropolitana', id: 4},
        {title: 'Riomar', id: 5},
        {title: 'Otro', id: 6}
      ],
      readyToRender: false,
      readyToRenderLoc: false,
      series: [],
      chartOptions: {
        colors: [
            '#53BC83'
          , '#246F76'
          , '#C42082'
          , '#F94349'
          , '#EE866C'
          , '#565462'
          , '#798696'
          , '#BC8A80'
          , '#E1B1A2'
          , '#BE3B28'
          , '#0EA02C'
          , '#71B08B'
          , '#EEA93A'
          , '#F11D2C'
          , '#31233D'
          , '#6A5F75'
          , '#D19A39'
          , '#B68884'
          , '#723336'
          , '#613745'
          , '#F65E2C'
          , '#1C9857'
          , '#353B3F'
          , '#F6DE8C'
          , '#13B2DA'
        ],
        responsive: [{
          breakpoint: 650,
          options: {
            chart: {
              width: 450
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
      seriesLoc: [],
      chartOptionsLoc: {
        colors: [
            '#53BC83'
          , '#246F76'
          , '#C42082'
          , '#F94349'
          , '#EE866C'
          , '#565462'
          , '#798696'
          , '#BC8A80'
          , '#E1B1A2'
          , '#BE3B28'
          , '#0EA02C'
          , '#71B08B'
          , '#EEA93A'
          , '#F11D2C'
          , '#31233D'
          , '#6A5F75'
          , '#D19A39'
          , '#B68884'
          , '#723336'
          , '#613745'
          , '#F65E2C'
          , '#1C9857'
          , '#353B3F'
          , '#F6DE8C'
          , '#13B2DA'
        ],
        responsive: [{
          breakpoint: 650,
          options: {
            chart: {
              width: 450
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
        this.readyToRenderLoc = true
      })
      .catch((err) => {
        this.$refs.alert.network_error();
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
        case 6:
          return 'otro'
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
          this.$refs.alert.network_error();
        })
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
          this.$refs.alert.network_error();
        });
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
        if (this.currentStage.number < 3) this.$router.push('/dashboard')
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
        title: 'Todos',
        id: 0
      })
    })
    .catch(err => {
      this.$refs.alert.network_error();
    });

    this.locationFilter = 0
    this.challengeFilter = 0
  }
};
</script>

<style lang="scss" scoped>
.row-scroll {
  overflow:scroll;
}
.chart-pie {
  margin-left: 0px;
  @media (max-width: 400px) {
    margin-left: -70px;
  }
}
.scroll-row {
  overflow-y: scroll;
}
.chart-col {
  padding-right: 15px;
  padding-left: 15px;
}
.dropdown-challenges {
  margin-top: 10px;
}
.fixed {
  overflow:scroll;
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
</style>


