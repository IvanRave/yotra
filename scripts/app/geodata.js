// http://docs.angularjs.org/api/ngResource.$resource
angular.module('geodata', ['ngResource']).factory('GeoData', function ($resource) {

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
});