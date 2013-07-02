// Modules can list other modules as their dependencies.
// ==============
// Modules are a way of managing $injector configuration, and have nothing to do with loading of scripts into a VM. 
// There are existing projects which deal with script loading, which may be used with Angular. 
// Because modules do nothing at load time they can be loaded into the VM in any order 
// and thus script loaders can take advantage of this property and parallelize the loading process.
var app = angular.module('project', ['geodata', 'yotraFilters']);

var wamsClient = new WindowsAzure.MobileServiceClient('https://rave-mobile.azure-mobile.net/', 'cJVLPsElKKsvBvtlYLKJwPgBzkFPmk65');

localStorage.applicationKey = wamsClient.applicationKey;
localStorage.version = wamsClient.version;

console.log(wamsClient);

////LoginPartialCtrl.$inject = ['$scope'];
var LoginPartialCtrl = ['$scope', function (fncScope) {
    ////console.log(localStorage);

    if (localStorage.currentUser) {
        fncScope.currentUser = JSON.parse(localStorage.currentUser);
    }

    fncScope.logOnWithFacebook = function () {
        // microsoftaccount, facebook, twitter, google
        wamsClient.login('facebook').then(function (response) {
            localStorage.currentUser = JSON.stringify(response);
            location.reload();
            ////console.log(localStorage);
            ////console.log(response);
            ////////console.log(response);
            ////////console.log(wamsClient.currentUser);
            ////if (!fncScope.$$phase) {
            ////    fncScope.$apply(function () {
            ////        fncScope.currentUser = response;
            ////        ////console.log(wamsClient.currentUser);
            ////    });
            ////}
        }, function (error) {
            console.log(error);
        });
    };

    fncScope.logout = function () {
        console.log('logout');
        wamsClient.logout();
        localStorage.currentUser = '';
        location.reload();
    }
}];

