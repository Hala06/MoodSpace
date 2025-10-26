import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial } from 'three';

const Orb = () => {
  const gltf = useLoader(GLTFLoader, '/orbs.glb');
  const orbRef = useRef();

  // Create a new material
  const material = new MeshStandardMaterial({
    color: '#8B5CF6', // Primary color
    metalness: 0.1,
    roughness: 0.2,
    emissive: '#3B82F6', // Secondary color as emissive
    emissiveIntensity: 0.3,
  });

  // Apply the material to all meshes in the loaded model
  if (gltf.scene) {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }

  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.2;
      orbRef.current.rotation.x += delta * 0.1;
    }
  });

  return <primitive ref={orbRef} object={gltf.scene} scale={2.5} />;
};

const OrbCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3B82F6" />
      <Orb />
    </Canvas>
  );
};

export default OrbCanvas;
