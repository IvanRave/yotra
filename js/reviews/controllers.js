angular.module('controllers', ['ngResource'])
    .controller('PlaceReviewsCtrl', ['$scope', function (angScope) {
        'use strict';

        angScope.placeList = [];

        jQuery.ajax({
            url: 'http://yotra.azurewebsites.net/api/reviews/',
            type: 'POST'
        }).done(function (res) {
            console.log('send req');
            angScope.$apply(function () {
                angScope.placeList = res["places"];
            });
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