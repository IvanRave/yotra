angular.module('app', ['ngRoute', 'ang-menu-controllers'])
    .config(['$routeProvider', '$locationProvider', function (angRouteProvider, angLocationProvider) {
        angRouteProvider
            .when('/', { controller: 'MenuCtrl', templateUrl: '/app/menu/main.tpl.html' })
            .when('/tickets', { controller: 'MenuCtrl', templateUrl: '/app/ticket/main.tpl.html' })
            .when('/maps', { controller: 'MenuCtrl', templateUrl: '/app/map/main.tpl.html' })
            ////.when('/forum/list', { controller: 'ForumListCtrl', templateUrl: '/app/forum/list.tpl.html' })
            ////.when('/forum/post', { controller: 'ForumPostCtrl', templateUrl: '/app/forum/post.tpl.html' })
            .otherwise({ redirectTo: '/' });

        angLocationProvider.html5Mode(true).hashPrefix('!');
    }])
    .run(['$rootScope', function (angRootScope) {
    }]);