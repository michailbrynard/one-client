/*global Firebase, console, angular */
angular.module('starter.services.dashboard', [])
    .service('Images', function ($http, API) {
        'use strict';
        var self = this;

        self.query = function () {
            return $http.get(API + '/images/');
        };
    });
