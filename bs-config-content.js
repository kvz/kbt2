/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */

module.exports = {
  'ui': {
    'port': 3001,
    'weinre': {
      'port': 8080
    }
  },
  'files': [
    'manifest.*'
  ],
  'online': false,
  'server': {
    'baseDir': '.'
  },
  'logLevel': 'debug',
  'logPrefix': 'BS',
  'logConnections': true,
  'logFileChanges': true,
  'logSnippet': true
};