<template>
  <div class="comp-sidebar-controller">

    <div ref="btn" class="btn-click" @click="toggle" />

    <svg width="1000px" height="1000px">

      <path ref="pathA" d="
        M 300 400
        L 700 400
        C 900 400 900 750 600 850
        A 400 400 0 0 1 200 200
        L 800 800
      " />

      <path ref="pathB" d="M 300 500 L 700 500" />

      <path ref="pathC" d="
        M 700 600
        L 300 600
        C 100 600 100 200 400 150
        A 400 380 0 1 1 200 800
        L 800 200
      " />

    </svg>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Segment from 'segment-js';
import { easeBounceOut, easeElasticOut, easeElasticIn } from 'd3-ease';

const beginAC = 80;
const endAC = 320;
const beginB = 80;
const endB = 320;

@Component({
  props: {
    abc: String,
    isOpened: { type: Boolean, required: true },
  },
})
export default class SidebarController extends Vue {
  slowSpeed: number = 0.7

  // 缓慢程度, 与速度成反比
  segmentA: any = undefined

  segmentB: any = undefined

  segmentC: any = undefined

  mounted() {
    this.segmentA = new Segment(this.$refs.pathA, beginAC, endAC);
    this.segmentB = new Segment(this.$refs.pathB, beginB, endB);
    this.segmentC = new Segment(this.$refs.pathC, beginAC, endAC);
    if ((this as any).isOpened === true) {
      this.slowSpeed = 0.1;
      this.startAc(this.segmentA);
      this.startB();
      this.startAc(this.segmentC);
      this.slowSpeed = 0.7;
    }
  }

  toggle(notEmit: boolean = false) {
    if ((this as any).isOpened) {
      this.endAc(this.segmentA);
      this.endB();
      this.endAc(this.segmentC);
    } else {
      this.startAc(this.segmentA);
      this.startB();
      this.startAc(this.segmentC);
    }
    if (notEmit !== true) this.$emit('toggle');
  }

  // 动画控制函数

  startAc(segment: any) {
    segment.draw('80% - 240', '80%', 0.3 * this.slowSpeed, {
      delay: 0.1 * this.slowSpeed,
      callback: () => {
        segment.draw('100% - 545', '100% - 305', 0.6 * this.slowSpeed, {
          easing: easeElasticOut,
        });
      },
    });
  }

  startB() {
    this.segmentB.draw(beginB - 60, endB + 60, 0.1 * this.slowSpeed, {
      callback: () => {
        this.segmentB.draw(beginB + 120, endB - 120, 0.3 * this.slowSpeed, {
          easing: easeBounceOut,
        });
      },
    });
  }

  endAc(segment: any) {
    segment.draw('90% - 240', '90%', 0.1 * this.slowSpeed, {
      easing: easeElasticIn,
      callback: () => {
        segment.draw('20% - 240', '20%', 0.3 * this.slowSpeed, {
          callback: () => {
            segment.draw(beginAC, endAC, 0.7 * this.slowSpeed, {
              easing: easeElasticOut,
            });
          },
        });
      },
    });
  }

  endB() {
    this.segmentB.draw(beginB, endB, 0.7 * this.slowSpeed, {
      delay: 0.1 * this.slowSpeed,
      easing: easeElasticOut,
    });
  }
}
</script>

<style lang="scss" scoped>
// 改变整体元素大小: svg.transform.scale && svg.left && svg.top
.comp-sidebar-controller {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
  svg {
    position: absolute;
    transform: scale(0.05);
    transform-origin: 0 0;
    pointer-events: none;
    path {
      stroke: #409EFF;
      stroke-width: 60px;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: transparent;
    }
  }
  .btn-click {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
