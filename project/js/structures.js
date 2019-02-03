//structures
// var dimRoom = 20;
// var heightDoor = 4;
// var widthDoor = 2.4;
// var heightWall = 6;
//var wallFrontWidth = dimRoom/2-widthDoor/2;
var pause = false;
var action_in_progess = false;
var onGoingAnimations = [];

function createSpikes(wall, dimWall,scene,left=true){
    var space = 1.5;
    var spikeTexture = new BABYLON.StandardMaterial("all_brick", scene);
    spikeTexture.diffuseTexture = new BABYLON.Texture("images/textures/spikes.png", scene);
    spikeTexture.ambientTexture = new BABYLON.Texture("images/textures/spikes.png", scene);
    spikeTexture.specularTexture = new BABYLON.Texture("images/textures/spikes.png", scene);
    var cone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 0, tessellation: 4}, scene);
    if (left) {
        cone.rotation.x = Math.PI / 2;
    }else {
        cone.rotation.x = -  Math.PI / 2;
    }
    cone.position.y -=1;
    cone.position.x = -dimWall / 2 + 2;
    cone.parent = wall;
    if (wall.position.x > 0)
        cone.position.z -=2;
    else
        cone.position.z +=2;
    cone.diffuseColor =  new BABYLON.Color3(0, 0, 0);
    cone.ambientColor =  new BABYLON.Color3(0, 0,0);
    cone.material = spikeTexture;
    var conesub = cone.clone("spike");
    var coneup = cone.clone("spike");
    conesub.position.y -= space;
    coneup.position.y += space;

    if (cone.position.x + 2 < dimWall / 2) {
        var spike1 = cone.clone("spike");
        spike1.position.x += 2;
        var spike1sub = spike1.clone("spike");
        var spike1up = spike1.clone("spike");
        spike1sub.position.y -= space;
        spike1up.position.y += space;
    }

    if (spike1.position.x + 2 < dimWall / 2) {
        var spike2 = cone.clone("spike");
        spike2.position.x += 4;
        var spike2sub = spike2.clone("spike");
        var spike2up = spike2.clone("spike");
        spike2sub.position.y -= space;
        spike2up.position.y += space;
    }

    if (spike2.position.x + 2 < dimWall / 2) {
        var spike3 = cone.clone("spike");
        spike3.position.x += 6;
        var spike3sub = spike3.clone("spike");
        var spike3up = spike3.clone("spike");
        spike3sub.position.y -= space;
        spike3up.position.y += space;
    }

    if (spike3.position.x + 2 < dimWall / 2) {
        var spike4 = cone.clone("spike");
        spike4.position.x += 8;
        var spike4sub = spike4.clone("spike");
        var spike4up = spike4.clone("spike");
        spike4sub.position.y -= space;
        spike4up.position.y += space;
    }

    if (spike4.position.x + 2 < dimWall / 2) {
        var spike5 = cone.clone("spike");
        spike5.position.x += 10;
        var spike5sub = spike5.clone("spike");
        var spike5up = spike5.clone("spike");
        spike5sub.position.y -= space;
        spike5up.position.y += space;
    }

    if (spike5.position.x + 2 < dimWall / 2) {
        var spike6 = cone.clone("spike");
        spike6.position.x += 12;
        var spike6sub = spike6.clone("spike");
        var spike6up = spike6.clone("spike");
        spike6sub.position.y -= space;
        spike6up.position.y += space;
    }

    if (spike6.position.x + 2 < dimWall / 2) {
        var spike7 = cone.clone("spike");
        spike7.position.x += 14;
        var spike7sub = spike7.clone("spike");
        var spike7up = spike7.clone("spike");
        spike7sub.position.y -= space;
        spike7up.position.y += space;
    }
    if (spike7.position.x + 2 < dimWall / 2) {
        var spike8 = cone.clone("spike");
        spike8.position.x += 16;
        var spike8sub = spike8.clone("spike");
        var spike8up = spike8.clone("spike");
        spike8sub.position.y -= space;
        spike8up.position.y += space;
    }
}

