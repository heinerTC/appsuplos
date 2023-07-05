<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h5>Crear procesos / Evento participación cerrada</h5>
          </div>
          <div class="card-body">
            <div class="overflow-scroll">
              <div class="tabs-container">
                <ul class="tabs">
                  <li class="active">
                    <a href="">Información básica</a>
                  </li>
                  <li>
                    <a href="">Cronograma</a>
                  </li>
                </ul>
                <div class="tabs-content">
                  <div>
                    <div class="tabs-panel active" data-index="0">
                      <h5>Información básica</h5>
                      <form>
                        <div class="mb-3">
                          <label for="objetoOferta" class="form-label">Objeto:</label>
                          <input type="text" class="form-control" id="objetoOferta" placeholder="Ingrese la información"
                            v-model="objeto" name="objeto" />
                        </div>
                        <div class="mb-3">
                          <label for="descripcionOferta" class="form-label">Descripción / Alcance:</label>
                          <textarea class="form-control" id="descripcionOferta" rows="3"
                            placeholder="Ingrese la descripción" v-model="descripcion" name="descripcion"></textarea>
                        </div>
                        <div class="mb-3">
                          <label for="monedaOferta" class="form-label">Moneda:</label>
                          <select class="form-select" id="monedaOferta" v-model="moneda" name="moneda">
                            <option disabled selected>Selecciona una moneda</option>
                            <option value="COP">COP</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label for="presupuestoOferta" class="form-label">Presupuesto:</label>
                          <input type="number" class="form-control" id="presupuestoOferta"
                            placeholder="Ingrese el monto de presupuesto" v-model="presupuesto" name="presupuesto" />
                        </div>
                        <div class="mb-3">
                          <label for="actividadOferta" class="form-label">Actividad:</label>
                          <select id="actividadOferta" v-model="actividadId" name="actividad"
                            class="form-select form-select-sm sel">
                            <option disabled selected>Por favor seleccione</option>
                            <option v-for="actividad in clasificador" :value="actividad.idclasificador"
                              :key="actividad.idclasificador">
                              {{ actividad.nombre_producto }} - {{ actividad.nombre_clase }} - {{ actividad.nombre_familia
                              }} - {{ actividad.nombre_segmento }}
                            </option>
                          </select>
                        </div>
                      </form>
                    </div>
                    <div class="tabs-panel" data-index="1">
                      <h5>Cronograma</h5>
                      <form>
                        <div class="row">
                          <div class="col-md-6 mb-3">
                            <label for="fechaInicio" class="form-label">Fecha de Inicio:</label>
                            <VDatePicker v-model="fechaInicio" mode="date" />
                          </div>
                          <div class="col-md-6 mb-3">
                            <label for="horaInicio" class="form-label">Hora de Inicio:</label>
                            <!-- <VDatePicker v-model="horaInicial" mode="time" :timezone="timezone" /> -->
                            <input type="time" v-model="horaInicio">

                          </div>
                          <div class="col-md-6 mb-3">
                            <label for="fechaCierre" class="form-label">Fecha de Cierre:</label>
                            <VDatePicker v-model="fechaCierre" mode="date" />
                          </div>
                          <div class="col-md-6 mb-3">
                            <label for="horaCierre" class="form-label">Hora de Cierre:</label>
                            <!-- <VDatePicker v-model="horaCierre" mode="time" :timezone="timezone" /> -->
                            <input type="time" v-model="horaCierre">
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="card-footer">
                      <button type="button" @click="guardarOferta" class="btn btn-success">GUARDAR</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery';
import select2 from 'select2';
select2($);

