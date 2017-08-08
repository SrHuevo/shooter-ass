// This begins the creation of a function that we will 'call' just after it's built
var createScene = function (camera) {
  // Now create a basic Babylon Scene object
  var scene = new BABYLON.Scene(engine)
  var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);
  // Change the scene background color to green.
  scene.clearColor = new BABYLON.Color3(1, 1, 1)
  // This creates and positions a free camera
  var camera = new BABYLON.VRDeviceOrientationFreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
  var camera2 = new BABYLON.WebVRFreeCamera('camera2', new BABYLON.Vector3(0, 5, -10), scene)
  camera.checkCollisions = true
  camera.applyGravity = true
  // This targets the camera to scene orig
  camera.setTarget(BABYLON.Vector3.Zero())
  camera2.setTarget(BABYLON.Vector3.Zero())
  // This attaches the camera to the canvas
  camera.attachControl(canvas, false)
  camera2.attachControl(canvas, false)

  var vr = true
  document.getElementById('changeCamera').addEventListener('click', function () {
    scene.activeCamera = vr ? camera2 : camera
    vr = !vr
  })

  // This creates a light, aiming 0,1,0 - to the sky.
  var sun = new BABYLON.HemisphericLight('sun', new BABYLON.Vector3(0, 1, 0), scene)
  // Dim the light a small amount
  sun.intensity = .5

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, scene)
  var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/TropicalSunnyDay', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial

  // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
  var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)
  // Move the sphere upward 1/2 its height
  sphere.position.y = 10
  sphere.checkCollisions = true

  var groundMaterial = new BABYLON.StandardMaterial('ground', scene)
  groundMaterial.diffuseTexture = new BABYLON.Texture('textures/grass.jpg', scene)
  groundMaterial.diffuseTexture.uScale = 6
  groundMaterial.diffuseTexture.vScale = 6
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)

  var ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground', 'textures/heightMap.png', 100, 100, 100, 0, 10, scene, true)
  ground.position.y = -2.0
  ground.material = groundMaterial
  ground.checkCollisions = true
/*
  // Water
  BABYLON.Engine.ShadersRepository = ''
  var water = BABYLON.Mesh.CreateGround('water', 1000, 1000, 1, scene, false)
  var waterMaterial = new WaterMaterial('water', scene, sun)
//  waterMaterial.refractionTexture.renderList.push(extraGround)
  waterMaterial.refractionTexture.renderList.push(ground)

  waterMaterial.reflectionTexture.renderList.push(ground)
  waterMaterial.reflectionTexture.renderList.push(skybox)

  // water.material = waterMaterial;
*/
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
    mass: 0,
    friction: 0.5,
    restitution: 10
  }, scene)
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, {
    mass: 0,
    friction: 0.5
  }, scene)

  // Leave this function
  return scene
}  // End of createScene function

// Get the canvas element from our HTML above
var canvas = document.getElementById('renderCanvas')
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true)
// Now, call the createScene function that you just finished creating
var scene = createScene()

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render()
})
// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize()
})
