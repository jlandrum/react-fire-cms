const scss = require('rollup-plugin-scss');

module.exports = {
  rollup(config, options) {
    config.plugins.unshift(
      scss(),
    );
    config.output.esModule = true;
    return config;
  },
};