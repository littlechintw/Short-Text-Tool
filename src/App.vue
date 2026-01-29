<template>
  <div id="app">
    <header class="app-header">
      <h1>Short Text Tool</h1>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} Copyright <a href="https://littlechintw.github.io">littlechin.tw</a>. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #e0e0e0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.app-header h1 {
  color: #00d4ff;
  font-size: 2rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.app-main {
  flex: 1;
  padding: 2rem 1rem;
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  text-align: center;
  color: #888;
}

.app-footer a {
  color: #00d4ff;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
