/*global Firebase, console, angular */
angular.module('starter.services.friends', [])
    .service('Friends', function ($http, API) {
        'use strict';
        var self = this;

        self.add = function (email) {
            return $http.post(API + '/friends/', {
                'friend_id': name,
                'instruction': 'add'
            });
        };

        self.remove = function(userId, friendId) {
            return $http.post(API + '/friends/', {
                'friend_id': name,
                'instruction': 'delete'
            });
        };

        self.list = function () {
            return $http.get(API + '/friends/').then(function (res) {
                return res;
            });
        };

        self.getImages = function (friendId) {
             return $http.get(API + '/friends/' + friendId + '/').then(function (res) {
                return res;
            });
        };
    });