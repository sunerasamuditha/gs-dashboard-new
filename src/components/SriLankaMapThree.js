import React, { useEffect, useRef, useState } from 'react';
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
  const zoomStep = 5;
  // Default: disabled for mobile (<=768px)
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set pointer-events to allow page scroll or map interaction
    container.style.pointerEvents = orbitControlsEnabled ? 'auto' : 'none';

    // WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CSS2D renderer for labels
    const cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';
    cssRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(cssRenderer.domElement);
    cssRendererRef.current = cssRenderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 30, 30);
    cameraRef.current = camera;

    // Adjust camera for various mobile sizes
    if (window.innerWidth <= 393) {
      camera.position.set(0, 46, 46);
    } else if (window.innerWidth <= 600) {
      camera.position.set(0, 42, 42);
    } else if (window.innerWidth <= 768) {
      camera.position.set(0, 35, 35);
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(30, 50, -30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Label offsets for all districts
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

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load('/srilanka_map.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(36, 36, 36);
      scene.add(model);
      loadedModelRef.current = model;

      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.originalPosition = child.position.clone();
          const dName = child.name.replace(/(\.\d+)+$/, '').trim();
          const data = districtMap[dName];
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

      // Create labels
      const labels = {};
      model.traverse((child) => {
        if (!child.isMesh || child.name === '1') return;
        const dName = child.name.replace(/(\.\d+)+$/, '').trim();
        if (!dName) return;
        const div = document.createElement('div');
        div.className = 'label';
        const initVal = districtMap[dName] ? Number(districtMap[dName][labelMetric]) : 0;
        div.textContent = initVal.toString();
        const label = new CSS2DObject(div);
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());
        const maxY = box.max.y;
        const offset = labelOffsets[dName] || { x: 0, y: 0, z: 0 };
        label.position.set(center.x + offset.x, maxY + 1 + offset.y, center.z + offset.z);
        scene.add(label);
        labels[dName] = label;
      });
      labelsRef.current = labels;
    });

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = false;
    controls.enableRotate = orbitControlsEnabled;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      cssRenderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Pointer move
    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Touch -> click mapping
    renderer.domElement.addEventListener('touchstart', (evt) => {
      if (evt.touches.length === 1) {
        const touch = evt.touches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        onPointerClick(touch);
      }
    });

    // Pointer click
    const onPointerClick = (event) => {
      raycaster.current.setFromCamera(pointer.current, camera);
      const hits = raycaster.current.intersectObjects(scene.children, true);
      if (hits.length > 0) {
        const mesh = hits[0].object;
        if (mesh.name === '1' || !mesh.userData.baseColor) return;
        const dName = mesh.name.replace(/(\.\d+)+$/, '').trim();
        if (selectedMeshRef.current !== mesh) {
          if (selectedMeshRef.current) {
            selectedMeshRef.current.material.color.copy(selectedMeshRef.current.userData.baseColor);
            selectedMeshRef.current.position.copy(selectedMeshRef.current.userData.originalPosition);
          }
          selectedMeshRef.current = mesh;
          mesh.material.color.set('#64ffda');
          mesh.position.y = mesh.userData.originalPosition.y + 0.1;
          onDistrictClick?.(dName);
        } else {
          mesh.material.color.copy(mesh.userData.baseColor);
          mesh.position.copy(mesh.userData.originalPosition);
          selectedMeshRef.current = null;
          onDistrictClick?.(null);
        }
      } else {
        if (selectedMeshRef.current) {
          selectedMeshRef.current.material.color.copy(selectedMeshRef.current.userData.baseColor);
          selectedMeshRef.current.position.copy(selectedMeshRef.current.userData.originalPosition);
          selectedMeshRef.current = null;
          onDistrictClick?.(null);
        }
      }
    };
    renderer.domElement.addEventListener
    ('pointerdown', onPointerClick);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      raycaster.current.setFromCamera(pointer.current, camera);
      const hits = raycaster.current.intersectObjects(scene.children, true);
      if (hits.length > 0) {
        const mesh = hits[0].object;
        if (mesh.name !== '1') {
          const dName = mesh.name.replace(/(\.\d+)+$/, '').trim();
          clearTimeout(hoverTimeoutRef.current);
          if (dName !== hoveredMeshName.current) {
            hoveredMeshName.current = dName;
            onDistrictHover?.(dName);
          }
        }
      } else if (!hoverTimeoutRef.current && hoveredMeshName.current) {
        hoverTimeoutRef.current = setTimeout(() => {
          hoveredMeshName.current = null;
          onDistrictHover?.(null);
          hoverTimeoutRef.current = null;
        }, 200);
      }

      controls.update();
      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerClick);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (cssRenderer.domElement && container.contains(cssRenderer.domElement)) container.removeChild(cssRenderer.domElement);
      renderer.dispose();
      scene.clear();
      controls.dispose();
      clearTimeout(hoverTimeoutRef.current);
    };
  }, [onDistrictClick, onDistrictHover, colorMetric, labelMetric, districtMap, orbitControlsEnabled]);

  // Toggle orbit controls on button click
  const toggleOrbitControls = () => {
    const controls = controlsRef.current;
    setOrbitControlsEnabled((prev) => {
      const enabled = !prev;
      controls.enableRotate = enabled;
      // Toggle pointer-events to allow map interaction
      const container = containerRef.current;
      if (container) container.style.pointerEvents = enabled ? 'auto' : 'none';
      return enabled;
    });
  };

  // Zoom handlers
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

  // Update effect for metrics and labels
  useEffect(() => {
    if (loadedModelRef.current) {
      loadedModelRef.current.traverse((child) => {
        if (child.isMesh) {
          const dName = child.name.replace(/(\.\d+)+$/, '').trim();
          const data = districtMap[dName];
          const value = data ? Number(data[colorMetric]) : 0;
          const color = new THREE.Color(value > 0 ? 'skyblue' : 'gray');
          child.userData.baseColor = color.clone();
          if (selectedMeshRef.current !== child) {
            child.material.color.copy(color);
          }
        }
      });
    }
    Object.entries(labelsRef.current).forEach(([dName, label]) => {
      const raw = districtMap[dName]?.[labelMetric];
      const num = Number(raw);
      label.element.textContent = num ? num.toString() : '0';
    });
  }, [districtMap, labelMetric, colorMetric]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
      <div className="zoom-buttons">
        <button className="rotate" onClick={toggleOrbitControls}>
          {orbitControlsEnabled ? 'Disable Map Rotation' : 'Enable Map Rotation'}
        </button>
        <div>
          <button className="zoom" onClick={zoomIn}>＋</button>
          <button className="zoom" onClick={zoomOut}>－</button>
        </div>
      </div>
    </div>
  );
}

export default SriLankaMapThree;
