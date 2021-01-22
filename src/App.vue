<template>
  <div id="app">
    <v-app>
      <v-app-bar app dark>
        <v-toolbar-title>Short Text Tool</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-content>
        <router-view />
      </v-content>

      <v-footer padless class="font-weight-medium">
        <v-col class="text-center" cols="12" style="font-size: 14px">
          &copy; {{ new Date().getFullYear() }} Copyright
          <a href="https://littlechintw.github.io">littlechintw.github.io</a>.
          All rights reserved.
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
