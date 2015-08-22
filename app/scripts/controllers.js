/*global angular, console, window */

angular.module('starter.controllers', [])

    .controller('CityCtrl', function ($scope, $state) {
        'use strict';
        console.log('this!');
        $scope.cityId = 1; //default
        $scope.selectCity = function (cityId) {
            $state.go('tab.ask_category', {
                cityId: cityId
            });
        };
    })

    .controller('CategoryCtrl', function ($scope, $state, $stateParams) {
        'use strict';
        console.log('yo');
        $scope.cityId = $stateParams.cityId;
        $scope.categoryId = 1; //default
        $scope.selectCategory = function (cityId, categoryId) {
            console.log(cityId, categoryId);
            $state.go('tab.ask_question', {
                cityId: cityId,
                categoryId: categoryId
            });
        };
    })

    .controller('QuestionCtrl', function ($scope, AskerQuestions, $state) {
        'use strict';
        $scope.createQuestion = function (question) {
            AskerQuestions.create($scope.categoryId, $scope.cityId, question.question);
            $state.go('tab.questions');
        };
    })

    .controller('ChannelDashCtrl', function ($scope, AskerChannels, $state, $stateParams) {
        'use strict';
        console.log('hello!');
        AskerChannels.query($stateParams.questionId).success(
            function (data) {
                $scope.channels = data.results;
                console.log('length');
                console.log($scope.channels.length);
            }
        );
        $scope.openChat = function (channelId) {
            console.log(channelId);
            $state.go('tab.chat', {
                channelId: channelId
            });
        };
    })

    .controller('QuestionDashCtrl', function ($scope, AskerQuestions, $state) {
        'use strict';
        AskerQuestions.query().success(
            function (data) {
                $scope.questions = data.results;
                console.log('length');
                console.log($scope.questions.length);
            }
        );
        $scope.openChannels = function (questionId) {
            console.log(questionId);
            $state.go('tab.channels', {
                questionId: questionId
            });
        };
    })

    .controller('ExpertQuestionDashCtrl', function ($scope, Auth, ExpertQuestions, ChannelsSocket, $state, $interval, REFRESH_INTERVAL) {
        'use strict';
        console.log('expertQ');
        var refreshData = function () {
            ExpertQuestions.query().success(
                function (data) {
                    $scope.questions = data.results;
                    console.log('questions');
                    console.log($scope.questions);
                }
            );
        };

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

        $scope.openChannel = function (question) {
            console.log('uni_channel_id: ' + question.channel_info);
            if (question.channel_info === null) {
                $scope.createChannel(question).then(function (channelId) {
                    console.log('cID');
                    console.log(channelId);
                    $state.go('tab.expert-chat', {
                        questionId: question.id,
                        channelId: channelId,
                        newChannel: true,
                        asker: question.user_info.id
                    });
                });
            } else {
                var channelId = question.channel_info.uni_channel_id;
                $state.go('tab.expert-chat', {
                    questionId: question.id,
                    channelId: channelId,
                    newChannel: true,
                    asker: question.user_info.id
                });
            }
        };
        $scope.createChannel = function (question) {
            var channelId = ChannelsSocket.create(question);
            console.log('xxx');
            console.log(channelId);
            return channelId;
        };
    })

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

    .controller('AccountCtrl', function ($scope) {
        'use strict';
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('ChatCtrl', function ($scope, MessagesSocket, ExpertQuestions, User, $stateParams) {
        'use strict';
        console.log('Chat Controller initialized');

        $scope.IM = {
            textMessage: ''
        };

        console.log($stateParams.channelId);

        MessagesSocket.initialize($stateParams.channelId);

        var channelName = 'Chat';

        // Fetching Chat Records only if a Room is Selected
        if (channelName) {
            $scope.channelName = ' - ' + channelName;
            $scope.chats = MessagesSocket.query();
        }

        $scope.sendMessage = function (msg) {
            console.log(msg);
            console.log($scope.displayName);
            //if it is a new channel, save to django api:
            var expert = User.getCurrent();
            console.log(expert.id);
            if ($stateParams.newChannel) {
                ExpertQuestions.create($stateParams.questionId,
                    $stateParams.channelId,
                    msg,
                    expert.id,
                    $stateParams.asker);
                $stateParams.newChannel = false;
            }
            MessagesSocket.create({'displayName': expert.first_name}, msg);
            $scope.IM.textMessage = '';
        };

        $scope.remove = function (chat) {
            MessagesSocket.remove(chat);
        };
    });
