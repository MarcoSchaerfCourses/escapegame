
var pathObjects = "images/textures/obj/";
var meshObject = JSON.parse('{}');
var currentId = 0;

getNewId = function(){
    currentId +=1;
    return currentId;
};

addMesh = function(obj){
    obj.mesh.id = getNewId();
    meshObject[obj.mesh.id] = obj;
};

function getObject(mesh){
    return meshObject[mesh.id];
}

//objects

//class for weapon. In future can be possible to extend this class
function Weapon(obj_loaded,name,type,position,scene){
    var actionSound = new BABYLON.Sound("openSound", "sounds/weapon/sound.wav", scene);
    this.name =  "object/weapon/" + name;
    //scale the object
    obj_loaded.scaling.x = 0.01;
    obj_loaded.scaling.y = 0.01;
    obj_loaded.scaling.z = 0.01;
    if(position != null) {
        obj_loaded.position = position;
    }

    //get the texture of object
    var mat_st = new BABYLON.StandardMaterial("mat_" + name, scene);
    var texture_st = new BABYLON.Texture(pathObjects + type + "/texture.png", scene);
    mat_st.diffuseTexture = texture_st;
    obj_loaded.material = mat_st;

    this.mesh = obj_loaded;
    this.mesh.name = name;

    //use the axe playing a sound and starting an animation
    this.action = function (scene)    {
        progress_animation = true;
        action_in_progess = true;
        actionSound.play();

        scene.beginDirectAnimation(this.mesh,action_weapon_animation(this.mesh,scene), 0, 60, false,1,function () {
            progress_animation = false;
            action_in_progess = false;
        });

    };

    this.pick = function(scene,mesh)    {
        pickingWeaponAnimation(scene,mesh);
    };

    this.throw = function(scene,mesh)    {
        throwWeaponAnimation(scene,mesh);
    };
    addMesh(this);

}

//class for key object
function Key(obj_loaded,name,position,scene){
    this.name = "object/key" ;
    obj_loaded.rotation.x -= Math.PI/2;
    if(position != null) {
        obj_loaded.position = position;
    }

    //add texture of key
    var mat_st = new BABYLON.StandardMaterial("mat_" + name, scene);
    var texture_st = new BABYLON.Texture( pathObjects + "key/" + name+".jpg", scene);
    mat_st.diffuseTexture = texture_st;
    obj_loaded.material = mat_st;
    this.mesh = obj_loaded;
    this.mesh.name = name;

    //bring the key on hand
    this.pick = function(scene,mesh)    {
        pickingKeyAnimation(scene,mesh);
    };

    //throw away the key
    this.throw = function(scene,mesh) {
        throwKeyAnimation(scene,mesh);
    };

    //action for use the key. If the key hit a door, open that door
    this.action = function (scene)    {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        var mesh = pickResult.pickedMesh;
        if (pickResult.hit  && mesh.name.includes("door") && pickResult.distance < 2)
        {
            changeRoom(meshObject[pickResult.pickedMesh.id]);
        }

     };

    addMesh(this);

}

