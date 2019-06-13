<template>
  <b-navbar toggleable="sm" type="dark" fixed="top">
    <b-navbar-brand href="/#/dashboard">
      <img src="../assets/CamaraBaq-24.svg" alt="Ciudá">
    </b-navbar-brand>
    <button
      class="navbar-toggler ml-auto"
      type="button"
      data-toggle="collapse"
      data-target="#nav-collapse"
      aria-controls="navbarSupportedContent"
      :aria-expanded="show"
      @click="collapse()"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div :class="collapseClass()" id="nav-collapse">
      <b-navbar-nav class="ml-auto">
        <li :class="dropClass('nav-item user-drop dropdown')" v-click-outside="close">
          <a class="user-drop nav-link dropdown-toggle" href="#" @click="toggleDropdown()">
            <span>{{fullname}}</span>
            <b-img
              rounded="circle"
              class="avatar img-responsive"
              :src="getPic()"
              alt="Circle image"
            ></b-img>
          </a>
          <div :class="dropClass('dropdown-menu')" aria-labelledby="navbarDropdownMenuLink">
            <a class="dropdown-item" href="#">Mi Perfil</a>
            <a class="dropdown-item logout" @click="userLogout()">Cerrar sesión</a>
          </div>
        </li>
      </b-navbar-nav>
    </div>
    <vue-snotify></vue-snotify>
  </b-navbar>
</template>

<script>
import auth from "../authentication.js";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      tokenExists: false,
      fullname: "",
      expanded: false,
      show: false
    };
  },
  methods: {
    userLogout() {
      auth.session
        .logout()
        .then(response => {
          auth.storage.clear();
          this.$router.push("/");
        })
        .catch(err => {
          auth.storage.clear();
          this.$router.push("/");
        });
    },
    getPic() {
      return auth.storage.get("picture");
    },
    gotoProfile() {
      this.$router.push("/miperfil");
    },
    toggleDropdown() {
      this.expanded = !this.expanded;
    },
    dropClass(ref) {
      if (this.expanded) return ref + " show";
      else return ref;
    },
    close() {
      if (this.expanded) {
        this.expanded = false;
      }
    },
    collapse() {
      this.show = !this.show;
    },
    collapseClass() {
      if (this.show) return "navbar-collapse collapse show";
      else return "navbar-collapse collapse";
    }
  },
  created() {
    var logged = auth.storage.logged()
    if(logged){
      this.tokenExists = logged
      this.fullname = auth.storage.get("name");
    }else{
      auth.storage.clear()
      this.$router.push('/')
    }
  },
  directives: {
    "click-outside": {
      bind: function(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 90px;
  background-color: #081641;
  color: white;
  .navbar-brand {
    img {
      height: 44px;
      margin-left: 6%;
    }
  }
  .login {
    padding: 5px 20px;
    font-size: 22px;
    margin-right: 6%;
    background-color: transparent;
    border-color: transparent;
    border-radius: 0px;
  }
  .nav-link {
    color: white;
    font-size: 22px;
  }
  .user-drop {
    span {
      margin-right: 10px;
    }
    img {
      border-color: white;
      border-style: solid !important;
      border: 2px;
    }
  }
  .logout {
    color: #ff0000;
  }
  .dropdown-menu {
    top: 65px;
  }
  .avatar {
    width: 34px;
    height: 34px;
  }

  .navbar-toggler {
    color: white !important;
    border: none;
    span {
      color: white;
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
    }
  }
  .navbar-collapse {
    background-color: #081641;
    text-align: center;
    @media (max-width: 576px) {
      margin-top: 28px;
      .nav-link {
        margin: 6px;
      }
    }

    -webkit-border-bottom-right-radius: 10px;
    -webkit-border-bottom-left-radius: 10px;
    -moz-border-radius-bottomright: 10px;
    -moz-border-radius-bottomleft: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
}
</style>