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

        appHelper.searchParams = function (locationSearch) {
            var match,
                pl = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = locationSearch.substring(1);

            var urlParams = {};
            while (match = search.exec(query)) {
                urlParams[decode(match[1])] = decode(match[2]);
            }

            return urlParams;
        };

        return appHelper;
    }]);