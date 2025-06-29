import React, { forwardRef } from 'react';
import { useTexture } from '@react-three/drei';

const ImagePlane = forwardRef(({ position, rotation, scale }, ref) => {
  const texture = useTexture('/ASTARTA_CAPITAL-01.png');

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[5, 3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
});

export default ImagePlane;
