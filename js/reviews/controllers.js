angular.module('controllers', ['factories'])
    .controller('PlaceReviewsCtrl', ['$scope', 'PlaceReviewsFactory', function (angScope, placeReviewsFactory) {
        'use strict';

        angScope.placeList = [];

        placeReviewsFactory.get({}, function (res) {
            angScope.placeList = res["places"];
        });

    }]);