export default {
  data() {
    return {
      timezone: 'America/Bogota',
      usuarioConectado: false,
      objeto: '',
      descripcion: '',
      moneda: '',
      presupuesto: 0,
      fechaInicio: null,
      horaInicio: null,
      fechaCierre: null,
      horaCierre: null,
      clasificador: null,
      offset: 0,
      limit: 100,
      nombreProducto: '',
      actividadId: '',
    };
  },
  computed: {
    ...mapState(['user']),
    userIdComputed() {
      return this.user.id;
    },

  },
  methods: {
    fetchData(search) {
      this.offset = 0;
      this.loadMoreData(search);
      // console.log('offset:', this.offset);
      // console.log('limit:', this.limit);
      // console.log('nombre_producto:', search);
    },
    loadMoreData(search) {
      this.offset += this.limit;

      this.$axios
        .get('/crud/clasificadorSesion.php', {
          params: {
            offset: this.offset,
            limit: this.limit,
            nombre_producto: search || this.nombre_producto,
          },
        })
        .then((response) => {
          this.clasificador = response.data.results;
          if (response.data.more) {
            this.offset += this.limit;
            this.fetchData(search);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    formatDate(date) {
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return '';
    },
    formatTime(time) {
      if (typeof time === 'string') {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
      }
      return '';
    },

    guardarOferta() {
      const camposRequeridos = [
        'objeto',
        'descripcion',
        'moneda',
        'presupuesto',
        'actividadId',
        'fechaInicio',
        'horaInicio',
        'fechaCierre',
        'horaCierre'
      ];

      if (this.fechaInicio && this.fechaCierre) {
        const fechaInicio = new Date(this.fechaInicio);
        const fechaCierre = new Date(this.fechaCierre);

        if (fechaCierre < fechaInicio) {
          this.$Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha de cierre no puede ser anterior a la fecha de inicio.',
          });
          return;
        }
      }
      // Acceder a los datos del primer formulario
      // console.log("Datos del primer formulario:");
      // console.log(this.objeto);
      // console.log(this.descripcion);
      // console.log(this.moneda);
      // console.log(this.presupuesto);
      // console.log(this.actividadId);

      // Acceder a los datos del segundo formulario
      // console.log("Datos del segundo formulario:");
      // console.log(this.fechaInicio);
      // console.log(this.horaInicio);
      // console.log(this.fechaCierre);
      // console.log(this.horaCierre);

      const camposIncompletos = camposRequeridos.filter((campo) => !this[campo]);

      if (camposIncompletos.length > 0) {
        this.$Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor complete todos los campos del formulario.',
        });
        return;
      }

      const oferta = {
        objeto: this.objeto,
        descripcion: this.descripcion,
        moneda: this.moneda,
        presupuesto: this.presupuesto,
        idclasificador: this.actividadId,
        fecha_inicio: this.formatDate(this.fechaInicio),
        hora_inicio: this.formatTime(this.horaInicio),
        fecha_cierre: this.formatDate(this.fechaCierre),
        hora_cierre: this.formatTime(this.horaCierre),
        idcreador: this.userIdComputed,
      };

      console.log(oferta);

      this.$axios
        .post('/crud/ofertasSesion.php', JSON.stringify(oferta), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          this.$Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Los datos han sido guardados correctamente',
          }).then(() => {
            this.mostrarDocumentos();
          });
        })
        .catch((error) => {
          console.error(error);
          this.$Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar la oferta.',
          });
        });
    },
    mostrarDocumentos() {
      this.$router.push('/documentos');
    },

  },
  mounted() {
    // Select2
    const select2Config = {
      width: '100%',
      minimumInputLength: 0,
      placeholder: 'Por favor seleccione',
      ajax: {
        transport: (params, success, failure) => {
          this.offset = 0;
          this.$axios
            .get('/crud/clasificadorSesion.php', {
              params: {
                offset: this.offset,
                limit: this.limit,
                nombre_producto: params.data.term || '',
              },
            })
            .then((response) => {
              success(response.data);
            })
            .catch((error) => {
              failure(error);
            });
        },
        processResults: (data) => {
          this.offset += this.limit;

          const results = data.map((item) => ({
            id: item.idclasificador,
            text: `${item.nombre_producto} - ${item.nombre_clase} - ${item.nombre_familia} - ${item.nombre_segmento}`,
          }));

          return {
            results: results,
            more: true,
          };
        },
      },
    };

    const self = this;

    $('#actividadOferta').select2(select2Config);
    $('#actividadOferta').on('select2:opening', function (event) {
      const $searchField = $(this).parent().find('.select2-search__field');

      $searchField.off('input');

      $searchField.on('input', function () {
        const searchValue = $(this).val();
        self.fetchData(searchValue);
      });
    });

    // capturo el id
    $('#actividadOferta').on('change', function () {
      self.actividadId = $(this).val();
    });

    // tabs
    const tabLinks = document.querySelectorAll('.tabs a');
    const tabPanels = document.querySelectorAll('.tabs-panel');
    for (let el of tabLinks) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.tabs li.active').classList.remove('active');
        document.querySelector('.tabs-panel.active').classList.remove('active');

        const parentListItem = el.parentElement;
        parentListItem.classList.add('active');
        const index = [...parentListItem.parentElement.children].indexOf(
          parentListItem
        );

        const panel = [...tabPanels].filter(
          (el) => el.getAttribute('data-index') == index
        );
        panel[0].classList.add('active');
      });
    }
  },
};
</script>
