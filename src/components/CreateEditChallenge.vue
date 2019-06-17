<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <h1 v-if="challengeID == 'new'">Crear Reto</h1>
      <h1 v-else>Editar Reto</h1>
      <br>
      <b-col cols="4">
        <h5>Imagen de perfil</h5>
        <b-button
          @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
          class="loadBtn"
          v-if="challenge.picture == null"
        >Carga tu imagen</b-button>
        <b-button-group class="loadBtn" v-if="challenge.picture != null">
          <b-button
            class="text"
            @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
          >Cambia tu imagen</b-button>
          <b-button class="icon" @click="clearImage()">
            <font-awesome-icon icon="times"></font-awesome-icon>
          </b-button>
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


        <!-- <b-button
          @click="$refs.fileInput.$el.querySelector('input[type=file]').click()"
          class="loadBtn"
          v-if="challenge.picture == null"
        >Carga tu imagen</b-button> -->
      </b-col>
      <b-col cols="8">
      </b-col>
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
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
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
}
.loadBtn {
    border: 1px solid #0e2469;
    border-radius: 5px;
    box-shadow: 0 0 2px 0 #ffffff;
    background-color: transparent;
    // width: 27.85%;
    width: 100%;
    height: 50px;
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
