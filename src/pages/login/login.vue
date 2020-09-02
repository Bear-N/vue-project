<template>
  <div class="login">
    <div class="con">
      <h3>登录</h3>
      <el-input v-model="user.username" placeholder="请输入账号" clearable></el-input>
      <el-input v-model="user.password" placeholder="请输入密码" clearable show-password></el-input>
      <div class="btn-box">
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../util/alert";
import { reqUserLogin } from "../../util/request"
export default {
  computed:{
    ...mapGetters({
      info:"user/info"
    })
  },
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions({
      changeInfoAction:"user/changeInfoAction"
    }),
    login() {
      
      
      reqUserLogin(this.user).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.changeInfoAction(res.data.list)
          this.$router.push("/");
        } else {
          warningAlert(res.data.msg);
          console.log(111);
        }
      });
    }
  },
  mounted() {
  }
};
</script>
<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #5b3243, #2b3d5f);
  position: fixed;
  left: 0;
  top: 0;
}
.con {
  width: 380px;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
h3 {
  text-align: center;
  line-height: 60px;
}
.el-input {
  margin-bottom: 15px;
}
.btn-box {
  text-align: center;
}
</style>