function BasicStructure(scene, dimRoom, heightWall,widthDoor,heightDoor,spikes=false,type_door=1,depthWall=0.1){
    // structural components
    var heightWallFrontUp = heightWall - heightDoor;
    var wallFrontWidth = dimRoom/2-widthDoor/2;

    this.ground = BABYLON.MeshBuilder.CreateGround("ground", {height: dimRoom, width: dimRoom, subdivisions: 1}, scene);
    this.ground.checkCollisions = true;
    this.ground.isPickable = false;

    this.wallFrontUp = BABYLON.MeshBuilder.CreateBox("wall", {width:widthDoor, height:heightWall-heightDoor, depth:depthWall}, scene);
    this.wallFrontUp.position.x = 0;
    this.wallFrontUp.position.y = heightDoor + (heightWallFrontUp/2);
    this.wallFrontUp.position.z = dimRoom/2;
    this.wallFrontUp.checkCollisions = true;
    this.wallFrontUp.isPickable = false;

    this.wallFrontLeft = BABYLON.MeshBuilder.CreateBox("wallLeft", {width:wallFrontWidth, height:heightWall, depth:depthWall}, scene);
    this.wallFrontLeft.position.y -= heightDoor/2;
    this.wallFrontLeft.checkCollisions = true;
    this.wallFrontLeft.isPickable = false;
    this.wallFrontLeft.parent =  this.wallFrontUp;
    this.wallFrontRight = this.wallFrontLeft.clone("wall");
    this.wallFrontLeft.position.x -= dimRoom/4+widthDoor/4;
    this.wallFrontRight.position.x += dimRoom/4+widthDoor/4;


    this.roof = BABYLON.MeshBuilder.CreateBox("wall", {width:dimRoom, height:dimRoom, depth:depthWall}, scene);
    this.roof.rotation.x = Math.PI/2;
    this.roof.position.x = 0;
    this.roof.position.y = heightWall;
    this.roof.position.z = 0;
    this.roof.isPickable = false;

    this.wallBehind = BABYLON.MeshBuilder.CreateBox("wall", {width:dimRoom, height:heightWall, depth:depthWall}, scene);
    this.wallBehind.position.x = 0;
    this.wallBehind.position.y = heightWall/2;
    this.wallBehind.position.z = -dimRoom/2;
    this.wallBehind.checkCollisions = true;
    this.wallBehind.isPickable = false;

    this.wallLeft = BABYLON.MeshBuilder.CreateBox("wallRight", {width:dimRoom, height:heightWall, depth:depthWall}, scene);
    this.wallLeft.rotation.y = Math.PI/2;
    this.wallLeft.position.x = -dimRoom/2;
    this.wallLeft.position.y = heightWall/2;
    this.wallLeft.position.z = 0;
    this.wallLeft.checkCollisions = true;
    this.wallLeft.isPickable = false;
    if (spikes) {
        createSpikes(this.wallLeft,dimRoom,scene);
     }

    this.wallRight = BABYLON.MeshBuilder.CreateBox("wall", {width:dimRoom, height:heightWall, depth:depthWall}, scene);
    this.wallRight.rotation.y = Math.PI/2;
    this.wallRight.position.x = dimRoom/2;
    this.wallRight.position.y = heightWall/2;
    this.wallRight.position.z = 0;
    this.wallRight.checkCollisions = true;
    this.wallRight.isPickable = false;
    if (spikes)
    {
        createSpikes(this.wallRight,dimRoom,scene,false);
    }

    this.tickLeft = BABYLON.MeshBuilder.CreateBox("tick", {width:dimRoom, height:0.1, depth:0.03}, scene);
    this.tickLeft.checkCollisions = true;
    this.tickLeft.isPickable = false;
    this.tickLeft.position.y -= heightWall/2;
    this.tickRight = this.tickLeft.clone("tick");
    this.tickBehind = this.tickLeft.clone("tick");
    this.tickLeft.parent = this.wallLeft;
    this.tickLeft.position.z += 0.05;

    this.tickRight.parent = this.wallRight;
    this.tickRight.position.z -= 0.05;

    this.tickBehind.parent = this.wallBehind;
    this.tickBehind.position.z += 0.05;

    this.tickUpRight = BABYLON.MeshBuilder.CreateBox("tick", {width:wallFrontWidth, height:0.1, depth:0.03}, scene);
    this.tickUpRight.position.y -= heightWall/2;
    this.tickUpRight.position.z -= 0.05;
    this.tickUpLeft = this.tickUpRight.clone("tick");
    this.tickUpRight.parent = this.wallFrontRight;
    this.tickUpLeft.parent = this.wallFrontLeft;

    this.door = new Door(new BABYLON.Vector3(0,0,dimRoom/2-depthWall/2),type_door,scene);

}

