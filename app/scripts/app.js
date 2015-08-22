/*global ionic, angular, window */
// Ionic Starter App

var firebaseUrl = 'https://gozebra.firebaseio.com';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'angularMoment', 'starter.controllers', 'starter.services'])

    .constant('API', 'http://localhost:9090/api')
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
                StatusBar.styleLightContent();
            }
            // To Resolve Bug
            ionic.Platform.fullScreen();

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

            .state('city', {
                url: '/city',
                templateUrl: 'templates/city.html'
            })
            .state('category', {
                url: '/category',
                templateUrl: 'templates/category.html',
                controller: 'CategoryCtrl'
            })
            .state('question', {
                url: '/question',
                templateUrl: 'templates/question.html',
                controller: 'QuestionCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                cache: false
            })

            .state('tab.ask_city', {
                url: '/ask_city',
                views: {
                    'tab-ask': {
                        templateUrl: 'templates/city.html',
                        controller: 'CityCtrl'
                    }
                }
            })

            .state('tab.ask_category', {
                url: '/ask_category',
                views: {
                    'tab-ask': {
                        templateUrl: 'templates/category.html',
                        controller: 'CategoryCtrl'
                    }
                },
                params: {
                    'cityId': null
                }
            })

            .state('tab.ask_question', {
                url: '/ask_question',
                views: {
                    'tab-ask': {
                        templateUrl: 'templates/question.html',
                        controller: 'QuestionCtrl',
                        cache: false
                    }
                }
            })

            .state('tab.questions', {
                url: '/questions',
                views: {
                    'tab-questions': {
                        templateUrl: 'templates/tab-questions.html',
                        controller: 'QuestionDashCtrl',
                        cache: false
                    }
                },
                params: {
                    'cityId': null,
                    'categoryId': null
                }
            })

            // Each tab has its own nav history stack:

            .state('tab.channels', {
                url: '/channels',
                views: {
                    'tab-questions': {
                        templateUrl: 'templates/tab-channels.html',
                        controller: 'ChannelDashCtrl',
                        cache: false
                    }
                },
                params: {'questionId': null}
            })

            .state('tab.chat', {
                url: '/chat/',
                views: {
                    'tab-questions': {
                        templateUrl: 'templates/tab-chat.html',
                        controller: 'ChatCtrl',
                        cache: false
                    }
                },
                params: {
                    'channelId': null,
                    'questionId': null,
                    'expert': null,
                    'user': null,
                    'newChannel': false
                }
            })

            .state('tab.expert-chat', {
                url: '/expert/chat/',
                views: {
                    'tab-answer': {
                        templateUrl: 'templates/tab-chat.html',
                        controller: 'ChatCtrl',
                        cache: false
                    }
                },
                params: {
                    'channelId': null,
                    'questionId': null,
                    'expert': null,
                    'user': null,
                    'newChannel': false
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

            .state('tab.answer', {
                url: '/expert/questions',
                views: {
                    'tab-answer': {
                        templateUrl: 'templates/expert-questions.html',
                        controller: 'ExpertQuestionDashCtrl'
                    }
                }
            })

            .state('expertQuestions', {
                url: '/expert/questions',
                templateUrl: 'templates/expert-questions.html',
                controller: 'ExpertQuestionDashCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
