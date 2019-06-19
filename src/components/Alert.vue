<template>
  <vue-snotify></vue-snotify>
</template>

<script>
export default {
	data(){
		return{
			params: {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      }
		}
	},
  methods: {
    error: function(message) {
      this.$snotify.error(message, 'Error', this.params);
		},
		simple: function(title, message) {
      this.$snotify.simple(message, title, this.params);
		},
		success: function(message) {
      this.$snotify.success(message, 'Éxito', this.params);
		},
		warning: function(message) {
      this.$snotify.warning(message, 'Alerta', this.params);
		},
		confirm: function(title, message, accept, deny) {
      this.$snotify.confirm(message, title, {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: true,
				pauseOnHover: true,
				buttons: [
					{text: 'Aceptar', action: () => accept()},
					{text: 'Cancelar', action: () => deny()}
				]
      });
    },
    network_error: function() {
      this.$snotify.error('Hubo un error en la red, intenta de nuevo', 'Error', this.params)
    },
    credentials_error: function() {
      this.$snotify.warning('Credenciales inválidas, intenta de nuevo', 'Atención', this.params)
    },
    form_error: function() {
      this.$snotify.warning('El formulario no está completo o tiene un error, revisa de nuevo', 'Atención', this.params)
    },
    blocked_user: function() {
      this.$snotify.error('Tu usuario ha sido bloqueado', 'Usuario bloqueado', this.params)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
