<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Etapas</h1>
      <b-col align="center" class="main-container">
        <h2>Etapa actual: {{currentStage.number}}</h2>
        <b-row align="left">
          <p>{{nextStageDescription(currentStage.number)}}</p>
        </b-row>
        <b-row>
          <b-col align="center">
            <div v-if="currentStage.number != 4">
              <button
                type="button"
                class="btn btn-primary btn-lg btnStyle"
                @click="showNextStage()"
              >Siguiente Etapa
              </button>
            </div>
            <div v-else>
              <h4>Convocatoria finalizada</h4>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-modal id="showNextStage" title="Siguiente Etapa" hide-footer>
        <div class="modal-container container-fluid">
          <h3>Etapa {{((currentStage.number + 1) % 5)}}</h3>
          <p>{{nextStageDescription((currentStage.number + 1) % 5)}}</p>
          <br>
          <b>ATENCIÓN:</b><br>
          <b>Los cambios son irreversibles luego de pasar a la siguiente etapa.</b><br>
          <b>En caso de estar seguro presione SI. En caso contrario presione NO.</b>
          <b-col align="center">
            <button
              type="button"
              class="btn btn-primary btn-lg btnStyle btnModal"
              @click="confirmNextStage()"
            >SI
            </button>
            <button
              type="button"
              class="btn btn-primary btn-lg btnModalNo"
              @click="cancelNextStage()"
            >NO
            </button>
          </b-col>
        </div>
      </b-modal>
    </div>
    <Alert ref="alert"></Alert >
  </section>
</template>

<script>
import Header from "./Header";
import auth from "../authentication.js";
import api from "../requests.js";
import Alert from "./Alert.vue";

export default {
  components: {
    Header,
    Alert
  },
  data() {
    return {
      currentStage: {}
    };
  },
  methods: {
    nextStageDescription(nextStage) {
      switch(nextStage) {
        case 0:
          return 'La página muestra la información e imágenes. Permita la creación, modificación y eliminación de retos. No se pueden publicar ideas, solo se pueden registrar usuarios.'
          break;
        case 1:
          return 'La página ya cuenta con los retos y las personas pueden comenzar a publicar ideas y comentarios. Se pueden registrar usuarios, no están todavía disponibles los votos de ideas pero cada usuario puede editar sus ideas un máximo de 2 veces. No se pueden agregar mas retos.'
          break;
        case 2:
          return 'Se pueden registrar usuarios. Se cierran las publicaciones de idas y el panel administrativo está abierto para seleccionar las que pasarán a votación. '
          break;
        case 3:
          return 'Sólo se muestran las ideas preseleccionadas (5 por cada reto), los usuarios podrán votar por una sola idea dentro de cada reto y comentar las ideas las veces que quieran. Se pueden registrar usuarios. No se pueden publicar mas ideas. No se pueden editar ideas. No se pueden agregar mas retos.'
          break;
        case 4:
          return 'Se cierran la votaciones y solo se muestran las ideas ganadoras por cada reto. Los usuarios pueden seguir comentando las ideas ganadoras. Se pueden registrar usuarios. No se puede votar por ideas. No se pueden agregar mas ideas. No se pueden editar ideas. No se puede agregar mas retos.'
          break;
          break;
        default:
          return 'Ha ocurrido un error'
          break;
      } 
    },
    showNextStage(){
      this.$bvModal.show("showNextStage");
    },
    cancelNextStage(){
      this.$bvModal.hide("showNextStage");
    },
    confirmNextStage(){
      api.stages
      .setNext()
      .then(() => {
        this.$bvModal.hide("showNextStage");
        this.getCurrentStage();
      })
      .catch((err) => {
        console.log(err)
        if (err.response != null){
          if (err.response.data.authorization == 'There are not enough ideas created, minimum 5 per challenge') {
            this.$refs.alert.error('No hay suficientes ideas para pasar de etapa.')
          } else if (err.response.data.authorization == 'There are not enough ideas picked, minimum 5 per challenge') { 
            this.$refs.alert.error('No hay suficientes ideas seleccionadas.')
          }
        } else {
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        }
      })
    },
    getCurrentStage(){
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
  },
  created() {
    this.getCurrentStage();
  }
};
</script>

<style lang="scss" scoped>
.btnModalNo {
  height: 50px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
  background-color: white;
  color: #0E2469;
  width: 100px;
  margin: 15px;
}
.btnStyle {
  height: 50px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
  background-color: #0E2469;
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
  .btnBack {
    margin-top: 10px;
  }
}
.main-container {
  padding-right: 250px;
  padding-left: 250px;
  @media (max-width: 800px) {
    padding-right: 20px !important;
    padding-left: 20px !important;
  }
}
.modal-container {
  text-align: left;
  .btnModal {
    margin: 15px;
    width: 100px;
  }
  b {
    color: #c7161c;
  }
}
.modal-title {
  color: #0e2469;
}
</style>


