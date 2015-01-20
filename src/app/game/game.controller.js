'use strict';

angular.module('appMaze')
  .controller('gameController', function ($scope, mazes) {
    angular.extend($scope, mazes);
    //$scope.render();
    
  })
  .factory('mazes', function($http){
    var mazes = {};
    mazes.n = 4; //will be a user val;


    //in the server implementation this will be 
    //an http call
    mazes.maze = [
    [11, 14, 13, 12],
    [10, 10, 9, 8],
    [10, 6, 5, 4],
    [10, 2, 1, 0]

    ];


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

      var t = THREE,scene, cam, renderer, keyboard, controls, clock, model, skin;
      var runAnim = true, mouse = { x: 0, y: 0 };


      var init = function(){


        clock = new t.Clock(); // A high-performance timer used to calculate the time between rendering frames in order to smooth animation
        scene = new t.Scene(); // The "world" environment. Holds all other objects.
        scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // Add fog to the world. Helps with depth perception. Params are color (in hex) and density
        keyboard = new THREEx.KeyboardState();
        // Set up camera so we know from where to render the scene
        cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
        cam.position.y = UNITSIZE * .2; // Raise the camera off the ground
        cam.position.x = UNITSIZE/2;
        cam.position.z = UNITSIZE/2;  //start at bottom left/facing north
        scene.add(cam); // Add the camera to the scene
 
        setupScene(); // Adds physical objects to the world. Described later
       
        renderer = new t.WebGLRenderer();
        renderer.setSize(WIDTH, HEIGHT); // Give the renderer the canvas size explicitly

        // Add the canvas to the document
        renderer.domElement.style.backgroundColor = 0xCCFFFF; // Make it easier to see that the canvas was added. Also this is the sky color
        document.body.appendChild(renderer.domElement); // Add the canvas to the document
       

     
      }


      // Set up the objects in the world
      function setupScene() {
        //var units = mapW;
       
        // Geometry: floor
        var floor = new t.Mesh(
            new t.BoxGeometry(mazes.n * UNITSIZE + UNITSIZE, 10, mazes.n * UNITSIZE + UNITSIZE),new t.MeshLambertMaterial({color: 0xEDCBA0})
        );
        floor.position.x = UNITSIZE * 0.5 * mazes.n;
        floor.position.z = UNITSIZE * 0.5 * mazes.n;
        scene.add(floor);
       
        // Geometry: walls
        for (var row = 0; row < mazes.n; row++) {
          for (var col = 0; col < mazes.n; col++) {
            var topWall = new t.BoxGeometry(UNITSIZE, WALLHEIGHT, WALLTHICKNESS);
            var bottomWall = new t.BoxGeometry(UNITSIZE, WALLHEIGHT, WALLTHICKNESS);
            var rightWall = new t.BoxGeometry(WALLTHICKNESS, WALLHEIGHT, UNITSIZE);
            var leftWall = new t.BoxGeometry(WALLTHICKNESS, WALLHEIGHT, UNITSIZE);
            var materials = new t.MeshLambertMaterial({color: 0xff0000});
            var tWall = new t.Mesh(topWall, materials);
            var bWall = new t.Mesh(bottomWall, materials);
            var rWall = new t.Mesh(rightWall, materials);
            var lWall = new t.Mesh(leftWall, materials);
            var cell = mazes.maze[row][col];
            var wall;
            
            //top
            wall = cell & 1;
            

            if(wall === 1){
              //has top wall
              tWall.position.x = (mazes.n - row) * UNITSIZE;
              tWall.position.y = WALLHEIGHT/2;
              tWall.position.z = (mazes.n - col) * UNITSIZE - WALLOFFSET;
              scene.add(tWall);
              console.log('cell ', row, col, 'has a top wall');
            }

            //right 
            wall = cell & 2;

            if(wall === 2){
              //has right wall
              rWall.position.x = (mazes.n - row) * UNITSIZE - WALLOFFSET;
              rWall.position.y = WALLHEIGHT/2;
              rWall.position.z = (mazes.n - col) * UNITSIZE;
              scene.add(rWall);
              console.log('cell ', row, col, 'has a right wall');
            }

            //bottom
            wall = cell & 4;
            

            if(wall === 4){
              //has bottom wall
              bWall.position.x = (mazes.n - row) * UNITSIZE;
              bWall.position.y = WALLHEIGHT/2;
              bWall.position.z = (mazes.n - col) * UNITSIZE - WALLOFFSET;
              scene.add(bWall);
              console.log('cell ', row, col, 'has a bottom wall');
            }

            //left
            wall = cell & 8;

            if(wall === 8){

              //has left wall
              lWall.position.x = (mazes.n - row) * UNITSIZE - WALLOFFSET;
              lWall.position.y = WALLHEIGHT/2;
              lWall.position.z = (mazes.n - col) * UNITSIZE;
              scene.add(lWall);
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
          update();
          console.log(cam.position);
          renderer.render(scene, cam);

        }

        function update()
        {
          var delta = clock.getDelta(); // seconds.
          var moveDistance = 200 * delta; // 200 pixels per second
          var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
          
          // local transformations
          // move forwards/backwards/left/right
          if ( keyboard.pressed("W") || keyboard.pressed("up") )
            cam.translateZ( - moveDistance );
          if ( keyboard.pressed("S") || keyboard.pressed("down") )
            cam.translateZ(  moveDistance );
          if ( keyboard.pressed("A") || keyboard.pressed("left"))
            cam.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
          if ( keyboard.pressed("D") || keyboard.pressed("right"))
            cam.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
          // rotate left/right/up/down
          // var rotation_matrix = new THREE.Matrix4().identity();
          // if ( keyboard.pressed("A") )
          //   cam.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
          // if ( keyboard.pressed("D") )
          //   cam.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
          // if ( keyboard.pressed("R") )
          //   cam.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
          // if ( keyboard.pressed("F") )
          //   cam.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
          
          // if ( keyboard.pressed("Z") )
          // {
          //   cam.position.set(0,25.1,0);
          //   cam.rotation.set(0,0,0);
          // }
          
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
