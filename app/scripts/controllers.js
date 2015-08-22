/*global angular, console, window */

angular.module('starter.controllers', [])

    .controller('LoginCtrl', function ($scope, $ionicModal, $state, $ionicLoading, $rootScope, User) {
        //console.log('Login Controller Initialized');
        'use strict';

        $ionicModal.fromTemplateUrl('templates/signup.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.registerUser = function (user) {
            console.log('Create User Function called');
            if (user && user.first_name && user.email && user.password1 && user.password2) {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });

                User.register(user.first_name, user.email, user.password1, user.password2)
                    .then(function (res) {
                        console.log(res.status);
                        if (res.status === 201) {
                            window.alert('User created successfully!');
                        } else {
                            window.alert('Error: ' + res.message);
                        }

                        $ionicLoading.hide();
                        $scope.modal.hide();
                    }).catch(function (error) {
                        window.alert('Error: ' + error);
                        $ionicLoading.hide();
                    });
            } else {
                window.alert('Please fill all details');
            }
        };

        $scope.logIn = function (user) {

            if (user && user.email && user.password) {
                $ionicLoading.show({
                    template: 'Signing In...'
                });
                User.login(user.email, user.password).then(function (res) {
                    console.log(res.status);
                    $ionicLoading.hide();
                    $state.go('tab.questions');
                }).catch(function (error) {
                    window.alert('Authentication failed:' + error.message);
                    $ionicLoading.hide();
                });
            } else {
                window.alert('Please enter both email and password');
            }
        };
    })
    .controller('CameraUpload', function($scope, $ionicModal, $state, $ionicLoading, $rootScope, User){
      // open PhotoLibrary
      $scope.openPhotoLibrary = function() {
          var options = {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imagePath) {
              // var image = document.getElementById('tempImage');
              // image.src = imagePath;

              var date = new Date();

              var options = {
                  fileKey: "file",
                  fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                  chunkedMode: false,
                  mimeType: "image/jpg"
              };

              $cordovaFileTransfer.upload(API + "/upload_image", imagePath, options).then(function(result) {
                  console.log("SUCCESS: " + JSON.stringify(result.response));
                  console.log('Result_' + result.response[0] + '_ending');
                  alert("success");
                  alert(JSON.stringify(result.response));

              }, function(err) {
                  console.log("ERROR: " + JSON.stringify(err));
                  //alert(JSON.stringify(err));
              }, function (progress) {
                  // constant progress updates
              });

          }, function(err) {
              // error
              console.log(err);
          });
      };
    });
