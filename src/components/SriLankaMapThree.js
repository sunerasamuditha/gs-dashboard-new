import React, { useEffect, useRef,useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import './SriLankaMapThree.css';

function SriLankaMapThree({ districtMap, onDistrictHover, onDistrictClick, colorMetric, labelMetric }) {
  const containerRef = useRef();
  const rendererRef = useRef();
  const cssRendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const loadedModelRef = useRef(null);
  const hoveredMeshName = useRef(null);
  const selectedMeshRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const labelsRef = useRef({});
  const minDistance = 20;
  const maxDistance = 80;
  const zoomStep    = 5;
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(window.innerWidth > 768); // Default: disabled for mobile

  // Initialization effect - runs on mount and when dependencies change
  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set up WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Set up CSS2D renderer for labels
    const cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';
    cssRenderer.domElement.style.pointerEvents = 'none'; // Allow mouse events to pass through
    container.appendChild(cssRenderer.domElement);
    cssRendererRef.current = cssRenderer;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 30, 30);
    cameraRef.current = camera;

    if (window.innerWidth <= 600) {
      // For mobile devices, adjust the camera position to be closer
      camera.position.set(0, 42, 42); // Adjust these values as needed
      // You might also want to adjust minDistance and maxDistance for mobile
    }

    if (window.innerWidth <= 768 && window.innerWidth > 601) {
      // For mobile devices, adjust the camera position to be closer
      camera.position.set(0, 35, 35); // Adjust these values as needed
      // You might also want to adjust minDistance and maxDistance for mobile
    }

    if (window.innerWidth <= 393) {
      // For mobile devices, adjust the camera position to be closer
      camera.position.set(0, 46, 46); // Adjust these values as needed
      // You might also want to adjust minDistance and maxDistance for mobile
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(30, 50, -30);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Define label offsets for all 25 districts
    const labelOffsets = {
      'Colombo': { x: -7.5, y: 0, z: 10 },
      'Gampaha': { x: -7, y: 0, z: 7.5 },
      'Kalutara': { x: -6, y: 0, z: 14 },
      'Kandy': { x: 0, y: 0, z: 5 },
      'Matale': { x: 0.3, y: 0, z: 2 },
      'Nuwara-Eliya': { x: 1, y: 0, z: 8 },
      'Galle': { x: -4.5, y: 0, z: 17 },
      'Matara': { x: -0.5, y: 0, z: 18 },
      'Hambantota': { x: 3, y: 0, z: 18 },
      'Jaffna': { x: -5.5, y: 0, z: -21.5 },
      'Kilinochchi': { x: -4, y: 0, z: -18 },
      'Mannar': { x: -6.5, y: 0, z: -12 },
      'Vavuniya': { x: -1, y: 0, z: -13 },
      'Mulativu': { x: -1, y: 0, z: -17 },
      'Batticaloa': { x: 9, y: 0, z: -1 },
      'Ampara': { x: 12, y: 0, z: 6 },
      'Trincomalee': { x: 5, y: 0, z: -8 },
      'Kurunegala': { x: -5, y: 0, z: 3 },
      'Puttlam': { x: -8, y: 0, z: -3 },
      'Anuradhapura': { x: -1, y: 0, z: -5.5 },
      'Polonnaruwa': { x: 4, y: 0, z: -1.5 },
      'Badulla': { x: 3.5, y: 0, z: 10 },
      'Monaragala': { x: 6, y: 0, z: 14 },
      'Ratnapura': { x: -2, y: 0, z: 13.5 },
      'Kegalle': { x: -3.5, y: 0, z: 8 }
    };

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load('/srilanka_map.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(36, 36, 36);
      scene.add(model);
      loadedModelRef.current = model;

      // Initialize mesh colors and positions
      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.originalPosition = child.position.clone();
          const districtName = child.name.replace(/(\.\d+)+$/, '').trim();
          const data = districtMap[districtName];
          let baseColor;
          if (data) {
            const metricValue = Number(data[colorMetric]) || 0;
            baseColor = new THREE.Color(metricValue > 0 ? 'skyblue' : 'gray');
          } else {
            baseColor = new THREE.Color('white');
          }
          child.material = child.material.clone();
          child.material.color.copy(baseColor);
          child.userData.baseColor = baseColor.clone();
          child.cursor = 'pointer';
        }
      });

      // Create labels for each district
      const labels = {};
