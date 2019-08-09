<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <Debug msg="Debugger" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Debug from "./components/Debug.vue";
import axios from "axios";

console.log(typeof vm);
export default {
  name: "app",
  components: {
    // HelloWorld,
    Debug
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
