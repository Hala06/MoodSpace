import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Blob({ position, color, scale }) {
  const meshRef = useRef();
  const timeOffset = Math.random() * 100;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + timeOffset;
      
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.3) * 0.2;
      
      // Subtle rotation
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
      
      // Gentle pulsing
      const pulseFactor = 1 + Math.sin(time * 0.7) * 0.1;
      meshRef.current.scale.set(scale * pulseFactor, scale * pulseFactor, scale * pulseFactor);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function AnimatedBlobs() {
  const blobs = [
    { position: [-3, 2, -2], color: '#667eea', scale: 0.8 },
    { position: [4, -1, -3], color: '#764ba2', scale: 1.2 },
    { position: [2, 3, -4], color: '#f093fb', scale: 0.6 },
    { position: [-2, -2, -2], color: '#667eea', scale: 0.9 },
    { position: [0, 1, -5], color: '#8b5cf6', scale: 1.0 },
  ];

  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      opacity: 0.4, 
      pointerEvents: 'none',
      zIndex: 0
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#764ba2" />
        {blobs.map((blob, i) => (
          <Blob key={i} {...blob} />
        ))}
      </Canvas>
    </div>
  );
}
