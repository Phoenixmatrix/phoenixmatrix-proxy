import angular from '../lib/angular';
import requestList from './requestList';

let app = angular.module('phoenixmatrix');

app.directive('requestList', requestList);