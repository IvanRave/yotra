var app = angular.module("project", ['geodata']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/map', { controller: MapCtrl, templateUrl: '/map.html' })
        .when('/geo', { controller: GeoCtrl, templateUrl: '/geo.html' })
        .when('/create', { controller: CreateCtrl, templateUrl: '/create.html' })
        .when('/login', { controller: LoginCtrl, templateUrl: '/login.html' })
        .otherwise({ redirectTo: '/geo' });

    ////$locationProvider.html5Mode(true);

    var client = new WindowsAzure.MobileServiceClient('https://rave-mobile.azure-mobile.net/', 'cJVLPsElKKsvBvtlYLKJwPgBzkFPmk65');

    function GeoCtrl($scope, GeoData) {
        $scope.geoPointList = GeoData.query();
    }

    function CreateCtrl($scope, $location, GeoData) {
        $scope.save = function () {
            GeoData.save($scope.project, function (project) {
                $location.path('/geo');
            });
        }
    }

    function LoginCtrl($scope) {
        // todo: how to move to global?
        ////$scope.isLoggedIn = client.currentUser !== null;

        $scope.loginWithFacebook = function () {
            ////if ($scope.isLoggedIn === true) { return; }

            client.login('facebook').then(function (response) {
                console.log(response);
                console.log(client.currentUser);
            },
            function (error) {
                console.log(error);
            });
        };
    }

    function MapCtrl($scope) {
        var myMap;

        $scope.isMapLoaded = false;

        $scope.initialize = function () {
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

                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.isMapLoaded = true;
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

        $scope.findPlace = function () {
            if ($scope.isMapLoaded === true) {
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
    }
}]);

// http://stackoverflow.com/questions/10486769/cannot-get-to-rootscope
app.run(function ($rootScope) {
    var client = new WindowsAzure.MobileServiceClient('https://rave-mobile.azure-mobile.net/', 'cJVLPsElKKsvBvtlYLKJwPgBzkFPmk65');
    $rootScope.isLoggedIn = client.currentUser !== null;

    console.log(client.currentUser);
    console.log('hello');
});