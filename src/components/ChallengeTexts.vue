<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <h1>Textos de Retos</h1>
      <br>
      <b-row class="content-tags">
        <h5>Título</h5>
        <div class="input-group">
        <input
          type="text"
          class="form-control inputStyles"
          v-model="currentStage.title"
          v-validate="'alpha_spaces|max:50|required'"
          :class="{'has-error': errors.has('title_invalid')}"
          name="title"
        >
      </div>
        <h5>Descripción</h5>
        <textarea 
          cols="101" 
          class="form-control long-text"
          v-model="currentStage.description"
        >
        </textarea>
      </b-row>
      <b-row>
        <b-col align="center">
          <button
            type="button"
            class="btn btn-primary btn-lg btnStyle btnContinueStyle"
            v-on:click.prevent="updateTexts()"
            :disabled="validInputs()"
            >Guardar
          </button>
          <router-link
            to="/dashboard" 
            tag="button"
            class="btn btn-primary btn-lg btnStyle btnCancelStyle"
          >Cancelar</router-link>
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
  data(){
    return {
      currentStage: {}
    }
  },
  created() {
    api.stages
    .getCurrent()
    .then((response) => {
      this.currentStage = response.data
    })
    .catch((err) => {
      console.log(err)
      this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
    })
  },
  methods: {
    validInputs(){
      if (this.currentStage.title == '' || this.currentStage.description == '') return true;
      else return false;
    },
    updateTexts() {
      api.stages
      .changeText({
        title: this.currentStage.title,
        description: this.currentStage.description
      })
      .then((response) => {
        this.$router.push("/dashboard")
      })
      .catch((err) => {
        console.log(err)
        this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.long-text {
  min-height: 100px;
  max-height: 300px;
}
.content-tags {
  padding-left: 20px;
  padding-right: 20px;
}
.btnStyle {
  height: 50px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
  margin: 10px;
}
.btnCancelStyle {
  color: #0E2469;
  background-color: white;
}
.btnContinueStyle {
  background-color: #0E2469;
}
.inputStyles {
  width: 100%;
  margin-bottom: 10px;
}
.fixed {
  position: fixed;
  z-index: 100;
  background-color: white;
  width: 100vw !important;
  padding-bottom: 30px;
  padding-top: 90px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
