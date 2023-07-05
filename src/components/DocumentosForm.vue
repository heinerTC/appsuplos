<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-header">
          <h5>Documentación petición de ofertas</h5>
        </div>
        <div class="card-body">
          <div class="overflow-scroll">
            <table class="table table-dark table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Oferta</th>
                  <th>Descripción</th>
                  <th>Contenido</th>
                  <th>Archivos a guardar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="oferta in ofertas" :key="oferta.id">
                  <td>{{ oferta.id }}</td>
                  <td>{{ oferta.nombre }}</td>
                  <td>{{ oferta.descripcion }}</td>
                  <td>
                    <ul>
                      <li v-for="archivoGuardado in oferta.archivosGuardados" :key="archivoGuardado.id">
                        <p>{{ archivoGuardado.nombre }}</p>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li v-for="archivo in oferta.archivosNuevos" :key="archivo.id">
                        {{ archivo.nombre }} {{ "|" }}
                        <button type="button" class="btn btn-danger btn-sm" @click="eliminarArchivo(oferta, archivo)">
                          <i class="fas fa-times"></i>
                        </button>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <button type="button" class="btn btn-primary btn-agregar-contenido" @click="abrirModal(oferta.id)"
                      :disabled="oferta.disableAgregarContenido">
                      Agregar contenido
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-success" @click="guardarDocumentos">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalAgregarContenido" tabindex="-1" aria-labelledby="modalAgregarContenidoLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalAgregarContenidoLabel">Agregar Contenido</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="formFileLg" class="form-label">Agregar Documento:</label>
                <input class="form-control form-control-lg" id="formFileLg" type="file" ref="archivoInput"
                  @change="handleArchivoSeleccionado" accept=".pdf,.docx,.doc,.xls,.xlsx,.ppt,.txt" />
              </div>
              <div class="mb-3">
                <label for="titulo" class="form-label">Título:</label>
                <input type="text" class="form-control" id="titulo" v-model="titulo" />
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea class="form-control" id="descripcion" v-model="descripcion"></textarea>
              </div>
            </form>
            <button type="button" class="btn btn-primary" @click="agregarDocumento">Agregar documento</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      archivosCargados: false,
      ofertas: [],
      archivo: null,
      titulo: '',
      descripcion: '',
      ofertaId: null,
      modalAgregarContenido: null,
      cambiosRealizados: false,
    };
  },
  computed: {
    ...mapState(['user']),
    userIdComputed() {
      return this.user.id;
    },
  },

  mounted() {
    this.obtenerOfertas();
    this.modalAgregarContenido = new bootstrap.Modal(document.getElementById('modalAgregarContenido'));
  },
  methods: {
    obtenerOfertas() {
      const userId = this.userIdComputed;
      this.$axios
        .get(`/crud/ofertasDocSesion.php?userId=${userId}`)
        .then(response => {
          this.ofertas = response.data.map(oferta => ({
            ...oferta,
            archivosGuardados: oferta.archivos.map(archivoGuardado => ({
              nombre: archivoGuardado.nombre_archivo,
              ruta: archivoGuardado.ruta_archivo,
            })),
          }));
        })
        .catch(error => {
          console.error(error);
        });
    },
    actualizarBotonesAgregarContenido() {
      this.ofertas.forEach((oferta) => {
        oferta.disableAgregarContenido = this.archivosCargados;
      });
    },
    abrirModal(ofertaId) {
      this.ofertaId = ofertaId;
      this.archivo = null;
      this.$refs.archivoInput.value = null;
      this.titulo = '';
      this.descripcion = '';
      this.modalAgregarContenido.show();
    },
    handleArchivoSeleccionado(event) {
      this.archivo = event.target.files[0];
    },
    eliminarArchivo(oferta, archivo) {
      const index = oferta.archivosNuevos.indexOf(archivo);
      if (index !== -1) {
        oferta.archivosNuevos.splice(index, 1);
        this.cambiosRealizados = true;
        this.archivosCargados = false;
        this.actualizarBotonesAgregarContenido();
      }
    },
    agregarDocumento() {
      if (!this.archivo) {
        this.$Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, selecciona un archivo.',
        });
        return;
      }

      if (!this.titulo) {
        this.$Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, ingresa un título',
        });
        return;
      }

      const nuevoArchivo = {
        nombre: this.archivo.name,
        archivo: this.archivo,
      };

      const oferta = this.ofertas.find(oferta => oferta.id === this.ofertaId);
      if (!oferta.hasOwnProperty('archivosNuevos')) {
        oferta.archivosNuevos = [];
      }
      oferta.archivosNuevos.push(nuevoArchivo);

      this.modalAgregarContenido.hide();
      this.cambiosRealizados = true;
      this.archivosCargados = true;
      this.actualizarBotonesAgregarContenido();
    },
    guardarDocumentos() {
      if (!this.cambiosRealizados) {
        this.$Swal.fire({
          icon: 'info',
          title: 'No hay cambios',
          text: 'No hay nuevos documentos para guardar.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('titulo', this.titulo);
      formData.append('descripcion', this.descripcion);
      formData.append('idoferta', this.ofertaId);

      const oferta = this.ofertas.find(oferta => oferta.id === this.ofertaId);
      if (oferta) {
        for (let i = 0; i < oferta.archivosNuevos.length; i++) {
          formData.append('archivo[]', oferta.archivosNuevos[i].archivo);
          formData.append('nombreArchivo[]', oferta.archivosNuevos[i].nombre);
        }
      }

      // console.log('Título:', this.titulo);
      // console.log('Descripción:', this.descripcion);
      // console.log('Id Oferta:', this.ofertaId);
      // console.log([...formData]);

      this.$axios.post('/crud/documentacionSesion.php', formData)
        .then(response => {
          console.log(response.data);
          this.titulo = '';
          this.descripcion = '';
          this.obtenerOfertas();
          this.archivosCargados = false;
          this.actualizarBotonesAgregarContenido();
          this.cambiosRealizados = false;
          this.$Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Los datos han sido guardados correctamente',
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

    // guardarDocumentos() {
    //   if (!this.cambiosRealizados) {
    //     this.$Swal.fire({
    //       icon: 'info',
    //       title: 'No hay cambios',
    //       text: 'No hay nuevos documentos para guardar.',
    //     });
    //     return;
    //   }
    //   const formData = new FormData();
    //   formData.append('titulo', this.titulo);
    //   formData.append('descripcion', this.descripcion);
    //   formData.append('idoferta', this.ofertaId);

    //   const oferta = this.ofertas.find(oferta => oferta.id === this.ofertaId);
    //   if (oferta) {
    //     oferta.archivosNuevos.forEach(archivo => {
    //       formData.append('archivo', archivo.archivo);
    //       formData.append('nombreArchivo', archivo.nombre);
    //     });
    //   }

    //   console.log('Título:', this.titulo);
    //   console.log('Descripción:', this.descripcion);
    //   console.log('Id Oferta:', this.ofertaId);
    //   console.log([...formData]);

    //   this.$axios.post('/crud/documentacionSesion.php', formData)
    //     .then(response => {
    //       console.log(response.data);
    //       this.titulo = '';
    //       this.descripcion = '';
    //       this.obtenerOfertas();
    //       this.cambiosRealizados = false;
    //       this.$Swal.fire({
    //         icon: 'success',
    //         title: 'Registro exitoso',
    //         text: 'Los datos han sido guardados correctamente',
    //       })
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });

    // },
  },
};
</script>