function importMesh(name,type,scene,position,container=null,shadowGenerator=null) {

    BABYLON.SceneLoader.ImportMesh("", pathObjects + type + "/", type + ".babylon", scene, function (meshes, sk, par)
    {
        var obj_loaded = meshes[0];
        if (shadowGenerator != null) {
            shadowGenerator.getShadowMap().renderList.push(obj_loaded);
        }
        switch (type)
        {
            case "axe":
                var w = new Weapon(obj_loaded,name,"axe",position,scene);
                if (container != null)
                {
                    container.objsInside.push(w);
                }
                break;
            case "key":
                var k = new Key(obj_loaded,name,position,scene);
                if (container != null)
                {
                    container.objsInside.push(k);
                }
                break;
        }



    });
}

function CameraGame(scene){
    // Add a camera to the scene and attach it to the canvas
    this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0.5, 2, -5), scene);
    // This targets the camera to scene origin
    this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 2);
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.speed = 1;
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysLeft.push(65);
    this.camera.keysRight.push(68);
    this.camera.attachControl(canvas,false);

}

//it creates the first room of game
function Room1() {
    var scene = new BABYLON.Scene(engine);
    scene.collisionEnabled = true;
    var gravity_vector = new BABYLON.Vector3(0, -9.81, 0);
    scene.gravity = gravity_vector;
    scene.clearColor = new BABYLON.Color3(0, 0, 0);


    var cam = new CameraGame(scene);
    var initialCameraPosition = new BABYLON.Vector3(0.5, 2, -5);

    //textures room
    var wallTexture = new BABYLON.StandardMaterial("all_brick", scene);
    wallTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg",scene);
    wallTexture.diffuseTexture.uScale = 4;
    wallTexture.diffuseTexture.vScale = 3;
    wallTexture.specularTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg",scene);
    wallTexture.specularTexture.uScale = 4;
    wallTexture.specularTexture.vScale = 3;

    var wallUpTexture = new BABYLON.StandardMaterial("all_brick", scene);
    wallUpTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    wallUpTexture.diffuseTexture.uScale = 1;
    wallUpTexture.diffuseTexture.vScale = 1;
    wallUpTexture.specularTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    wallUpTexture.specularTexture.uScale = 1;
    wallUpTexture.specularTexture.vScale = 1;

    var ceilTexture = new BABYLON.StandardMaterial("all_brick", scene);
    ceilTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    ceilTexture.diffuseTexture.uScale = 1;
    ceilTexture.diffuseTexture.vScale = 1;
    ceilTexture.specularTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    ceilTexture.specularTexture.uScale = 1;
    ceilTexture.specularTexture.vScale = 1;

    var floorTxt = new BABYLON.StandardMaterial("floor", scene);
    floorTxt.bumpTexture = new BABYLON.Texture("images/textures/pavement/normal_floor.png", scene);
    floorTxt.bumpTexture.uScale = 5;
    floorTxt.bumpTexture.vScale = 5;
    floorTxt.diffuseTexture = new BABYLON.Texture("images/textures/pavement/old.jpg", scene);
    floorTxt.diffuseTexture.uScale = 5;
    floorTxt.diffuseTexture.vScale = 5;


    var room = new BasicStructure(scene, dimRoom=16, heightWall=6,widthDoor=2.4,heightDoor=4);
    room.wallFrontUp.material = wallUpTexture;
    room.wallFrontLeft.material = wallTexture;
    room.roof.material =  wallTexture;
    room.wallBehind.material = wallTexture;
    room.wallLeft.material = wallTexture;
    room.wallRight.material = wallTexture;
    room.wallFrontRight.material = wallTexture;
    room.ground.material = floorTxt;


    // Add lights to the scene
    var light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(2, 2, 2), scene);
    light1.intensity = 1;
    light1.range = 20;
    light1.diffuse = BABYLON.Color3.FromHexString('#ff9944');
    light1.specular = new BABYLON.Color3(.9, .9, .9);

    //shadow setup
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
    shadowGenerator.usePoissonSampling = true;

    //boxes creation
    var cube_size = 1.2;
    var box1 = new Box("box1","wood", new BABYLON.Vector3(dimRoom/2-3*cube_size-1, cube_size/2, 3),shadowGenerator,scene,size=cube_size);
    var box2 = new Box("box2","tnt", new BABYLON.Vector3(box1.mesh.position.x+ box1.size,box1.mesh.position.y,box1.mesh.position.z),shadowGenerator,scene,size=cube_size);
    var box3 = new Box("box3","wood",new BABYLON.Vector3(box2.mesh.position.x+ box2.size,box2.mesh.position.y,box1.mesh.position.z),shadowGenerator,scene,size=cube_size);

    var box4 = new Box("box4","wood", new BABYLON.Vector3(-dimRoom/2+1, cube_size/2, -7),shadowGenerator,scene,size=cube_size);
    var box5 = new Box("box5","wood", new BABYLON.Vector3(box4.mesh.position.x,box4.mesh.position.y,box4.mesh.position.z+ box4.size),shadowGenerator,scene,size=cube_size);
    var box6 = new Box("box6","wood",new BABYLON.Vector3(box5.mesh.position.x,box5.mesh.position.y,box5.mesh.position.z+ box5.size),shadowGenerator,scene,size=cube_size);

    var box7 = new Box("box7","tnt", new BABYLON.Vector3(-dimRoom/2+1, cube_size/2, dimRoom/2-1),shadowGenerator,scene,size=cube_size);
    var box8 = new Box("box8","tnt", new BABYLON.Vector3(box7.mesh.position.x+1+ box7.size,box7.mesh.position.y,box7.mesh.position.z),shadowGenerator,scene,size=cube_size);
    var box9 = new Box("box9","tnt",new BABYLON.Vector3(box8.mesh.position.x+ 1+box8.size,box8.mesh.position.y,box8.mesh.position.z),shadowGenerator,scene,size=cube_size);

    this.boxes = [];
    this.boxes.push(box1);
    this.boxes.push(box2);
    this.boxes.push(box3);
    this.boxes.push(box4);
    this.boxes.push(box5);
    this.boxes.push(box6);
    this.boxes.push(box7);
    this.boxes.push(box8);
    this.boxes.push(box9);

    //check collisions with box
    scene.registerBeforeRender(function () {
        if (hand != null && hand.name.includes("axe") && action_in_progess) {
            if (box1.mesh.intersectsMesh(hand) )
            {

                box1.onDestroy(scene);
            }

            if (box2.mesh.intersectsMesh(hand) )
            {
                box2.onDestroy(scene);
            }

            if (box3.mesh.intersectsMesh(hand) )
            {
                box3.onDestroy(scene);
            }
            if (box4.mesh.intersectsMesh(hand) )
            {
                box4.onDestroy(scene);
            }
            if (box5.mesh.intersectsMesh(hand) )
            {
                box5.onDestroy(scene);
            }
            if (box6.mesh.intersectsMesh(hand) )
            {
                box6.onDestroy(scene);
            }
            if (box7.mesh.intersectsMesh(hand) )
            {
                box7.onDestroy(scene);
            }
            if (box8.mesh.intersectsMesh(hand) )
            {
                box8.onDestroy(scene);
            }
            if (box9.mesh.intersectsMesh(hand) )
            {
                box9.onDestroy(scene);
            }
        }
            });


    room.ground.receiveShadows = true;
    room.wallFrontUp.receiveShadows = true;
    room.wallFrontRight.receiveShadows = true;
    room.wallFrontLeft.receiveShadows = true;
    room.wallBehind.receiveShadows = true;
    room.wallLeft.receiveShadows = true;
    room.wallRight.receiveShadows = true;
    room.door.mesh.receiveShadows = true;

    //get objects
    importMesh("axe1","axe",scene, box2.posOnTop(),null,shadowGenerator);
    importMesh("key1","key",scene, box1.mesh.position,box1,shadowGenerator);

    //create lamp
    var materialSphere = new BABYLON.StandardMaterial("sphere1", scene);
    materialSphere.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.7);

    var heightLamp = 3;
    var neck = BABYLON.MeshBuilder.CreateCylinder("neck",{height:heightLamp,diameter:0.02},scene);
    neck.parent = room.roof;
    neck.rotation.x = Math.PI/2;
    neck.position.y = -heightLamp;

    var lamp = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene); //default sphere
    lamp.alpha = 0.2;
    lamp.material = materialSphere;
    lamp.parent = neck;
    lamp.position.y += heightLamp/2;
    light1.position = lamp.position;

    var hl = new BABYLON.HighlightLayer("hg", scene);
    hl.innerGlow = false;
    hl.addMesh(lamp, new BABYLON.Color3(.9, .9, .9));

    room.door.nextRoom = new Room2();
    this.scene = scene;

    // What to do when the game is restarted
    this.restart = function()
    {
        cam.camera.rotation = new BABYLON.Vector3(0,0,0);
        room.door.hinge.rotation.y = 0;
        hand = null;
        var axeMesh = this.scene.getMeshByName("axe1");
        if (axeMesh != null)
        {
            axeMesh.dispose();
        }
        var keyMesh = this.scene.getMeshByName("key1");
        if (keyMesh != null)
        {
            keyMesh.dispose();
        }

        for (var i = 0; i < this.boxes.length;i++)
        {
            resetBox(this.boxes[i]);
        }
        function resetBox(mesh)
        {
            if (mesh.destroyed)
            {
                if(mesh.pieces != null)
                {
                    mesh.pieces.dispose();
                }
                mesh.reset();
                scene.addMesh(mesh.mesh);
            }
        }
        cam.camera.position = new BABYLON.Vector3(initialCameraPosition.x,initialCameraPosition.y,initialCameraPosition.z);

        importMesh("axe1","axe",scene, box2.posOnTop(),null,shadowGenerator);
        importMesh("key1","key",scene, box1.mesh.position,box1,shadowGenerator);
        resetCurrentAnimations();
    };

    return this;
}

