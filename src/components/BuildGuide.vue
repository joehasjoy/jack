<template>
  <div class="guide-mask" v-if="!showGuide">
    <div class="step1" v-show="guideStep === 1">
      <img src="../assets/guide_img/step1.png" alt="" class="step1-img" />
      <img src="../assets/guide_img/line1.png" alt="" class="line1-img" />
      <img src="../assets/guide_img/text1.png" alt="" class="text1-img" />
    </div>
    <div class="step2" v-show="guideStep === 2">
      <div class="step2-wrap">
        <img src="../assets/guide_img/step2.png" alt="" class="step2-img" />
        <img src="../assets/guide_img/line2.png" alt="" class="line2-img" />
        <img src="../assets/guide_img/text2.png" alt="" class="text2-img" />
      </div>
    </div>
    <div class="step3" v-show="guideStep === 3">
      <img src="../assets/guide_img/step3.png" alt="" class="step3-img" />
      <img src="../assets/guide_img/line3.png" alt="" class="line3-img" />
      <img src="../assets/guide_img/text3.png" alt="" class="text3-img" />
    </div>
    <div class="step4" v-show="guideStep === 4">
      <el-button size="mini" circle icon="el-icon-plus" class="step4-img" />
      <img src="../assets/guide_img/line4.png" alt="" class="line4-img" />
      <img src="../assets/guide_img/text4.png" alt="" class="text4-img" />
    </div>
    <div class="step5" v-show="guideStep === 5">
      <img src="../assets/guide_img/step5.png" alt="" class="step5-img" />
      <img src="../assets/guide_img/line5.png" alt="" class="line5-img" />
      <img src="../assets/guide_img/text5.png" alt="" class="text5-img" />
    </div>

    <div class="btn-box flex">
      <div class="btn btn-close flex-center" @click="closeGuide">关闭</div>
      <div
        class="btn btn-prev flex-center"
        @click="guideStep--"
        v-show="guideStep > 1"
      >
        上一步
      </div>
      <div
        class="btn btn-next flex-center"
        @click="guideStep++"
        v-show="guideStep < 5"
      >
        下一步
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      guideStep: 1, // 引导的显示第几步
      showGuide: localStorage.getItem("hasShowBuildJenkinsGuild"),
    };
  },
  methods: {
    closeGuide() {
      this.showGuide = true;
      localStorage.setItem("hasShowBuildJenkinsGuild", this.showGuide);
    },
  },
};
</script>
<style lang="scss" scoped>
.guide-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10002;
  .step1 {
    .step1-img {
      width: 470px;
      position: absolute;
      right: 20px;
      top: 110px;
    }
    .line1-img {
      width: 248px;
      position: absolute;
      top: 300px;
      right: 490px;
    }
    .text1-img {
      width: 332px;
      position: absolute;
      top: 435px;
      right: 580px;
    }
  }
  .step2 {
    .step2-wrap {
      width: calc(100vw - 788px);
      height: 500px;
      position: absolute;
      right: 530px;
      top: 188px;
    }
    .step2-img {
      // width: calc(100vw - 593px);
      width: calc(100vw - 788px);
      position: absolute;
      top: 0;
      left: 0;
      // right: 530px;
      // top: 188px
    }
    .line2-img {
      width: 277px;
      height: 124px;
      position: absolute;
      top: 300px;
      right: 400px;
    }
    .text2-img {
      width: 332px;
      height: 80px;
      position: absolute;
      top: 435px;
      right: 80px;
    }
  }
  .step3 {
    .step3-img {
      width: 430px;
      position: absolute;
      right: 40px;
      bottom: 211px;
    }
    .line3-img {
      width: 277px;
      height: 124px;
      position: absolute;
      bottom: 330px;
      right: 290px;
    }
    .text3-img {
      width: 332px;
      position: absolute;
      bottom: 454px;
      right: 388px;
    }
  }
  .step4 {
    .step4-img {
      position: absolute;
      // right: 573px;
      right: 614px;
      top: 139px;
    }
    .line4-img {
      width: 67px;
      position: absolute;
      right: 572px;
      height: 190px;
      top: 147px;
    }
    .text4-img {
      width: 332px;
      position: absolute;
      top: 337px;
      right: 380px;
    }
  }
  .step5 {
    .step5-img {
      position: absolute;
      width: 74px;
      height: 30px;
      right: 40px;
      bottom: 319px;
    }
    .line5-img {
      width: 161px;
      height: 90px;
      position: absolute;
      right: 62px;
      bottom: 349px;
    }
    .text5-img {
      width: 376px;
      position: absolute;
      bottom: 403px;
      right: 236px;
    }
  }
  .btn-box {
    position: absolute;
    bottom: 125px;
    left: 50%;
    transform: translateX(-50%);
    .btn {
      width: 96px;
      height: 36px;
      color: white;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-close,
    .btn-prev {
      border: 1px solid white;
      margin-right: 20px;
    }
    .btn-next {
      background: $primary;
    }
  }
}
</style>