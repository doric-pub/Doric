<template>
  <div class="hello">
    <img alt="Vue logo" width="200px" src="../assets/doric.svg" />
    <h1>{{ title }}</h1>
    <p>
      Dev tools for doric.
      <br />
      <a href="https://github.com/penfeizhou/doric" target="_blank" rel="noopener">Doric</a>.
    </p>
    <h3>Running Contexts</h3>
    <ul>
      <li v-for="item in runningContexts" :key="item.id">
        <!-- <a v-bind:href="'#context/'+item.source">source: {{item.source}} id: {{item.id}}</a> -->
        <router-link v-bind:to="'/context/' + item.id">{{item.source}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Debug",
  props: {
    title: String
  },
  data: () => {
    return {
      runningContexts: [{ source: "contextSource", id: "contexId" }]
    };
  },
  methods: {
    getRunningContexts: function() {
      axios.get("/api/allContexts").then(res => {
        this.runningContexts = res.data;
      });
    }
  },
  mounted: function() {
    this.getRunningContexts();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
