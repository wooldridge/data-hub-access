const config = {};

config.server = {
  port:        '3000'
};

config.client = {
  host:        'localhost',
  port:        '8011',
  database:    'data-hub-FINAL',
  user:        'USERNAME',
  password:    'PASSWORD',
  authType:    'DIGEST'
};

config.search = {
  pageStart:   0,
  pageLength:  100
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = config;
}