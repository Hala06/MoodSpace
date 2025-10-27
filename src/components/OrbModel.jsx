import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Orb() {
  const orbRef = useRef();
  const { scene } = useGLTF('/orbs.glb');

  useFrame((state) => {
    if (orbRef.current) {
      // Gentle rotation on multiple axes
      orbRef.current.rotation.x += 0.002;
      orbRef.current.rotation.y += 0.003;
      // Subtle floating motion
      orbRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      orbRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <primitive
      ref={orbRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
    />
  );
}

export default function OrbModel() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.7} color="#764ba2" />
        <Environment preset="sunset" />
        <Orb />
      </Canvas>
    </div>
  );
}
