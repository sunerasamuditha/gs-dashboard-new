import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Color } from 'three';

function DistrictMap({ onDistrictHover, onDistrictClick }) {
  const group = useRef();
  const { scene } = useGLTF('/srilanka_map.glb');

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        const districtName = child.name.trim();
        console.log(`Processing mesh: ${districtName}`); // Debugging log

        child.material.color = new Color('gray'); // Default color for all districts

        child.cursor = 'pointer';
        child.onPointerOver = (event) => {
          event.stopPropagation();
          console.log(`Hovering over: ${districtName}`); // Debugging log
          child.material.color = new Color('lightblue'); // Highlight color on hover
          if (onDistrictHover) onDistrictHover(districtName);
        };
        child.onPointerOut = (event) => {
          event.stopPropagation();
          child.material.color = new Color('gray'); // Revert color on hover out
          if (onDistrictHover) onDistrictHover(null);
        };
        child.onClick = (event) => {
          event.stopPropagation();
          console.log(`Clicked on: ${districtName}`); // Debugging log
          if (onDistrictClick) onDistrictClick(districtName);
        };
      }
    });
  }, [scene, onDistrictHover, onDistrictClick]);

  return <primitive ref={group} object={scene} />;
}

function SriLankaMap({ onDistrictHover, onDistrictClick }) {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.7} position={[10, 10, 5]} />
      <DistrictMap onDistrictHover={onDistrictHover} onDistrictClick={onDistrictClick} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

export default SriLankaMap;
