/*global ionic, angular, window */
// Ionic Starter App

var firebaseUrl = 'https://gozebra.firebaseio.com';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'firebase',
    'angularMoment',
    'ngCordova',
    'ngFileUpload',
    'starter.controllers.account',
    'starter.controllers.camera',
    'starter.controllers.dashboard',
    'starter.controllers.friends',
    'starter.services.account',
    'starter.services.camera',
    'starter.services.dashboard',
    'starter.services.friends',
])

    //.constant('API', 'http://onepi.cf/api')
    .constant('API', 'http://127.0.0.1:8000/api')
    .constant('REFRESH_INTERVAL', 3000)

    .config(function ($httpProvider, $ionicConfigProvider) {
        'use strict';
        //Switch off caching:
        $ionicConfigProvider.views.maxCache(0);
        //Insert JWT token into all api requests:
        $httpProvider.interceptors.push('authInterceptor');
    })

    .run(function ($ionicPlatform, $rootScope) {
        'use strict';
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
                StatusBar.overlaysWebView(true);
                StatusBar.show();
            }

            $rootScope.firebaseUrl = firebaseUrl;
            $rootScope.displayName = null;
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // State to represent Login View
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'

            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                cache: false
            })

            .state('tab.camera', {
                url: '/camera',
                views: {
                    'tab-camera': {
                        templateUrl: 'templates/camera.html',
                        controller: 'CameraCtrl'
                    }
                }
            })

            .state('tab.dashboard', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'MyPhotosCtrl'
                    }
                }
            })

            .state('tab.friend', {
                url: '/friend',
                views: {
                    'tab-friend': {
                        templateUrl: 'templates/friend.html',
                        controller: 'FriendListingCtrl'
                    }
                }
            })

            .state('tab.friendView', {
                url: '/friend/view',
                views: {
                    'tab-friend': {
                        templateUrl: 'templates/friend_view.html',
                        controller: 'FriendViewCtrl'
                    }
                },
                params: {
                    friendId: null
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account.html',
                        controller: 'AccountViewCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/camera');

    });
