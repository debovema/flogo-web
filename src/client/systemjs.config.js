/*
 * This config is only used during development and build phase only
 * It will not be available on production
 *
 */

// We define the configuration for development environment and we adjust it for the building phase
(function (global) {
  // ENV
  var isDevEnv = typeof global.DEV != 'undefined' && global.DEV;

  // packages tells the System loader how to load when no filename and/or no extension
  // REMEMBER to also add your add library to be loaded in map config in production section below
  var packages = {
    'rxjs': {
      defaultExtension: false
    },
    'ng2-bs3-modal': {
      defaultExtension: false
    }
  };

  var paths;
  var map;
  var defaultJSExtensions = 'js';

  if(isDevEnv) {
    paths = {
      'main': '/main'
    };

    // map tells the System loader where to look for things
    // load angular from node_modules folder
    map = {
      '@angular': '/node_modules/@angular'
    };

  } else {

    // wildcard paths
    paths = {
      'n:*': 'src/client/node_modules/*'
    };

    // map tells the System loader where to look for things
    map = {
      'main': 'dist/public/build',
      'rxjs': 'n:rxjs',
      'ng2-bs3-modal': 'n:ng2-bs3-modal',
      '@angular': 'n:@angular'
    };

    defaultJSExtensions = false;
    // fix default extensions
    for (var pkgName in packages) {
      packages[pkgName].defaultExtension = 'js';
    }

    packages['main'] =  {
      main: 'main',
      defaultExtension: 'js'
    };

  }


  // Register @angular submodules
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated'
  ];

  ngPackageNames.forEach(function (pkgName) {
    packages['@angular/' + pkgName] = {
      main: isDevEnv ? pkgName + '.umd.js' : 'esm/sindex.js',
      defaultExtension: 'js'
    };
  });

  var config = {
    defaultJSExtensions: defaultJSExtensions,
    map: map,
    packages: packages,
    paths: paths
  };

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) {
    global.filterSystemConfig(config);
  }

  System.config(config);

})(this);
