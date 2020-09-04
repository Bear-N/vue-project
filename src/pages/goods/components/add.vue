<template>
  <div>
    <el-dialog
      :title="info.title"
      :visible.sync="info.isShow"
      @closed="close"
      @opened="createEditor"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="一级分类" :label-width="width">
          <el-select v-model="form.first_cateid" @change="changeFirstId">
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in catelist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="width">
          <el-select v-model="form.second_cateid">
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="width" prop="goodsname">
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="width" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" :label-width="width" prop="market_price">
          <el-input v-model="form.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="width">
          <div class="upload-box">
            <h3 class="upload-add">+</h3>
            <img class="upload-img" :src="imgUrl" v-if="imgUrl" alt />
            <input class="upload-file" @change="selectImg" type="file" />
          </div>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="width">
          <el-select v-model="form.specsid" @change="changeSpecId">
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" :label-width="width">
          <el-select v-model="form.specsattr" multiple>
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option v-for="item in attrList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" :label-width="width">
          <el-radio :label="1" v-model="form.isnew">是</el-radio>
          <el-radio :label="2" v-model="form.isnew">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" :label-width="width">
          <el-radio :label="1" v-model="form.ishot">是</el-radio>
          <el-radio :label="2" v-model="form.ishot">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="width">
          <div id="editor"></div>
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
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
import E from "wangeditor";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      catelist: "cate/list",
      specList: "spec/list"
    })
  },
  data() {
    return {
      //二级分类的列表
      secondCateList: [],
      //规格属性的列表
      attrList: [],
      //图片临时地址
      imgUrl: "",
      width: "100px",
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1
      },
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqListAction",
      reqSpecList: "spec/reqListAction",
      reqList: "goods/reqListAction",
      reqTotal: "goods/reqListNum",
      changePageAction: "goods/changePageAction"
    }),

    //创建编辑器
    createEditor() {
      this.editor = new E("#editor");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
    //修改一级分类
    changeFirstId() {
      this.secondCateList = this.catelist.find(
        item => item.id == this.form.first_cateid
      ).children;
      this.form.second_cateid = "";
    },
    //修改商品规格
    changeSpecId() {
      this.attrList = this.specList.find(
        item => item.id == this.form.specsid
      ).attrs;
      this.form.specsattr = [];
    },
    selectImg(e) {
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
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1
      };
      //二级分类的列表
      this.secondCateList = [];
      //规格属性的列表
      this.attrList = [];
      //图片临时地址
      this.imgUrl = "";
    },
    add() {
      if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
      } else if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
      } else if (this.form.goodsname == "") {
        warningAlert("商品名称不能为空");
      } else if (this.form.price == "") {
        warningAlert("价格不能为空");
      } else if (this.form.market_price == "") {
        warningAlert("市场价格不能为空");
      } else if (this.form.img == null) {
        warningAlert("图片不能为空");
      } else if (String(this.form.specsid) == "") {
        warningAlert("商品规格不能为空");
      } else if (this.form.specsattr == "") {
        warningAlert("规格属性不能为空");
      } else {
        this.form.description = this.editor.txt.html();
        reqGoodsAdd(this.form).then(res => {
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
      }
    },

    //查看一条数据
    look(id) {
      reqGoodsDetail({ id: id }).then(res => {
        this.form = res.data.list;
        this.form.id = id; //
        this.imgUrl = this.$preImg + res.data.list.img;
        this.form.specsattr = this.form.specsattr.split(",");
        this.secondCateList = this.catelist.find(
          item => item.id == this.form.first_cateid
        ).children;
        this.attrList = this.specList.find(
          item => item.id == this.form.specsid
        ).attrs;
      });
    },
    update() {
      if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
      } else if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
      } else if (this.form.goodsname == "") {
        warningAlert("商品名称不能为空");
      } else if (this.form.price == "") {
        warningAlert("价格不能为空");
      } else if (this.form.market_price == "") {
        warningAlert("市场价格不能为空");
      } else if (this.form.img == null) {
        warningAlert("图片不能为空");
      } else if (String(this.form.specsid) == "") {
        warningAlert("商品规格不能为空");
      } else if (this.form.specsattr == "") {
        warningAlert("规格属性不能为空");
      } else {
        this.form.description = this.editor.txt.html();

        reqGoodsUpdate(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.$emit("hide");
            this.empty();
            this.changePageAction(1);
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
  mounted() {
    if (this.catelist.length == 0) {
      this.reqCateList();
    }
    this.reqSpecList(true);
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