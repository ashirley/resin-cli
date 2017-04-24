// Generated by CoffeeScript 1.12.5
var Promise, dockerUtils, getBundleInfo;

Promise = require('bluebird');

dockerUtils = require('../utils/docker');

getBundleInfo = Promise.method(function(options) {
  var helpers;
  helpers = require('../utils/helpers');
  if (options.application != null) {
    return helpers.getAppInfo(options.application).then(function(app) {
      return [app.arch, app.device_type];
    });
  } else if ((options.arch != null) && (options.deviceType != null)) {
    return [options.arch, options.deviceType];
  } else {
    return void 0;
  }
});

module.exports = {
  signature: 'build [source]',
  description: 'Build a container locally',
  permission: 'user',
  help: 'Use this command to build a container with a provided docker daemon.\n\nYou must provide either an application or a device-type/architecture\npair to use the resin Dockerfile pre-processor\n(e.g. Dockerfile.template -> Dockerfile).\n\nExamples:\n\n	$ resin build\n	$ resin build ./source/\n	$ resin build --deviceType raspberrypi3 --arch armhf\n	$ resin build --application MyApp ./source/\n	$ resin build --docker \'/var/run/docker.sock\'\n	$ resin build --dockerHost my.docker.host --dockerPort 2376 --ca ca.pem --key key.pem --cert cert.pem',
  options: dockerUtils.appendOptions([
    {
      signature: 'arch',
      parameter: 'arch',
      description: 'The architecture to build for',
      alias: 'A'
    }, {
      signature: 'devicetype',
      parameter: 'deviceType',
      description: 'The type of device this build is for',
      alias: 'd'
    }, {
      signature: 'application',
      parameter: 'application',
      description: 'The target resin.io application this build is for',
      alias: 'a'
    }
  ]),
  action: function(params, options, done) {
    return dockerUtils.runBuild(params, options, getBundleInfo).asCallback(done);
  }
};
