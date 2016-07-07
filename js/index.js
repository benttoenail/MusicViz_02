/*
BASIC THREE.JS TEMPLATE
Max Rose -->  July 4th, 2016 
INDEPENDANCE DAY 
*/

/*
COLORS USED
E23721 -- red
54B0E4 -- Blue
B3007C -- red purple
92007B -- bluish purple
*/

//Init of camera, scene and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({alpha : true});


// -- -- -- LIGHTING -- -- -- \\
var dirLight = new THREE.DirectionalLight(0xFFFFF);
dirLight.position.set(10, 20, 5);
dirLight.target.position.set(scene.position);
//scene.add(dirLight);

var spotlight1 = new THREE.SpotLight(0x54B0E4);
var spotlight2 = new THREE.SpotLight(0xE23721);

//Spotlight1
spotlight1.position.set(-10, 20, 5);
spotlight1.castShadow = true;

spotlight1.shadowMapHeight = 2048;
spotlight1.shadowMapWidth  = 2048;

spotlight1.penumbra = .36;

//SpotLight 2
spotlight2.position.set(10, 20, 5);
spotlight2.castShadow = true;

spotlight2.shadowMapHeight = 2048;
spotlight2.shadowMapWidth  = 2048;

spotlight2.penumbra = .36;

scene.add(spotlight1, spotlight2);

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = false;

renderer.shadowCameraNear = 500;
renderer.shadowCameraFar  = 4000;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 1;
renderer.shadowMapDarkness = .1;
//renderer.shadowMapHeight = 2048;
//renderer.shadowMapWidth  = 2048;

dirLight.castShadow = true;

scene.fog = new THREE.FogExp2(0xE23721, .025);

// -- -- -- END LIGHTING -- -- -- \\

//PostProcessing
var composer = new THREE.EffectComposer( renderer );
var renderPass = new THREE.RenderPass( scene, camera );
composer.addPass( renderPass );

var rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
composer.addPass( rgbEffect );

var horizontalShift = new THREE.ShaderPass( THREE.HorizontalBlurShader );
composer.addPass( horizontalShift );

var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
effectCopy.renderToScreen = true;
composer.addPass( effectCopy );


//Audio Controls
var audio, analyser, frequencydata;

var ctx = new AudioContext();
audio = document.getElementById("mySong");
var audioSrc = ctx.createMediaElementSource(audio);
analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
frequencydata = new Uint8Array(analyser.frequencyBinCount);


//Get Time
var clock = new THREE.Clock();

//Init of Renderer and Canvas
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xf7e6f6, 0);

//Camera Controls
var controls;
controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

camera.position.z = 10;
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(new THREE.Vector3(0, 1.8, 0));

var camPivot = new THREE.Object3D();
camPivot.add(camera);
scene.add(camPivot);

//Ground Helper
var grid = new THREE.GridHelper(10, 0.5, 0xd3d3d3, 0xd3d3d3);
grid.position.y = - 2;
//scene.add(grid);

//Ground Plane
var planeGeo = new THREE.PlaneGeometry(100, 100, 5, 5);
var planeMat = new THREE.MeshLambertMaterial({color:0xE23721});
var plane    = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);


//creation of sphere and objects
var cubeArray = [];
var sphereGeo = new THREE.SphereGeometry(2, 10, 10);

function SphereObjects(){
    
    var sphereMat = new THREE.MeshLambertMaterial({color:0xFFFFF, wireframe:true});
    var sphere    = new THREE.Mesh(sphereGeo, sphereMat);
    
    scene.add(sphere);
    
    var cubeGeo   = new THREE.BoxGeometry(.25, .25, .25);
    var mat = new THREE.MeshPhongMaterial({ color: 0x54B0E4 });
    
    for(var i = 0; i < sphere.geometry.vertices.length; i++){
        var cube = new THREE.Mesh(cubeGeo, mat); 
        var vector = sphere.geometry.vertices[i];
        
        cube.position.x = vector.x;
        cube.position.y = vector.y;
        cube.position.z = vector.z;
        
        cube.lookAt(scene.position);
        
        cube.castShadow = true;
        scene.add(cube);
        cubeArray.push(cube);
    }
    
}