//functions that creates the second room of the game
function Room2() {
    var scene = new BABYLON.Scene(engine);
    scene.collisionEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.clearColor = new BABYLON.Color3(1,1,1);
    var playSound = false;
    var timerSound = new BABYLON.Sound("timer", "sounds/room2/countdown.wav", scene,null,{ loop: true});

    //textures
    var wallTexture = new BABYLON.StandardMaterial("wall", scene);
    wallTexture.diffuseColor = new BABYLON.Color3(0.32, 0, 0);
    wallTexture.ambientColor = new BABYLON.Color3(0.32, 0, 0);
    wallTexture.specularColor = new BABYLON.Color3(0.32, 0, 0);

    var blackMat = new BABYLON.StandardMaterial("wall", scene);
    blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    blackMat.ambientColor = new BABYLON.Color3(0, 0, 0);
    blackMat.specularColor = new BABYLON.Color3(0.32, 0, 0);

    var floorTexture = new BABYLON.StandardMaterial("floor_brick", scene);
    floorTexture.diffuseTexture = new BABYLON.Texture("images/textures/board.jpg", scene);
    floorTexture.diffuseTexture.uScale = 5;
    floorTexture.diffuseTexture.vScale = 5;

    //create walls
    var room = new BasicStructure(scene, dimRoom=20, heightWall=6,widthDoor=2.4,heightDoor=4,true,type_door=2,depthWall=3);
    room.door.state = "open";
    room.door.nextRoom = new Room3();
    room.wallRight.material = wallTexture;
    room.wallLeft.material = wallTexture;
    room.wallBehind.material = wallTexture;
    room.wallFrontRight.material= wallTexture;
    room.wallFrontLeft.material= wallTexture;
    room.wallFrontUp.material= wallTexture;
    room.ground.material = blackMat;
    room.roof = blackMat;


    var cam = new CameraGame(scene);
    var initialPositionCamera = new BABYLON.Vector3(0,2,room.wallBehind.position.z + 4);
    cam.camera.position = new BABYLON.Vector3(initialPositionCamera.x,initialPositionCamera.y,initialPositionCamera.z);

    //camera controller to check collisions with walls
    var cameraController = BABYLON.MeshBuilder.CreateBox('cameraController', {size:1.5}, scene);
    cameraController.isVisible = false;
    cameraController.position.x -=2;
    cameraController.checkCollision = true;
    cameraController.ellipsoid = new BABYLON.Vector3(2, 2, 2);
    cameraController.parent = cam.camera;

    var initialWallLeftposition = new BABYLON.Vector3(-dimRoom/2,room.wallLeft.position.y,room.wallLeft.position.z);
    var initialWallRightposition = new BABYLON.Vector3(dimRoom/2,room.wallRight.position.y,room.wallRight.position.z);

    onGoingAnimations.push(scene.beginDirectAnimation(room.wallLeft,[wall_animation(room.wallLeft) ],0,60,false,0.1));
    onGoingAnimations.push(scene.beginDirectAnimation(room.wallRight,[wall_animation(room.wallRight) ],0,60,false,0.1));

    // Add lights to the scene
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    var light2 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0),  Math.PI/2,32, scene);
    light2.diffuse = new BABYLON.Color3(1, 1, 0);
    light2.specular = new BABYLON.Color3(1, 1, 0);
    light2.parent = cam.camera;
    light2.position.y += 2;
    light2.position.z += 2;

    //check collision with walls
    scene.registerAfterRender(function () {
        if (!playSound && currentScene === this)
        {
            playSound = true;
            timerSound.play();
        }
        if (cameraController.intersectsMesh(room.wallLeft,true) || cameraController.intersectsMesh(room.wallRight,true))
        {
            timerSound.pause();
            timerSound.dispose();
            if(pause) return;
            pauseGame();
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene=scene);
            var panelRestart = new BABYLON.GUI.Rectangle();
            panelRestart.height = "30%";
            panelRestart.width = "50%";
            panelRestart.background = "#EEECE7";
            panelRestart.cornerRadius = 10;
            panelRestart.thickness = 3;
            panelRestart.color = "Black";
            var title = new menu_title("ESCAPE GAME", panelRestart);
            var restart = option_button("Restart", "50%");
            var ret_home = option_button("Home Page", "50%");

            restart.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            restart.left = "60%";
            ret_home.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            ret_home.left ="20%";


            var header = new BABYLON.GUI.TextBlock();
            header.height = "20px";
            header.fontStyle = "bold";
            header.text = "Sorry, You are died! Do you want retry?";
            header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            header.top = "25%";

            ret_home.onPointerClickObservable.add(function () {
                //remove buttons from the screen and release the resources
                panelRestart.removeControl(header);
                panelRestart.removeControl(restart);
                panelRestart.removeControl(ret_home);
                advancedTexture.removeControl(panelRestart);
                advancedTexture.removeControl(title);

                restart.dispose();
                title.dispose();
                header.dispose();
                panelRestart.dispose();
                ret_home.dispose();
                advancedTexture.dispose();
                running = false;
            });

            restart.onPointerClickObservable.add(function () {

                //remove buttons from the screen and release the resources
                panelRestart.removeControl(header);
                panelRestart.removeControl(restart);
                panelRestart.removeControl(ret_home);
                advancedTexture.removeControl(panelRestart);
                advancedTexture.removeControl(title);

                restart.dispose();
                title.dispose();
                header.dispose();
                panelRestart.dispose();
                ret_home.dispose();
                advancedTexture.dispose();
                currentScene.restart();
                continueGame();
            });

            advancedTexture.addControl(panelRestart);
            advancedTexture.addControl(title);
            panelRestart.addControl(header);
            panelRestart.addControl(restart);
            panelRestart.addControl(ret_home);
        }
    });

    this.scene = scene;

    // What to do when the game is restarted
    this.restart = function()
    {
        cam.camera.rotation = new BABYLON.Vector3(0,0,0);
        cam.camera.position = new BABYLON.Vector3(initialPositionCamera.x,initialPositionCamera.y,initialPositionCamera.z);
        room.wallLeft.position = new BABYLON.Vector3(-dimRoom/2,initialWallLeftposition.y,initialWallLeftposition.z);
        room.wallRight.position = new BABYLON.Vector3(dimRoom/2,initialWallRightposition.y,initialWallRightposition.z);
        resetCurrentAnimations();
    };
    return this;
}

