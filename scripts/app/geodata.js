// http://docs.angularjs.org/api/ngResource.$resource
angular.module('geodata', ['ngResource'])
    .factory('GeoData', function ($resource) {

        // Usage: $resource(url[, paramDefaults][, actions]);
        var self = $resource('https://rave-mobile.azure-mobile.net/api/geopoint/:Id',
            {}, {
                // default:
                //  'get':    {method:'GET'},
                //  'save':   {method:'POST'},
                //  'query':  {method:'GET', isArray:true},
                //  'remove': {method:'DELETE'},
                //   'delete': {method:'DELETE'} }
                // PUT or PATH
                save: {
                    method: 'POST',
                    // url params
                    ////params: { 'mytext': '@text' },
                    isArray: false,
                    headers: {
                        // This is the Application Key of your Azure Mobile Service. This optional if you set the Table permission to Everyone.
                        'X-ZUMO-APPLICATION': localStorage.applicationKey,
                        // TODO: change dynamically or refresh page
                        'X-ZUMO-AUTH': localStorage.currentUser ? JSON.parse(localStorage.currentUser).mobileServiceAuthenticationToken : null,
                        'X-ZUMO-VERSION': localStorage.version
                        // X-ZUMO-INSTALLATION-ID – This is ID of your Windows 8 app. We can send any GUID in this header. This is optional. (Thanks Josh Twist for the update)
                    }
                },
                update: { method: 'PUT' }
            }
        );

        ////var self = $resource('http://api-yotra.azurewebsites.net/api/geopoint/:Id',
        ////    { Id: 123 }, {}
        ////);

        ////var self = $resource('https://api.mongolab.com/api/1/databases' +
        ////    '/angularjs/collections/projects/:id',
        ////    { apiKey: '4f847ad3e4b08a2eed5f3b54' }, {
        ////        update: { method: 'PUT' }
        ////    }
        ////);

        ////Project.prototype.update = function (cb) {
        ////    return Project.update({ id: this._id.$oid },
        ////        angular.extend({}, this, { _id: undefined }), cb);
        ////};

        ////Project.prototype.destroy = function (cb) {
        ////    return Project.remove({ id: this._id.$oid }, cb);
        ////};

        return self;
    })
    .factory('GeoCoding', function ($resource) {
        ////var geoCodingUrl = 'http://geocoding.cloudmade.com/cf96818502834f14a74a10eabf87c129/geocoding/v2/find.js';
        // using query
        var geoCodingUrl = 'http://nominatim.openstreetmap.org/search';

        return $resource(geoCodingUrl, {}, {
            query: {
                method: 'JSONP',
                params: {
                    'format': 'json',
                    ////property_code: 'DEMO_ERFOLGX', adults: '2'
                    // try 'callback'
                    'json_callback': 'JSON_CALLBACK'
                },
                isArray: true
            }
        })
    })
    .factory('GeoRouting', function ($resource) {
        // http://routes.cloudmade.com/YOUR-API-KEY-GOES-HERE/api/0.3/start_point,[transit_point1,...,transit_pointN],end_point/route_type[/route_type_modifier].output_format[?lang=(Two letter ISO 3166-1 code)][&units=(km|miles)]
        var routeUrl = 'http://routes.cloudmade.com/cf96818502834f14a74a10eabf87c129/api/0.3/:startLat,:startLon,:endLat,:endLon/car/shortest.js';
        return $resource(routeUrl, {}, {
            query: {
                method: 'JSONP',
                params: {
                    'callback': 'JSON_CALLBACK'
                },
                isArray: false
            }
        })
    })
    .factory('GeoFeatureCollection', function ($resource) {
        var featureCollectionUrl = '/test.topojson';
        return $resource(featureCollectionUrl, {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    })