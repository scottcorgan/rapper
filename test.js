var Narrator = require('./lib/narrator');

var api = new Narrator({
  host: 'http://api.dev.divshot.com:9393'
});

var apps = api.endpoint('apps', {
  hooks: {
    pre: function (next) {
      // var releaseEndpoint = this.getEndpoint('releases')
      // console.log(releaseEndpoint, '===============================================');
      next();
    }
  },
  customMethod: function () {
    console.log('custom method');
  }
});

// apps.customMethod();

// apps.list(function (err, appList) {
//   console.log(err, appList);
// });


// console.log('apps:', apps.url());

var app = apps.one(123, {
  hooks: {
    pre: function (next) {
      next();
    }
  }
});
// app.get(function (err, appData) {
//   console.log(err, appData);
// });
// console.log('app:', app.url());

var releases = app.endpoint('releases');
// console.log('releases:', releases.url());

var release = releases.one(456);
// console.log('release:', release.url());

var builds = release.endpoint('builds');
// console.log('builds:', builds.url());

var build = builds.one(789);
// console.log('build:', build.url());
