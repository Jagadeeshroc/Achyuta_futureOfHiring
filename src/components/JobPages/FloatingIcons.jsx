import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingIcons() {
  const icons = useRef([]);
  const positions = [
    [0, 0, -5],
    [3, 2, -7],
    [-3, -1, -4],
    [2, -2, -6],
    [-2, 1, -5],
  ];

  useFrame((state) => {
    icons.current.forEach((icon, i) => {
      icon.rotation.y += 0.01 * (i + 1);
      icon.position.y = Math.sin(state.clock.getElapsedTime() * (0.5 + i * 0.1)) * 0.5;
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          ref={(el) => (icons.current[i] = el)}
          scale={0.5 + Math.random() * 0.5}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#6366f1' : '#4f46e5'} />
        </mesh>
      ))}
    </>
  );
}
