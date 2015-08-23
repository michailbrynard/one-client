/*global Firebase, console, angular */
angular.module('starter.services', ['firebase'])

    .factory('authInterceptor', function (API, Auth, $location) {
        'use strict';
        return {
            // automatically attach Authorization header
            request: function (config) {
                var token = Auth.getToken();

                if (token && config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'JWT ' + token;
                }

                return config;
            },

            // If a token was sent back, save it
            response: function (res) {
                if (res.data.results) {
                    if (res.config.url.indexOf(API) === 0 && res.data.results.token) {
                        Auth.saveToken(res.data.results.token);
                        Auth.saveUser(res.data.results.user_info);
                    }
                }

                return res;
            },
            //Redirect to login if unauthorised
            responseError: function (res) {
                window.alert('Code: ' + res.status);
                if (res.status === 401) {
                    console.log('unauthorized');
                    $location.path('/login');
                }

                return res;
            }
        };
    })
    .factory('Camera', ['$q', function($q) {
        'use strict';

        return {
        getPicture: function(options) {
          var q = $q.defer();

          navigator.camera.getPicture(function(result) {
            // Do any magic you need
            q.resolve(result);
          }, function(err) {
            q.reject(err);
          }, options);

          return q.promise;
        }
        };
    }])

    .service('Auth', function ($window) {
        'use strict';

        var self = this;

        // Add JWT methods here
        self.parseJwt = function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        self.saveToken = function (token) {
            $window.localStorage.jwtToken = token;
        };

        self.saveUser = function (user) {
            $window.localStorage.user = JSON.stringify(user);
        };

        self.getToken = function () {
            return $window.localStorage.jwtToken;
        };

        self.getUser = function () {
            return JSON.parse($window.localStorage.user);
        };

        self.isAuthed = function () {
            var token = self.getToken();
            if (token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        self.logout = function () {
            $window.localStorage.removeItem('jwtToken');
        };
    })

    .service('User', function ($http, API, Auth) {
        'use strict';
        var self = this;

        // add authentication methods here
        self.register = function (first_name, email, password1, password2) {
            return $http.post(API + '/register/', {
                first_name: first_name,
                email: email,
                password1: password1,
                password2: password2
            })
                .then(function (res) {
                    Auth.saveToken(res.data.token);
                    Auth.saveUser(res.data.results.user_info);
                    return res;
                });
        };

        self.login = function (email, password) {
            return $http.post(API + '/login/', {
                'email': email,
                'password': password
            });
        };

        self.getCurrent = function () {
            return Auth.getUser();
        };
    })

    .service('Images', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function () {
            return $http.get(API + '/images/');
        };

        self.get = function (groupId) {
            return $http.get(API + '/images/' + groupId + '/');
        };

        self.save = function (questionId, question) {
            return $http.put(API + '/asker/questions/' + questionId + '/', {
                'question': question
            });
        };

        self.create = function (city, category, question) {
            console.log(question);
            return $http.post(API + '/asker/questions/', {
                'city': city,
                'category': category,
                'question': question
            });
        };

    })

    .service('Cities', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function () {
            return $http.get(API + '/cities/');
        };

    })

    .service('Groups', function($http, API){
        'use strict';
        var self = this;

        self.create = function(name) {
            return $http.post(API + '/groups/', {
                'name': name
            });
        };

        self.list = function() {
            return $http.get(API + '/groups/').then(function (res) {
                    return res;
                });
        };

        self.getImages = function(id) {
            return $http.get(API + '/groups/' + id);
        }

    })

    .service('Categories', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function () {
            return $http.get(API + '/categories/');
        };

    })

    .service('ExpertQuestions', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function () {
            return $http.get(API + '/expert/questions/');
        };

        self.get = function (questionId) {
            return $http.get(API + '/expert/questions/' + questionId + '/');
        };

        self.create = function (questionId, channelId, message, expertId, userId) {
            return $http.post(API + '/expert/questions/' + questionId + '/', {
                'message': message,
                'uni_channel_id': channelId,
                'user': userId,
                'expert': expertId
            });
        };

    })

    .service('AskerChannels', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function (questionId) {
            return $http.get(API + '/asker/channels/' + questionId + '/');
        };

        self.get = function (channelId) {
            return $http.get(API + '/asker/channels/' + channelId + '/');
        };

        self.save = function (channelId, channel) {
            return $http.put(API + '/asker/channels/' + channelId + '/', {
                'question': channel
            });
        };

        self.create = function (channel) {
            console.log(channel);
            return $http.post(API + '/asker/channels/', {
                'question': channel
            });
        };

    });




