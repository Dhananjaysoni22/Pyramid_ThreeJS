import React from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useControls } from 'leva';


function background(props) {
  const { scene } = useGLTF("/Terrain.glb");

   const bgPos = useControls('bgCol', {
      x: { value: 2.4, min: -50, max: 50, step: 0.1 },
      y: { value: -6.7, min: -50, max: 50, step: 0.1 },
      z: { value: -47.5, min: -50, max: 50, step: 0.1 },
    });
  // console.log(bg)
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 15]} intensity={1.5} />
      <primitive  position={[bgPos.x,bgPos.y, bgPos.z]} object={scene} scale={17} {...props} />;
    </>
  );
}

export default background;
