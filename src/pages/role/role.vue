<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 列表 -->
    <v-list @edit="edit"></v-list>

    <!-- 添加弹框 -->
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
import vList from "./components/list"
import vAdd from "./components/add"
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isShow: false,
        title: "添加角色",
        isAdd: true
      }
    };
  },
  methods: {
    //点击了添加按钮
    willAdd() {
      this.info = {
        isShow: true,
        title: "添加角色",
        isAdd: true
      };
    },
    edit(id) {
      this.info = {
        isShow: true,
        title: "修改角色",
        isAdd: false
      };
      this.$refs.add.look(id);
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>