import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Diamond() {
  const diamondRef = useRef();
  const { scene } = useGLTF('/dimond.glb');

  useFrame((state) => {
    if (diamondRef.current) {
      // Gentle horizontal rotation
      diamondRef.current.rotation.y += 0.005;
      // Subtle floating motion
      diamondRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <primitive
      ref={diamondRef}
      object={scene}
      scale={2}
      position={[0, 0, 0]}
    />
  );
}

export default function DiamondModel() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#667eea" />
        <Environment preset="city" />
        <Diamond />
      </Canvas>
    </div>
  );
}
