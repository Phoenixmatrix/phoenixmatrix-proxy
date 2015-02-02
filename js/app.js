"use strict";
import '6to5/polyfill';
global.document = global.window.document;
global.navigator = global.window.navigator;

import angular from './lib/angular';

angular.module('phoenixmatrix', ['bgDirectives', 'ui.bootstrap']);

import './services';
import './filters';
import './directives';
import './controllers';


