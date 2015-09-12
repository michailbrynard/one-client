/*global angular, console, window, alert, ionic */

angular.module('starter.controllers', [])
    //.controller('CameraCtrl', function ($scope, $state, $cordovaFileTransfer, $ionicLoading, Camera, User, Auth, API) {
    //    'use strict';
    //    if (!Auth.isAuthed()) {
    //        $state.go('login');
    //    }
    //
    //
    //    // open PhotoLibrary
    //    $scope.openPhotoLibrary = function () {
    //        'use strict';
    //
    //        console.log('Hello');
    //
    //        document.addEventListener('deviceready', function () {
    //
    //            var camera_options = {
    //                quality : 75
    //            };
    //
    //            Camera.getPicture(camera_options).then(function (imagePath) {
    //                alert('Image will be at: ' + imagePath);
    //                $ionicLoading.show({
    //                    template: 'Uploading...'
    //                });
    //
    //                var options = {
    //                    fileKey: 'image',
    //                    fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
    //                    chunkedMode: false,
    //                    mimeType: 'image/jpg',
    //                    headers: {'Authorization': 'JWT ' + Auth.getToken(), 'Connection': 'close'}
    //                };
    //
    //                $cordovaFileTransfer.upload(API + '/image/', imagePath, options).then(function (result) {
    //                    $ionicLoading.hide();
    //                    alert('SUCCESS: ' + JSON.stringify(result));
    //                    alert('Result_' + result.response[0] + '_ending');
    //                    alert('success');
    //                    alert(JSON.stringify(result.response));
    //
    //                }, function (err) {
    //                    alert('ERROR: ' + JSON.stringify(err));
    //                    $ionicLoading.hide();
    //                    //alert(JSON.stringify(err));
    //                }, function (progress) {
    //                    // constant progress updates
    //                });
    //            }, function (err) {
    //                alert(err);
    //            });
    //        });
    //    };
    //})

    .
    controller('GroupListingCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, Groups) {
        'use strict';
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
            console.log('Create User Function called');
            if (name) {
                $ionicLoading.show({
                    template: 'Adding Group...'
                });
                Groups.create(name).then(function () {

                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert('Group Added');
                }).catch(function (error) {
                    window.alert('Error:' + error.message);
                    $ionicLoading.hide();
                });
            } else {
                window.alert('Please fill all details');
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
        });
    })

    .controller('GroupViewCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, Groups) {
        'use strict';
        var groupId = $stateParams.groupId;
        if (groupId == null) {
            $state.go('tab.group');
            return;
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
                }).catch(function (error) {
                    window.alert('Error:' + error.message);
                    $ionicLoading.hide();
                });
            } else {
                window.alert('Please fill all details');
            }
        };

        Groups.getImages(groupId).then(function (rawData) {
            console.log(JSON.stringify(rawData));
            var items = [];
            for (var i = 0; i < rawData.data.results.length; i++) {
                items[i] = {
                    'uploader': rawData.data.results[i].user_group.user.first_name,
                    'uploadedAt': rawData.data.results[i].created_timestamp,
                    'imageUrl': rawData.data.results[i].image.image
                }
            };
            $scope.items = items;
        });
    })

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
        });

        // Polling functions
        /*
         var promise;
         $scope.$on('$ionicView.afterEnter', function () { // $scope.$on('$destroy'
         console.log('ENTER');
         promise = $interval(refreshData, REFRESH_INTERVAL);
         });

         // Cancel interval view change
         $scope.$on('$ionicView.leave', function () {
         console.log('LEAVE');
         if (angular.isDefined(promise)) {
         $interval.cancel(promise);
         promise = undefined;
         }
         });

         $scope.$on('$destroy', function () {
         console.log('LEAVE');
         if (angular.isDefined(promise)) {
         $interval.cancel(promise);
         promise = undefined;
         }
         });
         */
    })

    .controller('AccountViewCtrl', function ($scope, Images) {
        'use strict';
        window.alert("We Are All in the account");
    });
