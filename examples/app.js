'use strict';
var app = angular.module('app', [
	'ngSanitize',
	'angularify.semantic.accordion',
    'angularify.semantic.checkbox',
    'angularify.semantic.dropdown',
    'angularify.semantic.dimmer',
    'angularify.semantic.modal',
    'angularify.semantic.popup',
    'angularify.semantic.rating',
    'angularify.semantic.sidebar'
]);

app.controller('DropDownCtrl', ['$scope',
    function($scope) {
    	// Static Example
    	$scope.mydropdown = 'item1';

        // Dynamic Example
        $scope.titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
        $scope.person = {
            title: 'Mr.'
        };


    }
]);
