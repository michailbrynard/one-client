/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.dashboard', [])
    .controller('MyPhotosCtrl', function ($scope, Images) {
        'use strict';

        var refreshData = function () {
            Images.query().success(
                function (data) {
                    $scope.images = data.results;
                    console.log('images');
                    console.log($scope.images);
                }
            );
        };

        $scope.$on('$ionicView.afterEnter', function () { // $scope.$on('$destroy'
            console.log('ENTER');
            refreshData();
        })
    });
