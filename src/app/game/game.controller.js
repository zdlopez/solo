'use strict';

angular.module('appMaze')
  .controller('gameController', function ($scope, mazes, builds) {
    angular.extend($scope, mazes);
    angular.extend($scope, builds);
    //$scope.render();
    //$scope.score = mazes.timer.value;
    $scope.func = function(userChoice){
      $scope.choice = '';
      $scope.n = userChoice;
      $scope.map = $scope.newMaze(userChoice, userChoice);
      $scope.mapTranslated = $scope.translate($scope.map);
      $scope.maze2 = $scope.mapTranslated;
      console.log('this working', userChoice);
      console.log($scope.map);
      console.log($scope.mapTranslated);
      $scope.go();
    }

    $scope.go = function(){
      console.log('i am going');
      mazes.maze = $scope.maze2;
      mazes.n = $scope.n;
      mazes.threeHelper();
      //mazes.animate();
    }
    
  })
  .factory('mazes', function($http){
    var mazes = {};
    mazes.n = 4; //will be a user val;
    var scoring = 0;
    mazes.score = scoring;


    //in the server implementation this will be 
    //an http call
    mazes.maze = [
    [15, 1, 1, 3],
    [8, 8, 0, 2],
    [8, 8, 0, 2],
    [12, 4, 4, 6]

    ];

    /* maze cell orientations

    [9, 1, 1, 3],
    [8, 0, 0, 2],
    [8, 0, 0, 2],
    [12, 4, 4, 6]

    [9, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
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

    mazes.timer = new Stopwatch();



    

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

      var t = THREE,scene, chaseCameraActive = true,cam, mapCamera, renderer, keyboard, controls, clock, model, skin, walls = [];
      var runAnim = true, mouse = { x: 0, y: 0 };


      var init = function(){

        mazes.timer.start();
        clock = new t.Clock(); // A high-performance timer used to calculate the time between rendering frames in order to smooth animation
        scene = new t.Scene(); // The "world" environment. Holds all other objects.
        scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // Add fog to the world. Helps with depth perception. Params are color (in hex) and density
        keyboard = new THREEx.KeyboardState();
        // Set up camera so we know from where to render the scene
        cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
        cam.position.y = UNITSIZE * .2; // Raise the camera off the ground
        cam.position.x = UNITSIZE/4;
        cam.position.z = UNITSIZE * (mazes.n -1) + UNITSIZE/2;  //start at bottom left/facing north
        //cam.rotateOnAxis(new t.Vector3(0, 1, 0), -90)
        scene.add(cam); // Add the camera to the scene


        //add overhead cam 

        mapCamera = new THREE.OrthographicCamera(
            window.innerWidth * -2,   // Left
            window.innerWidth * 2,    // Right
            window.innerHeight * 2,   // Top
            window.innerHeight * -2,  // Bottom
            -5000,                  // Near 
            10000 );                // Far 
          mapCamera.up = new THREE.Vector3(0,0,-1);
          mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
          mapCamera.position.x = UNITSIZE * (mazes.n / 2 + 1);
          mapCamera.position.z = UNITSIZE * (mazes.n / 2 + 1);
          scene.add(mapCamera);

 
        setupScene(); // Adds physical objects to the world. Described later
       
        renderer = new t.WebGLRenderer();
        renderer.setSize(WIDTH, HEIGHT); // Give the renderer the canvas size explicitly
        renderer.autoClear = false;

        // Add the canvas to the document
        renderer.domElement.style.backgroundColor = 0xCCFFFF; // Make it easier to see that the canvas was added. Also this is the sky color
        document.body.appendChild(renderer.domElement); // Add the canvas to the document
       

     
      }


      // Set up the objects in the world
      function setupScene() {
        //var units = mapW;
        if(mazes.maze === undefined){
          mazes.n = 8;
          mazes.maze = [
            [9, 1, 1, 1, 3, 1, 1, 3],
            [8, 4, 4, 4, 12, 3, 0, 2],
            [8, 0, 0, 0, 0, 2, 0, 2],
            [8, 0, 0, 9, 1, 2, 0, 2],
            [9, 0, 0, 8, 0, 2, 0, 2],
            [10, 0, 15, 0, 0, 0, 0, 2],
            [10, 0, 2, 0, 0, 0, 0, 2],
            [12, 4, 6, 4, 4, 4, 4, 6]
          ];
          /*empty cell = 0;
          top = 0001 = 1
          right = 0010 = 2
          bottom = 0100 = 4
          left = 1000 = 8*/
        }
       
        // Geometry: floor
        var floor = new t.Mesh(
            new t.BoxGeometry(mazes.n * 2 * UNITSIZE + UNITSIZE, 10, mazes.n * 2 * UNITSIZE + UNITSIZE),new t.MeshLambertMaterial({color: 0xEDCBA0})
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
            console.log('top: ', wall);
            

            if(wall === 1){
              //has top wall
              tWall.position.x = (col) * UNITSIZE;
              tWall.position.y = WALLHEIGHT/2;
              tWall.position.z = (row) * UNITSIZE - WALLOFFSET;
              walls.push(tWall);
              scene.add(tWall);
              console.log('cell ', row, col, 'has a top wall');
            }

            //right 
            wall = cell & 2;
            console.log('right: ', wall);

            if(wall === 2){
              //has right wall
              rWall.position.x = (col) * UNITSIZE - WALLOFFSET + UNITSIZE;
              rWall.position.y = WALLHEIGHT/2;
              rWall.position.z = (row) * UNITSIZE;
              walls.push(rWall);
              scene.add(rWall);
              console.log('cell ', row, col, 'has a right wall');
            }

            //bottom
            wall = cell & 4;
            console.log('bottom: ', wall);
            

            if(wall === 4){
              //has bottom wall
              bWall.position.x = (col) * UNITSIZE;
              bWall.position.y = WALLHEIGHT/2;
              bWall.position.z = (row) * UNITSIZE  - WALLOFFSET + UNITSIZE;
              walls.push(bWall);
              scene.add(bWall);
              console.log('cell ', row, col, 'has a bottom wall');
            }

            //left
            wall = cell & 8;
            console.log('left: ', wall);

            if(wall === 8){

              //has left wall
              lWall.position.x = (col) * UNITSIZE - WALLOFFSET;
              lWall.position.y = WALLHEIGHT/2;
              lWall.position.z = (row) * UNITSIZE;
              walls.push(lWall);
              scene.add(lWall);
              console.log('cell ', row, col, 'has a right wall');
            }
          
          }
        }

            var radius = 30;
             var sphereGeometry = new THREE.SphereGeometry( radius, 16, 8 );
             var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xffd700 } );
             var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
             sphere.position.x = Math.floor(Math.random() * mazes.n * UNITSIZE);
             sphere.position.z = Math.floor(Math.random() * mazes.n * UNITSIZE);
             sphere.position.y = 50
             scene.add(sphere);
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
          scoring = mazes.timer.update();
          mazes.score = scoring;
          //console.log('score is ', mazes.score);
          update();
          //console.log(cam.position);
          detectCollision();
          //renderer.setViewport( WIDTH * mazes.n /2 , HEIGHT * mazes.n /2, WIDTH, HEIGHT );
          renderer.clear();
          //renderer.render(scene, cam);
          //renderer.setViewport( .10 * WIDTH, .10 * HEIGHT, WIDTH, HEIGHT );
          //renderer.render( scene, mapCamera );

          if (chaseCameraActive)
            {  renderer.render( scene, cam );  }
            else
            {  renderer.render( scene, mapCamera );  }

        }

        function update()
        {
          var delta = clock.getDelta(); // seconds.
          var moveDistance = 200 * delta; // 200 pixels per second
          var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
          
          // move forwards/backwards/left/right
          if ( keyboard.pressed("W") || keyboard.pressed("up") )
            if(!detectCollision()){
              cam.translateZ( - moveDistance );
            }
          if ( keyboard.pressed("S") || keyboard.pressed("down") )
            if(!detectCollision()){
              cam.translateZ(  moveDistance );
            }
            
          if ( keyboard.pressed("A") || keyboard.pressed("left"))
              cam.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle); 

          if ( keyboard.pressed("D") || keyboard.pressed("right"))
              cam.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);

            if ( keyboard.pressed("1") )
              {  chaseCameraActive = true;  }
              if ( keyboard.pressed("2") )
              {  chaseCameraActive = false;  }

          
        }

        function detectCollision() {
          var vector = new THREE.Vector3( 0, 0, -1 );
          vector.applyQuaternion( cam.quaternion );
          var ray = new THREE.Raycaster(cam.position, vector);
          var intersects = ray.intersectObjects(scene.children, true);

          if (intersects.length > 0) {
            if (intersects[0].distance < 5) {
              console.log('collision', intersects);
              return true;
            }
          }

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
