<template>
  <div class="code-view">
    <div class="code-view-head">
      <span v-for="tab in tabs" :key="tab" :class="{
        [`${tab}`]: true,
        'active': curTab === tab,
      }" @click="curTab=tab" v-show="$slots[tab]">{{ tab }}</span>
      <span class="run-code">JsFiddle</span>
    </div>
    <div v-show="curTab==='template'"><slot name="template"></slot></div>
    <div v-show="curTab==='javascript'"><slot name="javascript"></slot></div>
    <div v-show="curTab==='style'"><slot name="style"></slot></div>
  </div>
</template>

<script>
  export default {
    name: 'code-view',
    data () {
      return {
        curTab: 'template',
        tabs: ['template', 'javascript', 'style'],
      };
    }
  };
</script>

<style lang="less">
  .code-view {
    margin: 10px 0;
    border: 1px solid #eeeeee;
    pre {
      margin: 0;
      border-radius: 0;
      /* background-color: #333333;
      color: white; */
    }
    &-head {
      position: relative;
      // display: flex;
      border-bottom: 1px solid #eeeeee;
      background-color: white;
      > span {
        display: inline-block;
        padding: 10px 15px;
        border-right: 1px solid #eeeeee;
        &:hover {
          cursor: pointer;
          background-color: #f5f5f5;
        }
      }
      > span.active {
        color: #1890ff;
      }
      > .run-code {
        border-left: 1px solid #eeeeee;
        border-right: none;
        position: absolute;
        right: 0;
      }
    }
  }
</style>