//class for boxes
function Box(name,box_type,position,shadowGenerator,scene,size=1){
    //sound of the tnt detroyed
    var tntSound = new BABYLON.Sound("openSound", "sounds/box/tnt.wav", scene);
    //sound of the wooden box destroyed
    var woodSound = new BABYLON.Sound("openSound", "sounds/box/wood.wav", scene);

    //set basic properties
    this.name = name;
    this.size = size;
    this.type = box_type;
    this.mesh = createBox(box_type,size,scene);
    // this.mesh.isPickable = true;
    this.mesh.position = position;
    this.mesh.checkCollisions = true;
    this.destroyed = false;
    this.shadowManger = shadowGenerator;

    //return the top position of the box in order to put objects
    this.posOnTop = function() {
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y*2, this.mesh.position.z);
    };

    //objets on top of the box
    this.objsOnTop = [];

    //objects inside the box
    this.objsInside = [];

    //add shadow to this object
    this.shadowManger.getShadowMap().renderList.push(this.mesh);

    //function to obtain the name of the objects inside and on top of the box. Useless for now,good for future
    this.showNames = function (position) {
        var names = [];
        switch(position)
        {
            case "top":
                for(var i=0;i< this.objsOnTop.length;i++)
                {
                    names.push(this.objsOnTop[i].name);
                }
                break;
            case "inside":
                for(var i=0;i< this.objsInside.length;i++)
                {
                    names.push(this.objsInside[i].name);
                }

        }
        return names;
    };

    this.pieces = null;

    this.reset = function()    {
        this.shadowManger.getShadowMap().renderList.push(this.mesh);
        this.destroyed = false;
    };

    //function that destroy the box
    this.onDestroy = async function(scene) {

        if (this.destroyed) return;
        else  {this.destroyed = true;}
        //remove the shadow of the box from the scene
        this.shadowManger.removeShadowCaster(this.mesh,true);
        switch (this.type)
        {

            case "tnt":
                tntSound.play();
                //explosion animation
                BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
                    set.systems.forEach(s => {
                    s.disposeOnStop = true;});
                set.start();
                });
                //remove the box
                scene.removeMesh(this.mesh);
                //end game
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
                break;
            case "wood":
                //play sound
                woodSound.play();
                //create particle system
                var sps = new BABYLON.SolidParticleSystem("wood_piece", scene);
                sps.checkCollisions = true;
                sps.ellipsoid = new BABYLON.Vector3(0.1, 3.0, 0.5);
                var body = BABYLON.MeshBuilder.CreateBox("body",{height:1,width:0.2,depth:0.05},scene);
                var woodMaterial = new BABYLON.StandardMaterial("woodMat", scene);
                var woodTexture = new BABYLON.WoodProceduralTexture("woodtext" , 256, scene);
                woodTexture.ampScale = 80.0;
                woodMaterial.diffuseTexture = woodTexture;
                sps.addShape(body,15);
                body.dispose();
                var piece = sps.buildMesh();
                this.pieces = piece;
                piece.material = woodMaterial;
                var speed = 1;
                piece.position = this.mesh.position;
                var size_box = this.size;
                //remove box from the scene
                scene.removeMesh(this.mesh);

                //init particles
                sps.initParticles = function()
                {
                    for (var p = 0; p < this.nbParticles; p++) {
                        this.particles[p].position.y = (Math.random()*1);
                        this.particles[p].position.x = (Math.random()*1);
                        this.particles[p].position.z = (Math.random()*1);
                        this.particles[p].velocity.x = (Math.random() - 0.5) * speed;
                        this.particles[p].velocity.y = Math.random() * speed;
                        this.particles[p].velocity.z = (Math.random() - 0.5) * speed;
                        this.particles[p].rotation.x = (Math.random() * Math.PI/2) ;
                        this.particles[p].rotation.y = (Math.random() * Math.PI/2) ;
                        this.particles[p].rotation.z = (Math.random() * Math.PI/2) ;
                    }
                };
                //animate particles
                sps.updateParticle = function(particle)
                {
                    if(particle.position.y > ((-(size_box))/2)+0.05)
                    {
                        particle.position.y -= 0.05;
                    }
                    if(particle.rotation.x < Math.PI/2 ) {
                        particle.rotation.x += 0.10;
                    }
                };
                sps.initParticles();
                sps.setParticles();
                var i;
                for (i=0;i < this.objsInside.length;i++)
                {
                    var obj_in = this.objsInside[i];
                    if (obj_in.name.includes("key"))
                        {
                            throwKeyAnimation(scene,obj_in.mesh);
                        }else if (obj_in.name.includes("weapon"))
                        {
                            throwWeaponAnimation(scene,obj_in.mesh);
                        }
                }
                for (i=0;i < this.objsOnTop.length;i++)
                {
                    var obj_in = this.objsOnTop[i];
                    if (obj_in.name.includes("key"))
                    {
                        throwKeyAnimation(scene,obj_in.mesh);
                    }else if (obj_in.name.includes("weapon"))
                    {
                        throwWeaponAnimation(scene,obj_in.mesh);
                    }
                }
                this.objsOnTop = [];
                this.objsInside = [];
                 scene.registerBeforeRender(function () { sps.setParticles(); });
                break;
        }

    };

    //function that create a box of the type chosen
    function createBox (box_type,size, scene) {
        var mat = new BABYLON.StandardMaterial("mat", scene);
        var texture = new BABYLON.Texture("images/textures/box_atlas.png", scene);
        mat.diffuseTexture = texture;
        var columns = 8;  // 6 columns
        var rows = 8;  // 4 rows
        var faceUV = new Array(6);

        switch (box_type) {
            case "wood":
                for (var i = 0; i < 6; i++) {
                    faceUV[i] = new BABYLON.Vector4(6 / columns, 3 / rows, 7 / columns, 4 / rows);
                }
                break;
            case "tnt":
                var Ubottom_left = 3 / columns;
                var Vbottom_left = 3 / rows;
                var Utop_right = 4 / columns;
                var Vtop_right = 4 / rows;
                //select the face of the cube
                faceUV[0] = new BABYLON.Vector4(Utop_right, Vtop_right, Ubottom_left, Vbottom_left);
                faceUV[1] = new BABYLON.Vector4(Ubottom_left, Vbottom_left, Utop_right, Vtop_right);
                faceUV[2] = new BABYLON.Vector4(Utop_right, Vtop_right, Ubottom_left, Vbottom_left);
                faceUV[3] = new BABYLON.Vector4(Utop_right, Vtop_right, Ubottom_left, Vbottom_left);
                for (var i = 4; i < 6; i++) {
                    faceUV[i] = new BABYLON.Vector4(4 / columns, 3 / rows, 5 / columns, 4 / rows);
                }


                break;
        }
        var box = BABYLON.MeshBuilder.CreateBox('box', {size:size,faceUV: faceUV}, scene);
        box.isPickable = true;
        box.material = mat;
        box.position = position;
        return box;
    } ;

    addMesh(this);
    return this;

}

