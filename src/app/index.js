'use strict';

angular.module('appMaze', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ngMaterial'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('game', {
        url: '/game',
        templateUrl: 'app/game/game.html',
        controller: 'gameController'
      })
      .state('build', {
        url: '/build',
        templateUrl: 'app/build/build.html',
        controller: 'buildController'
      });

    $urlRouterProvider.otherwise('/');
  })
;
