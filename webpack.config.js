/**
 * dev
 * prod -> 生产环境
 * test -> 测试环境
 * dev  -> 开发环境
 */
module.exports = function(env) {
  return require(`./build/webpack.${env}.js`)
}