angular.module('factories', ['ngResource'])
    .factory('PlaceReviewsFactory', ['$http', '$resource', function (angHttp, angResource) {
        angHttp.defaults.useXDomain = true;

        return angResource('http://yotra.azurewebsites.net/api/reviews/',
                    {}, {
                        // default:
                        //  'get':    {method:'GET'},
                        //  'save':   {method:'POST'},
                        //  'query':  {method:'GET', isArray:true},
                        //  'remove': {method:'DELETE'},
                        //   'delete': {method:'DELETE'} }
                        // PUT or PATH
                        ////post: { method: 'POST', isArray: false },
                        ////put: { method: 'PUT', isArray: false }
                    });
    }]);