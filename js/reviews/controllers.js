angular.module('controllers', ['ngResource'])
    .controller('PlaceReviewsCtrl', ['$scope', '$http', '$resource', function (angScope, angHttp, angResource) {
        'use strict';

        angScope.placeList = [];

        angHttp.defaults.useXDomain = true;

        var placeResource = angResource('http://yotra.azurewebsites.net/api/reviews/', {});
        placeResource.get({}, function (res) {
            angScope.placeList = res["places"];
        });
        ////placeReviewsFactory.get({}, function (res) {
        ////    angScope.placeList = res["places"];
        ////});

    }]);