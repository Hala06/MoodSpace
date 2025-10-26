import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = ({ mouse }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Mouse interaction - smooth follow
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mouse.x * 0.5,
        0.05
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mouse.y * 0.5,
        0.05
      );
    }

    if (materialRef.current) {
      // Animate distortion
      materialRef.current.distort = 0.4 + Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]} scale={2.5}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#667eea"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const FloatingOrb = ({ className = '', opacity = 0.6 }) => {
  const mousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY, currentTarget } = event;
    const { width, height } = currentTarget.getBoundingClientRect();
    mousePosition.current = {
      x: (clientX / width) * 2 - 1,
      y: -(clientY / height) * 2 + 1,
    };
  };

  return (
    <div 
      className={`floating-orb-container ${className}`}
      onMouseMove={handleMouseMove}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: opacity,
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#764ba2" />
        <AnimatedSphere mouse={mousePosition.current} />
      </Canvas>
    </div>
  );
};

export default FloatingOrb;
