<template>
  <div>
    <div id="main" class="box"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqListAction"
    })
  },
  mounted() {
    this.reqList();
  },
  watch: {
    list: {
      handler() {
        if (this.list.length > 0) {
          var myChart = echarts.init(document.getElementById("main"));
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "商品分类概况"
            },
            tooltip: {},
            legend: {
              data: ["分类数量"]
            },
            xAxis: {
              data: this.list.map(item=>item.catename)
            },
            yAxis: {},
            series: [
              {
                name: "分类数量",
                type: "line",
                data: this.list.map(item=>item.children?item.children.length:0)
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.box {
  width: 80%;
  height: 500px;
  border: 2px solid #cccccc;
  margin: 20px auto;
}
</style>