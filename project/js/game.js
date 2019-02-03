
    // Get the canvas element from our HTML below
    var canvas = document.getElementById('renderCanvas');
    // Load the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true,{ stencil: true });

    //variable to store the current room to be rendered
    var currentScene ;

    //variable to store object picked from the scene
    var hand = null;

    //status of the game
    var running = false;

    //starting room. Always First room
    var startingRoom = new Room1();

    //Homepage
    var homePage = new getHome();

    //menu in-game
    var menu0 = new menuScene();
    menu0.autoClear = false;

    //sound closed door
    var closeSound = new BABYLON.Sound("openSound", "sounds/door/lock.mp3", scene);

    // This function pauses the game stopping all the current animation and blocking all inputs for camera
    async function pauseGame(){
        pause=true;
        pauseCurrentAnimations();
        currentScene.scene.activeCamera.detachControl(canvas);
    }

    // This function resumes the game from the pause
    async function continueGame(){
        pause = false;
        restartCurrentAnimations();
        currentScene.scene.activeCamera.attachControl(canvas); // allow inputs for camera

    }

    // start the game setting the current scene as the restarted first room
    async function startGame()    {
        startingRoom.restart();
        currentScene = startingRoom;
        continueGame();
        running = true;
        return;
    }


    //events listeners
    /**
     * Keyboard commands
     */
    window.addEventListener('keyup', function (event) {

        if (!pause)
        {
            var key = event.key;

            //commands available when you have an object in hand
            if (hand != null) {
                switch (key) {
                    //throw away the object
                    case 'f':
                        if (!progress_animation)
                        {
                            getObject(hand).throw(currentScene.scene, hand);
                            hand = null;
                        }
                        break;
                    //use the object
                    case 'e':
                        if (!progress_animation) {
                            getObject(hand).action(currentScene.scene);
                        }
                        break;
                }
            }
            //case open door when this is open (so it doesn't need a key)
            if (key === "e") {
                var pickResult = currentScene.scene.pick(currentScene.scene.pointerX, currentScene.scene.pointerY);
                var mesh = pickResult.pickedMesh;
                if (pickResult.hit && pickResult.distance < 2 && getObject(mesh).name.includes("door")) {
                    if  (getObject(mesh).state === "open") {
                        changeRoom(getObject(mesh));
                        hand = null;
                    }else
                    {
                        closeSound.play();
                    }
                }
            }
            //when release the SHIFT key then the speed return normal
            if (key === 16) {
                currentScene.scene.activeCamera.speed = 1;
            }
        }
    });

    window.addEventListener('keydown', function (event) {

        var key = event.key;
        // run command: hold down SHIFT
        if (key === 16) {
            currentScene.scene.activeCamera.speed = 5;
        }


    });

    /**
     * Mouse event. Bring the object that you click
     */
    window.addEventListener("click", function () {
        if (running && !pause) {
            var pickResult = currentScene.scene.pick(currentScene.scene.pointerX, currentScene.scene.pointerY);
            var mesh = pickResult.pickedMesh;
            if (pickResult.hit && pickResult.distance < 2 && getObject(mesh).name.includes("object") && mesh != hand) {
                if (hand != null) {
                    getObject(hand).throw(currentScene.scene, hand);
                    hand = null;
                }
                getObject(mesh).pick(currentScene.scene, mesh);
                pickResult.pickedMesh.checkCollisions = false;
                hand = pickResult.pickedMesh;
            }
        }
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

    currentScene = startingRoom;

    //rendering
    engine.runRenderLoop(function () {

            if (running) {
                if (hand != null) {
                    var pos = currentScene.scene.activeCamera.getFrontPosition(1.5);
                    var curr_pos = hand.position;
                    var displacement = new BABYLON.Vector3(pos.x-curr_pos.x,pos.y-curr_pos.y-0.5,pos.z-curr_pos.z);
                    hand.moveWithCollisions(displacement);
                }
                currentScene.scene.render();
                menu0.render();
            }
            else {
                homePage.render();
            }

    });

    // auxiliar function to wait some amount of seconds
    function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

    // Given a object Door in input this function change the current scene
    async function changeRoom(door) {
        hand = null;
        pauseGame();

        door.open(currentScene.scene);
        await sleep(3000);
        //case last door. Declare win of the game is the user can open the door
        if (door.nextRoom === null){
           print_win();
        }
        else {
            //change the scene with the door linked by the door
            var temp = currentScene;
            currentScene = door.nextRoom;
            temp.restart();
            continueGame();
        }

        //function that shows a panel with a winner message
        function print_win(){
            var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene=currentScene.scene);
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
            header.text = "WINNER WINNER, CHICKEN DINNER!";
            header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            header.top = "25%";

            //callback when the user wants to return to the homepage
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
                running = false;
            });

            //callback for restarting the game and deleting the current panel
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
                currentScene.restart();
                continueGame();
            });

            advancedTexture.addControl(panelRestart);
            advancedTexture.addControl(title);
            panelRestart.addControl(header);
            panelRestart.addControl(restart);
            panelRestart.addControl(ret_home);
        }
    }

    //return a button with the style and alignment of the in-game menu
    function menu_button(text,pos) {
        var button = new BABYLON.GUI.Button.CreateSimpleButton("button", text);
        button.width = 0.2;
        button.alpha = 0.5;
        button.height = "5%";
        button.cornerRadius = 50;
        button.color = "Black";
        button.thickness = 4;
        button.background = "White";
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.top = pos;
        return button;
    }

    //return a button with the style and alignment of the homepage
    function option_button(text,pos) {
        var button = new BABYLON.GUI.Button.CreateSimpleButton("button", text);
        button.width = 0.2;
        button.alpha = 0.5;
        button.height = "30px";
        button.cornerRadius = 50;
        button.color = "Black";
        button.thickness = 4;
        button.background = "White";
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.top = pos;
        return button;
    }

    //return a button for show the title of the container
    function menu_title(text,container) {
        var button = new BABYLON.GUI.Button.CreateSimpleButton("button", "");
        button.isEnabled = false;
        button.width = 0.2;
        button.alpha = 1;
        button.height = "5%";
        button.cornerRadius = 50;
        button.color = "Black";
        button.thickness = 2;
        button.background = "#0086b3";
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.top = ""+ parseFloat(parseFloat(parseFloat("50%") - parseFloat(container.height)/2) - parseFloat(button.height)/2) + "%";
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = text;
        text1.color = "White";
        text1.fontStyle = 'bold';
        text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.addControl(text1);
        return button;
    }

    //function that creates the in-game menu
    function menuScene()   {
        var menu = new BABYLON.Scene(engine);
        var camMenu =  new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -5), menu);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene=menu);
        var keys = menu_button("Keybinds","0%");
        var volumeMenu = menu_button("Audio Settings","6%");
        var restart = menu_button("Restart","12%");
        var exit = menu_button("Exit","18%");

        var panel = new BABYLON.GUI.Rectangle();
        panel.background = "#EEECE7";
        panel.cornerRadius = 10;
        panel.thickness = 3;
        panel.color = "Black";
        panel.height = "30%";
        panel.width = "50%";

        //show the panel for set the volume of audio
        volumeMenu.onPointerClickObservable.add(function() {
            pauseGame();

            //disabilitate buttons of menu
            volumeMenu.isEnabled = false;
            keys.isEnabled = false;
            restart.isEnabled = false;
            exit.isEnabled = false;

            //components of panel
            var title = menu_title("Audio Settings",panel);
            var resume = option_button("Resume","70%");
            var slider = new BABYLON.GUI.Slider();
            slider.minimum = 0;
            slider.maximum = 100;
            slider.value = Math.floor(BABYLON.Engine.audioEngine.getGlobalVolume()*100);
            slider.height = "20px";
            slider.width = "200px";
            slider.verticalAlignment =  BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            slider.top = "50%";

            var header = new BABYLON.GUI.TextBlock();
            header.height = "20px";
            header.text = "Volume Level:"+slider.value;
            header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            header.top = "35%";

            slider.onValueChangedObservable.add(function(value) {
                header.text = "Volume Level: " + Math.floor(value);
                BABYLON.Engine.audioEngine.setGlobalVolume(value/100);
            });

            resume.onPointerClickObservable.add(function() {
                //restore clickability of menu buttons
                volumeMenu.isEnabled = true;
                keys.isEnabled = true;
                restart.isEnabled = true;
                exit.isEnabled = true;

               //remove buttons from the screen
                panel.removeControl(slider);
                panel.removeControl(header);
                panel.removeControl(resume);
                advancedTexture.removeControl(title);
                advancedTexture.removeControl(panel);

                //continue the game
                continueGame();
            });

            //show panel
            panel.addControl(header);
            panel.addControl(slider);
            panel.addControl(resume);
            advancedTexture.addControl(panel);
            advancedTexture.addControl(title);


        });

        //show the commands of the game
        keys.onPointerClickObservable.add(function() {
            pauseGame();

            //setup dimension of panel
            panel.height = "60%";
            panel.width = "50%";
            //disabilitate buttons of menu
            volumeMenu.isEnabled = false;
            keys.isEnabled = false;
            restart.isEnabled = false;
            exit.isEnabled = false;

            //components of panel
            var title = menu_title("Keybinds",panel);
            var resume = option_button("Resume","90%");
            var title_tab_left = new BABYLON.GUI.TextBlock();
            title_tab_left.color = "Black";
            title_tab_left.fontStyle = "bold";
            title_tab_left.fontSize = 28;
            title_tab_left.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            title_tab_left.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            title_tab_left.top = "5%";
            title_tab_left.text = "Action";
            title_tab_left.left = "15%";

            var title_tab_right = new BABYLON.GUI.TextBlock();
            title_tab_right.color = title_tab_left.color;
            title_tab_right.fontStyle = title_tab_left.fontStyle;
            title_tab_right.fontSize = title_tab_left.fontSize;
            title_tab_right.textVerticalAlignment = title_tab_left.textVerticalAlignment;
            title_tab_right.textHorizontalAlignment = title_tab_left.textHorizontalAlignment;
            title_tab_right.top = title_tab_left.top;
            title_tab_right.text = "Key";
            title_tab_right.left = "70%";

            var leftSide = new BABYLON.GUI.TextBlock();
            leftSide.color = "Black";
            leftSide.fontSize = 24;
            leftSide.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            leftSide.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            leftSide.top = "15%";

            var rightSide =  new BABYLON.GUI.TextBlock();
            rightSide.color = leftSide.color;
            rightSide.fontSize = leftSide.fontSize;
            rightSide.textHorizontalAlignment = leftSide.textHorizontalAlignment;
            rightSide.textVerticalAlignment = leftSide.textVerticalAlignment;
            rightSide.top = leftSide.top;
            leftSide.text =  "Rotate View \n" +
                "Walk Forward \n" +
                "Walk Downward \n" +
                "Walk Left \n" +
                "Walk Right \n" +
                "Run \n" +
                "Pick Object \n" +
                "Throw Object \n" +
                "Action \n" +
                "Pause Game \n" ;
            rightSide.text =
                "Mouse Movements \n" +
                "W / Arrow Up \n" +
                "S / Arrow Down \n" +
                "A / Arrow Left \n" +
                "D / Arrow Right \n" +
                "Shift \n" +
                "Left-Click \n" +
                "F \n" +
                "E \n" +
                "Esc \n" ;
            leftSide.left = "10%";
            rightSide.left = "60%";

            //reaction of buttons in the panel
            resume.onPointerClickObservable.add(function() {
                //restore clickability of menu buttons
                volumeMenu.isEnabled = true;
                keys.isEnabled = true;
                restart.isEnabled = true;
                exit.isEnabled = true;

                //remove buttons from the screen
                panel.removeControl(resume);
                panel.removeControl(title_tab_right);
                panel.removeControl(title_tab_left);
                panel.removeControl(leftSide);
                panel.removeControl(rightSide);
                advancedTexture.removeControl(title);
                advancedTexture.removeControl(panel);

                //restore dimension of panel
                panel.height = "30%";
                panel.width = "50%";
                //continue the game
                continueGame();
            });

            //show panel
            panel.addControl(title_tab_left);
            panel.addControl(title_tab_right);
            panel.addControl(leftSide);
            panel.addControl(rightSide);
            panel.addControl(resume);
            advancedTexture.addControl(panel);
            advancedTexture.addControl(title);


        });

        //show a panel of confirmation and eventually restart the scene
        restart.onPointerClickObservable.add(function() {
            if (!pause) {
                pauseGame();

                //disabilitate buttons of menu
                volumeMenu.isEnabled = false;
                keys.isEnabled = false;
                restart.isEnabled = false;
                exit.isEnabled = false;

                //components of panel
                var title = menu_title("Restart", panel);
                var resume = option_button("Resume", "50%");
                resume.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                resume.left = "20%";
                var ok = option_button("Confirm", "50%");
                ok.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                ok.left = "60%";

                var header = new BABYLON.GUI.TextBlock();
                header.height = "20px";
                header.fontStyle = "bold";
                header.text = "Are you sure to restart the room?";
                header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                header.top = "25%";

                resume.onPointerClickObservable.add(function () {
                    //restore clickability of menu buttons
                    volumeMenu.isEnabled = true;
                    keys.isEnabled = true;
                    restart.isEnabled = true;
                    exit.isEnabled = true;

                    //remove buttons from the screen
                    panel.removeControl(resume);
                    panel.removeControl(ok);
                    panel.removeControl(header);

                    advancedTexture.removeControl(title);
                    advancedTexture.removeControl(panel);

                    //continue the game

                    continueGame();
                });

                ok.onPointerClickObservable.add(function () {
                    //restore clickability of menu buttons
                    volumeMenu.isEnabled = true;
                    keys.isEnabled = true;
                    restart.isEnabled = true;
                    exit.isEnabled = true;

                    //remove buttons from the screen
                    panel.removeControl(resume);
                    panel.removeControl(ok);
                    panel.removeControl(header);
                    advancedTexture.removeControl(title);
                    advancedTexture.removeControl(panel);

                    //continue the game
                    // restartGame();
                    currentScene.restart();
                    continueGame();
                });

                //show panel
                panel.addControl(resume);
                panel.addControl(ok);
                panel.addControl(header);
                advancedTexture.addControl(panel);
                advancedTexture.addControl(title);


            }});

        //show a panel of confirmation and eventually return to the homepage
        exit.onPointerClickObservable.add(function() {
            if (!pause)
            {
                pauseGame();
                var panelRestart = new BABYLON.GUI.Rectangle();
                panelRestart.height = "30%";
                panelRestart.width = "50%";
                panelRestart.background = "#EEECE7";
                panelRestart.cornerRadius = 10;
                panelRestart.thickness = 3;
                panelRestart.color = "Black";
                var title = new menu_title("ESCAPE GAME", panelRestart);
                var ok = option_button("Ok", "50%");
                var cancel = option_button("Cancel", "50%");

                ok.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                ok.left = "60%";
                cancel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                cancel.left ="20%";


                var header = new BABYLON.GUI.TextBlock();
                header.height = "20px";
                header.fontStyle = "bold";
                header.text = "Do you want return to the homepage?";
                header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                header.top = "25%";

                cancel.onPointerClickObservable.add(function () {
                    //remove buttons from the screen and release the resources
                    panelRestart.removeControl(header);
                    panelRestart.removeControl(ok);
                    panelRestart.removeControl(cancel);
                    advancedTexture.removeControl(panelRestart);
                    advancedTexture.removeControl(title);

                    ok.dispose();
                    title.dispose();
                    header.dispose();
                    panelRestart.dispose();
                    cancel.dispose();
                    continueGame();
                });

                ok.onPointerClickObservable.add(function () {

                    //remove buttons from the screen and release the resources
                    panelRestart.removeControl(header);
                    panelRestart.removeControl(ok);
                    panelRestart.removeControl(cancel);
                    advancedTexture.removeControl(panelRestart);
                    advancedTexture.removeControl(title);

                    ok.dispose();
                    title.dispose();
                    header.dispose();
                    panelRestart.dispose();
                    cancel.dispose();
                    running = false;
                });

                advancedTexture.addControl(panelRestart);
                advancedTexture.addControl(title);
                panelRestart.addControl(header);
                panelRestart.addControl(ok);
                panelRestart.addControl(cancel);
        }});

        advancedTexture.addControl(exit);
        advancedTexture.addControl(keys);
        advancedTexture.addControl(volumeMenu);
        advancedTexture.addControl(restart);

        //event lister for pause the game
        window.addEventListener('keyup', function (event) {

            if (!pause) {

                var key = event.key;
                if (key === "Escape") {
                    pauseGame();
                    volumeMenu.isEnabled = false;
                    keys.isEnabled = false;
                    restart.isEnabled = false;
                    exit.isEnabled = false;

                    var title = new menu_title("ESCAPE GAME", panel);

                    var ok = option_button("Resume", "50%");

                    var header = new BABYLON.GUI.TextBlock();
                    header.height = "20px";
                    header.fontStyle = "bold";
                    header.text = "The game is paused";
                    header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    header.top = "25%";

                    ok.onPointerClickObservable.add(function () {

                        //remove buttons from the screen and release the resources
                        panel.removeControl(header);
                        advancedTexture.removeControl(ok);
                        advancedTexture.removeControl(title);
                        advancedTexture.removeControl(panel);
                        ok.dispose();
                        title.dispose();
                        header.dispose();

                        volumeMenu.isEnabled = true;
                        keys.isEnabled = true;
                        restart.isEnabled = true;
                        exit.isEnabled = true;

                        continueGame();
                    });
                    panel.addControl(header);
                    advancedTexture.addControl(panel);
                    advancedTexture.addControl(ok);
                    advancedTexture.addControl(title);

                }

            }
        });

        return menu;
     }

     //function that creates the homepage
    function getHome()    {
        var homePage = new BABYLON.Scene(engine);
        var camHome =  new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -3), homePage);
        //screen that contain all the elements
        var homeScreen = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",scene=homePage);
        //main container
        var mainPanel = new BABYLON.GUI.Rectangle();
        mainPanel.height = "50%";
        mainPanel.width = "70%";
        mainPanel.background = "#EEECE7";
        mainPanel.cornerRadius = 10;
        mainPanel.thickness = 3;
        mainPanel.color = "Black";
        var title = new menu_title("ESCAPE GAME",mainPanel);
        homeScreen.addControl(mainPanel);
        homeScreen.addControl(title);

        //this button start the game through the function above
        var start = new option_button("Start new game", "20%");
        start.onPointerClickObservable.add(function (){
            if (!running) {
                startGame();
            }
        });
        var keysS = new option_button("Keybinds", "40%");
        var volumeS = new option_button("Audio Settings", "60%");

        //show the panel for set the volume of audio
        volumeS.onPointerClickObservable.add(function() {
            if (!running) {
                console.log("insideeeee");
                mainPanel.removeControl(volumeS);
                mainPanel.removeControl(keysS);
                mainPanel.removeControl(start);
                homeScreen.removeControl(title);
                var title_vol = menu_title("Audio Settings", mainPanel);
                var ok = option_button("Resume", "70%");

                var slider = new BABYLON.GUI.Slider();
                slider.minimum = 0;
                slider.maximum = 100;
                slider.value = Math.floor(BABYLON.Engine.audioEngine.getGlobalVolume() * 100);
                slider.height = "20px";
                slider.width = "200px";
                slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                slider.top = "50%";

                var header = new BABYLON.GUI.TextBlock();
                header.height = "20px";
                header.text = "Volume Level:" + slider.value;
                header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                header.top = "35%";

                slider.onValueChangedObservable.add(function (value) {
                    header.text = "Volume Level: " + Math.floor(value);
                    BABYLON.Engine.audioEngine.setGlobalVolume(value / 100);
                });
                mainPanel.addControl(slider);
                mainPanel.addControl(ok);
                mainPanel.addControl(header);
                homeScreen.addControl(title_vol);


                ok.onPointerClickObservable.add(function () {
                    mainPanel.removeControl(ok);
                    mainPanel.removeControl(slider);
                    mainPanel.removeControl(header);
                    homeScreen.removeControl(title_vol);
                    homeScreen.addControl(title);
                    mainPanel.addControl(volumeS);
                    mainPanel.addControl(keysS);
                    mainPanel.addControl(start);
                });

            }});

        //show the commands of the game
        keysS.onPointerClickObservable.add(function() {

            if (!running) {
                mainPanel.removeControl(volumeS);
                mainPanel.removeControl(keysS);
                mainPanel.removeControl(start);
                homeScreen.removeControl(title);

                var title_s = menu_title("Keybinds", mainPanel);
                var ok_k = option_button("Resume", "90%");

                var title_tab_left = new BABYLON.GUI.TextBlock();
                title_tab_left.color = "Black";
                title_tab_left.fontStyle = "bold";
                title_tab_left.fontSize = 28;
                title_tab_left.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                title_tab_left.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                title_tab_left.top = "5%";
                title_tab_left.text = "Action";
                title_tab_left.left = "15%";

                var title_tab_right = new BABYLON.GUI.TextBlock();
                title_tab_right.color = title_tab_left.color;
                title_tab_right.fontStyle = title_tab_left.fontStyle;
                title_tab_right.fontSize = title_tab_left.fontSize;
                title_tab_right.textVerticalAlignment = title_tab_left.textVerticalAlignment;
                title_tab_right.textHorizontalAlignment = title_tab_left.textHorizontalAlignment;
                title_tab_right.top = title_tab_left.top;
                title_tab_right.text = "Key";
                title_tab_right.left = "70%";

                var leftSide = new BABYLON.GUI.TextBlock();
                leftSide.color = "Black";
                leftSide.fontSize = 24;
                leftSide.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                leftSide.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                leftSide.top = "15%";

                var rightSide = new BABYLON.GUI.TextBlock();
                rightSide.color = leftSide.color;
                rightSide.fontSize = leftSide.fontSize;
                rightSide.textHorizontalAlignment = leftSide.textHorizontalAlignment;
                rightSide.textVerticalAlignment = leftSide.textVerticalAlignment;
                rightSide.top = leftSide.top;
                leftSide.text = "Rotate View \n" +
                    "Walk Forward \n" +
                    "Walk Downward \n" +
                    "Walk Left \n" +
                    "Walk Right \n" +
                    "Run \n" +
                    "Pick Object \n" +
                    "Throw Object \n" +
                    "Action \n" +
                    "Pause Game \n";
                rightSide.text =
                    "Mouse Movements \n" +
                    "W / Arrow Up \n" +
                    "S / Arrow Down \n" +
                    "A / Arrow Left \n" +
                    "D / Arrow Right \n" +
                    "Shift \n" +
                    "Left-Click \n" +
                    "F \n" +
                    "E \n" +
                    "Esc \n";
                leftSide.left = "10%";
                rightSide.left = "60%";

                mainPanel.addControl(title_tab_left);
                mainPanel.addControl(title_tab_right);
                mainPanel.addControl(leftSide);
                mainPanel.addControl(rightSide);
                mainPanel.addControl(ok_k);
                homeScreen.addControl(title_s);


                ok_k.onPointerClickObservable.add(function () {
                    mainPanel.removeControl(title_tab_right);
                    mainPanel.removeControl(title_tab_left);
                    mainPanel.removeControl(leftSide);
                    mainPanel.removeControl(rightSide);
                    mainPanel.removeControl(ok_k);
                    homeScreen.removeControl(title_s);
                    homeScreen.addControl(title);
                    mainPanel.addControl(volumeS);
                    mainPanel.addControl(keysS);
                    mainPanel.addControl(start);
                });
            }});

        mainPanel.addControl(start);
        mainPanel.addControl(keysS);
        mainPanel.addControl(volumeS);
        return homePage;
    }

