'use strict';

// var THREE = require('three.js');

// // Add the plugin
// require('three-first-person-controls')(THREE);

// requirejs.config({
//     //By default load any module IDs from js/lib
//     baseUrl: '../npm_modules',
//     //except, if the module ID starts with "app",
//     //load it from the js/app directory. paths
//     //config is relative to the baseUrl, and
//     //never includes a ".js" extension since
//     //the paths config could be for a directory.
//     paths: {
//         app: '../app'
//     }
// });

// // Start the main app logic.
// requirejs(['three-first-person-controls'],
// function   ($) {
//     //jQuery, canvas and the app/sub module are all
//     //loaded and can be used here now.
// });

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

          if(wall === 2){
            //has right wall
            console.log('cell ', row, col, 'has a right wall');
          }

          //bottom
          wall = cell & 4;
          

          if(wall === 4){
            //has bottom wall
            console.log('cell ', row, col, 'has a bottom wall');
          }

          //left
          wall = cell & 8;

          if(wall === 8){
            //has left wall
            console.log('cell ', row, col, 'has a right wall');
          }



        }
      }
    };

    mazes.go = function(){
      console.log('i am going');
      mazes.threeHelper();
      //mazes.animate();
    }

    mazes.threeHelper = function()
    {
      var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,
        ASPECT = WIDTH / HEIGHT,
        UNITSIZE = 240,
        WALLTHICKNESS = 20,
        WALLOFFSET = UNITSIZE/2 - WALLTHICKNESS/2,
        WALLHEIGHT = UNITSIZE / 3,
        MOVESPEED = 100,
        LOOKSPEED = 0.075,
        NUMAI = 5;

      var t = THREE,scene, cam, renderer, controls, clock, projector, model, skin;
      var runAnim = true, mouse = { x: 0, y: 0 };


      var init = function(){


        clock = new t.Clock(); // A high-performance timer used to calculate the time between rendering frames in order to smooth animation
        projector = new t.Projector(); // A helper class for projecting 2D rays (on the screen) into 3D rays (in the virtual world)
        scene = new t.Scene(); // The "world" environment. Holds all other objects.
        scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // Add fog to the world. Helps with depth perception. Params are color (in hex) and density
       
        // Set up camera so we know from where to render the scene
        cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
        cam.position.y = UNITSIZE * .2; // Raise the camera off the ground
        cam.position.x = 0 - mazes.n/2;
        cam.position.z = 0 - mazes.n/2;
        scene.add(cam); // Add the camera to the scene
       
        // Camera moves with mouse, flies around with WASD/arrow keys
        // controls = new THREE.FirstPersonControls(cam); // Handles camera control
        // controls.movementSpeed = MOVESPEED; // How fast the player can walk around
        // controls.lookSpeed = LOOKSPEED; // How fast the player can look around with the mouse
        // controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
        // controls.noFly = true; // Don't allow hitting R or F to go up or down
       
        // World objects
        setupScene(); // Adds physical objects to the world. Described later
       
        // Handle drawing as WebGL (faster than Canvas but less supported by browsers)
        renderer = new t.WebGLRenderer();
        renderer.setSize(WIDTH, HEIGHT); // Give the renderer the canvas size explicitly

        // Add the canvas to the document
        renderer.domElement.style.backgroundColor = '#D6F1FF'; // Make it easier to see that the canvas was added. Also this is the sky color
        document.body.appendChild(renderer.domElement); // Add the canvas to the document
       

     
      }


      // Set up the objects in the world
      function setupScene() {
        //var units = mapW;
       
        // Geometry: floor
        var floor = new t.Mesh(
            new t.CubeGeometry(mazes.n * UNITSIZE, 10, mazes.n * UNITSIZE),
            new t.MeshLambertMaterial({color: 0xEDCBA0})
        );
        scene.add(floor);
       
        // Geometry: walls
        var topBottomWall = new t.BoxGeometry(UNITSIZE, WALLHEIGHT, WALLTHICKNESS);
        var rightLeftWall = new t.BoxGeometry(WALLTHICKNESS, WALLHEIGHT, UNITSIZE);
        var materials = new t.MeshLambertMaterial({color: 0xff0000});
        var tbWall = new t.Mesh(topBottomWall, materials);
        var rlWall = new t.Mesh(rightLeftWall, materials);
        for (var row = 0; row < mazes.n; row++) {
          for (var col = 0; col < mazes.n; col++) {
            var cell = mazes.maze[row][col];
            var wall;
            
            //top
            wall = cell & 1;
            

            if(wall === 1){
              //has top wall
              tbWall.position.x = (row - mazes.n/2) * UNITSIZE;
              tbWall.position.y = WALLHEIGHT/2;
              tbWall.position.z = (col - mazes.n/2) * UNITSIZE + WALLOFFSET;
              scene.add(tbWall);
              console.log('cell ', row, col, 'has a top wall');
            }

            //right 
            wall = cell & 2;

            if(wall === 2){
              //has right wall
              rlWall.position.x = (row - mazes.n/2) * UNITSIZE + WALLOFFSET;
              rlWall.position.y = WALLHEIGHT/2;
              rlWall.position.z = (col - mazes.n/2) * UNITSIZE;
              scene.add(rlWall);
              console.log('cell ', row, col, 'has a right wall');
            }

            //bottom
            wall = cell & 4;
            

            if(wall === 4){
              //has bottom wall
              tbWall.position.x = (row - mazes.n/2) * UNITSIZE;
              tbWall.position.y = WALLHEIGHT/2;
              tbWall.position.z = (col - mazes.n/2) * UNITSIZE - WALLOFFSET;
              scene.add(tbWall);
              console.log('cell ', row, col, 'has a bottom wall');
            }

            //left
            wall = cell & 8;

            if(wall === 8){

              //has left wall
              rlWall.position.x = (row - mazes.n/2) * UNITSIZE - WALLOFFSET;
              rlWall.position.y = WALLHEIGHT/2;
              rlWall.position.z = (col - mazes.n/2) * UNITSIZE;
              scene.add(rlWall);
              console.log('cell ', row, col, 'has a right wall');
            }
          
          }
        }

        // Lighting
          var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
          directionalLight1.position.set( 0.5, 1, 0.5 );
          scene.add( directionalLight1 );
          var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
          directionalLight2.position.set( -0.5, -1, -0.5 );
          scene.add( directionalLight2 );
        }
        init();
        // Helper function for browser frames
        function animate() {
          if (runAnim) {
            requestAnimationFrame(animate);
          }
          render();
        }
        animate();


        function render() {
          //controls.update(delta); // Move camera
          renderer.render(scene, cam);

        }


        
        };

          




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
