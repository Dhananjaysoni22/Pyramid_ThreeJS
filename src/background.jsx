import React, { useEffect } from "react";
import { useGLTF, OrbitControls, useTexture } from "@react-three/drei";
import { useControls } from "leva";

function background(props) {
  const { scene } = useGLTF("/Terrain.glb");

  const [albedoMap, normalMap] = useTexture(["/Albedo.jpg", "/Normal.jpg"]);

  // ✅ Traverse and apply textures
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = albedoMap;
        child.material.normalMap = normalMap;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, albedoMap, normalMap]);

  const bgPos = useControls("bgPos", {
    x: { value: -8.2, min: -50, max: 50, step: 0.1 },
    y: { value: 9.2, min: -50, max: 50, step: 0.1 },
    z: { value: -86.7, min: -100, max: 100, step: 0.1 },
  });
  const bgRot = useControls("bgRot", {
    x: { value: 0.0, min: 0, max: Math.PI * 10, step: 0.01 },
    y: { value: 5.79, min: 0, max: Math.PI * 10, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 10, step: 0.01 },
  });
  const dirPos = useControls("dirPos",{
     x: { value: 33.4, min: -50, max: 50, step: 0.1 },
    y: { value: -34.6, min: -50, max: 50, step: 0.1 },
    z: { value: -100, min: -100, max: 100, step: 0.1 },
  })
  // console.log(bg)
  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      <directionalLight
        position={[dirPos.x, dirPos.y - 20, dirPos.z]}
        target-position={[bgPos.x, bgPos.y, bgPos.z]}
        intensity={10}
        color="white"
      />{" "}
      <primitive
        position={[bgPos.x, bgPos.y, bgPos.z]}
        rotation={[bgRot.x, bgRot.y, bgRot.z]}
        object={scene}
        scale={22}
        {...props}
      />
      ;
    </>
  );
}

export default background;
