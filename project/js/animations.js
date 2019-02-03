//variable to avoid sovrapposition of certain animation
var progress_animation = false;

get_rotation_animation = function(scene,mesh,rotation){
    var rotationAnimation = new BABYLON.Animation("take_hand_rot", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 60,
        value: rotation
    });
    rotationAnimation.setKeys(keys);
    return rotationAnimation;
};

//picking animations
getPositionPickAnimation = function (scene,mesh){
    var camera_pos = scene.activeCamera.getFrontPosition(2);
    var animation = new BABYLON.Animation("take_hand", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z)
    });

    keys.push({
        frame: 20,
        value: new BABYLON.Vector3(mesh.position.x, camera_pos.y+0.5 , mesh.position.z)
    });
    keys.push({
        frame: 40,
        value: new BABYLON.Vector3(camera_pos.x, camera_pos.y+0.5 , mesh.position.z)
    });
    keys.push({
        frame: 60,
        value: new BABYLON.Vector3(camera_pos.x, camera_pos.y-0.2 , camera_pos.z-0.5 )
    });
    animation.setKeys(keys);
    return animation;
};

getPositionThrowAnimation = function (scene,mesh){
    var camera_pos = scene.activeCamera.getFrontPosition(2);
    var animation = new BABYLON.Animation("throw_hand", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z)
    });

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z)
    });
    keys.push({
        frame: 60,
        value: new BABYLON.Vector3(mesh.position.x, 0.1 , mesh.position.z )
    });
    animation.setKeys(keys);
    return animation;
};

//move the camera inside the door
cameraDoor_animation = function (scene,door){
    var camera = scene.activeCamera;
    var animationP = new BABYLON.Animation("throw_hand", "position", 120, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z)
    });
    keys.push({
        frame: 120,
        value: new BABYLON.Vector3(camera.position.x, camera.position.y , camera.position.z + 1)
    });
    animationP.setKeys(keys);

    var animationR = new BABYLON.Animation("throw_hand", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: camera.rotation.y
    });
    keys.push({
        frame: 20,
        value: 0
    });
    animationR.setKeys(keys);
    return [animationR,animationP];
};

//weapong animations
pickingWeaponAnimation = function (scene,mesh){
    progress_animation = true;
    var animations = [];
    animations = [getPositionPickAnimation(scene,mesh),get_rotation_animation(scene,mesh,new BABYLON.Vector3( 0,Math.PI/4, Math.PI))];
    var anim1 = scene.beginDirectAnimation(mesh,animations, 0, 60, false,1,function () {
        progress_animation = false;
    });
    mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
};

throwWeaponAnimation = function (scene,mesh) {
    mesh.billboardMode =  BABYLON.Mesh.BILLBOARDMODE_NONE;
    animations = [getPositionThrowAnimation(scene,mesh),get_rotation_animation(scene,mesh,new BABYLON.Vector3(Math.PI/2, 0,Math.PI/2))];
    var anim1 = scene.beginDirectAnimation(mesh,animations, 0, 60, false);
    //mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
};

action_weapon_animation = function (mesh,scene) {

    var cam = scene.activeCamera;
    var frontP = cam.getFrontPosition(2.5);
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 20,
        value: new BABYLON.Vector3(mesh.rotation.x+Math.PI/4, mesh.rotation.y, mesh.rotation.z-Math.PI/4)
    });
    keys.push({
        frame: 40,
        value: new BABYLON.Vector3(mesh.rotation.x+Math.PI/4, mesh.rotation.y, mesh.rotation.z+Math.PI/4)
    });
    keys.push({
        frame: 60,
        value:new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    rotationAnimation.setKeys(keys);


    var posAnimation = new BABYLON.Animation("action_pos", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z)
    });
    keys.push({
        frame: 30,
        value:new BABYLON.Vector3(frontP.x, mesh.position.y,  frontP.z)
    });

    keys.push({
        frame: 60,
        value:new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z)
    });
    posAnimation.setKeys(keys);

    return [posAnimation,rotationAnimation];
};