//function that creates the last room
function Room3() {
    var scene = new BABYLON.Scene(engine);
    scene.collisionEnabled = true;
    var gravity_vector = new BABYLON.Vector3(0, -9.81, 0);
    scene.gravity = gravity_vector;
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    var cam = new CameraGame(scene);

    //textures
    var wallTexture = new BABYLON.StandardMaterial("all_brick", scene);
    wallTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    wallTexture.diffuseTexture.uScale = 4;
    wallTexture.diffuseTexture.vScale = 3;

    var wallUpTexture = new BABYLON.StandardMaterial("all_brick", scene);
    wallUpTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    wallUpTexture.diffuseTexture.uScale = 1;
    wallUpTexture.diffuseTexture.vScale = 1;

    var ceilTexture = new BABYLON.StandardMaterial("all_brick", scene);
    ceilTexture.diffuseTexture = new BABYLON.Texture("images/textures/ceiling/ceil.jpg", scene);
    ceilTexture.diffuseTexture.uScale = 1;
    ceilTexture.diffuseTexture.vScale = 1;

    var floorTexture = new BABYLON.StandardMaterial("floor_brick", scene);
    floorTexture.diffuseTexture = new BABYLON.Texture("images/textures/board.jpg", scene);
    floorTexture.diffuseTexture.uScale = 5;
    floorTexture.diffuseTexture.vScale = 5;
    floorTexture.ambientTexture = new BABYLON.Texture("images/textures/board.jpg", scene);
    floorTexture.ambientTexture.uScale = 5;
    floorTexture.ambientTexture.vScale = 5;
    floorTexture.specularTexture = new BABYLON.Texture("images/textures/board.jpg", scene);
    floorTexture.specularTexture.uScale = 5;
    floorTexture.specularTexture.vScale = 5;

    var room = new BasicStructure(scene, dimRoom=20, heightWall=10,widthDoor=2.4,heightDoor=4);
    room.wallFrontUp.material = wallUpTexture;
    room.wallFrontLeft.material = wallTexture;
    room.roof.material = ceilTexture;
    room.wallBehind.material = wallTexture;
    room.wallLeft.material = wallTexture;
    room.wallRight.material = wallTexture;
    room.wallFrontRight.material = wallTexture;
    room.ground.material = floorTexture;

    var initialPositionCamera = new BABYLON.Vector3(0,2,room.wallBehind.position.z + 1);

    var initialPositionBird1 = new BABYLON.Vector3(-1,1,-4);
    var initialPositionBird2 = new BABYLON.Vector3(-3,1,-3);
    var initialPositionBird3 = new BABYLON.Vector3(2,2,2);
    var initialRotationBird1 = new BABYLON.Vector3(Math.PI/4,Math.PI/2,Math.PI/2);
    var initialRotationBird2 = new BABYLON.Vector3(Math.PI/5,0,0);
    var initialRotationBird3 = new BABYLON.Vector3(Math.PI/5,0,0);
    var bird = new Bird(new BABYLON.Vector3(1,1,1),new BABYLON.Vector3(Math.PI/4,Math.PI/2,Math.PI/2),scene);
    var bird2 = new Bird(new BABYLON.Vector3(-3,1,-3),new BABYLON.Vector3(Math.PI/5,0,0),scene);
    var bird3 = new Bird(new BABYLON.Vector3(0,3,0),new BABYLON.Vector3(Math.PI/5,0,0),scene);




    //setup lights and shadows
    var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 0,1), Math.PI / 2, 8, scene);
    light.parent = cam.camera;
    light.position.z -= 1;
    light.diffuse = new BABYLON.Color3(0.35,0.35, 0.35);
    light.specular = new BABYLON.Color3(0.25,0.25, 0.25);
    light.intensity =1;

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.addShadowCaster(bird.body,true);
    shadowGenerator.addShadowCaster(bird2.body,true);
    shadowGenerator.addShadowCaster(bird3.body,true);

    importMesh("key3","key",scene, new BABYLON.Vector3(-5,0,0),null,shadowGenerator);
    room.ground.receiveShadows = true;
    room.wallFrontUp.receiveShadows = true;
    room.wallFrontRight.receiveShadows = true;
    room.wallFrontLeft.receiveShadows = true;
    room.wallBehind.receiveShadows = true;
    room.wallLeft.receiveShadows = true;
    room.wallRight.receiveShadows = true;
    room.door.mesh.receiveShadows = true;

    // fly birds
    scene.registerBeforeRender(function () {
        if (!pause) {
            bird.fly(dimRoom, heightWall);
            bird2.fly(dimRoom, heightWall);
            bird3.fly(dimRoom, heightWall);
        }

    });

    room.door.nextRoom = null;

    // What to do when the game is restarted
    this.restart = function()
    {
        room.door.hinge.rotation.y = 0;
        var keyMesh = this.scene.getMeshByName("key3");
        if (keyMesh != null)
        {
            keyMesh.dispose();
        }
        cam.camera.rotation = new BABYLON.Vector3(0,0,0);
        cam.camera.position = new BABYLON.Vector3(initialPositionCamera.x,initialPositionCamera.y,initialPositionCamera.z);
        bird.mesh.position = new BABYLON.Vector3(initialPositionBird1.x,initialPositionBird1.y,initialPositionBird1.z);
        bird2.mesh.position = new BABYLON.Vector3(initialPositionBird2.x,initialPositionBird2.y,initialPositionBird2.z);
        bird3.mesh.position = new BABYLON.Vector3(initialPositionBird3.x,initialPositionBird3.y,initialPositionBird3.z);
        bird.mesh.rotation = new BABYLON.Vector3(initialRotationBird1.x,initialRotationBird1.y,initialRotationBird1.z);
        bird2.mesh.rotation = new BABYLON.Vector3(initialRotationBird2.x,initialRotationBird2.y,initialRotationBird2.z);
        bird3.mesh.rotation = new BABYLON.Vector3(initialRotationBird3.x,initialRotationBird3.y,initialRotationBird3.z);
        importMesh("key3","key",scene, new BABYLON.Vector3(-5,0,0),null,shadowGenerator);
        resetCurrentAnimations();
    };
    this.scene = scene;
    return this;
}

