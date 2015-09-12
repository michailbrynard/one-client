/*global Firebase, console, angular */
angular.module('starter.services.dashboard', [])
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
    });
