/*global angular, console, window, alert, ionic */

angular.module('starter.controllers.account', [])

    .controller('LoginCtrl', function ($scope, $ionicModal, $state, $ionicLoading, $rootScope, User, $ionicPopup) {
        //console.log('Login Controller Initialized');
        'use strict';

        $ionicModal.fromTemplateUrl('templates/signup.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.registerUser = function (user) {
            if (user && user.first_name && user.email && user.password1 && user.password2) {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });

                User.register(user.first_name, user.email, user.password1, user.password2)
                    .then(function (res) {
                        console.log(res.status);
                        if (res.status === 201) {
                            $ionicPopup.alert({title: 'User created successfully!'});
                        } else {
                            $ionicPopup.alert({title: "Error", template: res.message});
                        }

                        $ionicLoading.hide();
                        $scope.modal.hide();
                    }).catch(function (error) {
                        $ionicPopup.alert({title: "Error", template: error});
                        $ionicLoading.hide();
                    });
            } else {
                $ionicPopup.alert({title: 'Please fill all details'});
            }
        };

        $scope.logIn = function (user) {
            if (user && user.email && user.password) {
                $ionicLoading.show({
                    template: 'Signing In...'
                });
                User.login(user.email, user.password).then(function (res) {
                    $ionicLoading.hide();
                    $state.go('tab.camera');
                }).catch(function (error) {
                    $ionicPopup.alert({title: 'Authentication failed', template: error.message});
                    $ionicLoading.hide();
                });
            } else {
                $ionicPopup.alert({title: 'Please enter both email and password'});
            }
        };
    })

    .controller('AccountViewCtrl', function ($scope, $state, Auth) {
        'use strict';
        $scope.logOut = function (user) {
            $ionicPopup.alert({title: 'Logging out, goodbye'});
            Auth.logout();
            $state.go('login');
        };
    });