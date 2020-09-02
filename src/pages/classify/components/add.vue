<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="上级分类" :label-width="width">
          <el-select v-model="form.pid">
            <el-option value label="--请选择--" disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="width">
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="width" v-if="form.pid!=0">
          <div class="upload-box">
            <h3 class="upload-add">+</h3>
            <img class="upload-img" :src="imgUrl" v-if="imgUrl" alt />
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
  reqCateAdd,
  reqCateDetail,
  reqCateUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  data() {
    return {
      imgUrl: "",
      width: "100px",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1
      }
    };
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqListAction"
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
      this.imgUrl=URL.createObjectURL(file);
      this.form.img=file;
    },
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        pid: 0,
        catename: "",
        img: null,
        status: 1
      };
      this.imgUrl = "";
    },
    add() {
      reqCateAdd(this.form).then(res => {
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
      reqCateDetail({ id: id }).then(res => {
        this.form = res.data.list;
        this.form.id=id;//
        this.imgUrl=this.$preImg+res.data.list.img;
      });
    },
    update() {
      reqCateUpdate(this.form).then(res => {
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
  }
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