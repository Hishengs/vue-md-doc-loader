const loaderUtils = require('loader-utils');
const hljs = require('highlight.js');
const hljsDefineVue = require("./highlight-vue.js");
const MarkdownIt = require('markdown-it');

hljsDefineVue(hljs);

function renderHighlight (str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return '';
  }

  return hljs.highlight(lang, str, true).value;
};

const defaultOpts = {
  html: true,
  highlight: renderHighlight,
};

function SFCcode (md, hoistedTags) {
  const RE = /\s*{([^}]+)}/;
  // const templateRE = /<template.*>(.|\n)*<\/template>/;
  const scriptRE = /<script.*>(.|\n)*<\/script>/;
  const styleRE = /<style.*>(.|\n)*<\/style>/;

  const parseOptions = str => {
    if (!RE.test(str)) {
      return {};
    }
    const [, options] = RE.exec(str);
    const fn = new Function(`return {${options}}`);
    return fn();
  }

  function wrapCode (code, slot) {
    return code ? `<template slot="${slot}"><div v-pre>${code}</div></template>` : '';
  }

  const { fence } = md.renderer.rules;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const { content, info } = tokens[idx];
    const lang = info.split(/\s+/g)[0];
    if (lang.toLowerCase() === 'vue') {
      const opts = parseOptions(info);
      const pos = opts.insert ? opts.insert : 'above';
      let tpl, script, style = '';
      let r = scriptRE.exec(content);
      r && hoistedTags.push(script = r[0]);
      r = styleRE.exec(content);
      r && hoistedTags.push(style = r[0]);
      tpl = content.replace(scriptRE, '').replace(styleRE, '').trim();
      const template = tpl;
      if (tpl) {
        tokens[idx].content = tpl;
        tpl = fence(tokens, idx, options, env, self);
      }
      if (script) {
        tokens[idx].content = script;
        script = fence(tokens, idx, options, env, self);
      }
      if (style) {
        tokens[idx].content = style;
        style = fence(tokens, idx, options, env, self);
      }
      const demoView = `<demo-view>${template}</demo-view>`;
      const codeView = `<code-view>${wrapCode(tpl, 'template')}${wrapCode(script, 'javascript')}${wrapCode(style, 'style')}</code-view>`;
      if (pos === 'above') {
        return `${demoView}${codeView}`;
      }
      if (pos === 'below') {
        return `${codeView}${demoView}`;
      }
    }
    tokens.content = content;
    const res = fence(tokens, idx, options, env, self);
    return res;
  };
}

module.exports = function (source) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this) || {};
  const markdownIt = new MarkdownIt(Object.assign({}, defaultOpts, options));
  const hoistedTags = [];

  markdownIt.use(SFCcode, hoistedTags);

  markdownIt.use(md => {
    const RE = /^<(script|style)(?=(\s|>|$))/i;

    md.renderer.rules.html_block = (tokens, idx, options, env) => {
      const content = tokens[idx].content;
      if (RE.test(content.trim())) {
        hoistedTags.push(content);
        return '';
      }
      return content;
    }
  });

  const html = markdownIt.render(source);
  return `<template><div class="vmark">${html}</div></template>\n\n${hoistedTags.join('\n\n')}`;
}