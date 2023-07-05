<template>
  <header>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <button class="btn btn-danger" @click="logout">
          <i class="fas fa-sign-out-alt"></i>&nbsp;Cerrar sesión
        </button>
      </div>
    </nav>
    <div class="collapse" id="navbarToggleExternalContent">
      <div class="bg-dark p-4">
        <nav>
          <div class="btn-group d-flex" role="group">
            <RouterLink to="/crear" class="btn btn-primary mr-3"><i class="fas fa-plus"></i>&nbsp;Crear</RouterLink>
            <RouterLink to="/documentos" class="btn btn-secondary mr-3"><i
                class="fas fa-file-alt"></i>&nbsp;<span>Documentos</span></RouterLink>
            <RouterLink to="/consultar" class="btn btn-success mr-3"><i class="fas fa-search"></i>&nbsp;Consultar
            </RouterLink>
          </div>
        </nav>

      </div>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.commit("logout");      
      this.$router.push("/"); // Redirigir a la página de inicio de sesión
    }
  }
};
</script>