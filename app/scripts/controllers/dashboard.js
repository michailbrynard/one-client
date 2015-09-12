/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.dashboard', [])
    .controller('MyPhotosCtrl', function ($scope, $http, $window, Images, $ionicLoading, $ionicPopup) {
        'use strict';
        $ionicLoading.show({
            template: 'Loading...'
        });
        var viewedUrls = [];

        var refreshData = function () {
            if ($window.localStorage.myPhotos){
                $scope.items = JSON.parse($window.localStorage.myPhotos);
                $ionicLoading.hide();
            }
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
                    $window.localStorage.myPhotos = JSON.stringify(items);
                    $ionicLoading.hide();
                    $scope.nextUrl = rawData.next;
                    console.log(items);
                    console.log('URL');
                    console.log($scope.nextUrl);
                    if (items.length == 0) {
                        $ionicPopup.alert({title: 'You have not uploaded anything yet'});
                    }
                }
            );
        };

        $scope.loadNext = function () {
            if ($scope.nextUrl && viewedUrls.indexOf($scope.nextUrl) < 0) {
                viewedUrls.push($scope.nextUrl);
                $http.get($scope.nextUrl).success(
                    function (rawData) {
                        for (var i = 0; i < rawData.results.length; i++) {
                            $scope.items.push({
                                'imageUrl': rawData.results[i].image.image,
                                'uploadedAt': rawData.results[i].image.created_timestamp
                            });
                        }
                        $scope.nextUrl = rawData.next;
                    }
                );
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.$on('$ionicView.afterEnter', function () { // $scope.$on('$destroy'
            console.log('ENTER');
            refreshData();
        });
    });
