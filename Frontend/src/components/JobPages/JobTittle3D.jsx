import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Text3D } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function JobTitle3D({ title }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      '/textures/wood.jpg',
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      () => setTexture(null) // On error, fallback to color
    );
  }, []);

  return (
    <Text3D
      font="public/fonts/helvetiker_regular.typeface.json" // ✅ correct (served from public/)

      size={0.5}
      height={0.2}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      position={[-2, 0, 0]}
    >
      {title || 'New Job'}
      {texture ? (
        <meshStandardMaterial map={texture} />
      ) : (
        <meshStandardMaterial color="#6366f1" />
      )}
    </Text3D>
  );
}
