'use strict';

angular.module('appMaze')
  .controller('gameController', function ($scope, mazes) {
    angular.extend($scope, mazes);
    $scope.render();
    
  })
  .factory('mazes', function($http){
    var mazes = {};
    mazes.n = 4; //will be a user val;


    //in the server implementation this will be 
    //an http call
    mazes.maze = [
    [15, 14, 13, 12],
    [11, 10, 9, 8],
    [7, 6, 5, 4],
    [3, 2, 1, 0]

    ];

    mazes.render = function(){
      var cell = 0;

      for(var row = 0; row < mazes.n; row++){
        for(var col = 0; col < mazes.n; col++){
          cell = mazes.maze[row][col];
          var wall;
          
          //top
          wall = cell & 1;
          

          if(wall === 1){
            //has top wall
            console.log('cell ', row, col, 'has a top wall');
          }

          //right 
          wall = cell & 2;
          //wall >> 1;
          

          if(wall === 2){
            //has top wall
            console.log('cell ', row, col, 'has a right wall');
          }

          //bottom
          wall = cell & 4;
          //wall >> 1;
          

          if(wall === 4){
            //has top wall
            console.log('cell ', row, col, 'has a bottom wall');
          }

          //left
          wall = cell & 8;
          //wall >> 1;
          

          if(wall === 8){
            //has top wall
            console.log('cell ', row, col, 'has a right wall');
          }



        }
      }
    }

    return mazes;

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
