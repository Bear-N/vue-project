<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="标题" :label-width="width" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="width">
          <div class="upload-box">
            <h3 class="upload-add">+</h3>
            <img class="upload-img" :src="imgUrl" alt />
            <input class="upload-file" @change="selectImg" type="file" />
          </div>
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
  reqBannerAdd,
  reqBannerDetail,
  reqBannerUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "banner/list"
    })
  },
  data() {
    return {
      imgUrl: "",
      width: "100px",
      form: {
        title: "",
        img: null,
        status: 1
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqListAction"
    }),
    selectImg(e) {
      // console.log(e);
      var file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件格式不能超过2M");
        return;
      }
      let imgTypeArr = [".jpg", ".jpeg", ".png", ".gif"];
      var extname = file.name.slice(file.name.lastIndexOf("."));
      if (!imgTypeArr.includes(extname)) {
        warningAlert("请上传正确的图片格式");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        title: "",
        img: null,
        status: 1
      };
      this.imgUrl = "";
    },
    add() {
      if (this.form.title == "") {
        warningAlert("标题不能为空");
      } else if (this.form.img == null) {
        warningAlert("图片不能为空");
      } else {
        reqBannerAdd(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert(res.data.msg);
            this.cancel();
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
      reqBannerDetail({ id: id }).then(res => {
        this.form = res.data.list;
        // this.form.id=id;//
        this.imgUrl = this.$preImg + res.data.list.img;
      });
    },
    update() {
      if (this.form.title == "") {
        warningAlert("标题不能为空");
      } else if (this.form.img == null) {
        warningAlert("图片不能为空");
      } else {
        reqBannerUpdate(this.form).then(res => {
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
.upload-box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.upload-add {
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  font-size: 40px;
  color: #666;
  font-weight: 400;
}
.upload-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.upload-file {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>