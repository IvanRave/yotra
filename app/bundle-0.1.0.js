/*! yotra - v0.1.0 - 2013-10-07
* http://yotra.ru
* Copyright (c) 2013 IvanRave; Licensed MIT */
angular.module('ang-menu-controllers', [])
    .controller('MenuCtrl', ['$scope', function () {
        'use strict';

    }]);;/* some header comment in app.js */
angular.module('app', ['ngRoute', 'ang-menu-controllers'])
    .config(['$routeProvider', '$locationProvider', function (angRouteProvider, angLocationProvider) {
        angRouteProvider
            .when('/', { controller: 'MenuCtrl', templateUrl: '/app/menu/' })
            .when('/app/tickets/', { controller: 'MenuCtrl', templateUrl: '/app/tickets/' })
            .when('/app/maps/', { controller: 'MenuCtrl', templateUrl: '/app/maps/' })
            .when('/app/reviews/', { controller: 'MenuCtrl', templateUrl: '/app/reviews/' })
            ////.when('/forum/list', { controller: 'ForumListCtrl', templateUrl: '/app/forum/list.tpl.html' })
            ////.when('/forum/post', { controller: 'ForumPostCtrl', templateUrl: '/app/forum/post.tpl.html' })
            .otherwise({ redirectTo: '/' });

        angLocationProvider.html5Mode(true).hashPrefix('!');
    }])
    .run(['$rootScope', function () {
    }]);