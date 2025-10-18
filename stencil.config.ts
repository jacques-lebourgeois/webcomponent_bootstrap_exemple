import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-bootstrap-multi-version-example',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  devServer: {
    openBrowser: false
  }
};