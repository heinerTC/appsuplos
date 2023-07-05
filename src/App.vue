<template>
  <HeaderView v-if="mostrarHeader"></HeaderView>

  <div class="main-content">
    <RouterView></RouterView>
  </div>

  <FooterView v-if="mostrarFooter"></FooterView>
</template>

<script>
import HeaderView from "./components/HeaderView.vue";
import FooterView from "./components/FooterView.vue";

export default {
  name: "App",
  components: {
    HeaderView,
    FooterView
  },
  computed: {
    mostrarHeader() {
      const mostrarHeaderFooter = this.$route.meta.mostrarHeaderFooter;
      const authenticated = this.$store.state.authenticated;

      return mostrarHeaderFooter !== false && authenticated;
    },
    mostrarFooter() {
      const mostrarHeaderFooter = this.$route.meta.mostrarHeaderFooter;
      const authenticated = this.$store.state.authenticated;

      return mostrarHeaderFooter !== false && authenticated;
    }
  }
};
</script>


