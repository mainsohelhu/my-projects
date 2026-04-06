import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1.2,
  smoothWheel: true,
});

// Global State for Visual Sync
window.ETHAN_STATE = {
    isListening: false,
    isSpeaking: false,
    isAnalyzing: false,
    sceneSpeed: 1.0,
    moodColor: '#0088ff'
};

window.ETHAN_VISUALS = {}; // Will be populated below

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- THREE.JS SCENE ---
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 12;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Environment (Simple Gradient/Vibe)
const mainColor = new THREE.Color(0x0088ff);
const accentColor = new THREE.Color(0xbd00ff);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(mainColor, 5);
pointLight2.position.set(-5, -5, 2);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(accentColor, 5);
pointLight3.position.set(2, 5, -5);
scene.add(pointLight3);

// Geometric Shape (Refractive Octahedron)
// --- PROCEDURAL EARTH TEXTURE GENERATION ---
const generateEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Background (Oceans) 
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Continents (Simplified Digital Blobs)
    ctx.fillStyle = '#ffffff';
    
    const drawContinent = (x, y, w, h, dots = 50) => {
        for(let i = 0; i < dots; i++) {
            const dx = Math.random() * w;
            const dy = Math.random() * h;
            const size = 1 + Math.random() * 4;
            ctx.fillRect(x + dx, y + dy, size, size);
        }
    };

    // North America
    drawContinent(100, 100, 200, 150, 400);
    // South America
    drawContinent(250, 250, 100, 200, 300);
    // Eurasia
    drawContinent(450, 50, 400, 150, 800);
    // Africa
    drawContinent(500, 200, 150, 200, 400);
    // Australia
    drawContinent(800, 300, 100, 100, 150);
    // Antarctica
    drawContinent(0, 450, 1024, 60, 200);

    return new THREE.CanvasTexture(canvas);
};

const earthMap = generateEarthTexture();

// --- THE CALM NEURAL CORE (Replaces Globe) ---
const ringParticlesCount = 4500;
const ringPositions = new Float32Array(ringParticlesCount * 3);
const ringColors = new Float32Array(ringParticlesCount * 3);
const ringSizes = new Float32Array(ringParticlesCount);

for (let i = 0; i < ringParticlesCount; i++) {
    const theta = (i / ringParticlesCount) * Math.PI * 2;
    const radius = 4.2 + (Math.random() - 0.5) * 0.4;
    
    // Vertical Orientation (XY Plane with slight Z depth)
    ringPositions[i * 3] = Math.cos(theta) * radius;
    ringPositions[i * 3 + 1] = Math.sin(theta) * radius;
    ringPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2; 

    // Smooth Astral Colors
    const color = new THREE.Color(mainColor);
    if (Math.random() > 0.9) color.set(0xffffff); // Rare faint sparkles
    if (Math.random() > 0.95) color.set(0xbd00ff); // Occasional soft purple
    
    ringColors[i * 3] = color.r;
    ringColors[i * 3 + 1] = color.g;
    ringColors[i * 3 + 2] = color.b;

    ringSizes[i] = 0.03 + Math.random() * 0.08; 
}

const ringGeometry = new THREE.BufferGeometry();
ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));
ringGeometry.setAttribute('size', new THREE.BufferAttribute(ringSizes, 3));

