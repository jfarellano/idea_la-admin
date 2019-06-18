<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Ideas</h1>
      <div class="input-group">
        <input
          type="text"
          class="form-control inputStyles"
          placeholder="Buscar"
          v-model="search"
        >
      </div>
    </div>
    <div class="main-container container-fluid">
      <b-button-group v-for="user in filter()" :key="user.id" class="list-item">
        <b-button @click="showUser(user)" class="user">
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="getImage(user.picture)"
            alt="Circle image"
          ></b-img>
          {{upCase(getName(user.name, user.lastname))}}
          <span class="extra">{{user.email}}</span>
        </b-button>
        <b-button class="option" @click="deleteUser(user)">
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <b-button class="next" @click="nextPage()" v-if="pagination()">Mas resultados</b-button>
    </div>
    <b-modal id="showUser" :title="upCase(getName(user.name, user.lastname))" hide-footer>
      <div class="modal-container container-fluid">
        <b-img
          rounded="circle"
          class="picture img-responsive"
          :src="getImage(user.picture)"
          alt="Circle image"
        ></b-img>
        <p>
          <b>Correo:</b>
          {{user.email}}
        </p>
        <p>
          <b>C.C.:</b>
          {{user.cc}}
        </p>
        <p>
          <b>Télefono:</b>
          {{user.phone}}
        </p>
        <p>
          <b>Edad:</b>
          {{user.age}}
        </p>
        <p>
          <b>Género:</b>
          {{getGender(user.gender)}}
        </p>
        <p v-if="user.location != null">
          <b>Localidad:</b>
          {{upCase(user.location.hood)}}
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
      ideas:[],

      users: [],
      search: "",
      user: {},
      page: 1,
      size: 10
    };
  },
  methods: {
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
    getIdeas() {
      api.ideas
        .indexAll()
        .then(response => {
          this.ideas = response.data;
        })
        .catch(err => {
          console.log(err.response);
          this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
        });
    },
    pagination() {
      return this.page * this.size < this.users.length;
    },
    deleteUser(user) {
      this.$snotify.confirm(
        "¿Estas seguro que quieres eliminar a " +
          this.upCase(this.getName(user.name, user.lastname)) + "?",
        "Eliminar usuario",
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
                  this.getIdeas();
                  this.$snotify.success("Usuario eliminado", "Exito", {
                    timeout: 2000,
                    showProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true
                  });
                }).catch((err) => {
                  console.log(err)
                  this.$refs.alert.error('Ha ocurrido un error. Intenta de nuevo más tarde.')
                });
              }
            },
            { text: "Cancelar" }
          ]
        }
      );
    },
    blockUser(id) {
      console.log("Usuario bloqueado");
    },
    filter() {
      var list = [];
      if (this.search != "" && this.search != null) {
        var here = this;
        list = here.users.filter(function(user) {
          return (
            here
              .getName(user.name, user.lastname)
              .includes(here.search.toLowerCase()) ||
            user.cc.includes(here.search.toLowerCase()) ||
            user.email.includes(here.search.toLowerCase())
          );
        });
      } else {
        list = this.users;
      }
      return list.slice(0, this.page * this.size);
    },
    nextPage() {
      this.page = this.page + 1;
    },
    showUser(user) {
      this.user = user;
      this.$bvModal.show("showUser");
    },
    getGender(gender) {
      switch (gender) {
        case "male":
          return "Masculino";
          break;
        case "female":
          return "Femenino";
          break;
        case "other":
          return "Otro";
        case "i_prefer_not_to_say":
          return "Prefiero no decir";
          break;

        default:
          return "";
          break;
      }
    },
    upCase(str) {
      return api.utils.upcase(str);
    }
  },
  created() {
    this.getIdeas();
  }
};
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
  .btnBack {
    margin-top: 10px;
  }
}
.main-container {
  padding-top: 260px;
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
      width: 50px;
      background-color: #c7161c;
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

