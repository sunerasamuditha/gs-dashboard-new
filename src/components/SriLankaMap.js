import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Color } from 'three';

function MapModel({ districtMap, onDistrictHover, onDistrictClick, ...props }) {
  const group = useRef();
  const { scene } = useGLTF('/srilanka_map.glb');

  useEffect(() => {
    if (!scene || !districtMap) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        const districtName = child.name.trim();
        const data = districtMap[districtName];
        if (data) {
          const lastWeek = Number(data['Total Seminar Count - Within Last Week']) || 0;
          child.material.color = lastWeek > 0 ? new Color('lightblue') : new Color('gray');
          
          child.cursor = 'pointer';
          child.onPointerOver = (event) => {
            event.stopPropagation();
            if (onDistrictHover) onDistrictHover(districtName);
          };
          child.onPointerOut = (event) => {
            event.stopPropagation();
            if (onDistrictHover) onDistrictHover(null);
          };
          child.onClick = (event) => {
            event.stopPropagation();
            if (onDistrictClick) onDistrictClick(districtName);
          };
        } else {
          child.material.color = new Color('white');
        }
      }
    });
  }, [scene, districtMap, onDistrictHover, onDistrictClick]);

  return <primitive ref={group} object={scene} {...props} />;
}

function SriLankaMap({ districtMap, onDistrictHover, onDistrictClick }) {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.7} position={[10, 10, 5]} />
      <MapModel districtMap={districtMap} onDistrictHover={onDistrictHover} onDistrictClick={onDistrictClick} position={[0, 0, 0]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
    </Canvas>
  );
}

export default SriLankaMap;
