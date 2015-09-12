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
                });
            } else {
                $ionicPopup.alert({title: 'Please enter both email and password'});
            }
        };
    })

    .controller('AccountViewCtrl', function ($scope, $state, Auth, $ionicPopup, User) {
        'use strict';
        $scope.logOut = function (user) {
            $ionicPopup.alert({title: 'Logging out, goodbye'});
            Auth.logout();
            $state.go('login');
        };

        $scope.createSnorty = function() {
            $scope.data = {}
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.snorty">',
                title: 'Create a new snorty',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.snorty) {
                                e.preventDefault();
                            } else {
                                return $scope.data.snorty;
                            }
                        }
                    }
                ]
            }).then(function(res) {
                User.createSnorty(res).then(function(rawData) {
                    if (rawData.data.status == 'success') {
                        $ionicPopup.alert({title: 'Snorty Added'});
                    } else {
                        $ionicPopup.alert({title: rawData.data.message});
                    }
                });
            });
        };
    });