<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <!-- <router-link tag="b-button" class="button btnStyle" to="/challenges">
        Inicio
      </router-link> -->
      <h1>Retos</h1>
      <div class="input-group">
        <input
          type="text"
          class="form-control inputStyles"
          placeholder="Buscar"
          v-model="search"
        >
      </div>
      <router-link tag="b-button" class="button btnStyle" to="/add_edit_challenge/new">
        <font-awesome-icon icon="plus"/>   Agregar
      </router-link>
    </div>
    <div class="main-container container-fluid listStyle">
      <b-button-group v-for="challenge in filter2()" :key="challenge.id" class="list-item">
        <!-- <b-button @click="showChallenge(challenge)" class="challenge">
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="getImage(challenge.challenge_pictures[0])"
            alt="Circle image"
          ></b-img>
          {{upCase(challenge.title)}}
        </b-button> -->

        <router-link tag="b-button" class="challenge" :to='"/add_edit_challenge/" + challenge.id'>
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="getImage(challenge.challenge_pictures[0])"
            alt="Circle image"
          ></b-img>
          {{upCase(challenge.title)}}
        </router-link>

        <!-- <b-button @click="showChallenge(challenge)" class="user">
          <b-row>  
            <b-col cols="2">
              <b-img
                rounded="circle"
                class="imageStyle"
                :src="getImage(challenge.picture)"
                alt="Circle image"
              ></b-img>
            </b-col>
            <b-col cols="10">
              <b-row>
                {{upCase(challenge.title)}}
                {{challenge.title}}
              </b-row>
              <b-row>
                <span class="extra">{{challenge.ideas}} idea(s) publicada(s)</span>
              </b-row>
              <b-row>
                <span class="extra">{{challenge.description}}</span>
              </b-row>
            </b-col>
          </b-row>
        </b-button> -->
        <!-- <b-button class="block" @click="blockUser(user.id)">
          <font-awesome-icon icon="user-slash"></font-awesome-icon>
        </b-button>-->
        <b-button class="option" @click="deleteChallenge(challenge)">
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <!-- <b-button class="next" @click="nextPage()" v-if="pagination()">Mas resultados</b-button> -->
    </div>
    <b-modal id="showChallenge" :title="challenge.title" class="modalStyle" hide-footer style="max-width: 700px; max-width: 120%;">
    <!-- <b-modal id="showChallenge" :title="upCase(challenge.title)" hide-footer> -->
      <div class="modal-container container-fluid">
        <b-img
          rounded="circle"
          class="picture img-responsive"
          :src="getImage(challenge.url)"
          alt="Circle image"
        ></b-img>
        <p>
          <b>Ideas Publicadas:</b>
          <!-- <input
            type="email"
            class="form-control inputStyles"
            placeholder="ej. example@email.com"
            v-model="userCredentials.email"
            v-validate="'required|email'"
            :class="{'has-error': errors.has('email_invalid')}"
            name="email"
            @keydown.space.prevent
          > -->
          <!-- <input
            v-model="challenge.ideas"
          > -->
          {{challenge.ideas}}
        </p>
        <p>
          <b>Descripción breve:</b>
          <!-- {{challenge.short-description}} -->
        </p>
        <p>
          <b>Descripción detallada:</b>
          {{challenge.description}}
        </p>
      </div>
    </b-modal>
    <vue-snotify></vue-snotify>
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
  data() {
    return {
      challenges: [],
      challenge: {},

      users: [],
      search: "",
      user: {},
      page: 1,
      size: 10
    };
  },
  methods: {
    createChallenge(){
      console.log('nuevo challenge')
    },
    getChallenges() {
      api.challenges
        .index()
        .then(response => {
          this.challenges = response.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    filter2() {
      var list = [];
      if (this.search != "" && this.search != null) {
        var here = this;
        list = here.challenges.filter(function(challenge) {
          return (
            challenge.title.includes(here.search.toLowerCase()) ||
            // challenge.short-description.includes(here.search.toLowerCase()) ||
            challenge.description.includes(here.search.toLowerCase())
          );
        });
      } else {
        list = this.challenges;
      }
      return list.slice(0, this.page * this.size);
    },
    showChallenge(challenge) {
      this.challenge = challenge;
      this.$bvModal.show("showChallenge");
    },
    getImage(picture) {
      if (picture != null) {
        return picture.url;
      } else {
        return "https://via.placeholder.com/150";
      }
    },
    upCase(str) {
      return api.utils.upcase(str);
    },
    deleteChallenge(challenge) {
      this.$snotify.confirm(
        "¿Estás seguro que desea eliminar este reto?",
        "Eliminar reto",
        {
          timeout: 2000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          buttons: [
            {
              text: "Borrar",
              action: () => {
                api.user.delete(user.id).then(response => {
                  this.getUsers();
                  this.$snotify.success("Reto eliminado", "Éxito", {
                    timeout: 2000,
                    showProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true
                  });
                });
              }
            },
            { text: "Cancelar" }
          ]
        }
      );
    },
    


    // getName(name, last) {
    //   return name + " " + last;
    // },
    
    // getUsers() {
    //   api.user
    //     .get()
    //     .then(response => {
    //       this.users = response.data;
    //     })
    //     .catch(err => {
    //       console.log(err.response);
    //     });
    // },
    // pagination() {
    //   return this.page * this.size < this.users.length;
    // },
    
    // blockUser(id) {
    //   console.log("Usuario bloqueado");
    // },
    // filter() {
    //   var list = [];
    //   if (this.search != "" && this.search != null) {
    //     var here = this;
    //     list = here.users.filter((user) => {
    //       return (
    //         here
    //           .getName(user.name, user.lastname).includes(here.search.toLowerCase()) ||
    //         user.cc.includes(here.search.toLowerCase()) ||
    //         user.email.includes(here.search.toLowerCase())
    //       );
    //     });
    //   } else {
    //     list = this.users;
    //   }
    //   return list.slice(0, this.page * this.size);
    // },
    // nextPage() {
    //   this.page = this.page + 1;
    // },
    
    // getGender(gender) {
    //   switch (gender) {
    //     case "male":
    //       return "Masculino";
    //       break;
    //     case "female":
    //       return "Femenino";
    //       break;
    //     case "other":
    //       return "Otro";
    //     case "i_prefer_not_to_say":
    //       return "Prefiero no decir";
    //       break;

    //     default:
    //       return "";
    //       break;
    //   }
    // },
  },
  created() {
    this.getChallenges();
    

    // this.getUsers();
  }
};
</script>

<style lang="scss" scoped>
.btnStyle {
  margin-top: 10px;
  margin-bottom: 10px;
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
}
.main-container {
  padding-top: 270px;
  .list-item {
    width: 100%;
    border: 1px solid #0e2469;
    border-radius: 5px;
    color: #0e2469;
    margin-top: 7px;
    .challenge {
      width: 100%;
      background-color: transparent;
      color: #0e2469;
      flex: 0 1 auto;
      text-align: left;
    }
    .option {
      width: 50px;
      background-color: #ed1d24;
      color: white;
    }
    .edit-icon {
      width: 50px;
      background-color: #0e2469;
      color: white;
    }
    .block {
      width: 50px;
      background-color: transparent;
      color: #6a6a6a;
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
  .imageStyle {
    height: 130px;
    width: 130px;
  }
  .modalStyle {
    width: 500px;
    background: red;
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


