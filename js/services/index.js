import angular from '../lib/angular';
import requestFilter from './requestFilter';
import requests from './requests';

let app = angular.module('phoenixmatrix');

app.service('requestFilter', requestFilter);
app.service('requests', requests);