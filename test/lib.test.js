const path = require('path');
const { expect } = require('chai');

const { getFilesByExtName } = require('../src/lib');

describe('lib tests', () => {
  const srcDir = process.cwd();

  it('should getFilesByExtName works correctly', async () => {
    const files = await getFilesByExtName(srcDir, 'md');
    expect(files).to.be.an('array').that.includes('README.md');
  });

});
