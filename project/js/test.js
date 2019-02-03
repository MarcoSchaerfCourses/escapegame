
// Get the canvas element from our HTML below
var canvas = document.getElementById('renderCanvas');
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var currentScene ;
var hand = null;

// -------------------------------------------------------------
// Here begins a function that we will 'call' just after it's built

var pathObjects = "images/textures/obj/";



var createScene = function () {
    // Create the scene space
    var room1 = new BABYLON.Scene(engine);
    room1.collisionEnabled = true;
    room1.gravity = new BABYLON.Vector3(0, -9.81, 0);

    var box = BABYLON.MeshBuilder.CreateBox('box',{}, room1);
    box.isPickable = true;
    box.checkCollisions = true;
    box.position = new BABYLON.Vector3(1, 1, 1);


    // Parameters : name, position, scene


    this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(1, 2, -2), room1);

    camera.attachControl(canvas, false);

    // Add lights to the scene
    //var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), room1);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), room1);

    // Add and manipulate meshes in the scene
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 20, width: 20, subdivisions: 1}, room1);
    ground.checkCollisions = true;
    ground.isPickable = false;
    window.addEventListener("click", function () {
        // We try to pick an object
        box.position.z = box.position.z + 1;
        });
    hand = box;
    return room1;
}; // End of createScene function




// -------------------------------------------------------------
// Now, call the createScene function that you just finished creating
var room = createScene();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    currentScene = room;
    //currentScene.activeCamera.position = new BABYLON.Vector3(hand.position.x,hand.position.y+1, hand.position.z - 3);
    //hand.position.z = hand.position.z +1 ;
    if (hand != null) {
        console.log(currentScene.activeCamera.getFrontPosition(1));
        //hand.position = new BABYLON.Vector3(currentScene.activeCamera.position.x, currentScene.activeCamera.position.y - 1, currentScene.activeCamera.position.z + 3);
        hand.position = currentScene.activeCamera.getFrontPosition(2);
    }
    //currentScene.activeCamera.position = new BABYLON.Vector3(hand.position.x,hand.position.y+1, hand.position.z - 3);
    // if (hand != null)
    // {
    //
    //     currentScene.registerBeforeRender()
    //     {
    //         cam = currentScene.activeCamera;
    //         cam.position.x = hand.position.x - 2;
    //         cam.position.y = hand.position.y - 2;
    //         cam.position.z = hand.position.z - 2;
    //
    //     };
    // };
    room.render();
});


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

