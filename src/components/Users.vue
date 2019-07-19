<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <b-row>
        <b-col>
          <h1>Usuarios</h1>
        </b-col>
        <b-col align="right">
          <h4 v-if="usersReceived">{{users.length}} usuarios registrados</h4>
        </b-col>
      </b-row>
      <div class="input-group">
        <input
          type="text"
          class="form-control inputStyles"
          placeholder="Búsqueda: Nombre, correo, C.C."
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
          ></b-img>
          {{upCase(getName(user.name, user.lastname))}}
          <span class="extra">{{user.email}} (C.C. {{user.cc}})</span>
        </b-button>
        <b-button class="unblock" @click="blockUser(user)" v-if="user.block == null">
          <font-awesome-icon icon="user"></font-awesome-icon>
        </b-button>
        <b-button class="block" @click="unblockUser(user)" v-else>
          <font-awesome-icon icon="user-slash"></font-awesome-icon>
        </b-button>
        
        <b-button class="option" @click="deleteUser(user)">
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <b-button class="next" @click="nextPage()" v-if="pagination()">Mas resultados</b-button>
    </div>
    <b v-if="filter().length == 0 && users != ''">No hay usuarios que coincidan con la búsqueda</b>
    <b v-if="users == '' && usersReceived">No hay usuarios registrados</b>
    <b-row v-else>
      <b-col align="center">
        <b-spinner v-if="users == ''" class="d-flex align-items-center" label="Loading..."></b-spinner>
      </b-col>
    </b-row>
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
          <b>Barrio:</b>
          {{upCase(user.location.name)}}
        </p>
        <p v-if="user.location != null">
          <b>Localidad:</b>
          {{upCase(user.location.hood)}}
        </p>
      </div>
    </b-modal>
    <Alert ref="alert"></Alert >
  </section>
</template>

<script>
import Header from "./Header";
import api from "../requests.js";
import Alert from "./Alert.vue";

export default {
  components: {
    Header,
    Alert
  },
  data() {
    return {
      users: [],
      search: "",
      user: {},
      page: 1,
      size: 10,
      usersReceived: false
    };
  },
  methods: {
    getName(name, last) {
      return name + " " + last;
    },
    getImage(picture) {
      if (typeof picture == 'object') {
        return picture.url;
      } else {
        return picture;
      }
    },
    getUsers() {
      api.user
        .get()
        .then(response => {
          this.users = response.data;
          this.usersReceived = true
        })
        .catch(err => {
          this.$refs.alert.network_error();
          this.usersReceived = true
        });
    },
    pagination() {
      return this.page * this.size < this.users.length;
    },
    deleteUser(user) {
      this.$refs.alert.confirm(
        "Eliminar",
        "¿Estás seguro que quieres eliminar a " +
         this.upCase(this.getName(user.name, user.lastname)) + "?",
        () => {
          api.user.delete(user.id).then(response => {
            this.getUsers();
            this.$refs.alert.success('Usuario eliminado.')
          }).catch((err) => {
            this.$refs.alert.network_error();
          });
        },
        function() {}
      );
    },
    blockUser(user) {
      this.$refs.alert.confirm(
        "Bloquear",
        "¿Estás seguro que quieres bloquear a " +
         this.upCase(this.getName(user.name, user.lastname)) + "?",
        () => {
          api.user
          .block(user.id)
          .then((response) => {
            this.$refs.alert.success('Usuario bloqueado.')
            this.getUsers();
          })
          .catch((err) => {
            this.$refs.alert.network_error();
          })
        },
        function() {}
      );
    },
    unblockUser(user) {
      this.$refs.alert.confirm(
        "Desbloquear",
        "¿Estás seguro que quieres desbloquear a " +
         this.upCase(this.getName(user.name, user.lastname)) + "?",
        () => {
          api.user
                .unblock(user.id)
                .then((response) => {
                  this.$refs.alert.success('El usuario ha sido desbloqueado.')
                  this.getUsers();
                })
                .catch((err) => {
                  this.$refs.alert.network_error();
                })
        },
        function() {}
      );
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
    this.$snotify.clear()
    this.getUsers();
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
  padding-bottom: 15px;
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
      background-color: #FFA500;
      color: white;
    }
    .unblock {
      width: 50px;
      background-color:#0B6623;
      color: white;
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


