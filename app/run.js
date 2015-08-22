/* global require:true process:true */

'use strict';

process.title = 'ionic';

var IonicCli = require('../lib/cli');

IonicCli.run(process.argv);