function pauseCurrentAnimations(){
    for (var i=0; i< onGoingAnimations.length;i++)
    {
        onGoingAnimations[i].pause();
    }
}

function restartCurrentAnimations(){
    for (var i=0; i< onGoingAnimations.length;i++)
    {
        onGoingAnimations[i].restart();
    }
}

function resetCurrentAnimations(){
    for (var i=0; i< onGoingAnimations.length;i++)
    {
        onGoingAnimations[i].reset();
    }
}

function Door(position,type_door=1,scene){
    //door
    this.name = "door";
    this.state = "close";
    this.mesh = BABYLON.MeshBuilder.CreateBox("door", {width:2.4, height:4, depth:0.1}, scene);
    this.hinge = BABYLON.MeshBuilder.CreateBox("hinge", {width:0.1, height:0.1, depth:0.1}, scene);
    var mat = new BABYLON.StandardMaterial("mat", scene);
    switch (type_door)
    {
        case 1:
            var mat = new BABYLON.StandardMaterial("floor", scene);
            mat.bumpTexture = new BABYLON.Texture("images/textures/NormalMap_door.png", scene);
            mat.diffuseTexture = new BABYLON.Texture("images/textures/door.jpg", scene);
            mat.specularTexture = new BABYLON.Texture("images/textures/door.jpg", scene);
            break;
        case 2:
            var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
            noiseTexture.animationSpeedFactor = 10;
            noiseTexture.persistence = 2;
            noiseTexture.setColor3("a",new BABYLON.Vector3(0.5,0.5,0.5));
            mat.emissiveTexture = noiseTexture;
            mat.emissiveColor = new BABYLON.Color3(0.43, 0.48, 0.73);
            break;
    }


    this.mesh.material = mat;
    this.hinge.isVisible = false;
    this.mesh.parent = this.hinge;
    this.mesh.checkCollisions = true;
    this.hinge.checkCollisions = false;
    this.hinge.position = position;
    this.hinge.position.y = 2;
    this.hinge.position.x = 1;
    this.mesh.position.x = -1;
    this.nextRoom = null;
    var openSound = new BABYLON.Sound("openSound", "sounds/door/open.mp3", scene);
    this.open = async function(scene)
    {
        switch (type_door) {
            case 1:
                openSound.play();
                var anim = scene.beginDirectAnimation(this.hinge, [door_animation()], 0, 60, false, 0.5);
                var anim2 = scene.beginDirectAnimation(scene.activeCamera, cameraDoor_animation(scene, this.mesh), 0, 120, false, 0.5);
                break;
            case 2:
                var anim2 = scene.beginDirectAnimation(scene.activeCamera, cameraDoor_animation(scene, this.mesh), 0, 120, false, 0.5);
                break;
        }
        return true;

    }

    addMesh(this);
}

