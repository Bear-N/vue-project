<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="活动名称" :label-width="width" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" :label-width="width">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="chooseTimeRange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" :label-width="width" prop="first_cateid">
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
        <el-form-item label="二级分类" :label-width="width" prop="second_cateid">
          <el-select v-model="form.second_cateid" @change="changeSecondId">
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
        <el-form-item label="商品" :label-width="width" prop="goodsid">
          <el-select v-model="form.goodsid">
            <el-option value label="--请选择--" disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in thiredList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
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
import {
  reqSeckAdd,
  reqSeckDetail,
  reqSeckUpdate
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      catelist: "cate/list",
      goodslist: "goods/list",
      secklist: "seckill/list"
    })
  },
  data() {
    return {
      //二级分类列表
      secondCateList: [],
      //三级商品列表
      thiredList: [],
      width: "100px",
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      time: null,
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqListAction",
      reqGoodsList: "goods/reqListAction",
      reqSeckList: "seckill/reqListAction"
    }),
    //修改一级分类
    changeFirstId() {
      this.secondCateList = this.catelist.find(
        item => item.id == this.form.first_cateid
      ).children;
      this.form.second_cateid = "";
      this.form.goodsid = "";
    },
    //修改二级分类
    changeSecondId() {
      this.thiredList = this.goodslist.filter(
        item => item.second_cateid == this.form.second_cateid
      );

      this.form.goodsid = "";
    },
    cancel() {
      this.info.isShow = false;
    },
    empty() {
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
      //二级分类的列表
      this.secondCateList = [];
      this.thiredList = [];
    },
    add() {
      if (this.form.title == "") {
        warningAlert("活动名称不能为空");
      } else if (this.form.begintime == "" || this.form.endtime == "") {
        warningAlert("活动期限不能为空");
      } else if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
      } else if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
      } else if (this.form.goodsid == "") {
        warningAlert("商品不能为空");
      } else {
        reqSeckAdd(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert(res.data.msg);
            this.cancel();
            this.empty();
            this.reqSeckList();
          } else {
            warningAlert(res.data.msg);
          }
        });
      }
    },

    //查看一条数据
    look(id) {
      reqSeckDetail({ id: id }).then(res => {
        this.form = res.data.list;
        this.time = [
          new Date(parseInt(this.form.begintime)),
          new Date(parseInt(this.form.endtime))
        ];
        this.form.id = id;
        this.secondCateList = this.catelist.find(
          item => item.id == this.form.first_cateid
        ).children;
        this.thiredList = this.goodslist.filter(
          item => item.second_cateid == this.form.second_cateid
        );
      });
    },
    update() {
      if (this.form.title == "") {
        warningAlert("活动名称不能为空");
      } else if (this.form.begintime == "" || this.form.endtime == "") {
        warningAlert("活动期限不能为空");
      } else if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
      } else if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
      } else if (this.form.goodsid == "") {
        warningAlert("商品不能为空");
      } else {
        reqSeckUpdate(this.form).then(res => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.$emit("hide");
            this.empty();
            this.reqSeckList();
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
        this.time = [];
      }
      this.$refs.form.clearValidate();
    },
    //时间
    chooseTimeRange(t) {
      this.form.begintime = t[0].getTime();
      this.form.endtime = t[1].getTime();
    }
  },
  mounted() {
    if (this.catelist.length == 0) {
      this.reqCateList();
    }
    this.reqGoodsList(true);
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