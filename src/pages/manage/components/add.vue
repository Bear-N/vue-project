<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="所属角色" :label-width="width">
          <el-select v-model="form.roleid">
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" :label-width="width">
          <el-input v-model="form.username" autocomplete="off"></el-input>
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
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      roleList: "role/list"
    })
  },
  data() {
    return {
      width: "100px",
      indexRoutes: indexRoutes,
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1
      }
    };
  },
  methods: {
    ...mapActions({
      reqRoleList: "role/reqListAction",
      reqUserList: "manage/reqListAction",
      reqTotal:"manage/reqListNum",
      changePageAction: "manage/changePageAction"
    }),
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        roleid: "",
        username: "",
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
          this.reqTotal();
          this.changePageAction(1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },

    //查看一条数据
    look(id) {
      reqUserDetail({ uid: id }).then(res => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
    update() {
      reqUserUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.$emit("hide");
          this.empty();
          this.reqUserList();
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
    if (this.roleList.length == 0) {
      this.reqRoleList();
    }
  }
};
</script>
<style scoped>
</style>