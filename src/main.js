// This begins the creation of a function that we will 'call' just after it's built
var createScene = function (camera) {
    // Now create a basic Babylon Scene object
    var scene = new BABYLON.Scene(engine);
    // Change the scene background color to green.
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    // This creates and positions a free camera
    var camera = new BABYLON.VRDeviceOrientationFreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    var camera2 = new BABYLON.WebVRFreeCamera("camera2", new BABYLON.Vector3(0, 5, -10), scene);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    // This targets the camera to scene orig
    camera.setTarget(BABYLON.Vector3.Zero());
    camera2.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);
    camera2.attachControl(canvas, false);

    var vr = true;
    document.getElementById("changeCamera").addEventListener( 'click', function () {
        scene.activeCamera = vr ? camera2 : camera;
        vr = !vr;
    });

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount
    light.intensity = .5;

    createSkybox(scene);

    // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 10;

    var texture1 = new BABYLON.Texture("textures/grass.png", scene);

    // // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    // var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 24, scene);
    // ground.material = new BABYLON.StandardMaterial("texture1", scene);
    // ground.checkCollisions = true;
    // scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

    // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 20;
    groundMaterial.diffuseTexture.vScale = 20;
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/ground_heights.png", 300, 300, 100, 0, 45, scene);
    ground.material = groundMaterial;


    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 1 }, scene);
    // Leave this function
    return scene;
};  // End of createScene function

function createSkybox(scene) {
    // Skybox
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;
}

// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);
// Now, call the createScene function that you just finished creating
var scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
