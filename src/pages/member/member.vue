<template>
  <div>
    <!-- 数据列表  -->
    <v-list @emit="emit($event)"></v-list>

    <!-- 添加弹框 -->
    <v-add :info="info" @hide="hide" ref="add"></v-add>
  </div>
</template>
<script>
import vList from "./components/list";
import vAdd from "./components/add";
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isShow: false,
        title: "添加菜单",
        isAdd: true
      }
    };
  },
  methods: {
    hide() {
      this.info.isShow = false;
    },
    emit(id) {
      (this.info = {
        isShow: true,
        title: "修改菜单",
        isAdd: false
      }),
        this.$refs.add.look(id);
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>