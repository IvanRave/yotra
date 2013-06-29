angular.module('geodata', ['ngResource']).factory('GeoData', function ($resource) {
    var self = $resource('https://rave-mobile.azure-mobile.net/api/geopoint/:Id',
        {}, {}
    );

    ////var self = $resource('http://api-yotra.azurewebsites.net/api/geopoint/:Id',
    ////    {}, {}
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