//Create Array of Cylinders 
var cylinderArray = [];
function CylinderArray(){
    
    var height = 1;
    var radius = .75;
    
    var geo = new THREE.CylinderGeometry(radius, radius, height, 32);
    var mat = new THREE.MeshPhongMaterial({ color: 0xB3007C });
    geo.translate(0, .5, 0);
    
    var max = 50;
    var min = -50;
    
    for(var i = 0; i < 300; i++){
        
        var x = Math.floor(Math.random() * (max - min + 1)) + min;
        var z = Math.floor(Math.random() * (max - min + 1)) + min;;
        
        var location = new THREE.Vector3(x, 0, z);
        
        var cylinder = new THREE.Mesh(geo, mat);
        
        cylinder.position.x = location.x;
        cylinder.position.z = location.z;
        cylinder.position.y = -2;
        
        cylinder.castShadow = true;
        scene.add(cylinder);
        cylinderArray.push(cylinder);
    }
}

//Create sphere strips\\
var stripArray = [];
var theta = 3;
function SphereStrips(){
    //Create Sphere Strips\\
    var stripGeo = new THREE.SphereGeometry(4, 5, 20, 1, 0.4, theta, 3.5 );
    var stripMat = new THREE.MeshPhongMaterial({ color: 0xB3007C,
                                                transparent : true,
                                                opacity : .5 }); 
    
    for(var i = 0; i < 4; i ++){
        var strip = new THREE.Mesh(stripGeo, stripMat);
        
        strip.position.y = 2;
        strip.rotation.x = .05 + i;
        strip.rotation.z = .05 + i;
        
        strip.overdraw = true;
        strip.material.side = THREE.doubleSided;
        
        strip.castShadow = true;
        stripArray.push(strip);
        scene.add(strip);
    }
    
}

// -- -- -- ANIMATE SCENE -- -- -- \\
function AnimateScene(){
    
    var time = clock.getElapsedTime();
   // document.getElementById("clock").innerHTML = time;
    
    analyser.getByteFrequencyData(frequencydata);
    
    sphereGeo.verticesNeedUpdate = true;
    
    var position, target;
    var yPos = 2; // Center object's height locaiton
    
    var smoothValue = 0;
    smoothValue +=  (frequencydata[0] - smoothValue) * .1;
    
    spotlight1.intensity = smoothValue / 15;
    spotlight2.intensity = smoothValue / 15;
    
    //animate the cubes
    for(var i = 0; i < sphereGeo.vertices.length; i++){
        var px = Math.sin(i) * smoothValue / 10 ,
            py = Math.cos(i) * smoothValue / 10 ,
            pz = Math.sin(i) * smoothValue / 10;
        
        sphereGeo.vertices[i].set(px, py + yPos, pz);
        
        position = cubeArray[i].position; 
        target = {x:px, y:py, z:pz};
        
        cubeArray[i].rotation.x += .05;
        cubeArray[i].rotation.y += .05;
        cubeArray[i].scale.y = Math.sin(time)*10;
        
        cubeArray[i].position.set(px, py + yPos, pz);
        
    }
    
    //animate the Cylinders
    for(var i = 0; i < cylinderArray.length; i++){
        
        var objLoc = cylinderArray[i].position;
        
        var x = objLoc.x;
        var z = objLoc.z;
        
        if(x < 0){
            x = x * -1;
        }
        if(z < 0){
            z = z * -1;
        }
        var avg = (x + z) / 2;
        
        cylinderArray[i].scale.y = frequencydata[0] /100 * avg / 5;
        cylinderArray[i].scale.x = avg / 10;
        cylinderArray[i].scale.z = avg / 10;
        
    }
    
    //Animate the Strips
    for(var i = 0; i < stripArray.length; i++){
        
        stripArray[i].rotation.x += .04 + i*.01;
        stripArray[i].rotation.y += .05 + i*.01;
        stripArray[i].rotation.z += .06 + i*.01;
        
    }
    
    //Camera Rotation
    camPivot.rotation.y += .004;
    
}



//Main Render Function 
var render = function() {
    
    composer.render(1);
    requestAnimationFrame( render );

    AnimateScene();
    
//    controls.update();
//    renderer.render(scene, camera);
    };

SphereObjects();
CylinderArray();
SphereStrips();
render();
audio.play();