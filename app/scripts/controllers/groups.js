/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.groups', [])

    .controller('GroupListingCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, Groups, $ionicPopup) {
        'use strict';
        $ionicLoading.show({template: 'Loading...'});
        $scope.openGroup = function (id) {
            $state.go('tab.groupView', {
                groupId: id
            });
        };

        $ionicModal.fromTemplateUrl('templates/group_create.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.addGroup = function (name) {
            if (name) {
                $ionicLoading.show({
                    template: 'Adding Group...'
                });
                Groups.create(name).then(function () {

                    $ionicLoading.hide();
                    $scope.modal.hide();
                    $ionicPopup.alert({title: 'Group Added'});
                });
            } else {
                $ionicPopup.alert({title: 'Please fill all details'});
            }
        };

        Groups.list().then(function (rawData) {
            var items = [];
            for (var i = 0; i < rawData.data.results.length; i++) {
                items[i] = {
                    'id': rawData.data.results[i].group.id,
                    'title': rawData.data.results[i].group.group_name,
                    'last_upload': rawData.data.results[i].last_upload
                };
            }
            $scope.items = items;
            $ionicLoading.hide();
        });
    })

    .controller('GroupViewCtrl', function ($scope, $stateParams, $state, $ionicLoading, $http, $ionicModal, $window, Groups, $ionicPopup) {
        'use strict';
        var groupId = $stateParams.groupId;
        if (groupId === null) {
            $state.go('tab.group');
            return;
        }
        $scope.groupId = groupId;
        var viewedUrls = [];
        $ionicLoading.show({template: 'Loading...'});
        if ($window.localStorage[groupId]) {
            $scope.items = JSON.parse($window.localStorage[groupId]);
            $ionicLoading.hide();
        }

        $ionicModal.fromTemplateUrl('templates/group_add_person.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.addUser = function (email) {
            console.log('Create User Function called');
            if (email) {
                $ionicLoading.show({
                    template: 'Adding Person...'
                });
                Groups.addUser(groupId, email).then(function () {

                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert('Person Added');
                });
            } else {
                window.alert('Please fill all details');
            }
        };

        Groups.getGroup(groupId).then(function (rawData) {
            var people = [];
            for (var i = 0; i < rawData.data.results.length; i++) {
                people[i] = {
                    'id': rawData.data.results[i].user.id,
                    'name': rawData.data.results[i].user.first_name
                };
            }
            $scope.people = people;
        });
        Groups.getImages(groupId).then(function (rawData) {
            var items = [];
            for (var i = 0; i < rawData.data.results.length; i++) {
                items[i] = {
                    'uploader': rawData.data.results[i].image.user.first_name,
                    'uploadedAt': rawData.data.results[i].created_timestamp,
                    'imageUrl': rawData.data.results[i].image.image
                };
                $scope.nextUrl = rawData.data.next;
            }
            $scope.items = items;
            $window.localStorage[groupId] = JSON.stringify(items);
            $ionicLoading.hide();
        });

        $scope.loadNext = function () {
            if ($scope.nextUrl && viewedUrls.indexOf($scope.nextUrl) < 0) {
                viewedUrls.push($scope.nextUrl);
                console.log($scope.nextUrl);
                $http.get($scope.nextUrl).success(
                    function (rawData) {
                        console.log(JSON.stringify(rawData));
                        for (var i = 0; i < rawData.results.length; i++) {
                            $scope.items.push({
                                'uploader': rawData.results[i].image.user.first_name,
                                'imageUrl': rawData.results[i].image.image,
                                'uploadedAt': rawData.results[i].image.created_timestamp
                            });
                            $scope.nextUrl = rawData.next;
                        }
                    }
                );
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        };
        $scope.removeHuman = function (groupId, humanId, name) {
            $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Are you sure you would like to remove ' + name
            }).then(function (res) {
                if (res) {
                    Groups.removeHuman(groupId, humanId).then(function (rawData) {
                        if (rawData.data.status == 'success') {
                            $ionicPopup.alert({title: 'Deleted them'});
                        } else {
                            $ionicPopup.alert({title: rawData.data.message});
                        }
                    });
                }
            });

        };
    });