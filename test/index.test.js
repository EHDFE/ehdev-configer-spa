const { expect } = require('chai');
const { getProdConfig, getDevConfig } = require('../index');

describe('exports methods: <<getProdConfig>> and <<getDevConfig>>', () => {

  it('<<getProdConfig>> is a function', () => {
    expect(getProdConfig).to.be.a('function');
  });
  it('<<getDevConfig>> is a function', () => {
    expect(getDevConfig).to.be.a('function');
  });

  it('should <<getProdConfig>> return a promise', () => {
    expect(getProdConfig({})).to.be.a('promise');
  });
  it('should <<getDevConfig>> return a promise', () => {
    expect(getDevConfig({})).to.be.a('promise');
  });

  it('should getDevConfig a valid webpack config', async () => {
    const devConfig = await getDevConfig();
    expect(devConfig).to.have.all.keys(
      'entry',
      'output',
      'resolve',
      'module',
      'externals',
      'target',
      'plugins',
      'node',
      'performance',
      'devtool',
    );
    expect(devConfig.resolve.extensions).to.eql(
      ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    );
    expect(devConfig.module.strictExportPresence).to.be.true;
    expect(devConfig.module.rules[0].oneOf).to.have.lengthOf(5);
    expect(devConfig.plugins).to.have.lengthOf(5);
  });

  it('should getProdConfig a valid webpack config', async () => {
    const prodConfig = await getProdConfig();
    expect(prodConfig).to.have.all.keys(
      'bail',
      'entry',
      'output',
      'resolve',
      'module',
      'externals',
      'target',
      'plugins',
      'node',
      'devtool',
    );
    expect(prodConfig.resolve.extensions).to.eql(
      ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    );
    expect(prodConfig.module.strictExportPresence).to.be.true;
    expect(prodConfig.module.rules[0].oneOf).to.have.lengthOf(5);
    expect(prodConfig.plugins).to.have.lengthOf(7);
  });

});