angular.module('controllers', ['ngResource'])
    .controller('PlaceReviewsCtrl', ['$scope', function (angScope) {
        'use strict';

        angScope.placeList = [];

        jQuery.ajax({ url: 'http://yotra.azurewebsites.net/api/reviews/' }).done(function (res) {
            console.log(res);
            angScope.placeList = res["places"];
        });

        ////angHttp.defaults.useXDomain = true;

        ////var placeResource = angResource('http://yotra.azurewebsites.net/api/reviews/', {});
        ////placeResource.get({}, function (res) {
        ////    angScope.placeList = res["places"];
        ////});
        ////placeReviewsFactory.get({}, function (res) {
        ////    angScope.placeList = res["places"];
        ////});

    }]);