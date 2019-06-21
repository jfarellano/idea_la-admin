<template>
  <div class="loginComponent">
    <div class="container-fluid">
      <div class="row align-items-center rowStyle">
        <div class="col align-self-center">
          <div
            class="fieldsContainer"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="10"
          >
            <router-link to="/">
              <img src="../assets/CamaraBaq-Blue.svg" alt height="54px" class="iconImage">
            </router-link>

            <p class="iniciar-sesion">Iniciar Sesión admin</p>

            <h3 class="input-title" id="email">Correo electrónico</h3>
            <div class="input-group">
              <input
                type="email"
                class="form-control inputStyles"
                placeholder="ej. example@email.com"
                v-model="userCredentials.email"
                v-validate="'required|email'"
                :class="{'has-error': errors.has('email_invalid')}"
                name="email"
                @keydown.space.prevent
              >
            </div>
            <p v-if="errors.has('email')" class="incorrectInput">El correo ingresado no es válido.</p>

            <h3 class="input-title">Contraseña</h3>
            <div class="input-group">
              <input
                type="password"
                class="form-control inputStyles"
                v-model="userCredentials.password"
                v-validate="'required'"
                :class="{'has-error': errors.has('password_invalid')}"
                name="password"
                @keyup.enter="userLogin()"
              >
            </div>
            <p v-if="errors.has('password')" class="incorrectInput">Este campo es obligatorio.</p>

            <button
              type="button"
              class="btn btn-primary btn-lg btn-block btnLoginStyle"
              v-on:click.prevent="userLogin()"
              :disabled="!validLogin()"
            >Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="modalPopover credentials" title="Atención" ok-only>
      <p class="parag">Credenciales Inválidas.</p>
    </b-modal>
    <b-modal id="modalPopover blocked" title="Atención" ok-only>
      <p class="parag">Usuario bloqueado.</p>
    </b-modal>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import auth from "../authentication.js";

export default {
  data() {
    return {
      userCredentials: {}
    };
  },
  methods: {
    validLogin() {
      if (
        this.errors.count() == 0 &&
        this.userCredentials.email != null &&
        this.userCredentials.password != null
      ) {
        return true;
      } else {
        return false;
      }
    },
    userLogin() {
      auth.session
        .login({
          email: this.userCredentials.email,
          password: this.userCredentials.password
        })
        .then(response => {
          if (response.data.is_admin) {
            auth.storage.set(
              response.data.user.id,
              response.data.secret,
              response.data.expire_at,
              response.data.is_admin
            );
            if (typeof response.data.user.picture == 'object')
              auth.storage.setImage(response.data.user.picture.url);
            else auth.storage.setImage(response.data.user.picture);
            auth.storage.set_name(
              response.data.user.name,
              response.data.user.lastname
            );
            this.$router.push("/dashboard");
          } else {
            this.$snotify.error("Su usuario no es admin", "Atención", {
              timeout: 2000,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            });
          }
        })
        .catch(err => {
          if (err.response == null) {
            this.$snotify.error("Error de red. Inténtelo mas tarde.", "Error", {
              timeout: 2000,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            });
          } else {
            if (err.response.data.single_authentication == "invalid credentials") {
              this.$snotify.error("Credenciales inválidas.", "Atención", {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              });
              this.userCredentials.password = ""
            } else if (err.response.data.single_authentication == "user is blocked") {
              // ALERT NOTIFICATION USER BLOCKED
              this.$snotify.error("Usuario bloqueado", "Atención", {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              });
              this.userCredentials.username = "";
              this.userCredentials.password = "";
            } else {
              this.$snotify.error("Error de red. Inténtelo mas tarde.", "Error", {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              });
            }
          }
        });
    }
  }
};
</script>

<style scoped style lang="scss">
.loginComponent {
  background-color: #0e2469;
  height: 100%;
  text-align: center;
  .rowStyle {
    height: 100%;
    min-height: 100vh;
  }
  .iconImage {
    margin-bottom: 15px;
    fill: #0e2469;
  }
  @media (max-width: 800px) {
    .fieldsContainer {
      max-width: 100% !important;
      padding: 21px !important;
    }
    .input-title {
      font-size: 17px !important;
    }
    .iniciar-sesion {
      font-size: 31px !important;
    }
  }
  @media (max-width: 365px) {
    .iniciar-sesion {
      margin-bottom: 50px !important;
    }
  }
  @media (max-width: 321px) {
    #email {
      margin-bottom: 40px !important;
    }
  }
  .fieldsContainer {
    // background-color: white;
    text-align: left;
    padding: 23px;
    margin: auto;
    margin-top: 20px !important;
    // max-width: 35%;
    // max-height: 80%;
    padding: 60px;
    width: 521px;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0 0 14px 0 rgba(20, 20, 20, 0.3);
  }
  .divSeparator {
    height: 13px;
  }
  @media (max-width: 341px) {
    .btnLoginStyle {
      height: 75px !important;
    }
  }
  .btnLoginStyle {
    // background-color: grey;
    // border: grey;
    // box-shadow: 0px 5px #ffe01b;
    // border-radius: 0px;
    // margin-top: 17px;
    // margin-bottom: 17px;

    height: 50px;
    // width: 100%;
    border-radius: 5px;
    border-color: #0e2469;
    background-color: #0e2469;
    margin-top: 17px;
    margin-bottom: 17px;
  }
  .inputStyles {
    border: 1px solid #0e2469;
    border-radius: 5px;
    box-shadow: 0 0 2px 0 #ffffff;
    // width: 27.85%;
    height: 50px;
    font-size: 21px;
    color: #0e2469;
    &:focus {
      border: 2px solid #0e2469;
    }
  }

  .incorrectInput {
    color: #ed1d24;
  }
  .iniciar-sesion {
    height: 44px;
    // width: 213px;
    color: #0e2469;
    font-size: 35px;
    font-weight: bold;
    line-height: 44px;
  }
  .input-title {
    height: 27px;
    // width: 175px;
    color: #6a6a6a;
    font-size: 21px;
    font-weight: 300;
    line-height: 27px;
    margin-top: 17px;
  }
  .orSocialMedia {
    margin-left: -17px;
    margin-right: -17px;
  }
}
</style>