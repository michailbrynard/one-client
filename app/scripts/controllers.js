/*global angular, console, window */

angular.module('starter.controllers', [])

    .controller('LoginCtrl', function ($scope, $ionicModal, $state, $ionicLoading, $rootScope, User, $http, API) {
        //console.log('Login Controller Initialized');
        'use strict';

        $ionicModal.fromTemplateUrl('templates/signup.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.registerUser = function (user) {
            window.alert('Create User Function called');
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
                    window.alert('Login Success: ' + JSON.stringify(res.data));
                    $ionicLoading.hide();
                    $state.go('tab.camera');
                }).catch(function (error) {
                    window.alert('Authentication failed:' + error.message);
                    $ionicLoading.hide();
                });
            } else {
                window.alert('Please enter both email and password');
            }
        };
    })
    .controller('CameraCtrl', function ($scope, $state, $cordovaFileTransfer, Camera, User, Auth, API) {
        'use strict';
        if (!Auth.isAuthed()) {
            $state.go('login');
        }
        // open PhotoLibrary
        $scope.openPhotoLibrary = function () {
            'use strict';

            Camera.getPicture().then(function (imagePath) {
                alert('Image will be at: ' + imagePath);

                var date = new Date();

                var options = {
                    fileKey: "file",
                    fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg"
                };

                $cordovaFileTransfer.upload(imagePath, API + "/images", options).then(function (result) {
                    alert("SUCCESS: " + JSON.stringify(result.response));
                    alert('Result_' + result.response[0] + '_ending');
                    alert("success");
                    alert(JSON.stringify(result.response));

                }, function (err) {
                    alert("ERROR: " + JSON.stringify(err));
                    //alert(JSON.stringify(err));
                }, function (progress) {
                    // constant progress updates
                });
            }, function (err) {
                alert(err);
            });
        };
    })

    .controller('GroupListingCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, Groups) {
        'use strict';
        $scope.openGroup = function (id) {
            $state.go('tab.groupView', {
                groupId: id
            })
        }

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
              Group.create(name).then(function() {

                  $ionicLoading.hide();
                  $scope.modal.hide();
                  alert('Group Added');
              }).catch(function (error) {
                  window.alert('Error:' + error.message);
                  $ionicLoading.hide();
              });

                // User.register(user.first_name, user.email, user.password1, user.password2)
                //     .then(function (res) {
                //         console.log(res.status);
                //         if (res.status === 201) {
                //             window.alert('User added successfully!');
                //         } else {
                //             window.alert('Error: ' + res.message);
                //         }

                //         $ionicLoading.hide();
                //         $scope.modal.hide();
                //     }).catch(function (error) {
                //         window.alert('Error: ' + error);
                        $ionicLoading.hide();
                //     });
            } else {
                window.alert('Please fill all details');
            }
        };

        Groups.list().then(function(rawData){
          var items = [];
          for (var i = 0; i < rawData.data.results.length; i++) {
            items[i] = {
              'id': rawData.data.results[i].group.id,
              'title': rawData.data.results[i].group.group_name,
              'last_upload': rawData.data.results[i].last_upload
            }
          };
          $scope.items = items;
        });
    })

    .controller('GroupViewCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, Groups){
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
              Group.addUser(groupId, email).then(function() {

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

      Groups.getImages(groupId).then(function(rawData){
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

      // var rawData = Groups.getImages(groupId);
      // $scope.items = [
      //   {
      //     uploader : 'Human Name 1',
      //     uploadedAt : '00:00:59 23 August 2015',
      //     imageUrl : 'http://made-in-stellenbosch.com/img/helghardt.jpg'
      //   },
      //   {
      //     uploader : 'Human Name 2',
      //     uploadedAt : '00:00:59 23 August 2015',
      //     imageUrl : 'http://made-in-stellenbosch.com/img/michail.jpg'
      //   },
      //   {
      //     uploader : 'Human Name 3',
      //     uploadedAt : '00:00:59 23 August 2015',
      //     imageUrl : 'http://made-in-stellenbosch.com/img/hugo.jpg'
      //   },
      //   {
      //     uploader : 'Human Name 4',
      //     uploadedAt : '00:00:59 23 August 2015',
      //     imageUrl : 'http://made-in-stellenbosch.com/img/christo.jpg'
      //   },
      // ];
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
    });
