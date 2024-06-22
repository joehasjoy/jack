  <template>
  <div class="wrap">
    <ul id="marquee" ref="" @mouseover="mouseover" @mouseout="mouseout" >
      <li v-for="(item, index) in notices" ref="li" :key="index" :style="{'width': (item.length > 150 ? '200%': item.length > 80 ? '120%' : '100%')}" :title="item">{{ item }}</li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "Scroller",
  props: ["notices"], // 父组件传入数据， 数组形式
	data(){
		return {
			timer: null,
			copySpeed: 10,
		}
	},
  methods: {
	  mouseout(){
		  this.move();
	  },
	  mouseover(){
		  clearInterval(this.timer);
		  this.timer = null;
	  },
    move() {
	    // 获取内容区宽度
      let width = document.getElementById("marquee").scrollWidth;
      let marquee = document.getElementById("marquee");
      let speed = this.copySpeed; // 位移距离
      // 设置位移
      this.timer = setInterval( ()=> {
        speed = speed - 1;
        if (Math.abs(speed) >= width) { // 从右往左是负数，转为整数判断大小
          speed = 10;
        }
				this.copySpeed = speed // 记住每一次的位置
        marquee.style.transform = "translateX(" + speed + "px)";
      }, 40);
    },
  },
  mounted: function () {
    this.move();
  },
};
</script>
 <style scoped>
/*样式的话可以写*/
.wrap {
  overflow: hidden;
  color: white;
	text-align: right;
}
#marquee {
  /*width: 120%;*/
}
ul,
li {
  margin: 0;
  padding: 0;
}
ul {
  white-space: nowrap;
  margin: 0 10px;
}
li {
  height: 100%;
  list-style: none;
  margin-right: 10px;
  display: inline-block;
}
</style>
