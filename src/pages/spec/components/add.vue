<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="规格名称" :label-width="width">
          <el-input v-model="form.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="规格属性"
          :label-width="width"
          v-for="(item,index) in attrArr"
          :key="index"
        >
          <el-row>
            <el-col :span="18">
              <el-input v-model="item.value"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" v-if="index==0" @click="addAttr">新增规格属性</el-button>
              <el-button type="danger" v-else @click="del(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "spec/list"
    })
  },
  data() {
    return {
      attrArr: [
        {
          value: ""
        }
      ],
      width: "100px",
      form: {
        specsname: "",
        attrs: "",
        status: 1
      }
    };
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqListAction",
      reqTotal: "spec/reqListNum",
      changePageAction: "spec/changePageAction"
    }),
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    del(index) {
      this.attrArr.splice(index, 1);
    },
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1
      };
      this.attrArr = [{ value: "" }];
    },
    add() {
      this.form.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqTotal();
          this.changePageAction(1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },

    //查看一条数据
    look(id) {
      reqSpecsDetail({ id: id }).then(res => {
        this.form = res.data.list[0];
        this.attrArr = JSON.parse(this.form.attrs).map(item => ({
          value: item
        }));
      });
    },
    update() {
      this.form.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.$emit("hide");
          this.empty();
          // this.reqList();
          this.changePageAction(1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //弹框关闭完成
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>