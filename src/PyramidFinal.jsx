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
    x: { value: -64.1, min: -200, max: 200, step: 0.1 },
    y: { value: 23.3, min: -40, max: 40, step: 0.1 },
    z: { value: -77.4, min: -80, max: 80, step: 0.1 },
  });

  const textRotation = useControls("Text Rotation", {
    x: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 0.86, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  // Leva controls for position
  const part1Pos = useControls('Part 1 Position', {
    x: { value: 0.9, min: -10, max: 10, step: 0.1 },
    y: { value: 1.0, min: -10, max: 10, step: 0.1 },
    z: { value: -0.4, min: -10, max: 10, step: 0.1 },
  });

  const part2Pos = useControls('Part 2 Position', {
    x: { value: 0.2, min: -10, max: 10, step: 0.1 },
    y: { value: 1.9, min: -10, max: 10, step: 0.1 },
    z: { value: -0.3, min: -10, max: 10, step: 0.1 },
  });

  const part3Pos = useControls('Part 3 Position', {
    x: { value: -0.9, min: -10, max: 10, step: 0.1 },
    y: { value: 0.44, min: -10, max: 10, step: 0.1 },
    z: { value: -0.4, min: -10, max: 10, step: 0.1 },
  });

  // NEW: Individual scale controls for each part
  const part1Scale = useControls('Part 1 Scale', {
    x: { value: 0.5, min: 0.1, max: 3, step: 0.1 },
    y: { value: 0.7, min: 0.1, max: 3, step: 0.1 },
    z: { value: 0.7, min: 0.1, max: 3, step: 0.1 },
  });

  const part2Scale = useControls('Part 2 Scale', {
    x: { value: 0.4, min: 0.1, max: 3, step: 0.1 },
    y: { value: 0.8, min: 0.1, max: 3, step: 0.1 },
    z: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
  });

  const part3Scale = useControls('Part 3 Scale', {
    x: { value: 0.5, min: 0.1, max: 3, step: 0.1 },
    y: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
    z: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
  });

  const WholePos = useControls('whole', {
    x: { value: -5.6, min: -200, max: 200, step: 0.1 },
    y: { value: -0.9, min: -200, max: 200, step: 0.1 },
    z: { value: -83.6, min: -200, max: 200, step: 0.1 },
  });

  const wholeRot = useControls('WholeRot', {
    x: { value: 0.0, min: 0, max: Math.PI *10, step: 0.01 },
    y: { value: 5.65, min: 0, max: Math.PI * 10, step: 0.01 },
    z: { value: 0.0, min: 0, max: Math.PI * 10, step: 0.01 },
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
      {/* <OrbitControls /> */}
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
          scale={[part1Scale.x, part1Scale.y, part1Scale.z]} 
          animationComplete={animationComplete}
        />
        <FloatingPart 
          nodes={nodes}
          partName="Part1"
          position={part2Pos}
          scale={[part2Scale.x, part2Scale.y, part2Scale.z]}
          animationComplete={animationComplete}
        />
        <FloatingPart 
          nodes={nodes}
          partName="Part3"
          position={part3Pos}
          scale={[part3Scale.x, part3Scale.y, part3Scale.z]}
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