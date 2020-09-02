<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="规格编号" sortable width="180"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable width="180"></el-table-column>
      <el-table-column label="规格属性">
        <template slot-scope="scope">
          <el-tag type="success" v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <v-del @confirm="del(scope.row.id)"></v-del>
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
import { reqSpecsDel } from "../../../util/request";
export default {
  computed: {
    ...mapGetters({
      list: "spec/list",
      size: "spec/size",
      total: "spec/total",
      page: "spec/page"
    })
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqListAction",
      reqTotal: "spec/reqListNum",
      changePageAction: "spec/changePageAction"
    }),
    changeCurrentPage(p) {
      this.changePageAction(p);
    },
    edit(id) {
      this.$emit("emit", id);
    },
    //删除
    del(id) {
      reqSpecsDel({ id: id }).then(res => {
        if (res.data.code == 200) {
          successAlert("删除成功");
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