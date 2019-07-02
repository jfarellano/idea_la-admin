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

        
        <apexchart v-if="readyToRenderLoc && sumVotes != 0" type=bar height=350 :options="chartOptions" :series="series" />
        <div v-else>
          <p v-if="locationFilter != ''">  0 encuestas registradas en esta localidad.</p>
        </div>
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
      readyToRenderLoc: false,
      locationFilter: '',
      challenges: [],
      ideas: [],
      ideasLoc: [],
      idea: {},
      currentStage: {},
      sumVotes: 0,
      series: [],
        chartOptions: {
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',	
            },
          },
          dataLabels: {
            // enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },

          xaxis: {
            categories: [],
          },
          yaxis: {
            title: {
              text: 'No. de votos'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " votos"
              }
            }
          }
        }
    };
  },
  methods: {
    filterByLocation(id) {
      if (id == 0) return;

      this.readyToRenderLoc = false

      var apiLocation = this.getLocationById(id);

      this.series = []
      this.sumVotes = 0

      api.surveys
      .getResultsByHood({hood: apiLocation})
      .then(response => {
        var resultsResponse = response.data
        var hashSize = Object.keys(resultsResponse).length
        var resultsGraph = []
        for (var i = 0; i < hashSize; i++){
          resultsGraph[i] = []
        }
        for (var key in resultsResponse) {
          var tempResult = resultsResponse[key]
          for (var key2 in tempResult) {
            var parsedIndex = parseInt(key2[key2.length - 1] - 1)
            resultsGraph[parsedIndex].push(tempResult[key2])
            this.sumVotes = this.sumVotes + tempResult[key2]
          }
        }
        for (var i = 0; i < hashSize; i++){
          this.series.push({
            name: 'Puesto ' + (i + 1),
            data: resultsGraph[i]
          })
        }
        this.readyToRenderLoc = true
      })
      .catch(err => {
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
      for (var key in this.challenges) {
        this.chartOptions.xaxis.categories.push(this.challenges[key].title)
      }
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
  :focus {
    outline: none !important;
    outline: 0 !important;
  }
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
</style>


