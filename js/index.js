/*
BASIC THREE.JS TEMPLATE
Max Rose -->  July 4th, 2016 
INDEPENDANCE DAY 
*/

//Init of camera, scene and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({alpha : true});

//set up Lights
var dirLight = new THREE.DirectionalLight(0xFFFFF);
scene.add(dirLight);

scene.fog = new THREE.FogExp2(0xfffff, .025);

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

//Ground Helper
var ground = new THREE.GridHelper(10, 0.5, 0xd3d3d3, 0xd3d3d3);
ground.position.y = - 2;
scene.add(ground);



//creation of sphere and objects
var cubeArray = [];
var sphereGeo = new THREE.SphereGeometry(2, 10, 10);

function SphereObjects(){
    
    var sphereMat = new THREE.MeshLambertMaterial({color:0xFFFFF, wireframe:true});
    var sphere    = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);
    
    var cubeGeo   = new THREE.BoxGeometry(.25, .25, .25);
    var mat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    
    for(var i = 0; i < sphere.geometry.vertices.length; i++){
        var cube = new THREE.Mesh(cubeGeo, mat); 
        var vector = sphere.geometry.vertices[i];
        
        cube.position.x = vector.x;
        cube.position.y = vector.y;
        cube.position.z = vector.z;
        
        cube.lookAt(scene.position);
        
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
    var mat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
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
        
        scene.add(cylinder);
        cylinderArray.push(cylinder);
    }
}

//Animate Cubes

function AnimateScene(){
    
    var time = clock.getElapsedTime();
    document.getElementById("clock").innerHTML = time;
    
    analyser.getByteFrequencyData(frequencydata);
    
    sphereGeo.verticesNeedUpdate = true;
    
    var position, target;
    
    var smoothValue = 0;
    smoothValue +=  (frequencydata[0] - smoothValue) * .1;
    
    //animate the cubes
    for(var i = 0; i < sphereGeo.vertices.length; i++){
        var px = Math.sin(i) * smoothValue / 10 ,
            py = Math.cos(i) * smoothValue / 10 ,
            pz = Math.sin(i) * smoothValue / 10;
        
        sphereGeo.vertices[i].set(px, py, pz);
        
        
        position = cubeArray[i].position; 
        target = {x:px, y:py, z:pz};
        
        cubeArray[i].rotation.x += .05;
        cubeArray[i].rotation.y += .05;
        cubeArray[i].scale.y = Math.sin(time)*10;
        
        cubeArray[i].position.set(px, py, pz);
        
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
}

//scene.add(cube, cube2);
camera.position.z = 5;

//Main Render Function 
var render = function() {
    requestAnimationFrame( render );

    AnimateScene();
    
    controls.update();
    renderer.render(scene, camera);
    };

SphereObjects();
CylinderArray();
render();
audio.play();