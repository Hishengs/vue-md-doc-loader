# vue-md-doc-loader
a webpack loader for writing vue in markdown docs

[![npm][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/vue-md-doc-loader.svg
[npm-url]: https://www.npmjs.com/package/vue-md-doc-loader

## install

```js
npm i vue-md-doc-loader -D
```

## usage

setup your webpack config

```js
{
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader'
          },
          {
            loader: 'vue-md-doc-loader'
          }
        ] 
      }
    ]
  }
}
```

> you should install `vue-loader` first

in your markdown, write vue component like this:

```md
## Default Demo

> some description about this component

:::vue
<template>
  <panda-carousel @change="onChange">
    <panda-carousel-item
      v-for="(item, index) in 8"
      :key="index"
    >
      <div class="panda-carousel-demo-item">{{ index }}</div>
    </panda-carousel-item>
  </panda-carousel>
</template>

<script>
  export default {
    methods: {
      onChange (val) {
        console.log('>>> onChange', val);
      },
    },
  };
</script>

<style>
  .panda-carousel-demo-item {
    height: 260px;
    background-color: #fa541c;
    border-radius: 2px;
    color: white;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
</style>
:::

```

> start with `:::vue` and end with `:::`, which is a special mark for loader to parse vue component in markdown

finally, write your wrap component

`demo-view.vue`

> `vue-md-doc-loader` will put template into `demo-view`'s default slot, so you need to have, and register it first, like:

```vue
<template>
  <div class="demo-view">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'demo-view',
  }
</script>

<style lang="less">
  .demo-view {
    padding: 20px 10px;
    border: 1px solid #eeeeee;
  }
</style>
```

`code-view.vue`

> `vue-md-doc-loader` will put template, script, style into `code-view`'s template, script, style slot, so you need to have, and register it first, like:

```vue
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
```