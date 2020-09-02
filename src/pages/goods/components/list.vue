<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="商品编号"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$preImg+scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="是否新品">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew">是</el-button>
          <el-button type="info" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.ishot">是</el-button>
          <el-button type="info" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" sortable width="200">
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
import { reqGoodsDel } from "../../../util/request";
export default {
  computed: {
    ...mapGetters({
      list: "goods/list",
      size: "goods/size",
      total: "goods/total",
      page: "goods/page"
    })
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqListAction",
      reqTotal: "goods/reqListNum",
      changePageAction: "goods/changePageAction"
    }),
    edit(id) {
      this.$emit("emit", id);
    },
    changeCurrentPage(p) {
      this.changePageAction(p);
    },
    //删除
    del(id) {
      reqGoodsDel({ id: id }).then(res => {
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
img {
  width: 80px;
  height: 80px;
}
</style>