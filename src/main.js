import { createApp } from 'vue';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import axios from 'axios';
import App from './App.vue';
import router from './router/index';
import store from './store';
import Swal from 'sweetalert2';
import $ from 'jquery';
import * as XLSX from 'xlsx';

// css
import 'v-calendar/style.css';
import './assets/css/reset.css';
import './assets/css/style.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'select2/dist/css/select2.min.css';
// js
import './assets/js/scripts.js';
import 'select2/dist/js/select2.min.js';

const app = createApp(App);

app.use(setupCalendar, {})
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

// Configuración global axios
app.config.globalProperties.$axios = axios;

// Configuración del servidor
axios.defaults.baseURL = 'http://localhost/apisuplos/api';

// Configuración global para Header y Footer
app.config.globalProperties.mostrarHeaderFooter = true;

// Configuración global para sweetalert2
app.config.globalProperties.$Swal = Swal;

// Configuración global para Select2 y jQuery
app.config.globalProperties.$select2 = $;

// Libreria para Excel
app.config.globalProperties.$XLSX = XLSX;

app.use(router);
app.use(store);
app.mount('#app');
