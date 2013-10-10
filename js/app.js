/* some header comment in app.js */
angular.module('app', ['ngRoute', 'ang-menu-controllers'])
    .config(['$routeProvider', '$locationProvider', function (angRouteProvider, angLocationProvider) {
        angRouteProvider
            .when('/', { controller: 'MenuCtrl', templateUrl: '/js/menu/' })
            .when('/app/tickets/', { controller: 'MenuCtrl', templateUrl: '/js/tickets/' })
            ////.when('/maps.html', { controller: 'MenuCtrl', templateUrl: '/maps.html' })
            .when('/app/reviews/', { controller: 'MenuCtrl', templateUrl: '/js/reviews/' })
            ////.when('/forum/list', { controller: 'ForumListCtrl', templateUrl: '/app/forum/list.tpl.html' })
            ////.when('/forum/post', { controller: 'ForumPostCtrl', templateUrl: '/app/forum/post.tpl.html' })
            .otherwise({ redirectTo: '/' });

        angLocationProvider.html5Mode(true).hashPrefix('!');
    }])
    .run(['$rootScope', function () {
    }]);