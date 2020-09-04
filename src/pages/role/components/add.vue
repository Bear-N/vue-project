<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" :label-width="width" prop="rolename">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="width">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children:'children',label:'title'}"
          ></el-tree>
        </el-form-item>
        <el-form-item label="角色状态" :label-width="width">
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
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../util/alert";
import {
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate
} from "../../../util/request";
export default {
  computed: {
    ...mapGetters({
      menuList: "menu/list",
      user: "user/info"
    })
  },
  props: ["info"],
  components: {},
  data() {
    return {
      width: "100px",
      form: {
        rolename: "",
        menus: [],
        status: 1
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      reqMenuList: "menu/reqListAction",
      reqRoleList: "role/reqListAction",
      changeInfoAction: "user/changeInfoAction"
    }),
    //点击取消
    cancel() {
      this.info.isShow = false;
    },

    //弹框消失
    close() {
      !this.info.isAdd && this.empty();
      this.$refs.form.clearValidate();
    },

    //数据重置
    empty() {
      this.form = {
        rolename: "",
        menus: [],
        status: 1
      };
      //重置树形控件
      this.$refs.tree.setCheckedKeys([]);
    },

    //点击添加
    add() {
      if (this.form.rolename == "") {
        warningAlert("角色名称不能为空");
      } else {
        // this.$refs.tree.getCheckedKeys() 获取树形控件上的选中的key
        this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());

        reqRoleAdd(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //数据重置
            this.empty();
            //刷新角色列表的数据
            this.reqRoleList();
          } else {
            warningAlert(res.data.msg);
          }
        });
      }
    },

    //查询数据
    look(id) {
      // this.$refs.ruleForm.clearValidate();
      reqRoleDetail({ id: id }).then(res => {
        this.form = res.data.list;
        this.form.id = id;
        this.$refs.tree.setCheckedKeys(JSON.parse(res.data.list.menus));
      });
    },

    //点击更新
    update() {
      if (this.form.rolename == "") {
        warningAlert("角色名称不能为空");
      } else {
        this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleUpdate(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert("修改成功");
            if (this.form.id == this.user.roleid) {
              this.changeInfoAction({});
              this.$router.replace("/login");
              return;
            }
            this.cancel();
            this.empty();
            this.reqRoleList();
          } else {
            warningAlert(res.data.msg);
          }
        });
      }
    }
  },
  mounted() {
    if (this.menuList.length == 0) {
      this.reqMenuList();
    }
  }
};
</script>
<style scoped>
</style>