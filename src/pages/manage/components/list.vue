<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="用户编号" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="用户名称" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="所属角色" sortable width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <v-del @confirm="del(scope.row.uid)"></v-del>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="size"
      :current-page="page"
      layout="prev, pager, next"
      :total="total"
      @current-change="changeCurrentPage"
    ></el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../util/alert";
import { reqUserDel } from "../../../util/request";
export default {
  computed: {
    ...mapGetters({
      list: "manage/list",
      size: "manage/size",
      total: "manage/total",
      page: "manage/page"
    })
  },
  methods: {
    ...mapActions({
      reqList: "manage/reqListAction",
      reqTotal: "manage/reqListNum",
      changePageAction: "manage/changePageAction"
    }),
    changeCurrentPage(p) {
      this.changePageAction(p);
    },
    edit(id) {
      this.$emit("emit", id);
    },
    //删除

    del(id) {
      reqUserDel({ uid: id }).then(res => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          //删除完成，重新取总数，page设置为1
          this.reqTotal();
          this.changePageAction(1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.reqList();
    this.reqTotal();
  }
};
</script>
<style scoped>
</style>