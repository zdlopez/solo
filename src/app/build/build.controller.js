'use strict';

angular.module('appMaze')
  .controller('buildController', function ($scope, builds) {
    angular.extend($scope, builds);
    $scope.n = 0;

    
    $scope.func = function(userChoice){
      $scope.choice = '';
      $scope.n = userChoice;
      $scope.map = $scope.newMaze(userChoice, userChoice);
      $scope.mapTranslated = $scope.translate($scope.map);
      console.log('this working', userChoice);
      console.log($scope.map);
      console.log($scope.mapTranslated);
    }
    //console.log($scope.choice);
  })
  .factory('builds', function($http){
    var builds = {};


    builds.mapIt = function(size){
      var arrRow = [];
      var results = [];

      for(var i = 0; i < size; i++){
        arrRow.push(0);
      }

      for(var j = 0; j < size; j++){
        results.push(arrRow.slice(0));
      }

      return results;
    }

    builds.translate = function(maps){
      var results = [];

      for(var i = 0; i < maps.length; i++){
        var row = [];
        for(var j = 0; j < maps.length; j++){
          var temp = 0;
          var cell = maps[i][j];
          temp = cell[0] * 4 + cell[1] * 8 + cell[2] * 1 + cell[3] * 2;

          /*
          These are oriented to the screen
          top, right, bottom, left

          empty cell = 0;
          top = 0001 = 1
          right = 0010 = 2
          bottom = 0100 = 4
          left = 1000 = 8
          */
          row.push(temp);
        }
        results.push(row);
      }
      return results;
    }

    builds.newMaze = function(x, y) {

        // Establish variables and starting grid
        var totalCells = x*y;
        var cells = new Array();
        var unvis = new Array();
        for (var i = 0; i < y; i++) {
            cells[i] = new Array();
            unvis[i] = new Array();
            for (var j = 0; j < x; j++) {
                cells[i][j] = [0,0,0,0];
                unvis[i][j] = true;
            }
        }
        
        // Set a random position to start from
        var currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
        var path = [currentCell];
        unvis[currentCell[0]][currentCell[1]] = false;
        var visited = 1;
        
        // Loop through all available cell positions
        while (visited < totalCells) {
            // Determine neighboring cells
            var pot = [[currentCell[0]-1, currentCell[1], 0, 2],
                    [currentCell[0], currentCell[1]+1, 1, 3],
                    [currentCell[0]+1, currentCell[1], 2, 0],
                    [currentCell[0], currentCell[1]-1, 3, 1]];
            var neighbors = new Array();
            
            // Determine if each neighboring cell is in game grid, and whether it has already been checked
            for (var l = 0; l < 4; l++) {
                if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
            }
            
            // If at least one active neighboring cell has been found
            if (neighbors.length) {
                // Choose one of the neighbors at random
                var next = neighbors[Math.floor(Math.random()*neighbors.length)];
                
                // Remove the wall between the current cell and the chosen neighboring cell
                cells[currentCell[0]][currentCell[1]][next[2]] = 1;
                cells[next[0]][next[1]][next[3]] = 1;
                
                // Mark the neighbor as visited, and set it as the current cell
                unvis[next[0]][next[1]] = false;
                visited++;
                currentCell = [next[0], next[1]];
                path.push(currentCell);
            }
            // Otherwise go back up a step and keep going
            else {
                currentCell = path.pop();
            }
        }
        return cells;
    }

    return builds;

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
