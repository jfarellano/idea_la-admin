<template>
  <section>
    <Header></Header>
    <div class="fixed">
      <router-link tag="b-button" class="button btnBack" to="/dashboard">Menú</router-link>
      <h1>Comentarios</h1>
      <button
        type="button"
        class="btn btn-primary btnStyle"
        v-if="commentsParam != 'all'"
        @click="goToAllComments()"
        >Mostrar Todos
      </button>
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
      <b-button-group v-for="comment in filter()" :key="comment.id" class="list-item">
        <div class="user">
          <b-img
            rounded="circle"
            class="avatar img-responsive"
            :src="getImage(comment.user_profile_picture)"
            alt="Circle image"
          ></b-img>
          {{upCase(comment.user_name)}}
          <span class="extra">{{comment.description}}</span>
        </div>
        <b-button class="option" @click="deleteComment(comment)">
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <b-button class="next" @click="nextPage()" v-if="pagination()">Mas resultados</b-button>
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
  data() {
    return {
      comments: [],
      commentsParam: '',
      currentStage: {},
      search: "",
      page: 1,
      size: 10
    };
  },
  methods: {
    goToAllComments(){
      this.$router.push('/comments/all')
      this.$router.go()
    },
    getName(name, last) {
      return name + " " + last;
    },
    getImage(picture) {
      if (typeof picture == 'object') return picture.url
      else return picture
    },
    getComments() {
      api.comments
        .getAll()
        .then(response => {
          this.comments = response.data;
        })
        .catch(err => {
          this.$refs.alert.network_error();
        });
    },
    pagination() {
      return this.page * this.size < this.comments.length;
    },
    deleteComment(comment) {
      this.$snotify.confirm(
        "¿Estas seguro que quieres eliminar este comentario?",
        "Eliminar comentario",
        {
          timeout: 2000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          buttons: [
            {
              text: "Borrar",
              action: () => {
                api.comments.delete(comment.id).then(response => {
                  if (this.commentsParam == 'all') this.getComments();
                  else this.getCommentsFromIdea(this.commentsParam);
                  this.$refs.alert.success('Comentario eliminado.')
                }).catch((err) => {
                  this.$refs.alert.network_error();
                });
              }
            },
            { text: "Cancelar" }
          ]
        }
      );
    },
    filter() {
      var list = [];
      if (this.search != "" && this.search != null) {
        var here = this;
        list = here.comments.filter(function(comment) {
          return (
            comment.user_name.toLowerCase().includes(here.search.toLowerCase()) ||
            comment.description.toLowerCase().includes(here.search.toLowerCase())
          );
        });
      } else {
        list = this.comments;
      }
      return list.slice(0, this.page * this.size);
    },
    nextPage() {
      this.page = this.page + 1;
    },
    upCase(str) {
      return api.utils.upcase(str);
    },
    getCommentsFromIdea(ideaID) {
      api.comments
        .getFromIdea(ideaID)
        .then(response => {
          this.comments = response.data;
        })
        .catch(err => {
          this.$refs.alert.network_error();
        });
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
    this.commentsParam = this.$route.params.commentsParam;
    if (this.commentsParam == 'all') this.getComments();
    else this.getCommentsFromIdea(this.commentsParam);

    this.getCurrentStage();
  }
};
</script>

<style lang="scss" scoped>
.separator {
  height: 10px;
}
.btnStyle {
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
  padding-top: 330px;
  margin-bottom: 15px;
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
      padding: 5px;
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


