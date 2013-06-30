// Modules can list other modules as their dependencies.
// ==============
// Modules are a way of managing $injector configuration, and have nothing to do with loading of scripts into a VM. 
// There are existing projects which deal with script loading, which may be used with Angular. 
// Because modules do nothing at load time they can be loaded into the VM in any order 
// and thus script loaders can take advantage of this property and parallelize the loading process.
var app = angular.module('project', ['geodata', 'yotraFilters']);

var wamsClient = new WindowsAzure.MobileServiceClient('https://rave-mobile.azure-mobile.net/', 'cJVLPsElKKsvBvtlYLKJwPgBzkFPmk65');

////LoginPartialCtrl.$inject = ['$scope'];
var LoginPartialCtrl = ['$scope', function (fncScope) {
    fncScope.curUser = null;

    fncScope.logOnWithFacebook = function () {
        wamsClient.login('facebook').then(function (response) {
            ////console.log(response);
            ////console.log(wamsClient.currentUser);
            if (!fncScope.$$phase) {
                fncScope.$apply(function () {
                    fncScope.curUser = wamsClient.currentUser.userId;
                    console.log(wamsClient.currentUser);
                });
            }

        }, function (error) {
            console.log(error);
        });
    };
}];

// In AngularJS, model values on the scope should always "have a dot", meaning be objects instead of primitives.
// $routeParams (contains route params: $routeParams.phoneId;)
app.config(['$routeProvider', function (rpr) {
    var GeoCtrl = ['$scope', 'GeoData', function (angScope, angGeoData) {
        angScope.geoForm = { pointList: angGeoData.query() };
    }];

    var CreateCtrl = ['$scope', '$location', 'GeoData', function (angScope, angLocation, angGeoData) {
        angScope.save = function () {
            angGeoData.save(angScope.project, function (project) {
                angLocation.path('/geo');
            });
        };
    }];
    
    var MapCtrl = ['$scope', function (angScope) {
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

                myMap = new ymaps.Map('map', {
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

    rpr.when('/map', { controller: MapCtrl, templateUrl: '/map.html' })
        .when('/geo', { controller: GeoCtrl, templateUrl: '/geo.html' })
        .when('/create', { controller: CreateCtrl, templateUrl: '/create.html' })
        .otherwise({ redirectTo: '/geo' });

    ////$locationProvider.html5Mode(true);
}]);

app.run(function ($rootScope) {
    console.log($rootScope);
});
// =========== config block ===========
// Only providers and constants can be injected into configuration blocks
// http://stackoverflow.com/questions/10486769/cannot-get-to-rootscope
// =========== run block =======
// Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.
// It is executed after all of the service have been configured and the injector has been created