model.traverse((child) => {
  if (child.isMesh) {

    if (child.name === "1") return;

    const districtName = child.name.replace(/(\.\d+)+$/, '').trim();
    if (districtName) {
      const labelDiv = document.createElement('div');
      labelDiv.className = 'label';

      // Fetch initial value from districtMap if available
      const initialData = districtMap[districtName];
      const initialValue = initialData ? Number(initialData[labelMetric]) || '0' : '0';
      
      labelDiv.textContent = initialValue; // Set initial value dynamically

      const label = new CSS2DObject(labelDiv);
      const box = new THREE.Box3().setFromObject(child);
      const center = box.getCenter(new THREE.Vector3());
      const maxY = box.max.y;
      const offset = labelOffsets[districtName] || { x: 0, y: 0, z: 0 };
      label.position.set(center.x + offset.x, maxY + 1 + offset.y, center.z + offset.z);
      scene.add(label);
      labels[districtName] = label;
    }
  }
});
labelsRef.current = labels;
    });

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = false;
    controls.enableRotate = orbitControlsEnabled; // Enable/disable based on state
    controls.autoRotate = false;
    controlsRef.current = controls;

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      cssRenderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Handle pointer movement
    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    renderer.domElement.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        // Convert touch to pointer coordinates
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.current.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
        onPointerClick(event.touches[0]);
      }
    });

    // Handle pointer click
    const onPointerClick = (event) => {
      raycaster.current.setFromCamera(pointer.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (clickedMesh.name === "1" || !clickedMesh.userData.baseColor) return;
        const districtName = clickedMesh.name.replace(/(\.\d+)+$/, '').trim();
        if (selectedMeshRef.current !== clickedMesh) {
          if (selectedMeshRef.current) {
            selectedMeshRef.current.material.color.copy(selectedMeshRef.current.userData.baseColor);
            selectedMeshRef.current.position.copy(selectedMeshRef.current.userData.originalPosition);
          }
          selectedMeshRef.current = clickedMesh;
          clickedMesh.material.color.set('#64ffda');
          clickedMesh.position.y = clickedMesh.userData.originalPosition.y + 0.1;
          if (onDistrictClick) onDistrictClick(districtName);
        } else {
          clickedMesh.material.color.copy(clickedMesh.userData.baseColor);
          clickedMesh.position.copy(clickedMesh.userData.originalPosition);
          selectedMeshRef.current = null;
          if (onDistrictClick) onDistrictClick(null);
        }
      } else {
        if (selectedMeshRef.current) {
          selectedMeshRef.current.material.color.copy(selectedMeshRef.current.userData.baseColor);
          selectedMeshRef.current.position.copy(selectedMeshRef.current.userData.originalPosition);
          selectedMeshRef.current = null;
          if (onDistrictClick) onDistrictClick(null);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      raycaster.current.setFromCamera(pointer.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      // Handle hover logic
      if (intersects.length > 0) {
        const mesh = intersects[0].object;

        if (mesh.name === "1") return;

        const districtName = mesh.name.replace(/(\.\d+)+$/, '').trim();
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        if (districtName !== hoveredMeshName.current) {
          hoveredMeshName.current = districtName;
          if (onDistrictHover) onDistrictHover(districtName);
        }
      } else {
        if (!hoverTimeoutRef.current && hoveredMeshName.current !== null) {
          hoverTimeoutRef.current = setTimeout(() => {
            hoveredMeshName.current = null;
            if (onDistrictHover) onDistrictHover(null);
            hoverTimeoutRef.current = null;
          }, 200);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (cssRendererRef.current && container.contains(cssRendererRef.current.domElement)) {
        container.removeChild(cssRendererRef.current.domElement);
      }
      renderer.dispose();
      scene.clear();
      controls.dispose();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [onDistrictClick, onDistrictHover, colorMetric, labelMetric, districtMap, orbitControlsEnabled]);

  // Toggle orbit controls
  const toggleOrbitControls = () => {
    const controls = controlsRef.current;
    setOrbitControlsEnabled((prev) => {
      const newState = !prev;
      controls.enableRotate = newState;

      // Enable or disable pointer-events for scrolling
      const container = containerRef.current;
      if (container) {
        container.style.pointerEvents = newState ? 'auto' : 'none';
      }

      return newState;
    });
  };

  // -- Zoom buttons handlers (relative to controls.target) --
const zoomIn = () => {
  const camera  = cameraRef.current;
  const controls = controlsRef.current;
  const target  = controls.target;

  // direction from camera to target
  const dir = new THREE.Vector3().copy(target)
    .sub(camera.position)
    .normalize();

  // current distance
  const dist = camera.position.distanceTo(target);
  // clamp to [minDistance, maxDistance]
  const newDist = Math.max(minDistance, dist - zoomStep);
  const actualStep = dist - newDist;

  camera.position.addScaledVector(dir, actualStep);
  controls.update();
};

const zoomOut = () => {
  const camera  = cameraRef.current;
  const controls = controlsRef.current;
  const target  = controls.target;

  // direction from target to camera
  const dir = new THREE.Vector3().copy(camera.position)
    .sub(target)
    .normalize();

  const dist = camera.position.distanceTo(target);
  const newDist = Math.min(maxDistance, dist + zoomStep);
  const actualStep = newDist - dist;

  camera.position.addScaledVector(dir, actualStep);
  controls.update();
};


  // Update effect - updates mesh colors and labels when districtMap or metrics change
  useEffect(() => {
    if (loadedModelRef.current) {
      loadedModelRef.current.traverse((child) => {
        if (child.isMesh) {
          const districtName = child.name.replace(/(\.\d+)+$/, '').trim();
          const data = districtMap[districtName];
          let baseColor;
          if (data) {
            const metricValue = Number(data[colorMetric]) || 0;
            baseColor = new THREE.Color(metricValue > 0 ? 'skyblue' : 'gray');
          } else {
            baseColor = new THREE.Color('white');
          }
          child.userData.baseColor = baseColor.clone();
          if (selectedMeshRef.current !== child) {
            child.material.color.copy(baseColor);
          }
        }
      });
    }

    // Update label text when districtMap or labelMetric changes
    if (labelsRef.current) {
      Object.entries(labelsRef.current).forEach(([districtName, label]) => {
        const data = districtMap[districtName];
        if (data) {
          // Convert to number explicitly
        const rawValue = data[labelMetric];
        const cumulativeCount = Number(rawValue);
        label.element.textContent = cumulativeCount ? cumulativeCount : '0';
        console.log(`District: ${districtName}, raw cumulative: ${rawValue}, converted: ${cumulativeCount}`);
          
        } else {
          label.element.textContent = '0';
        }
      });
    }
  }, [districtMap, labelMetric, colorMetric]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D canvas */}
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
  
      {/* zoom controls */}
      <div className="zoom-buttons">
      <button className="rotate" onClick={toggleOrbitControls}>
          {orbitControlsEnabled ? 'Disable Map Rotation' : 'Enable Map Rotation'}
        </button>
        <div>
          <button className='zoom' onClick={zoomIn}>＋</button>
          <button className='zoom' onClick={zoomOut}>－</button>
        </div>
      </div>
    </div>
  );
  
}

export default SriLankaMapThree;
