<template>
  <div class="context">
    <el-page-header @back="goBack"></el-page-header>
    <el-container class="container">
      <el-aside>
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
          <div class="script" ref="editor"></div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { StandaloneCodeEditorServiceImpl } from "monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl.js";

export default {
  name: "Context",
  data: function() {
    return {
      id: this.$route.params.id,
      source: this.$route.params.id,
      script: "",
      editor: null,
      curTheme: "vs"
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: "/" });
    },
    debug() {
      console.log("debug");
      axios
        .post(`/api/reload?id=${this.$route.params.id}`, {
          contextId: this.$route.params.id,
          script: this.editor.getValue()
        })
        .then(function(response) {
          console.log("post result:", response);
        });
    }
  },
  mounted: function() {
    console.log("mounted");
    axios.get(`/api/context?id=${this.$route.params.id}`).then(res => {
      this.source = res.data.source;
      this.script = res.data.script;
      this.editor.setValue(this.script);
    });
    this.editor = monaco.editor.create(this.$refs.editor, {
      theme: this.curTheme,
      automaticLayout: true,
      language: "javascript"
    });
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
  font-size: 100%;
  height: fill-available;
}
</style>
