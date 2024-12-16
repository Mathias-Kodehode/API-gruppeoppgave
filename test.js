import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
// Closer camera position
camera.position.set(0, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 3; // Allow more distance for larger model
controls.minPolarAngle = 0.1; // Allow close-to-horizontal views
controls.maxPolarAngle = Math.PI - 0.1;
controls.autoRotate = false;
controls.target.set(0, 0, 0); // Center on the planet
controls.update();

// Lighting: Sunlight (Directional Light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Change to neutral white color
directionalLight.position.set(10, 10, 10); // Simulating sunlight angle
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Add subtle ambient light with a cool tint (slightly bluish)
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Slightly blue ambient light
scene.add(ambientLight);

// Load and scale the planet model
const loader = new GLTFLoader().setPath("3d_model/earth/");
loader.load(
  "scene.gltf",
  (gltf) => {
    console.log("Model loaded successfully:", gltf);
    const mesh = gltf.scene;

    // Scale the planet
    mesh.scale.set(5, 5, 5); // Increase size by scaling
    mesh.position.set(0, 0, 0); // Ensure planet is centered

    // Add shadows
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(mesh);
  },
  (xhr) => {
    console.log(
      xhr.lengthComputable
        ? `Loading progress: ${(xhr.loaded / xhr.total) * 100}%`
        : "Progress: Unable to compute"
    );
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
