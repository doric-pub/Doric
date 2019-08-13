<template>
  <div class="context">
    <el-page-header @back="goBack"></el-page-header>
    <el-container class="container">
      <el-aside class="aside">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Context info</span>
            <el-button @click="debug" style="float: right; padding: 3px 0" type="text">Debug</el-button>
          </div>
          <p>
            ID:
            <span>{{id}}</span>
          </p>
          <p>
            Source:
            <span>{{source}}</span>
          </p>
        </el-card>
      </el-aside>
      <el-main>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Running</span>
          </div>
          <div class="script">
            <pre class="language-js"> <code v-html="script"></code></pre>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
console.log(`ws://${window.location.host}`);
import axios from "axios";
export default {
  name: "Context",
  data: function() {
    return {
      id: this.$route.params.id,
      source: this.$route.params.id,
      script: ""
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    debug() {
      console.log("debug");
    }
  },
  mounted: function() {
    console.log("mounted");
    axios.get(`/api/context?id=${this.$route.params.id}`).then(res => {
      this.source = res.data.source;
      this.script = res.data.script;
      console.log(this.script);
    });
  },
  updated: function() {
    Prism.highlightAll();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  font-size: 120%;
}

p span {
  color: #409eff;
}
.context {
  font-size: 100%;
}
.container {
  margin-top: 30px;

  margin-left: 30px;
}
.aside {
  text-align: left;
  padding-left: 10px;
}
.script {
  text-align: left;
  font-size: 50%;
}
</style>
