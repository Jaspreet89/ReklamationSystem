(function () {

    'use strict';

    angular
        .module('RefundSystemApp', ['ui.router', 'satellizer', 'angularFileUpload'])
        .config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$httpProvider', '$provide', '$locationProvider', function ($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, $locationProvider) {

            function redirectWhenLoggedOut($q, $injector) {

                return {
                    responseError: function (rejection) {
                        var $state = $injector.get('$state');
                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
                        angular.forEach(rejectionReasons, function (value, key) {
                            if (rejection.data.error === value) {
                                localStorage.removeItem('user');
                                $state.go('auth');
                            }
                        });
                        return $q.reject(rejection);
                    }
                }
            }


            $provide.factory('redirectWhenLoggedOut', ['$q', '$injector', redirectWhenLoggedOut]);
            $httpProvider.interceptors.push('redirectWhenLoggedOut');
            $authProvider.loginUrl = configuration.path + '/api/authenticate';
            $urlRouterProvider.otherwise('/auth');
            $stateProvider
                .state('auth', {
                    url: '/auth',
                    templateUrl: '../resources/views/AuthView.blade.php',
                    controller: 'AuthController as auth'
                })
                .state('users', {
                    url: '/users',
                    templateUrl: '../resources/views/UserView.blade.php',
                    controller: 'UserController as user'
                })
                .state('sellerrefundform', {
                    url: '/sellerrefundform',
                    templateUrl: '../resources/views/SellerRefundForm.blade.php',
                    controller: 'SellerRefundFormCtrl as sellerrefundform'
                })
                .state('manageuser', {
                    url: '/manageuser',
                    templateUrl: '../resources/views/ManageUser.blade.php',
                    controller: 'ManageUserCtrl as manageuser'
                })
                .state('warehouse', {
                    url: '/warehouse',
                    templateUrl: '../resources/views/Warehouse.blade.php',
                    controller: 'WarehouseCtrl as warehouse'
                })
                .state('notification', {
                    url: '/notification',
                    templateUrl: '../resources/views/Notification.blade.php',
                    controller: 'NotificationCtrl as notification'
                })
                .state('upload', {
                    url: '/upload',
                    templateUrl: '../resources/views/Uploader.blade.php',
                    params: {
                        'casedId': -1
                    }
                })
                .state('warehouseitem', {
                    url: '/warehouseitem',
                    templateUrl: '../resources/views/WarehouseItem.blade.php',
                    controller: 'WarehouseItemCtrl as warehouseitem',
                    params: {
                        'casedata': ''
                    }
                })
            ;
        }])
        .run(['$rootScope', '$state','$window', function ($rootScope, $state,$window) {
            $rootScope.getGlobals = function(variableName){
                return $window[variableName];
            };
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                $('.ui-dialog').remove();
                user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser = user;
                    if (toState.name === "auth") {
                        event.preventDefault();
                        if (fromState.name === "") {
                            $state.go('users');
                        }
                    }
                }
            });
        }]);
})();
//# sourceMappingURL=app.js.map
