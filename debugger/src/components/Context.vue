<template>
  <div class="context">
    <el-page-header @back="goBack" v-bind:content="'Context: '+$route.params.id"></el-page-header>
    <el-container>
      <el-aside>
        <h3>Context info</h3>
        <p>ID:{{$route.params.id}}</p>
        <p>Source:{{$route.params.id}}</p>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Context",
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  /* margin: 40px 0 0; */
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