//class for birds
function Bird(position,rotation,scene) {
    var heightWing = 0.3;
    var bodyHeight = 0.5;
    var bodyWidth =bodyHeight /4;

    var controllerBody = new  BABYLON.MeshBuilder.CreateBox("hinge", {width:0.01, height:0.01, depth:0.01}, scene);
    controllerBody.position = position;
    controllerBody.isVisible = false;
    controllerBody.rotation = rotation;

    //textures and colors
    var birdSkin = new BABYLON.StandardMaterial("blackSkin", scene);
    birdSkin.diffuseColor =  new BABYLON.Color3(0, 0, 0);
    birdSkin.ambientColor =  new BABYLON.Color3(0, 0, 0);
    birdSkin.specularColor =  new BABYLON.Color3(0.3, 0.3, 0.3);
    var nailColor = new BABYLON.StandardMaterial("nailColor", scene);
    nailColor.diffuseColor =  new BABYLON.Color3(1, 1, 1);
    var beakTexture = new BABYLON.StandardMaterial("YellowBeak", scene);
    beakTexture.diffuseColor =  new BABYLON.Color3(1, 1, 0);
    beakTexture.ambientColor =  new BABYLON.Color3(1, 1, 0);
    beakTexture.specularColor =  new BABYLON.Color3(1, 1, 1);

    //body
    this.body = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: bodyWidth, diameterX: bodyHeight}, scene);
    this.body.material = birdSkin;
    this.body.checkCollisions = true;
    this.body.parent = controllerBody;

    //beak
    var beakHeight = 0.2;
    this.beak = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 0, height: beakHeight,diameterBottom:0.1, tessellation: 96}, scene);
    this.beak.parent = this.body;
    this.beak.rotation.z -= Math.PI/2;
    this.beak.position.x += beakHeight;

    //wings setup
    this.junctionRight = BABYLON.MeshBuilder.CreateBox("hinge", {width:0.1, height:0.1, depth:0.1}, scene);
    this.junctionRight.isVisible = false;
    this.junctionRight.parent = this.body;
    this.junctionRight.position.x += heightWing/2;
    this.junctionLeft = this.junctionRight.clone();
    this.junctionLeft.rotation.z -= Math.PI/2;
    this.junctionRight.rotation.z += Math.PI/2;
    this.wingR = BABYLON.MeshBuilder.CreatePolyhedron("wings", {type: 5, sizeX: heightWing,sizeY:0.01,sizeZ:0.1}, scene);
    this.wingR.material = birdSkin;
    this.wingL = this.wingR.clone("wingR");
    this.wingR.position.x +=heightWing;
    this.wingL.position.x +=heightWing;
    this.wingR.position.y +=heightWing/2-0.05;
    this.wingL.position.y -=heightWing/2;
    this.wingR.rotation.x += Math.PI/2;
    this.wingL.rotation.x += Math.PI/2;
    this.wingR.parent = this.junctionRight;
    this.wingL.parent = this.junctionLeft;
    this.junctionLeft.animations = wingsL_animation(this.junctionLeft);
    this.junctionRight.animations = wingsR_animation(this.junctionRight);

    //tail setup
    this.topTail = BABYLON.MeshBuilder.CreateCylinder("tail", {diameterTop: 0.04, diameter:0.07, height:0.07, tessellation: 4}, scene);
    this.topTail.material = birdSkin;
    this.topTail.parent = this.body;
    this.topTail.position.x -=bodyHeight/2-0.02;
    this.topTail.rotation.z += Math.PI/2;
    this.topTail.rotation.y -= Math.PI/6;
    this.topTail.isVisible = false;
    this.topTail.animations = tail_animation(this.topTail);
    this.bottomLeftTail = BABYLON.MeshBuilder.CreatePolyhedron("tailBL", {type: 0, sizeX: 0.02,sizeY:0.02,sizeZ:0.09}, scene);
    this.bottomLeftTail.parent = this.topTail;
    this.bottomLeftTail.rotation.x -= Math.PI/2;
    this.bottomLeftTail.material = birdSkin;
    this.bottomLeftTail.position.y -= 0.03;
    this.bottomLeftTail.position.z -= 0.02;
    this.bottomRightTail = this.bottomLeftTail.clone();
    this.bottomLeftTail.position.x += 0.02;
    this.bottomRightTail.position.x -= 0.02;


    onGoingAnimations.push(scene.beginAnimation(this.junctionLeft, 0, 60, true, 0.5));
    onGoingAnimations.push(scene.beginAnimation(this.junctionRight, 0, 60, true, 0.5));
    onGoingAnimations.push(scene.beginAnimation(this.topTail, 0, 60, true, 0.5));

    //legs
    var lengthLeg = 0.1;
    this.leftLeg = BABYLON.MeshBuilder.CreateCylinder("leg", {diameter:0.02, height:lengthLeg}, scene);
    this.leftLeg.parent = this.body;
    this.leftLeg.rotation.x += Math.PI/2 + Math.PI/8;
    this.leftLeg.position.z += lengthLeg/2 ;
    this.leftLeg.position.x -= bodyHeight/5 ;
    this.leftLeg.material = birdSkin;

    this.rightLeg = this.leftLeg.clone();
    this.leftLeg.position.y -= 0.05;
    this.rightLeg.position.y += 0.05;
    this.rightLeg.rotation.x -= Math.PI/8 + Math.PI/8 ;
    this.rightLeg.material = birdSkin;
    create_fingers(this.rightLeg);
    create_fingers(this.leftLeg);

    this.leftLeg.animations = leg_animation(this.leftLeg);
    this.rightLeg.animations = leg_animation(this.rightLeg);
    onGoingAnimations.push(scene.beginAnimation(this.leftLeg, 0, 120, true, 0.5));
    onGoingAnimations.push(scene.beginAnimation(this.rightLeg, 0, 120, true, 0.5));

    //function to create a palm with 4 fingers attacched to the leg input
    function create_fingers(leg)    {
        var sizePalm= 0.02;
        var heightPh = 0.04;
        var widthPh = 0.015;
        var depthPalm = 0.01;

        var palmLeft = BABYLON.MeshBuilder.CreateBox("palm",{size:sizePalm,depth:depthPalm});
        palmLeft.rotation.x += Math.PI/2;
        palmLeft.rotation.y += Math.PI/2;
        palmLeft.parent = leg;
        palmLeft.position.y += lengthLeg/2;

        var junctionFirstFinger = new BABYLON.TransformNode("firstJunction") ;
        junctionFirstFinger.parent =  palmLeft;
        var junctionSecondFinger = new BABYLON.TransformNode("secondJunction") ;
        junctionSecondFinger.parent =  palmLeft;
        junctionSecondFinger.rotation.x += Math.PI;
        junctionSecondFinger.rotation.y += Math.PI;
        var junctionThirdFinger = new BABYLON.TransformNode("thirdJunction") ;
        junctionThirdFinger.parent =  palmLeft;
        var junctionFourthFinger = new BABYLON.TransformNode("fourthJunction") ;
        junctionFourthFinger.parent =  palmLeft;


        junctionFirstFinger.position.y += sizePalm/2;

        junctionSecondFinger.position.y -= sizePalm/2;

        junctionThirdFinger.position.y -= sizePalm/2 ;
        junctionThirdFinger.position.x -= sizePalm/2 ;
        junctionThirdFinger.rotation.z += Math.PI/2 + Math.PI/8;

        junctionFourthFinger.position.y -= sizePalm/2 ;
        junctionFourthFinger.position.x += sizePalm/2;
        junctionFourthFinger.rotation.z -= Math.PI/2 + Math.PI/8;


        junctionFirstFinger.animations = finger_animation(junctionFirstFinger,false);
        junctionSecondFinger.animations = finger_animation(junctionSecondFinger,false);
        junctionThirdFinger.animations = finger_diagonal(junctionThirdFinger,false);
        junctionFourthFinger.animations = finger_diagonal(junctionFourthFinger,true);

        var ph1FirstFinger = create_finger(heightPh,widthPh,scene);
        var ph1SecondFinger = create_finger(heightPh/2,widthPh,scene);
        var ph1ThirdFinger = create_finger(heightPh,widthPh,scene);
        var ph1FourthFinger = create_finger(heightPh,widthPh,scene);

        ph1FirstFinger.parent = junctionFirstFinger;
        ph1SecondFinger.parent = junctionSecondFinger;
        ph1ThirdFinger.parent = junctionThirdFinger;
        ph1FourthFinger.parent = junctionFourthFinger;

        onGoingAnimations.push(scene.beginAnimation(junctionFirstFinger, 0, 60, true, 0.5));
        onGoingAnimations.push(scene.beginAnimation(junctionSecondFinger, 0, 60, true, 0.5));
        onGoingAnimations.push(scene.beginAnimation(junctionThirdFinger, 0, 60, true, 0.5));
        onGoingAnimations.push(scene.beginAnimation(junctionFourthFinger, 0, 60, true, 0.5));

        function create_finger(heightPh,widthPh,scene)        {
            var ph1Finger = BABYLON.MeshBuilder.CreateCylinder("finger", {diameter:widthPh,height: heightPh,tessellation:24}, scene);
            ph1Finger.material = birdSkin;
            ph1Finger.position.y += heightPh/2;
            var junctionPh1Finger = new BABYLON.TransformNode("phFirstJunction") ;
            junctionPh1Finger.parent =  ph1Finger;
            junctionPh1Finger.position.y += heightPh/2;
            junctionPh1Finger.animations = finger_animation(junctionPh1Finger,false);
            onGoingAnimations.push(scene.beginAnimation(junctionPh1Finger, 0, 60, true, 0.5));
            var ph2Finger = BABYLON.MeshBuilder.CreateCylinder("finger", {diameter:widthPh,height: heightPh,tessellation:24}, scene);
            ph2Finger.parent = junctionPh1Finger;
            ph2Finger.position.y += heightPh/2;
            ph2Finger.material = birdSkin;

            var junctionPh2Finger = new BABYLON.TransformNode("phFirstJunction") ;
            junctionPh2Finger.parent =  ph2Finger;
            junctionPh2Finger.position.y += heightPh/2;
            junctionPh2Finger.animations = finger_animation(junctionPh2Finger,false);
            onGoingAnimations.push(scene.beginAnimation(junctionPh2Finger, 0, 60, true, 0.5));
            var ph3Finger = BABYLON.MeshBuilder.CreateCylinder("finger", {diameter:widthPh,height: heightPh/2,tessellation:24}, scene);
            ph3Finger.parent = junctionPh2Finger;
            ph3Finger.position.y += heightPh/4;
            ph3Finger.material = birdSkin;

            var nail = BABYLON.MeshBuilder.CreateCylinder("finger", {diameter:widthPh, diameterTop:0,height: heightPh,tessellation:4}, scene);
            nail.parent = ph3Finger;
            nail.position.y += heightPh/2;
            nail.material = nailColor;

            return ph1Finger;

        }
    }
    this.mesh = controllerBody;
    this.mesh.position.y = 2;

    //pseudo random movement of bird
    var blocking_rotation = false;
    var dir = (Math.random() * 1);
    this.fly = function(dimArea,limY)  {
        var limX = dimArea/2;
        var limit = 1;
        var current_position = controllerBody.position;
        var amount = BABYLON.Tools.ToRadians(1);
        var speed = 0.05;

        //random movement
        if (!blocking_rotation && (current_position.y < 0 + limit || current_position.y > limY - limit
        || current_position.x < limX-limit || current_position.x < -limX + limit ||
            current_position.z < limX-limit || current_position.z < -limX + limit))
        {
            speed = speed/2;
            if (dir > 0.5) {
                controllerBody.rotate(BABYLON.Axis.Z, -amount, BABYLON.Space.LOCAL);
            }else
            {
                controllerBody.rotate(BABYLON.Axis.Z, amount, BABYLON.Space.LOCAL);

            }

        }

        //calculate improvement of the movement
        var old_distance = get_distance_fromWall(current_position,limX,limY);
        this.mesh.translate(BABYLON.Axis.X, speed, BABYLON.Space.LOCAL);
        var positionUpdated = this.mesh.position;
        var new_distance = get_distance_fromWall(positionUpdated,limX,limY);

        // if the the current rotation helps the bird to stay far from the wall mantain the current rotation
        if ( new_distance > old_distance+limit)
        {
            blocking_rotation = true;
            dir = (Math.random() * 1);

        }
        else
        {
            blocking_rotation = false;
        }

        //get the sum of the distance between the current position and all the wall
        function get_distance_fromWall(position, limX,limY)
        {
            var dist_x = Math.abs(Math.max(position.x,-position.x) - limX);
            var dist_y = Math.abs(Math.max(position.y,-position.y) - limY);
            var dist_ground = Math.abs(Math.max(position.y,-position.y) - 0);
            var dist_z = Math.abs(Math.max(position.z,-position.z) - limX);
            return dist_x + dist_ground + dist_y + dist_z;

        }

        //backup movement if this doesn't improve the situation
        if(this.mesh.position.y <= 0 + limit || this.mesh.position.y > limY - limit
        || this.mesh.position.x <= -limX + limit || this.mesh.position.x > limX - limit || this.mesh.position.z <= -limX + limit
            || this.mesh.position.x > limX - limit) {
                this.mesh.translate(BABYLON.Axis.X, -speed, BABYLON.Space.LOCAL);
            }

    };

    addMesh(this);
    return this;
}



