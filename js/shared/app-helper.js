angular.module('app-helper-module', [])
    .factory('app-helper', [function () {
        'use strict';

        var appHelper = {};

        appHelper.endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        appHelper.startsWith = function (str, suffix) {
            return str.indexOf(suffix) === 0;
        };

        appHelper.trimLeft = function (str) {
            return str.replace(/^\s+/, '');
        };

        appHelper.trimRight = function (str) {
            return str.replace(/\s+$/, '');
        };


        return appHelper;
    }]);