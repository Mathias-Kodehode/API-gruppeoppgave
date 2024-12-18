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
controls.minDistance = 2;
controls.maxDistance = 3;
controls.minPolarAngle = 0.1;
controls.maxPolarAngle = Math.PI - 0.1;
controls.autoRotate = false;
controls.target.set(0, 0, 0);
controls.update();

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const loader = new GLTFLoader().setPath("3d_model/earth/");
loader.load(
  "scene.gltf",
  (gltf) => {
    const mesh = gltf.scene;

    mesh.scale.set(3, 3, 3);
    mesh.position.set(0, 0, 0);

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

let iss;
const issLoader = new GLTFLoader().setPath("3d_model/iss/");
issLoader.load(
  "iss_scene.gltf",
  (gltf) => {
    iss = gltf.scene;
    iss.scale.set(1, 1, 1);
    iss.position.set(0, 10, 0);
    scene.add(iss);
  },
  (xhr) => {
    console.log(
      xhr.lengthComputable
        ? `Loading progress: ${(xhr.loaded / xhr.total) * 100}%`
        : "Progress: Unable to compute"
    );
  },
  (error) => {
    console.error("Error loading ISS model:", error);
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

  if (iss) {
    const time = Date.now() * 0.001;
    const radius = 10;
    const speed = 0.1;

    iss.position.x = Math.cos(time * speed) * radius;
    iss.position.z = Math.sin(time * speed) * radius;

    iss.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}

animate();
