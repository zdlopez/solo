'use strict';

angular.module('appMaze')
  .controller('buildController', function ($scope, builds) {
    angular.extend($scope, mazes);
    //$scope.render();
    //$scope.score = mazes.timer.value;
    
  })
  .factory('builds', function($http){
    

  });

  /* maze cell orientations
  These are oriented to the screen
  top, right, bottom, left

  empty cell = 0;
  top = 0001 = 1
  right = 0010 = 2
  bottom = 0100 = 4
  left = 1000 = 8

  top & left = 1001 = 9
  top & right = 0011 = 3

  all = 1111 = 15
  
  */