const ringShaderMaterial = new THREE.PointsMaterial({
    size: 0.08, // Delicate star-field particles
    vertexColors: true,
    transparent: true,
    opacity: 0.5, // Ghostly transparency
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const neuralRing = new THREE.Points(ringGeometry, ringShaderMaterial);
neuralRing.rotation.y = 0.45; // Subtle tilt
neuralRing.position.z = -2;
scene.add(neuralRing);

// --- RESPONSIVE 3D SCALING & POSITIONING ---
const update3DScales = () => {
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 1.0 : 1.25;
    
    neuralRing.scale.setScalar(scale);
    camera.position.z = isMobile ? 15 : 12;
};

update3DScales();
window.addEventListener('resize', update3DScales);

// --- DATA FLOW PARTICLES (Vertical) ---
const dataParticlesCount = 1000;
const dataPositions = new Float32Array(dataParticlesCount * 3);
const velocity = new Float32Array(dataParticlesCount);

for (let i = 0; i < dataParticlesCount; i++) {
    dataPositions[i * 3] = (Math.random() - 0.5) * 20;
    dataPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    dataPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    velocity[i] = 0.02 + Math.random() * 0.05;
}

const dataGeometry = new THREE.BufferGeometry();
dataGeometry.setAttribute('position', new THREE.BufferAttribute(dataPositions, 3));
const dataMaterial = new THREE.PointsMaterial({ size: 0.04, color: mainColor, transparent: true, opacity: 0.4 });
const dataPoints = new THREE.Points(dataGeometry, dataMaterial);
scene.add(dataPoints);

// --- PARTICLE RING ---
const particlesCount = 2000;
const positions = new Float32Array(particlesCount * 3);
const particleGeometry = new THREE.BufferGeometry();

for (let i = 0; i < particlesCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const radius = 6 + Math.random() * 2;
  const x = Math.cos(theta) * radius;
  const z = Math.sin(theta) * radius;
  const y = (Math.random() - 0.5) * 0.5;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: mainColor,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const starsCount = 5000;
const starPositions = new Float32Array(starsCount * 3);
const starGeometry = new THREE.BufferGeometry();

for (let i = 0; i < starsCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 100;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.3 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// --- EXPOSE VISUALS TO ETHAN'S BRAIN ---
window.ETHAN_VISUALS = {
    ring: neuralRing,
    data: dataPoints,
    particles,
    stars,
    scene,
    camera,
    lights: { p1: pointLight, p2: pointLight2, p3: pointLight3 }
};

// --- ANIMATION & INTERACTION ---
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Resize Listener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render Loop
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ring Core Animation (Slow, Smooth Rotation)
  const baseRotation = window.ETHAN_STATE.isAnalyzing ? 1.0 : 0.2;
  neuralRing.rotation.z += (0.005 * baseRotation); // Slower rotate
  neuralRing.rotation.y = 0.45 + Math.sin(elapsedTime * 0.3) * 0.05;
  
  // Fluctuation Logic (Smooth Ripple Effect)
  const ringPos = ringGeometry.attributes.position.array;
  const targetIntensity = window.ETHAN_STATE.isSpeaking ? 0.6 : (window.ETHAN_STATE.isListening ? 0.25 : 0.1);
  
  // Slow "Breathing" Radius cycle
  const breathingRadius = 4.2 + Math.sin(elapsedTime * 0.8) * 0.15;
  
  for (let i = 0; i < ringParticlesCount; i++) {
      const theta = (i / ringParticlesCount) * Math.PI * 2;
      
      // Multi-layered Smooth Ripple (No noise jitter)
      const ripple1 = Math.sin(theta * 8 + elapsedTime * 2) * 0.2;
      const ripple2 = Math.sin(theta * 15 - elapsedTime * 3) * 0.1;
      const talkingWave = window.ETHAN_STATE.isSpeaking ? (Math.sin(theta * 20 + elapsedTime * 8) * 0.3) : 0;
      
      const currentRadius = breathingRadius + ripple1 + ripple2 + talkingWave;
      
      ringPos[i * 3] = Math.cos(theta) * currentRadius;
      ringPos[i * 3 + 1] = Math.sin(theta) * currentRadius;
      
      // Delicate depth wave (Slow drift on Z)
      const zWave = Math.sin(theta * 4 + elapsedTime * 1.5) * 0.3;
      ringPos[i * 3 + 2] = zWave + (Math.random() - 0.5) * 0.2; // Tiny bit of static
  }
  ringGeometry.attributes.position.needsUpdate = true;

  // Data Flow Animation
  const dataPos = dataGeometry.attributes.position.array;
  const flowSpeed = window.ETHAN_STATE.isAnalyzing ? 5 : 1;
  
  for (let i = 0; i < dataParticlesCount; i++) {
      dataPos[i * 3 + 1] -= velocity[i] * flowSpeed;
      if (dataPos[i * 3 + 1] < -10) dataPos[i * 3 + 1] = 10;
  }
  dataGeometry.attributes.position.needsUpdate = true;

  // Particle Ring Animation
  particles.rotation.y = elapsedTime * 0.1;
  particles.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;

  // Background Stars Animation
  stars.rotation.y += 0.0002;
  
  // React to mouse
  particles.rotation.x = gsap.utils.interpolate(particles.rotation.x, mouseY * 0.5, 0.05);

  // Mouse Parallax (Smooth transition)
  gsap.to(neuralRing.position, {
    x: mouseX * 1.5,
    y: -mouseY * 1.5,
    duration: 1.5,
    ease: 'power2.out'
  });

  // Camera Shake (Subtle)
  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.01;
  camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.01;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();

// Final Position Polish (Smooth transition)
gsap.to(neuralRing.position, {
  x: 0,
  y: 0,
  z: 0,
  duration: 1,
  ease: 'power2.out'
});
