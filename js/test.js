import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

camera.position.set(0, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 3;
controls.minPolarAngle = 0.1;
controls.maxPolarAngle = Math.PI - 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.target.set(0, 0, 0);
controls.update();

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Earth Model
let earth;
const earthGroup = new THREE.Group(); // Group for the Earth model
scene.add(earthGroup);

const loader = new GLTFLoader().setPath("3d_model/earth/");
loader.load(
  "scene.gltf",
  (gltf) => {
    earth = gltf.scene;

    const box = new THREE.Box3().setFromObject(earth);
    const center = box.getCenter(new THREE.Vector3());

    earth.position.set(-center.x, -center.y, -center.z);
    earth.scale.set(3, 3, 3);

    earth.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    earthGroup.add(earth);
  },
  undefined,
  (error) => console.error("Error loading Earth model:", error)
);

// ISS Model
let iss;
const issLoader = new GLTFLoader().setPath("3d_model/ISS/");
issLoader.load(
  "iss_scene.gltf",
  (gltf) => {
    iss = gltf.scene;
    iss.scale.set(3, 3, 3);
    scene.add(iss);
  },
  undefined,
  (error) => console.error("Error loading ISS model:", error)
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Convert Lat/Lon to 3D Cartesian coordinates
function latLonToCartesian(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return { x, y, z };
}

// Fetch ISS Position from the API
async function fetchISSPosition() {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );
    const data = await response.json();

    const latitude = parseFloat(data.latitude);
    const longitude = parseFloat(data.longitude);

    document.getElementById(
      "latitude"
    ).textContent = `Latitude: ${latitude.toFixed(2)}`;
    document.getElementById(
      "longitude"
    ).textContent = `Longitude: ${longitude.toFixed(2)}`;

    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching ISS position:", error);
    return null;
  }
}

// Update ISS Position on the Earth Model
async function updateISSPosition() {
  const position = await fetchISSPosition();
  if (position && iss) {
    const { x, y, z } = latLonToCartesian(
      position.latitude,
      position.longitude,
      0.8
    );
    iss.position.set(x, y, z);
    iss.lookAt(0, 0, 0);
  }
}

let animationsEnabled = true;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (animationsEnabled) {
    earthGroup.rotation.y += 0.001;
    controls.autoRotate = true;
  } else {
    controls.autoRotate = false;
  }

  controls.update();
  renderer.render(scene, camera);
}

// Add button for toggling animations
const button = document.createElement("button");
button.id = "stop-animation-button";
button.textContent = "Toggle Animation";
button.style.position = "absolute";
button.style.top = "30px";
button.style.left = "30px";
button.style.padding = "10px 15px";
button.style.fontSize = "16px";
button.style.backgroundColor = "black";
button.style.color = "#fff";
button.style.border = "1px solid white";
button.style.cursor = "pointer";
button.style.zIndex = "9999";
button.style.borderRadius = "5px";
button.style.display = "flex";
button.style.alignItems = "center";
document.body.appendChild(button);

// Toggle animation state
button.addEventListener("click", () => {
  animationsEnabled = !animationsEnabled;
});

animate();
setInterval(updateISSPosition, 5000);
