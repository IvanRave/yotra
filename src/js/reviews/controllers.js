angular.module('ang-reviews-controllers', [])
    .controller('ReviewsCtrl', ['$scope', function (angScope) {
        'use strict';

        angScope.todoList = [
            { text: 'learn angular', done: true },
            { text: 'build an angular app', done: false }];

    }]);