//bird animations
//move the junction of the wings up and down
wingsL_animation = function (mesh){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 15,
        value: new BABYLON.Vector3(mesh.rotation.x+Math.PI/2-Math.PI/6, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 30,
        value: new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 45,
        value: new BABYLON.Vector3(mesh.rotation.x-Math.PI/2+Math.PI/6, mesh.rotation.y, mesh.rotation.z)
    });
    keys.push({
        frame: 60,
        value:new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};
wingsR_animation = function (mesh){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.x
    });
    keys.push({
        frame: 15,
        value: mesh.rotation.x-Math.PI/2+Math.PI/6
    });
    keys.push({
        frame: 30,
        value: mesh.rotation.x
    });
    keys.push({
        frame: 45,
        value: mesh.rotation.x+Math.PI/2-Math.PI/6
    });
    keys.push({
        frame: 60,
        value: mesh.rotation.x
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};

//move the tail up and down rotating on the Y axis
tail_animation = function (mesh){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.y
    });

    keys.push({
        frame: 30,
        value: mesh.rotation.y+Math.PI/6
    });
    keys.push({
        frame: 45,
        value: mesh.rotation.y
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};

leg_animation = function (mesh){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation.z", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.z
    });

    keys.push({
        frame: 30,
        value: mesh.rotation.z+Math.PI/3
    });
    keys.push({
        frame: 60,
        value: mesh.rotation.z
    });
    keys.push({
        frame: 90,
        value: mesh.rotation.z-Math.PI/3
    });
    keys.push({
        frame: 120,
        value: mesh.rotation.z
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};

finger_animation = function (mesh,direction=true){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var value = 0;
    if (direction)
    {
        value = Math.PI/3;
    }else
    {
        value = -Math.PI/3;
    }
    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.x
    });

    keys.push({
        frame: 30,
        value: mesh.rotation.x + value
    });
    keys.push({
        frame:60,
        value: mesh.rotation.x
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};

finger_diagonal = function (mesh,direction=true){
    var rotationAnimation = new BABYLON.Animation("action_rot", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var value = 0;
    if (direction)
    {
        value = Math.PI/3;
    }else
    {
        value = -Math.PI/3;
    }
    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.y
    });

    keys.push({
        frame: 30,
        value: mesh.rotation.y + value
    });
    keys.push({
        frame:60,
        value: mesh.rotation.y
    });
    rotationAnimation.setKeys(keys);
    return [rotationAnimation];
};

//key animations
pickingKeyAnimation = function (scene,mesh) {
    var animations = [];
    animations = [getPositionPickAnimation(scene,mesh),get_rotation_animation(scene,mesh,new BABYLON.Vector3( Math.PI/2,Math.PI/2, Math.PI/2))];
    var anim1 = scene.beginDirectAnimation(mesh,animations, 0, 60, false);
    mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
};

throwKeyAnimation = function (scene,mesh) {
    mesh.billboardMode =  BABYLON.Mesh.BILLBOARDMODE_NONE;
    animations = [getPositionThrowAnimation(scene,mesh),get_rotation_animation(scene,mesh,new BABYLON.Vector3(0, Math.PI/2,0))];
    var anim1 = scene.beginDirectAnimation(mesh,animations, 0, 60, false);
};

//wall animations
wall_animation = function(mesh){
    //for door to open and close
    var animation = new BABYLON.Animation("hinge_rotation", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_COSTANT);
    var finalValue = 1;
    if (mesh.position.x < 0) finalValue = -1;
    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.position.x
    });

    keys.push({
        frame: 60,
        value: finalValue
    });


    animation.setKeys(keys);

    return animation;
};

//door animations
door_animation = function(){
    //for door to open and close
    var rotAnimation = new BABYLON.Animation("hinge_rotation", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keys = [];
    keys.push({
        frame: 0,
        value: 0
    });

    keys.push({
        frame: 60,
        value:Math.PI/2 - Math.PI/358
    });


    rotAnimation.setKeys(keys);

    return rotAnimation;
};