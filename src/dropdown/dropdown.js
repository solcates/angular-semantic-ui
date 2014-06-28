'use strict';

angular.module('angularify.semantic.dropdown', ['ngSanitize'])
    .controller('DropDownController', ['$scope',
        function($scope) {
            $scope.items = [];
            $scope.display = '';


            this.remove_item = function(scope) {
                var index = $scope.items.indexOf(scope);
                if (index !== -1)
                    $scope.items.splice(index, 1);
            };

            this.add_item = function(scope) {
                $scope.items.push(scope);
                scope.$on('$destroy', function(event) {
                    this.remove_item(scope);
                });
                return $scope.items;
            };

            this.update_title = function(title) {
                $scope.selected_title = title;
                var i = 0;
                for (i in $scope.items) {
                    $scope.items[i].title = title;
                }
            };
        }
    ])

.directive('dropdown', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'DropDownController',
        required: 'ngModel',
        scope: {
            open: '@',
            model: '=ngModel',
            styletype: '@',
            displayTitle: '='

        },
        template: '<div class="{{dropdown_class}}">' + '<div class="default text">{{displayTitle||model}}</div>' + '<i class="dropdown icon"></i>' + '<div class="menu" ng-transclude>' + '</div>' + '</div>',
        link: function(scope, element, attrs, DropDownController) {

            scope.base_class = 'ui ' + scope.styletype + ' dropdown';
            scope.dropdown_class = scope.base_class;
            if (scope.open === 'true') {
                scope.open = true;
                scope.dropdown_class = scope.base_class + ' active visible';
            } else {
                scope.open = false;
            }
            DropDownController.add_item(scope);

            //
            // Watch for ng-model changing
            //
            scope.$watch('model', function(val) {
                // update title
                scope.model = val;
                DropDownController.update_title(val);
                if (angular.isDefined(attrs.onChange)) {
                    scope.$parent.$eval(attrs.onChange);
                }
            });


            //
            // Click handler
            //
            element.bind('click', function() {
                if (scope.open === false || scope.open === undefined) {
                    scope.open = true;
                    scope.$apply(function() {
                        scope.dropdown_class = scope.base_class + ' active visible';
                    });
                } else {
                    scope.open = false;
                    scope.model = scope.title
                    scope.$apply(function() {
                        scope.dropdown_class = scope.base_class + ' ';
                    });
                }
            });
        }
    };
})

.directive('dropdownGroup', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^dropdown',
        scope: {
            title: '=title',
            displayTitle: '='
        },
        template: '<div class="item" ng-transclude >{{displayTitle}}</div>',
        link: function(scope, element, attrs, DropDownController) {

            // Check if title= was set... if not take the contents of the dropdown-group tag
            // title= is for dynamic variables from something like ng-repeat {{variable}}
            var title;
            if (scope.title !== undefined) {
                title = scope.title;
            } else {
                title = element.children()[0].innerHTML;
            }

            //
            // Menu item click handler
            //
            element.bind('click', function() {
                DropDownController.update_title(title);


            });
        }
    };
});
