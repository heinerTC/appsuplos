<template>
    <div class="container">
        <div class="row">
            <div class="card">
                <div class="card-header">
                    <h5>Consultar Formulario</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="busquedaId" class="form-label">ID:</label>
                        <select class="form-select" id="busquedaId" v-model="busquedaId"
                            @change="limpiarComboboxObjetoComprador">
                            <option value="">Por favor seleccione</option>
                            <option v-for="id in ids" :value="id" :key="id">{{ id }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="busquedaObjetoDescripcion" class="form-label">Objeto/Descripción:</label>
                        <select class="form-select" id="busquedaObjetoDescripcion" v-model="busquedaObjetoDescripcion"
                            @change="limpiarComboboxIDComprador">
                            <option value="">Por favor seleccione</option>
                            <option v-for="oferta in ofertas" :value="oferta" :key="oferta">{{ oferta }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="busquedaComprador" class="form-label">Comprador:</label>
                        <select class="form-select" id="busquedaComprador" v-model="busquedaComprador"
                            @change="limpiarComboboxIDObjeto">
                            <option value="">Por favor seleccione</option>
                            <option v-for="comprador in compradores" :value="comprador.id" :key="comprador.id">{{
                                comprador.nombre }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="busquedaEstado" class="form-label">Estado:</label>
                        <select class="form-select" id="busquedaEstado" v-model="busquedaEstado">
                            <option value="todos" selected>Todos</option>
                            <option value="activo">Activo</option>
                            <option value="publicado">Publicado</option>
                            <option value="evaluacion">Evaluación</option>
                        </select>
                    </div>

                    <div class="mb-3 d-flex justify-content-between">
                        <div class="mb-3">
                            <button type="button" class="btn btn-primary" @click="buscarFormularios">Buscar</button>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-success" @click="exportarExcel">Exportar a Excel</button>
                        </div>
                    </div>


                    <div class="overflow-scroll">
                        <table class="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Objeto</th>
                                    <th>Descripción</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Cierre</th>
                                    <th>Estado</th>
                                    <th>Responsable del Evento</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="formulario in formularios" :key="formulario.id">
                                    <td>{{ formulario.idofertas }}</td>
                                    <td>{{ formulario.objeto }}</td>
                                    <td>{{ formulario.descripcion }}</td>
                                    <td>{{ formulario.fecha_inicio }}</td>
                                    <td>{{ formulario.fecha_cierre }}</td>
                                    <td>{{ formulario.estado }}</td>
                                    <td>{{ formulario.responsable }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            busquedaId: '',
            busquedaObjetoDescripcion: '',
            busquedaComprador: '',
            busquedaEstado: "todos",
            formularios: [],
            compradores: [],
            ofertas: [],
            ids: [],
        };
    },
    mounted() {
        this.obtenerCompradores();
        this.obtenerIds();
        this.obtenerOfertas();
    },
    methods: {
        limpiarComboboxObjetoComprador() {
            this.busquedaObjetoDescripcion = "";
            this.busquedaComprador = "";
        },
        limpiarComboboxIDComprador() {
            this.busquedaId = "";
            this.busquedaComprador = "";
        }, limpiarComboboxIDObjeto() {
            this.busquedaId = "";
            this.busquedaObjetoDescripcion = "";
        },
        extractObjeto(oferta) {
            const partes = oferta.split(' - ');
            return partes[0];
        },
        obtenerOfertas() {
            this.$axios
                .get('/crud/consultas/getObjetoOfertas.php')
                .then((response) => {
                    console.log(response.data); // Agrega esta línea
                    this.ofertas = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        obtenerCompradores() {
            this.$axios
                .get('/crud/consultas/getCreadorOfertas.php')
                .then((response) => {
                    this.compradores = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        obtenerIds() {
            this.$axios
                .get('/crud/consultas/getIDOfertas.php')
                .then((response) => {
                    this.ids = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        buscarFormularios() {
            const objeto = this.busquedaObjetoDescripcion.split(' - ')[0];
            // console.log(objeto)
            const params = {
                id: this.busquedaId,
                objetoDescripcion: objeto,
                comprador: this.busquedaComprador,
                estado: this.busquedaEstado,
            };
            this.$axios
                .get('/crud/consultarSesion.php', { params })
                .then((response) => {
                    // console.log(response.data)
                    this.formularios = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        exportarExcel() {
            const XLSX = this.$XLSX;

            // Verificar si hay datos en la tabla
            if (this.formularios.length === 0) {
                this.$Swal.fire({
                    icon: 'info',
                    title: 'No hay datos',
                    text: 'No hay datos para exportar a Excel.',
                });
                return;
            }

            // Mapear los datos y agregar campos adicionales
            const datosExportar = this.formularios.map(formulario => {
                const { idofertas, responsable, objeto, descripcion, moneda, presupuesto, codigo_segmento_actividad,
                    nombre_segmento_actividad,
                    codigo_familia_actividad,
                    nombre_familia_actividad,
                    codigo_clase_actividad,
                    nombre_clase_actividad,
                    codigo_producto_actividad,
                    nombre_producto_actividad, fecha_inicio, hora_inicio, fecha_cierre, estado } = formulario;

                // Concatenar todos los campos con actividad
                const actividad = `${codigo_segmento_actividad}, ${nombre_segmento_actividad}, ${codigo_familia_actividad}, ${nombre_familia_actividad}, ${codigo_clase_actividad}, ${nombre_clase_actividad}, ${codigo_producto_actividad}, ${nombre_producto_actividad}`;

                return {
                    'ID oferta': idofertas,
                    'Creador oferta': responsable,
                    'Objeto': objeto,
                    'Actividad': actividad,
                    'Descripción': descripcion,
                    'Moneda': moneda,
                    'Presupuesto': presupuesto, // Reemplaza '' con la lógica para obtener el valor de presupuesto
                    'Fecha de inicio': fecha_inicio,
                    'Hora de inicio': hora_inicio, // Reemplaza '' con la lógica para obtener el valor de hora de inicio
                    'Fecha de cierre': fecha_cierre,
                    'Estado': estado
                };
            });

            console.log(datosExportar);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(datosExportar, {
                header: [
                    'ID oferta',
                    'Creador oferta',
                    'Objeto',
                    'Actividad',
                    'Descripción',
                    'Moneda',
                    'Presupuesto',
                    'Fecha de inicio',
                    'Hora de inicio',
                    'Fecha de cierre',
                    'Estado'
                ]
            });

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de ofertas');
            XLSX.writeFile(workbook, 'reporte_ofertas.xlsx');
        },





    },
};
</script>
  