// In AngularJS, model values on the scope should always "have a dot", meaning be objects instead of primitives.
// $routeParams (contains route params: $routeParams.phoneId;)
app.config(['$routeProvider', function (rpr) {
    var GeoCtrl = ['$scope', 'GeoData', function (angScope, angGeoData) {
        angScope.geoForm = { pointList: angGeoData.query() };
    }];

    var CreateCtrl = ['$scope', '$location', 'GeoData', function (angScope, angLocation, angGeoData) {
        angScope.save = function () {
            var authToken = localStorage.currentUser ? JSON.parse(localStorage.currentUser).mobileServiceAuthenticationToken : 'testToken';
            // Resource.action([parameters], postData, [success], [error])
            angGeoData.save(angScope.project, function (project) {
                angLocation.path('/geo');
            }, function (error) {
                alert(error);
            });
        };
    }];

    var MapLeafletCtrl = ['$scope', 'GeoCoding', 'GeoRouting', 'GeoFeatureCollection', function (angScope, angGeoCoding, angGeoRouting, angGeoFeatureCollection) {
        angScope.mapForm = {
            name: '',
            fullName: '',
            lat: 45,
            lon: 0.5
            ////lat: 47.258469,
            ////lon: 9.58625
        };

        ////var leafletMap = L.map('leaflet_map').setView([51.505, -0.09], 13);
        // todo: add controls (bottom map, full zoom control)
        var leafletMap = L.map('map_leaflet').setView([angScope.mapForm.lat, angScope.mapForm.lon], 5);

        L.tileLayer('http://{s}.tile.cloudmade.com/cf96818502834f14a74a10eabf87c129/997/256/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
        }).addTo(leafletMap);

        angScope.buildRouteList = function () {
            //   L.polyline([
            //[47.258469, 9.58625], [47.25893, 9.58668], [47.25885, 9.58687], [47.258419, 9.58784], [47.258148, 9.58849], [47.258991, 9.58929], [47.259319, 9.58957], [47.259548, 9.5898], [47.259708, 9.5901], [47.259789, 9.59034], [47.259861, 9.59071], [47.259918, 9.59088], [47.259769, 9.59246], [47.259739, 9.59299], [47.259701, 9.59367], [47.259682, 9.59403], [47.259651, 9.59418], [47.259571, 9.59441], [47.259399, 9.59497], [47.259209, 9.5956], [47.259178, 9.59574], [47.259159, 9.59587], [47.259102, 9.59682], [47.259102, 9.59689], [47.258991, 9.59737], [47.25898, 9.59743], [47.258862, 9.59792], [47.258709, 9.59839], [47.25869, 9.59847], [47.258808, 9.59861], [47.258881, 9.59878], [47.25893, 9.59878], [47.25922, 9.5988], [47.259548, 9.59889], [47.25988, 9.59897], [47.26001, 9.59902], [47.260201, 9.59911], [47.260429, 9.59921], [47.260761, 9.59938], [47.261009, 9.59879]
            //   ], { color: 'red' }).addTo(leafletMap);

            angGeoRouting.query({ startLat: angScope.mapForm.lat, startLon: angScope.mapForm.lon, endLat: 48, endLon: 10 }, function (data) {
                if (data.status > 0) {
                    alert(data.status_message);
                    // 207 - Can not find the road between points
                }
                else {
                    // mapFormmapForm
                    // "total_distance":100930,"total_time":8175
                    var routeArr = data.route_geometry;
                    L.polyline(routeArr, { color: 'green' }).addTo(leafletMap);
                }
                ////console.log('success');
                ////console.log(data);
            }, function (error) {
                console.log('error');
                console.log(error);
            })
        };

        angScope.getFeatureCollection = function () {
            angGeoFeatureCollection.query(function (response) {
                // response - topojson
                // convert to geoJson
                var geoJsonFt = topojson.feature(response, response.objects.collection);
                console.log(geoJsonFt);
                L.geoJson(geoJsonFt).addTo(leafletMap);
            }, function (error) {
                console.log(error);
            });
        };

        angScope.findPlace = function () {
            // todo: improve search by other responses and other sources
            // https://github.com/olegsmith/leaflet.geocoding/blob/master/leaflet.geocoding.js
            //// $.ajax({
            ////     url: 'http://nominatim.openstreetmap.org/search'
            ////, dataType: 'jsonp'
            ////, jsonp: 'json_callback'
            ////, data: {
            ////    'q': 'London'
            ////    , 'format': 'json'
            ////}
            //// })
            ////.done(function (data) {
            ////    console.log('success');
            ////    console.log(data);
            ////});

            angGeoCoding.query({ q: angScope.mapForm.name }, function (data) {
                if (data.length > 0) {
                    angScope.mapForm.lat = data[0].lat;
                    angScope.mapForm.lon = data[0].lon;
                    leafletMap.setView([angScope.mapForm.lat, angScope.mapForm.lon], 12);
                    ////cb({
                    ////    query: query
                    ////    , content: res.display_name
                    ////    , latlng: new L.LatLng(res.lat, res.lon)
                    ////    , bounds: new L.LatLngBounds([res.boundingbox[0], res.boundingbox[2]], [res.boundingbox[1], res.boundingbox[3]])
                    ////});
                }
                else {
                    alert('Place not found');
                }
            }, function () {
                alert('Error');
                console.log('error');
                console.log(p);
            });

            ////, function (response) {

            ////    console.log('data');
            ////    console.log(response);
            ////    ////var firstGeoPoint = response.features[0];
            ////    ////if (firstGeoPoint) {
            ////    ////    leafletMap.setView(firstGeoPoint.centroid.coordinates, 12);
            ////    ////}
            ////}, function (error) {
            ////    console.log('error');
            ////    console.log(error);
            ////});
        }
    }];

    var MapYandexCtrl = ['$scope', function (angScope) {
        var myMap;

        angScope.mapForm = { isMapLoaded: false };

        angScope.initialize = function () {
            ymaps.ready(function () {
                if (!ymaps.geolocation) {
                    ymaps.geolocation = {
                        latitude: 55.76,
                        longitude: 37.64,
                        zoom: 10
                    };
                }

                myMap = new ymaps.Map('map_yandex', {
                    center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
                    zoom: 5
                });

                myMap.controls.add(new ymaps.control.ZoomControl());

                myMap.behaviors.enable(["scrollZoom", "dblClickZoom"]);

                if (!angScope.$$phase) {
                    angScope.$apply(function () {
                        angScope.mapForm.isMapLoaded = true;
                    });
                }

                function getShareCoord(centerLatitude, centerLongitude, radius) {
                    ////var arr = [];
                    ////for (var i = 0; i < 360; i += 1) {
                    ////    arr.push([centerLatitude, centerLongitude + radius]);
                    ////}

                    return [[55.80, 37.30], [55.80, 37.40], [55.70, 37.30], [55.70, 37.40]];
                }

                var myCircle = new ymaps.GeoObject({
                    geometry: {
                        type: "Circle",
                        coordinates: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
                        radius: 100000
                    }
                });

                myMap.geoObjects.add(myCircle);

                // https://github.com/rmoskal/v3-eshapes/blob/master/eshapes.js
                ////var myEllipse = new ymaps.GeoObject({
                ////    geometry: {
                ////        type: "LineString",
                ////        coordinates: getShareCoord()
                ////    }
                ////});

                ////myMap.geoObjects.add(myEllipse);
            });
        };

        // Обработчик загрузки XML-файлов.
        function onGeoXmlLoad(res, isLastMap) {
            myCollection.add(res.geoObjects);
            // Изменение области показа карты
            //  myMap.setBounds(bounds);

            if (isLastMap === true) {
                console.log(myCollection.getLength());
                ////myMap.geoObjects.add(myCollection);

                // building routes
                var routeCollection = new ymaps.GeoObjectCollection({}, {});
                myCollection.each(function (elemValue) {
                    /////console.log(elemValue.getLength());
                    elemValue.each(function (objValue) {
                        ////console.log(objValue.geometry.getCoordinates());
                        ///
                        var routeCoords = objValue.geometry.getCoordinates();

                        ymaps.route([myMap.getCenter(), routeCoords]).then(function (route) {
                            routeCollection.add(route);
                            //    console.log(route);
                            ////myMap.geoObjects.add(route);

                            console.log(routeCollection.getLength());
                            if (routeCollection.getLength() === 23) {
                                myMap.geoObjects.add(routeCollection);
                                ////http://api.yandex.ru/maps/doc/jsapi/2.x-rc/ref/reference/router.Route.xml
                            }
                        });
                    });
                });

                //console.log(myCollection.get(0)); // Первый объект    
            }
            //if (res.mapState) {
            //    res.mapState.applyToMap(myMap);
            //}
            // bounds - заданная область показа карты
            // var bounds = res.mapState.getBounds();
            // Добавление коллекции геообъектов на карту
            ////myMap.geoObjects.add(res.geoObjects);
        }

        function onGeoXmlLoadError(error) {
            // todo: handle error

            alert(error);
            /////$("#loader").html('<span style="color:red">Ошибка при загрузке YMapsML: ' + error + '</span>');
        }

        function loadToCollection(mapName, isLastMap) {
            ymaps.geoXml.load("http://maps.yandex.ua/export/usermaps/" + mapName + "/").then(function (res) {
                onGeoXmlLoad(res, isLastMap);
            }, onGeoXmlLoadError);
        }

        angScope.findPlace = function () {
            if (angScope.mapForm.isMapLoaded === true) {
                ymaps.geocode($scope.startPointName, { results: 1 }).then(function (res) {
                    var firstGeoObject = res.geoObjects.get(0);
                    if (firstGeoObject !== null) {
                        var coords = firstGeoObject.geometry.getCoordinates();

                        myMap.setCenter(coords, 7, {
                            duration: 1
                        });

                        var myCollection = new ymaps.GeoObjectCollection({}, {
                            preset: 'twirl#brownStretchyIcon',
                            geoObjectCursor: 'point'
                        });

                        ////var mapNameList = ["EraqyPO94sOvKxc6kNQ2XbMHO7EJJR0R", "t3pjobj4S1hssyQjYPRKI1DGSCQkU9iI", "JBAz7LI1otiUXlo8Kq8WJtF_w2y7pb_5"];
                        var mapNameList = ["EraqyPO94sOvKxc6kNQ2XbMHO7EJJR0R", "t3pjobj4S1hssyQjYPRKI1DGSCQkU9iI"];

                        for (var i = 0, ilimit = mapNameList.length; i < ilimit; i += 1) {
                            // Загрузка YMapsML-файла
                            var isLastMap = (i === ilimit - 1);
                            loadToCollection(mapNameList[i], isLastMap);
                        }
                    }

                    ////// Осуществляет рекурсивный отбор объектов с заданным значением свойства
                    ////var filteredObj =
                    ////gCollection.filter(function (obj) {
                    ////    return obj.property == "filter";
                    ////})

                });
            }
        };
    }];

    rpr.when('/geo', { controller: GeoCtrl, templateUrl: '/geo.html' })
        .when('/create', { controller: CreateCtrl, templateUrl: '/create.html' })
        .when('/map-yandex', { controller: MapYandexCtrl, templateUrl: '/map-yandex.html' })
        .when('/map-leaflet', { controller: MapLeafletCtrl, templateUrl: '/map-leaflet.html' })
        .otherwise({ redirectTo: '/map-leaflet' });

    ////$locationProvider.html5Mode(true);
}]);

app.run(function ($rootScope) {
    ////console.log($rootScope);
});
// =========== config block ===========
// Only providers and constants can be injected into configuration blocks
// http://stackoverflow.com/questions/10486769/cannot-get-to-rootscope
// =========== run block =======
// Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.
// It is executed after all of the service have been configured and the injector has been created