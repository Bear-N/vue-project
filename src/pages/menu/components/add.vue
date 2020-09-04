<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="菜单名称" :label-width="width" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="width">
          <el-select v-model="form.pid" placeholder="请选择活动区域" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="width">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="width" v-if="form.type==1" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择目录图标">
            <el-option value="el-icon-setting">
              <i class="el-icon-setting"></i>
            </el-option>
            <el-option value="el-icon-goods">
              <i class="el-icon-goods"></i>
            </el-option>
            <el-option value="el-icon-user">
              <i class="el-icon-user"></i>
            </el-option>
            <el-option value="el-icon-camera">
              <i class="el-icon-camera"></i>
            </el-option>
          </el-select>
          {{form.url}}
        </el-form-item>
        <el-form-item label="菜单地址" :label-width="width" v-else prop="url">
          <el-select v-model="form.url">
            <el-option value label="--请选择--" disabled></el-option>
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
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
  reqAddMenu,
  reqMenuDetail,
  reqMenuUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "menu/list"
    })
  },
  data() {
    return {
      width: "100px",
      indexRoutes: indexRoutes,
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      },
      //规则
      rules: {
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      reqList: "menu/reqListAction"
    }),
    cancel() {
      this.$emit("hide");
    },
    changePid() {
      this.form.type = this.form.pid == 0 ? 1 : 2;
    },
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      };
    },
    add() {
      if (this.form.title == "") {
        warningAlert("菜单名称不能为空");
      } else if (this.form.icon == "" && this.form.type == 1) {
        warningAlert("菜单图标不能为空");
      } else if (this.form.url == "" && this.form.type == 2) {
        warningAlert("菜单地址不能为空");
      } else {
        reqAddMenu(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert(res.data.msg);
            this.$emit("hide");
            this.empty();
            this.reqList();
          } else {
            warningAlert(res.data.msg);
          }
        });
      }
    },

    //查看一条数据
    look(id) {
      reqMenuDetail({ id: id }).then(res => {
        this.form = res.data.list;
        this.form.id = id;
      });
    },
    update() {
      if (this.form.title == "") {
        warningAlert("菜单名称不能为空");
      } else if (this.form.icon == "" && this.form.type == 1) {
        warningAlert("菜单图标不能为空");
      } else if (this.form.url == "" && this.form.type == 2) {
        warningAlert("菜单地址不能为空");
      } else {
        reqMenuUpdate(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.$emit("hide");
            this.empty();
            this.reqList();
          } else {
            warningAlert(res.data.msg);
          }
        });
      }
    },
    //弹框关闭完成
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
      this.$refs.form.clearValidate();
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>