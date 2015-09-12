/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.dashboard', [])
    .controller('MyPhotosCtrl', function ($scope, Images) {
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
                    console.log(items)
                }
            );
        };

        $scope.$on('$ionicView.afterEnter', function () { // $scope.$on('$destroy'
            console.log('ENTER');
            refreshData();
        })
    });
