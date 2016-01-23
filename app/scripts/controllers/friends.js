/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.friends', [])

    .controller('FriendListingCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, $window, Friends, $ionicPopup) {
        'use strict';
        $ionicLoading.show({template: 'Loading...'});
        $scope.openFriend = function (id) {
            $state.go('tab.friendView', {
                friendId: id
            });
        };

        $ionicModal.fromTemplateUrl('templates/friend_add.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.addFriend = function (email) {
            if (email) {
                $ionicLoading.show({
                    template: 'Adding Friend...'
                });
                Friends.add(email).then(function () {
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    $ionicPopup.alert({title: 'Friend Added'});
                });
            } else {
                $ionicPopup.alert({title: 'Please fill all details'});
            }
        };

        if ($window.localStorage.friend) {
            $scope.items = JSON.parse($window.localStorage.friends);
            $ionicLoading.hide();
        }

        Friends.list().then(function (rawData) {
            var items = [];
            for (var i = 0; i < rawData.data.results.length; i++) {
                items[i] = {
                    'id': rawData.data.results[i].friend.id,
                    'title': rawData.data.results[i].friend.friend_name,
                    'last_upload': rawData.data.results[i].last_upload
                };
            }
            $scope.items = items;
            $window.localStorage.friends = JSON.stringify(items);
            $ionicLoading.hide();
        });

        // Temp loader
        $ionicLoading.hide();
    })

    .controller('FriendViewCtrl', function ($scope, $stateParams, $state, $ionicLoading, $http, $ionicModal, $window, Friends, $ionicPopup) {
        'use strict';
        var friendId = $stateParams.friendId;
        if (friendId === null) {
            $state.go('tab.friend');
            return;
        }
        $scope.friendId = friendId;
        var viewedUrls = [];
        $ionicLoading.show({template: 'Loading...'});
        if ($window.localStorage[friendId]) {
            $scope.items = JSON.parse($window.localStorage[friendId]);
            $ionicLoading.hide();
        }

        Friends.getImages(friendId).then(function (rawData) {
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
            $window.localStorage[friendId] = JSON.stringify(items);
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
        
        $scope.removeFriend = function (userId, friendId, name) {
            $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Are you sure you would like to remove ' + name
            }).then(function (res) {
                if (res) {
                    Friends.remove(userId, friendId).then(function (rawData) {
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