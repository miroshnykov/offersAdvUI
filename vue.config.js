module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = process.env.VUE_APP_TITLE || 'My Vue App';
        return args;
      });
  },
};
