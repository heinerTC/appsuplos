<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="card text-center size-card" >
        <div class="card-header">
          Ingreso a Módulo
        </div>
        <div class="card-body">
          <form id="inicioSesion" autocomplete="off" @submit.prevent="login">
            <div class="mb-3">
              <label for="correoLogin" class="form-label">Correo:</label>
              <input type="email" v-model="email" name="email" class="form-control" id="correoLogin"
                placeholder="Ingrese el correo" required autocomplete="username" />
            </div>
            <div class="mb-3">
              <label for="passLogin" class="form-label">Contraseña:</label>
              <input type="password" v-model="pass" name="pass" class="form-control" id="passLogin"
                placeholder="Ingrese la contraseña" required autocomplete="current-password" />
            </div>
            <button class="btn btn-success" type="submit">INGRESAR</button>
          </form>
        </div>
        <div class="card-footer text-muted">
          <RouterLink to="/registro" class="btn btn-primary mr-3">CREAR CUENTA</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      pass: ""
    };
  },
  methods: {
    login() {
      this.$axios
        .post('/crud/loginSesion.php', JSON.stringify({
          email: this.email,
          pass: this.pass
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          const data = response.data;

          if (data.success) {
            this.$Swal.fire({
              icon: 'success',
              title: 'Ingreso exitoso',
              text: 'Sesión iniciada'
            }).then(() => {
              this.$store.commit("setUser", data.user);
              this.$store.commit('setAuthenticated', true);
              this.$router.push("/crear");

            });
          } else {
            this.$Swal.fire({
              icon: 'error',
              title: 'Error',
              text: '¡Datos erróneos! Inténtalo nuevamente.'
            });
            console.log("Datos a entregar:", data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    mostrarRegistro() {
      if (this.$store.state.authenticated) {
        this.$router.push("/crear");
      }
    }

  }
};
</script>
  