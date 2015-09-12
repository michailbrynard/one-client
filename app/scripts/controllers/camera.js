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
                            alert('You are using ios');
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
                                Groups.list().then(function(rawData) {
                                    $scope.data = {};
                                    var values = '';
                                    var items = [];
                                    for (var i = 0; i < rawData.data.results.length; i++) {
                                        items[i] = rawData.data.results[i].group.id;
                                        var values = values + '<ion-checkbox ng-model="data.groups['
                                            + rawData.data.results[i].group.id
                                            + ']">'
                                            + rawData.data.results[i].group.group_name
                                            + '</ion-checkbox>';
                                    }
                                    $ionicPopup.show({
                                        template: values,
                                        title: 'Select Groups',
                                        subTitle: 'Which grups do you want to send to?',
                                        scope: $scope,
                                        buttons: [
                                            { text: 'Cancel' },
                                            {
                                                text: '<b>Upload</b>',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    return $scope.data;
                                                }
                                            }
                                        ]
                                    }).then(function(res) {
                                        var l = '';
                                        for (var key in res.groups) {
                                          if (res.groups.hasOwnProperty(key)) {
                                            l = l + ',' + key;
                                          }
                                        }
                                        var g = l.substring(1);
                                        if (g.length > 0) {
                                            Upload.upload({
                                                url: API + '/image/' + g,
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
                                        }
                                    });
                                });
                            }, function (err) {
                                alert(err);
                            });

                        } else if (ionic.Platform.isAndroid()) {
                            alert('You are using Android');
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
                                Groups.list().then(function(rawData) {
                                    $scope.data = {};
                                    var values = '';
                                    var items = [];
                                    for (var i = 0; i < rawData.data.results.length; i++) {
                                        items[i] = rawData.data.results[i].group.id;
                                        var values = values + '<ion-checkbox ng-model="data.groups['
                                            + rawData.data.results[i].group.id
                                            + ']">'
                                            + rawData.data.results[i].group.group_name
                                            + '</ion-checkbox>';
                                    }
                                    $ionicPopup.show({
                                        template: values,
                                        title: 'Select Groups',
                                        subTitle: 'Which groups do you want to send to?',
                                        scope: $scope,
                                        buttons: [
                                            { text: 'Cancel' },
                                            {
                                                text: '<b>Upload</b>',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    return $scope.data;
                                                }
                                            }
                                        ]
                                    }).then(function(res) {
                                        var l = '';
                                        for (var key in res.groups) {
                                          if (res.groups.hasOwnProperty(key)) {
                                            l = l + ',' + key;
                                          }
                                        }
                                        var g = l.substring(1);
                                        if (g.length > 0) {
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

                                            $cordovaFileTransfer.upload(API + '/image/' + g, imagePath, options).then(function (result) {
                                                $ionicLoading.hide();
                                                $ionicPopup.alert({title: "Image Uploaded"});
                                            }, function (err) {
                                                alert('ERROR: ' + JSON.stringify(err));
                                                $ionicLoading.hide();
                                                //alert(JSON.stringify(err));
                                            }, function (progress) {
                                                // constant progress updates
                                            });
                                        } else {
                                            $ionicPopup.alert({title: "You should have selected a group"});
                                        }
                                    });
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