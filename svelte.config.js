module.exports = {
  preprocess: [],
  compilerOptions: {
    preserveComments: true,
  },
  filterWarnings: ({ code, filename }) =>
    code !== 'css-unused-selector' || !filename.includes('node_modules'),
};
