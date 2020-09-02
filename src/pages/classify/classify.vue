<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 数据列表  -->
    <v-list @emit="emit($event)"></v-list>

    <!-- 添加弹框 -->
    <v-add :info="info" @hide="hide" ref="add"></v-add>
  </div>
</template>
<script>
import vList from "./components/list"
import vAdd from "./components/add"
export default {
components:{
    vList,
    vAdd
},
data(){
return {
    info:{
        isShow:false,
        title:"添加分类",
        isAdd:true
    }
}
},
methods:{
    willAdd(){
        this.info={
            isShow:true,
            title:"添加分类",
            isAdd:true
        }
    },
    hide(){
        this.info.isShow=false;
    },
    emit(id){
        this.info={
            isShow:true,
            title:"修改分类",
            isAdd:false
        },
        this.$refs.add.look(id)
    }
},
mounted(){
}
}
</script>
<style scoped>
</style>