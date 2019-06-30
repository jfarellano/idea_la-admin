<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Resultados de Encuestas</h1>
      <br>
      <b-col align="center" class="chart-col">
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
        <apexchart v-if="readyToRenderLoc" type=bar height=350 :options="chartOptions" :series="series" />
      </b-col>
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
      ],
      readyToRender: false,
      readyToRenderLoc: false,
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
        case 5:
          return 'riomar'
        break;
      } 
    },
    getCurrentStage(){
      api.stages
      .getCurrent()
      .then((response) => {
        this.currentStage = response.data
        if (this.currentStage.number == 0) this.$router.push('/dashboard')
      })
      .catch((err) => {
        this.$refs.alert.network_error();
      })
    }
  },
  created() {
    this.getCurrentStage();

    api.challenges
    .index()
    .then(response => {
      this.challenges = response.data;
    })
    .catch(err => {
      this.$refs.alert.network_error();
    });

    this.locationFilter = 0
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


