<template>
  <div class="home">
    <img alt="Vue logo" width="200px" src="../assets/doric.svg" />
    <h1>{{ title }}</h1>
    <p>
      Dev tools for doric.
      <br />
      <el-link href="https://github.com/penfeizhou/doric" type="primary">Doric</el-link>
    </p>
    <h3>Running Contexts</h3>
    <ul>
      <li v-for="item in runningContexts" :key="item.id">
        <el-link type="success" v-bind:href="'#/context/' + item.id">{{item.source}}</el-link>
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
div {
  font-size: 200%;
}
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
  font-size: 100%;
  color: #42b983;
}
</style>
