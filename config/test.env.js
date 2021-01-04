const MergeAnything = require('merge-anything').merge;
const defaultEnv = require('./default.env.js');

module.exports = MergeAnything(defaultEnv, {
  base_api: '//xadmin-api.xueboren.cn/',
});
