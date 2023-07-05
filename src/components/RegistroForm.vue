<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="card text-center size-card">
        <div class="card-header">
          Registro de usuario
        </div>
        <div class="card-body">
          <form id="registro" autocomplete="off" @submit.prevent="register">
            <div class="mb-3">
              <label for="nombreRegistro" class="form-label">Nombre:</label>
              <input type="text" v-model="nombre" name="nombre" class="form-control" id="nombreRegistro"
                placeholder="Ingrese su nombre" required />
            </div>
            <div class="mb-3">
              <label for="correoRegistro" class="form-label">Correo:</label>
              <input type="email" v-model="email" name="email" class="form-control" id="correoRegistro"
                placeholder="Ingrese su correo" required />
            </div>
            <div class="mb-3">
              <label for="passRegistro" class="form-label">Contraseña:</label>
              <input type="password" v-model="pass" name="pass" class="form-control" id="passRegistro"
                placeholder="Ingrese una contraseña" required pattern="[A-Za-z0-9]{8,15}" autocomplete="new-password" />
            </div>
            <div class="mb-3">
              <label for="passRegistroC" class="form-label">Confirmar Contraseña:</label>
              <input type="password" v-model="passC" class="form-control" id="passRegistroC"
                placeholder="Confirme contraseña" required pattern="[A-Za-z0-9]{8,15}" />
            </div>
            <button class="btn btn-success" type="submit">REGISTRARSE</button>
          </form>
        </div>
        <div class="card-footer text-muted">
          <router-link to="/" class="btn btn-primary mr-3">INICIAR SESION</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistroForm",
  data() {
    return {
      nombre: "",
      email: "",
      pass: "",
      passC: ""
    };
  },
  methods: {
    register() {
      if (this.pass !== this.passC) {
        this.$Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden. Por favor, inténtelo nuevamente.'
        });
        return;
      }

      this.$axios
        .post('/crud/registroSesion.php', JSON.stringify({
          nombre: this.nombre,
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
              title: 'Registro exitoso',
              text: 'Por favor, inicie sesión.'
            }).then(() => {
              this.mostrarLogin();
            });
          } else {
            // console.log("Datos a entregar:", data);
            this.$Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error! Inténtalo nuevamente.'
            });
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    mostrarLogin() {
      this.$router.push("/");
    }
  }
};
</script>
