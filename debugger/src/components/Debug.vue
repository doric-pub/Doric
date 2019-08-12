<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <p>
      Dev tools for doric.
      <br />
      <a href="https://github.com/penfeizhou/doric" target="_blank" rel="noopener">Doric</a>.
    </p>
    <h3>Running Contexts</h3>
    <ul>
      <li v-for="item in runningContexts" :key="item.id">
        <a>source: {{item.source}} id: {{item.id}}</a>
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
      runningContexts: [{ source: "xxxx", id: "xxx" }]
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
