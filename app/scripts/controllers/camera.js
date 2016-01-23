/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.camera', [])

    .controller('CameraCtrl', function ($scope, $state, $ionicLoading, $cordovaFileTransfer, $cordovaCamera, Upload, User, Auth, API, Groups, $ionicPopup) {
        'use strict';
        if (!Auth.isAuthed()) {
            $state.go('login');
        }

        //TODO: Figure out why Upload doesn't work on Android and FileTransfer doesnt work on iOS
        $scope.getPicture = function () {
            'use strict';

            document.addEventListener("deviceready", function () {
                $ionicLoading.show({
                    template: 'Checking...'
                });

                User.canUpload().then(function(rawData) {
                    $ionicLoading.hide();
                    // window.alert(JSON.stringify(rawData));
                    if (rawData.data.status == 'True') {
                        if (ionic.Platform.isIOS()) {
                            var options = {
                                quality: 75,
                                destinationType: Camera.DestinationType.DATA_URL,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                allowEdit: true,
                                encodingType: Camera.EncodingType.JPEG,
                                targetWidth: 1024,
                                targetHeight: 1024,
                                popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: true
                            };

                            $cordovaCamera.getPicture(options).then(function (imageData) {
                                Upload.upload({
                                    url: API + '/image/',
                                    fileName: 'image.jpeg',
                                    fileFormDataName: 'image',
                                    file: imageData
                                }).progress(function (evt) {
                                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                                }).success(function (data, status, headers, config) {
                                    $ionicPopup.alert({title: "Image Uploaded"});
                                }).error(function (data, status, headers, config) {
                                    alert('error status: ' + status);
                                });
                            }, function (err) {
                                window.alert(err);
                            });
                        } else if (ionic.Platform.isAndroid()) {
                            var camera_options = {
                                quality: 75,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                allowEdit: true,
                                encodingType: Camera.EncodingType.JPEG,
                                targetWidth: 1024,
                                targetHeight: 1024,
                                popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false
                            };

                            $cordovaCamera.getPicture(camera_options).then(function (imagePath) {
                                $ionicLoading.show({
                                    template: 'Uploading...'
                                });

                                var options = {
                                    fileKey: 'image',
                                    fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                                    chunkedMode: true,
                                    mimeType: 'image/jpg',
                                    headers: {'Authorization': 'JWT ' + Auth.getToken(), 'Connection': 'close'}
                                };

                                $cordovaFileTransfer.upload(API + '/image/', imagePath, options).then(function (result) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({title: "Image Uploaded"});
                                }, function (err) {
                                    $ionicPopup.alert({title: 'Error', template: JSON.stringify(err)});
                                    $ionicLoading.hide();
                                    //alert(JSON.stringify(err));
                                }, function (progress) {
                                    // constant progress updates
                                });
                            });
                        }
                        else
                        {
                            $ionicPopup.alert({title: 'Your device is not recognised, and cannot submit photos'});
                        }
                    } else {
                        $ionicPopup.alert({title: rawData.data.message});
                    }
                });
            }, false);
        };
    });