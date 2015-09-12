/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.dashboard', [])
    .controller('MyPhotosCtrl', function ($scope, $http, Images) {
        'use strict';


        var refreshData = function () {
            Images.query().success(
                function (rawData) {
                    console.log(JSON.stringify(rawData));
                    var items = [];
                    for (var i = 0; i < rawData.results.length; i++) {
                        items[i] = {
                            'imageUrl': rawData.results[i].image.image,
                            'uploadedAt': rawData.results[i].image.created_timestamp
                        };
                    }
                    $scope.items = items;
                    $scope.nextUrl = rawData.next;
                    console.log(items);
                    console.log('URL');
                    console.log($scope.nextUrl);
                }
            );
        };

        $scope.loadNext = function () {
            $http.get($scope.nextUrl).success(
                function (rawData) {
                    for (var i = 0; i < rawData.results.length; i++) {
                        $scope.items.push({
                            'imageUrl': rawData.results[i].image.image,
                            'uploadedAt': rawData.results[i].image.created_timestamp
                        });
                        $scope.nextUrl = rawData.next;
                    }
                }
            );
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.$on('$ionicView.afterEnter', function () { // $scope.$on('$destroy'
            console.log('ENTER');
            refreshData();
        });
    });
