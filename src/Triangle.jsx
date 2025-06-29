import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, useGLTF, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import gsap from "gsap";
import * as THREE from "three";

function Triangle() {
  const { nodes } = useGLTF("/latestTri.glb");
  const part1Ref = useRef();
  const part2Ref = useRef();
  const part3Ref = useRef();
  

   const [
    colorTexture,
    normalTexture,
    metalnessTexture
  ] = useTexture([
    '/Triangle_Material_BaseColor.webp',      // Base color texture
    '/Triangle_Material_Normal.webp',     // Normal map (optional)
    '/Triangle_Material_Metallic-Triangle_Material_Roughness.webp'   // Metalness map (optional)
  ]);

  // Alternative: Load just one texture
  // const texture = useTexture('/path/to/your-texture.jpg');

  // Configure texture properties
  useEffect(() => {
    if (colorTexture) {
      colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping;
      colorTexture.repeat.set(1, 1); // Adjust tiling
      colorTexture.flipY = false; // Important for GLTF models
    }
  }, [colorTexture]);

  // Apply textures to model parts
  useEffect(() => {
    if (nodes && colorTexture) {
      // Apply texture to each part
      if (nodes.Plane && nodes.Plane.material) {
        nodes.Plane.material.map = colorTexture;
        nodes.Plane.material.normalMap = normalTexture;
        nodes.Plane.material.metalnessMap = metalnessTexture;
        nodes.Plane.material.needsUpdate = true;
      }
      
      if (nodes.Plane1 && nodes.Plane1.material) {
        nodes.Plane1.material.map = colorTexture;
        nodes.Plane1.material.normalMap = normalTexture;
        nodes.Plane1.material.metalnessMap = metalnessTexture;
        nodes.Plane1.material.needsUpdate = true;
      }
      
      if (nodes.Plane2 && nodes.Plane2.material) {
        nodes.Plane2.material.map = colorTexture;
        nodes.Plane2.material.normalMap = normalTexture;
        nodes.Plane2.material.metalnessMap = metalnessTexture;
        nodes.Plane2.material.needsUpdate = true;
      }
    }
  }, [nodes, colorTexture, normalTexture, metalnessTexture]);

  // Refs for original positions
  const part1OriginalPos = useRef({ x: 0, y: 0, z: 0 });
  const part2OriginalPos = useRef({ x: 0, y: 0, z: 0 });
  const part3OriginalPos = useRef({ x: 0, y: 0, z: 0 });

  const textPosition = useControls("Text Position", {
    x: { value: 0, min: -10, max: 10, step: 0.1 },
    y: { value: 0, min: -10, max: 10, step: 0.1 },
    z: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  const textRotation = useControls("Text Rotation", {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  // Leva: Position controls with final values
  const part1Pos = useControls("Part 1 Position", {
    x: { value: 2.0, min: -10, max: 10, step: 0.1 },
    y: { value: 4.2, min: -10, max: 10, step: 0.1 },
    z: { value: -0.1, min: -10, max: 10, step: 0.1 },
  });
  const part2Pos = useControls("Part 2 Position", {
    x: { value: 2.9, min: -10, max: 10, step: 0.1 },
    y: { value: 4.3, min: -10, max: 10, step: 0.1 },
    z: { value: 0.6, min: -10, max: 10, step: 0.1 },
  });
  const part3Pos = useControls("Part 3 Position", {
    x: { value: 1.9, min: -10, max: 10, step: 0.1 },
    y: { value: 4.1, min: -10, max: 10, step: 0.1 },
    z: { value: -0.5, min: -10, max: 10, step: 0.1 },
  });

  // Leva: Rotation controls with final values (in radians)
  const part1Rot = useControls("Part 1 Rotation", {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });
  const part2Rot = useControls("Part 2 Rotation", {
    x: { value: 0.17, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 6.28, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });
  const part3Rot = useControls("Part 3 Rotation", {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 4.07, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  useEffect(() => {
    // Animate position
    gsap.fromTo(
      part1Ref.current.position,
      { x: -15 },
      { ...part1Pos, duration: 1, delay: 0.2 }
    );
    gsap.fromTo(
      part2Ref.current.position,
      { y: 20 },
      { ...part2Pos, duration: 1, delay: 0.4 }
    );
    gsap.fromTo(
      part3Ref.current.position,
      { x: 18 },
      { ...part3Pos, duration: 1, delay: 0.6 }
    );

    // Animate rotation
    gsap.to(part1Ref.current.rotation, {
      ...part1Rot,
      duration: 1,
      delay: 0.2,
    });
    gsap.to(part2Ref.current.rotation, {
      ...part2Rot,
      duration: 1,
      delay: 0.4,
    });
    gsap.to(part3Ref.current.rotation, {
      ...part3Rot,
      duration: 1,
      delay: 0.6,
    });
  }, []);

  // Live update from Leva (rotation and position)
  useEffect(() => {
    if (part1Ref.current) {
      part1Ref.current.position.set(part1Pos.x, part1Pos.y, part1Pos.z);
      part1Ref.current.rotation.set(part1Rot.x, part1Rot.y, part1Rot.z);
      // Store original position
      part1OriginalPos.current = {
        x: part1Pos.x,
        y: part1Pos.y,
        z: part1Pos.z,
      };
    }
    if (part2Ref.current) {
      part2Ref.current.position.set(part2Pos.x, part2Pos.y, part2Pos.z);
      part2Ref.current.rotation.set(part2Rot.x, part2Rot.y, part2Rot.z);
      // Store original position
      part2OriginalPos.current = {
        x: part2Pos.x,
        y: part2Pos.y,
        z: part2Pos.z,
      };
    }
    if (part3Ref.current) {
      part3Ref.current.position.set(part3Pos.x, part3Pos.y, part3Pos.z);
      part3Ref.current.rotation.set(part3Rot.x, part3Rot.y, part3Rot.z);
      // Store original position
      part3OriginalPos.current = {
        x: part3Pos.x,
        y: part3Pos.y,
        z: part3Pos.z,
      };
    }
  }, [part1Pos, part2Pos, part3Pos, part1Rot, part2Rot, part3Rot]);

  // Hover handlers
  const handleHover = (ref, originalPos, isHovering) => {
    if (ref.current) {
      gsap.to(ref.current.position, {
        y: isHovering ? originalPos.y + 0.5 : originalPos.y,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(ref.current.rotation, {
        z: isHovering
          ? ref.current.rotation.z + 0.1
          : ref.current.rotation.z - (isHovering ? 0 : 0.1),
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <group scale={7}>
        <primitive
          object={nodes.Plane}
          ref={part1Ref}
          onPointerEnter={() =>
            handleHover(part1Ref, part1OriginalPos.current, true)
          }
          onPointerLeave={() =>
            handleHover(part1Ref, part1OriginalPos.current, false)
          }
        />
        <primitive
          object={nodes.Plane1}
          ref={part2Ref}
          onPointerEnter={() =>
            handleHover(part2Ref, part2OriginalPos.current, true)
          }
          onPointerLeave={() =>
            handleHover(part2Ref, part2OriginalPos.current, false)
          }
        />
        <primitive
          object={nodes.Plane2}
          ref={part3Ref}
          onPointerEnter={() =>
            handleHover(part3Ref, part3OriginalPos.current, true)
          }
          onPointerLeave={() =>
            handleHover(part3Ref, part3OriginalPos.current, false)
          }
        />
        <Text scale={3} rotation={[textRotation.x,textRotation.y,textRotation.z]} position={[textPosition.x, textPosition.y, textPosition.z]} font="./orbitron-v34-latin-regular.woff2">
          ASTARTA{"\n"}CAPITAL
        </Text>
      </group>
    </>
  );
}

export default Triangle;
