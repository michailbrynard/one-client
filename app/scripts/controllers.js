/*global angular, console, window, alert, ionic */

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

