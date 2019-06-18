<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <h1 v-if="challengeID == 'new'">Crear Reto</h1>
      <h1 v-else>Editar Reto</h1>
      <br>
      <b-row class="margins-content">
        <b-col cols="4" align="center">
          <b-img class="challenge-picture" :src="getImage()"/>
          <b-button
              @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
              class="loadBtn"
              v-if="challenge.picture == null"
            >Carga una imagen</b-button>
            <b-button-group class="loadBtn" v-else>
              <b-button
                class="text"
                @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
              >Cambia tu imagen</b-button>
            </b-button-group>
            <b-form-file
              v-model="challenge.picture"
              accept="image/jpeg, image/png"
              style="display:none;"
              @change="checkSize()"
              ref="fileInput"
              v-validate="'size:2000'"
              :class="{'has-error': errors.has('image_size')}"
              name="image"
            />
            <p v-if="challenge.picture != null" class="selectedImage">{{challenge.picture.name}}</p>
            <p
              v-if="errors.has('image')"
              class="incorrectInput"
            >La imagen es muy grande, el maximo son 2MB</p>
        </b-col>
        <b-col cols="8">
          <!-- PENDIENTE ROUTER LINK A IDEAS DEL RETO YA FILTRADAS -->
          <!-- <router-link class="challenge" :to='"/add_edit_challenge/" + challenge.id'>{{challenge.ideas}} idea(s) publicada(s)</router-link> -->
          <router-link v-if="challengeID != 'new'" class="challenge" to='/add_edit_challenge'>
            {{challenge.ideas}} idea(s) publicada(s)
          </router-link>
          <h5>Título</h5>
          <div class="input-group">
            <input
              type="text"
              class="form-control inputStyles"
              v-model="challenge.title"
              v-validate="'alpha_spaces|max:50|required'"
              :class="{'has-error': errors.has('name_invalid')}"
              name="name"
            >
          </div>
          <h5>Descripción breve</h5>
          <textarea cols="101" class="form-control" v-model="challenge.short_description">
          </textarea>
        </b-col>
      </b-row>
      <b-row class="margins-content">
        <b-col>
          <br>
          <h5>Descripción detallada</h5>
          <textarea cols="101" class="form-control longDescription" v-model="challenge.description">
          </textarea>
        </b-col>
      </b-row>
      <b-row class="margins-content">
        <b-col align="center">
            <button
              type="button"
              class="btn btn-primary btn-lg btnStyle btnContinueStyle"
              v-on:click.prevent="acceptChallenge()"
              :disabled='allValidInputs()'
            >
            <p v-if="challengeID == 'new'">Aceptar</p>
            <p v-else>Guardar</p>
            </button>
            <router-link
              to="/challenges" 
              tag="button" 
              class="btn btn-primary btn-lg btnStyle btnCancelStyle"
            >Cancelar</router-link>
          </b-col>
      </b-row>
    </div>
  </section>
</template>

<script>
import Header from "./Header";
import auth from "../authentication.js";
import api from "../requests.js";

export default {
  components: {
    Header
  },
  data(){
    return{
      challengeID: '',
      challenge: {}
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
  },
  methods: {
    allValidInputs(){
      if (this.challenge.picture != null || this.challenge.title == '' || 
      this.challenge.short_description == '' || this.challenge.description == '') {
        return false;
      } else {
        return true;
      }
    },
    acceptChallenge(){
      var newChallenge = new FormData();
      newChallenge.append("title", this.challenge.title);
      newChallenge.append("short_description", this.challenge.short_description);
      newChallenge.append("description", this.challenge.description);
      if (this.challenge.picture != null) challenge.append("image", this.challenge.picture);
      
      if (this.challengeID == 'new') {
        api.challenges
        .create(newChallenge)
        .then(() => {
          this.$router.push("/challenges");
        })
        .catch((err) => {
          console.log(err)
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        })
      } else {
        api.challenges
        .update(newChallenge)
        .then(() => {
          this.$router.push("/challenges");
        })
        .catch((err) => {
          console.log(err)
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        })
      }
    },
    getImage() {
      if (this.challenge.picture == null) {
        if (this.challenge.picture == null) return "http://placehold.it/100x100";
        else return this.challenge.picture.url;
      } else return URL.createObjectURL(this.challenge.picture);
    },
  }
}
</script>

<style lang="scss" scoped>
.selectedImage {
  color: #6a6a6a;
  font-size: 12px;
  margin: 0px;
}
.challenge-picture {
  max-height: 135px;
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
    // .margins-content {
    //   padding-left: 70px;
    //   padding-right: 70px;
    // }
  // .input-group {
  //   width: calc(100vw - 30px) !important;
  // }
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
