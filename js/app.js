"use strict";
import '6to5/polyfill';
import angular from './lib/angular';

angular.module('phoenixmatrix', ['bgDirectives', 'ui.bootstrap']);

import './services';
import './filters';
import './directives';
import './controllers';


