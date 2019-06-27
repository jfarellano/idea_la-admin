<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <h1 v-if="challengeID == 'new'">Crear Reto</h1>
      <h1 v-else>Editar Reto</h1>
      <br>
      <b-row class="margins-content container-fluid">
        <b-col v-if="challengeID == 'new'" cols="5" align="center">
          <b-img v-if="challenge.newPicture != null" class="avatar img-responsive" :src="getImage()"/>
          <b-form-file
            v-model="challenge.newPicture"
            accept="image/jpeg, image/png"
            style="display:none;"
            ref="fileInput"
            v-validate="'size:2000'"
            :class="{'has-error': errors.has('image_size')}"
            name="image"
          />
          <b-button
            @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
            class="loadBtn"
            :disabled="validStage()"
          >
          <p v-if="challenge.newPicture != null">Cambiar tu imagen</p>
          <p v-else>Carga imagen</p>
          </b-button>
          <p v-if="challenge.newPicture != null" class="selectedImage">{{challenge.newPicture.name}}</p>
        </b-col>
        <b-col v-else cols="5" align="center">
          <img v-if="challenge.challenge_pictures != null && challenge.newPicture == null" class="avatar img-responsive" :src="challenge.challenge_pictures[0].url"/>
          <img v-if="challenge.newPicture != null" class="avatar img-responsive" :src="getImage()"/>
          <b-form-file
            v-model="challenge.newPicture"
            accept="image/jpeg, image/png"
            style="display:none;"
            ref="fileInput"
            v-validate="'size:2000'"
            :class="{'has-error': errors.has('image_size')}"
            name="image"
          />
          <b-button
            @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
            class="loadBtn"
            :disabled="validStage()"
          >Cambiar tu imagen
          </b-button>
          <p v-if="challenge.newPicture != null" class="selectedImage">{{challenge.newPicture.name}}</p>
        </b-col>
        <b-col cols="7">
          <div v-if="challengeID != 'new'">
            <router-link v-if="challenge.ideas > 0" class="challenge" :to='"/ideas/" + challenge.id'>
              {{challenge.ideas}} idea(s) publicada(s)
            </router-link>
            <p v-else>{{challenge.ideas}} idea(s) publicada(s)</p>
          </div>
          
          <h5>Título</h5>
          <div class="input-group">
            <input
              type="text"
              class="form-control inputStyles"
              v-model="challenge.title"
              v-validate="'alpha_spaces|max:50|required'"
              :class="{'has-error': errors.has('name_invalid')}"
              name="name"
              :disabled="validStage()"
            >
          </div>
          <h5>Descripción breve</h5>
          <textarea 
            cols="101" 
            class="form-control short-description" 
            v-model="challenge.short_description" 
            :disabled="validStage()"
          >
          </textarea>
        </b-col>
      </b-row>
      <b-row class="margins-content">
        <b-col>
          <br>
          <h5>Descripción detallada</h5>
          <textarea 
            cols="101" 
            class="form-control longDescription" 
            v-model="challenge.description"
            :disabled="validStage()"  
          >
          </textarea>
        </b-col>
      </b-row>
      <b-row class="margins-content">
        <b-col align="center">
            <button
              v-if="currentStage.number == 0"
              type="button"
              class="btn btn-primary btn-lg btnStyle btnContinueStyle"
              v-on:click.prevent="acceptChallenge()"
            >
            <p v-if="challengeID == 'new'">Crear</p>
            <p v-else>Guardar</p>
            </button>
            <router-link
              v-if="currentStage.number == 0"
              to="/challenges" 
              tag="button"
              class="btn btn-primary btn-lg btnStyle btnCancelStyle"
            >Cancelar</router-link>
            <router-link
              v-else
              to="/challenges" 
              tag="button"
              class="btn btn-primary btn-lg btnStyle btnCancelStyle"
            >Volver</router-link>
          </b-col>
      </b-row>
      <b-row>
        <b-col align="center">
          <b v-if="currentStage.number != 0">Etapa {{currentStage.number}}: En esta etapa no se pueden crear, modificar ni eliminar retos.</b>
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
    return{
      test: [],
      currentStage: '',

      challengeID: '',
      challenge: {},
    }
  },
  created(){
    this.challengeID = this.$route.params.challengeID;
    
    if (this.challengeID != 'new') {
      api.challenge
      .getInfo(this.challengeID)
      .then((response) => {
        this.challenge = response.data;
      })
      .catch((err) => {
        console.log(err)
        this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
      })
    }

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
    getImage() {
      return URL.createObjectURL(this.challenge.newPicture);
    },
    validStage(){
      if (this.currentStage.number == 0) return false;
      else return true;
    },
    acceptChallenge() {
      var fd = new FormData();
      fd.append('title', this.challenge.title);
      fd.append('short_description', this.challenge.short_description)
      fd.append('description', this.challenge.description)
      if (this.challengeID != 'new' && this.challenge.newPicture != null) {
        fd.append('image_update', this.challenge.newPicture)
        fd.append('update_img', true)
      } else if (this.challenge.newPicture != null) {
        fd.append('image', this.challenge.newPicture)
      }

      if (this.challengeID == 'new') {
        api.challenges
        .create(fd)
        .then((response) => {
          this.$router.push("/challenges")
        })
        .catch((err) => {
          console.log(err)
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        })
      } else {
        api.challenges
        .update(fd, this.challengeID)
        .then((response) => {
          this.$router.push("/challenges")
        })
        .catch((err) => {
          console.log(err)
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.short-description {
  max-height: 100px;
  min-height: 50px;
}
.img-responsive {
  max-height: 100%;
  max-width: 100%;  
}
.selectedImage {
  color: #6a6a6a;
  font-size: 12px;
  margin: 0px;
}
.challenge-picture {
  max-height: 135px;
  max-width: 100%;
  margin-bottom: 10px;
}
.btnStyle {
  height: 50px;
  border-radius: 5px;
  margin-top: 17px;
  margin-bottom: 17px;
  border-color: #0E2469;
}
.btnCancelStyle {
  color: #0E2469;
  background-color: white;
  margin-left: 10px;
}
.btnContinueStyle {
  background-color: #0E2469;
}
.btnsRows {
  margin-top: 15px;
}
.longDescription {
  height: 130px;
  max-height: 200px;
  min-height: 50px;
}
.inputStyles {
  width: 100%;
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
}
.loadBtn {
    border: 1px solid #0e2469;
    border-radius: 5px;
    box-shadow: 0 0 2px 0 #ffffff;
    background-color: transparent;
    // width: 27.85%;
    width: 100%;
    // height: 50px;
    font-size: 17px;
    color: #0e2469;
    &:focus {
      border: 2px solid #0e2469;
    }
    .text {
      background-color: transparent;
      color: #0e2469;
      border: 0px;
    }
    .icon {
      background-color: #ff0000;
      color: white;
      border: 0px;
      z-index: 0;
    }
  }
</style>
