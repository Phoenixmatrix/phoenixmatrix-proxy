import angular from '../lib/angular';
import proxy from './proxy';

let app = angular.module('phoenixmatrix');

app.controller('ProxyCtrl', proxy);