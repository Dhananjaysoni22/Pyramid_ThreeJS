import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import { useControls } from 'leva';
import gsap from 'gsap';
import ImagePlane from './ImagePlane';
import FloatingPart from './FloatingPart';

function PyramidFinal() {
  const { nodes } = useGLTF('/TriangleOG.glb');
  console.log(nodes); // Your GLB file
  const groupRef = useRef();
  const textRef = useRef();
  const [animationComplete, setAnimationComplete] = useState(false);

  const textPosition = useControls("Text Position", {
    x: { value: 45.3, min: -80, max: 80, step: 0.1 },
    y: { value: 8.1, min: -40, max: 40, step: 0.1 },
    z: { value: 35.9, min: -80, max: 80, step: 0.1 },
  });

  const textRotation = useControls("Text Rotation", {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 0.80, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  // Leva controls for position
  const part1Pos = useControls('Part 1 Position', {
    x: { value: 1.1, min: -10, max: 10, step: 0.1 },
    y: { value: 1.0, min: -10, max: 10, step: 0.1 },
    z: { value: -0.07, min: -10, max: 10, step: 0.1 },
  });

  const part2Pos = useControls('Part 2 Position', {
    x: { value: 0.2, min: -10, max: 10, step: 0.1 },
    y: { value: 1.9, min: -10, max: 10, step: 0.1 },
    z: { value: -0.2, min: -10, max: 10, step: 0.1 },
  });

  const part3Pos = useControls('Part 3 Position', {
    x: { value: -1.1, min: -10, max: 10, step: 0.1 },
    y: { value: 0.4, min: -10, max: 10, step: 0.1 },
    z: { value: -0.45, min: -10, max: 10, step: 0.1 },
  });

  const WholePos = useControls('whole', {
    x: { value: 23.3, min: -50, max: 50, step: 0.1 },
    y: { value: -3.0, min: -50, max: 50, step: 0.1 },
    z: { value: 20.0, min: -50, max: 50, step: 0.1 },
  });

  const wholeRot = useControls('WholeRot', {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 5.50, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  // Animation effect - runs once on mount
  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => setAnimationComplete(true)
    });

    // Set initial positions and animate text
    if (textRef.current) {
      textRef.current.position.set(textPosition.x, textPosition.y - 20, textPosition.z);
      textRef.current.rotation.set(textRotation.x, textRotation.y, textRotation.z);
      textRef.current.material.opacity = 0;
      textRef.current.material.transparent = true;

      // Animate text after a delay
      timeline
        .to(textRef.current.position, {
          y: textPosition.y,
          duration: 1.2,
          ease: "back.out(1.3)"
        }, 1.8)
        .to(textRef.current.material, {
          opacity: 1,
          duration: 0.8
        }, 1.8);
    }

    // Set animation complete after 3 seconds to allow parts to settle
    setTimeout(() => setAnimationComplete(true), 3000);
  }, []); // Empty dependency array - runs once on mount

  // Live text updates from Leva controls - only after animation is complete
  useEffect(() => {
    if (textRef.current && animationComplete) {
      textRef.current.position.set(textPosition.x, textPosition.y, textPosition.z);
    }
  }, [textPosition.x, textPosition.y, textPosition.z, animationComplete]);

  useEffect(() => {
    if (textRef.current && animationComplete) {
      textRef.current.rotation.set(textRotation.x, textRotation.y, textRotation.z);
    }
  }, [textRotation.x, textRotation.y, textRotation.z, animationComplete]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <OrbitControls />
      <group 
        ref={groupRef}
        position={[WholePos.x, WholePos.y, WholePos.z]} 
        rotation={[wholeRot.x, wholeRot.y, wholeRot.z]} 
        scale={25}
      >
        <FloatingPart 
          nodes={nodes}
          partName="Part2"
          position={part1Pos}
          animationComplete={animationComplete}
        />
        <FloatingPart 
          nodes={nodes}
          partName="Part1"
          position={part2Pos}
          animationComplete={animationComplete}
        />
        <FloatingPart 
          nodes={nodes}
          partName="Part3"
          position={part3Pos}
          animationComplete={animationComplete}
        />
      </group>
      <ImagePlane
        ref={textRef}
        position={[textPosition.x, textPosition.y - 20, textPosition.z]} 
        rotation={[textRotation.x, textRotation.y, textRotation.z]}
        scale={[7, 7, 1]}
      />
    </>
  );
}

export default PyramidFinal;