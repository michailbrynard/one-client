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

    .controller('GroupListingCtrl', function ($scope, $state, ListGroups) {
        'use strict';
        $scope.openGroup = function (id) {
            $state.go('tab.groupView', {
                groupId: id
            })
        }
        // $scope.items = ListGroups.query();
        $scope.items = [
            {id: 1, title: 'Group1'},
            {id: 2, title: 'Group2'},
            {id: 3, title: 'Group3'},
            {id: 4, title: 'Group4'},
            {id: 5, title: 'Group5'},
            {id: 'new', title: 'Create New Group'}
        ];
    })

    .controller('GroupViewCtrl', function ($scope, $stateParams, $state, GetImages) {
        'use strict';
        var groupId = $stateParams.groupId;
        if (groupId == null) {
            $state.go('tab.group');
            return;
        }
        // $rawData = GetImages.query(groupId);
        $scope.items = [
            {
                uploader: 'Human Name 1',
                uploadedAt: '00:00:59 23 August 2015',
                imageUrl: 'http://made-in-stellenbosch.com/img/helghardt.jpg'
            },
            {
                uploader: 'Human Name 2',
                uploadedAt: '00:00:59 23 August 2015',
                imageUrl: 'http://made-in-stellenbosch.com/img/michail.jpg'
            },
            {
                uploader: 'Human Name 3',
                uploadedAt: '00:00:59 23 August 2015',
                imageUrl: 'http://made-in-stellenbosch.com/img/hugo.jpg'
            },
            {
                uploader: 'Human Name 4',
                uploadedAt: '00:00:59 23 August 2015',
                imageUrl: 'http://made-in-stellenbosch.com/img/christo.jpg'
            }
        ];
    })

    .controller('MyPhotosCtrl', function ($scope, API) {
        'use strict';
        $scope.images = [
            {
                url: 'http://made-in-stellenbosch.com/img/helghardt.jpg',
                timestamp: '00:00:59 23 August 2015'
            },
            {
                url: 'http://made-in-stellenbosch.com/img/louw.jpg',
                timestamp: '00:00:59 23 August 2015'
            }
        ];
        console.log($scope.images);
    });
