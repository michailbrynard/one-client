/*global Firebase, console, angular */
angular.module('starter.services.groups', [])
    .service('Groups', function ($http, API) {
        'use strict';
        var self = this;

        self.create = function (name) {
            return $http.post(API + '/groups/', {
                'group_name': name
            });
        };

        self.list = function () {
            return $http.get(API + '/groups/').then(function (res) {
                return res;
            });
        };

        self.getImages = function (id) {
            return $http.get(API + '/images/' + id + '/');
        };

        self.addUser = function (groupId, email) {
            return $http.post(API + '/groups/' + groupId + '/', {
                'email': email
            });
        };
        self.getGroup = function (groupId) {
            return $http.get(API + '/groups/' + groupId + '/');
        };

        self.removeHuman = function(groupId, humanId) {
            return $http.post(API + '/groups/' + groupId + '/delete/' + humanId + '/');
        }

    });