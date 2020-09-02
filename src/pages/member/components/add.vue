<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="width">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="width">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="width">
          <el-input v-model="form.password" autocomplete="off"></el-input>
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
import { indexRoutes } from "../../../router";
import {
  reqMemberDetail,
  reqMemberUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "member/list"
    })
  },
  data() {
    return {
      width: "100px",
      indexRoutes: indexRoutes,
      form: {
        phone: "",
        nickname: "",
        password: "",
        status: 1
      }
    };
  },
  methods: {
    ...mapActions({
      reqList: "member/reqListAction",
    }),
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        phone: "",
        nickname: "",
        password: "",
        status: 1
      };
    },
    add() {
      reqUserAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },

    //查看一条数据
    look(id) {
      reqMemberDetail({ uid: id }).then(res => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
    update() {
      reqMemberUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.$emit("hide");
          this.empty();
          this.reqList();
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
  mounted() {
    if (this.list.length == 0) {
      this.reqList();
    }
  }
};
</script>
<style scoped>
</style>