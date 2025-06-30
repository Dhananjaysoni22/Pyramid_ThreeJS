import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import { useControls } from 'leva';
import gsap from 'gsap';
import * as THREE from 'three';
import ImagePlane from './ImagePlane';

function FloatingPart({ nodes, partName, position, animationComplete, initialPosition }) {
  const partRef = useRef();
  const meshDataRef = useRef([]);
  const isInitialized = useRef(false);
  const [hasInitialAnimation, setHasInitialAnimation] = useState(!animationComplete);
  const [hoveredMeshes, setHoveredMeshes] = useState(new Set());

  // Handle initial animation for this part
  useEffect(() => {
    if (partRef.current && hasInitialAnimation) {
      // Set initial position away from final position
      let startPos;
      if (partName === "Part2") { // part1
        startPos = { x: -10, y: position.y, z: position.z };
      } else if (partName === "Part1") { // part2  
        startPos = { x: position.x, y: 15, z: position.z };
      } else { // part3
        startPos = { x: 12, y: position.y, z: position.z };
      }
      
      partRef.current.position.set(startPos.x, startPos.y, startPos.z);
      
      // Animate to final position
      const delay = partName === "Part2" ? 0.2 : partName === "Part1" ? 0.4 : 0.6;
      gsap.to(partRef.current.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: "back.out(1.7)",
        delay: delay,
        onComplete: () => {
          setHasInitialAnimation(false);
          // Now capture the original mesh positions after animation is complete
          if (!isInitialized.current) {
            setTimeout(() => {
              captureOriginalPositions();
            }, 100);
          }
        }
      });
    }
  }, [nodes, partName, hasInitialAnimation]);

  // Extract and store mesh data AFTER initial animation while maintaining hierarchy
  const captureOriginalPositions = () => {
    if (nodes[partName] && !isInitialized.current) {
      const meshData = [];
      
      const extractMeshes = (object) => {
        if (object.isMesh) {
          // Store mesh reference and original transform data
          const meshInfo = {
            mesh: object,
            originalPosition: {
              x: object.position.x,
              y: object.position.y,
              z: object.position.z
            },
            originalRotation: {
              x: object.rotation.x,
              y: object.rotation.y,
              z: object.rotation.z
            }
          };
          
          meshData.push(meshInfo);
        }
        if (object.children && object.children.length > 0) {
          object.children.forEach(child => extractMeshes(child));
        }
      };
      
      extractMeshes(nodes[partName]);
      meshDataRef.current = meshData;
      isInitialized.current = true;
      
      console.log(`${partName} - Found ${meshData.length} meshes after initial animation`);
    }
  };

  // Handle individual mesh hover
  const handleMeshHover = (meshInfo, isHovered) => {
    if (!isInitialized.current || hasInitialAnimation) return;

    const { mesh, originalPosition, originalRotation } = meshInfo;
    
    console.log(`${partName} - Mesh ${mesh.name || 'unnamed'} hover: ${isHovered}`);

    // Kill any existing animations on this mesh
    gsap.killTweensOf([mesh.position, mesh.rotation]);
    
    if (isHovered) {
      // Create floating effect for this specific mesh
      const floatDistance = 0.15;
      const direction = {
        x: (Math.random() - 0.5) * floatDistance,
        y: Math.random() * floatDistance * 0.5 + 0.05,
        z: (Math.random() - 0.5) * floatDistance
      };
      
      const rotationAmount = 0.3;
      const rotationOffset = {
        x: (Math.random() - 0.5) * rotationAmount,
        y: (Math.random() - 0.5) * rotationAmount,
        z: (Math.random() - 0.5) * rotationAmount
      };
      
      // Animate to floating position
      gsap.to(mesh.position, {
        x: originalPosition.x + direction.x,
        y: originalPosition.y + direction.y,
        z: originalPosition.z + direction.z,
        duration: 0.6,
        ease: "back.out(1.4)"
      });

      // Animate rotation
      gsap.to(mesh.rotation, {
        x: originalRotation.x + rotationOffset.x,
        y: originalRotation.y + rotationOffset.y,
        z: originalRotation.z + rotationOffset.z,
        duration: 0.6,
        ease: "back.out(1.4)"
      });
    } else {
      // Return to original positions
      gsap.to(mesh.position, {
        x: originalPosition.x,
        y: originalPosition.y,
        z: originalPosition.z,
        duration: 0.5,
        ease: "back.out(1.2)",
        onComplete: () => {
          // Ensure exact position is set
          mesh.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        }
      });

      // Return to original rotations
      gsap.to(mesh.rotation, {
        x: originalRotation.x,
        y: originalRotation.y,
        z: originalRotation.z,
        duration: 0.5,
        ease: "back.out(1.2)",
        onComplete: () => {
          // Ensure exact rotation is set
          mesh.rotation.set(originalRotation.x, originalRotation.y, originalRotation.z);
        }
      });
    }
  };

  // Add event listeners to meshes after initialization
  useEffect(() => {
    if (isInitialized.current && meshDataRef.current.length > 0) {
      meshDataRef.current.forEach(meshInfo => {
        const { mesh } = meshInfo;
        
        // Create event handlers
        const onPointerEnter = () => handleMeshHover(meshInfo, true);
        const onPointerLeave = () => handleMeshHover(meshInfo, false);
        
        // Store handlers on mesh for cleanup
        mesh.userData.onPointerEnter = onPointerEnter;
        mesh.userData.onPointerLeave = onPointerLeave;
        
        // Add event listeners directly to the mesh
        mesh.addEventListener('pointerenter', onPointerEnter);
        mesh.addEventListener('pointerleave', onPointerLeave);
      });

      // Cleanup function
      return () => {
        meshDataRef.current.forEach(meshInfo => {
          const { mesh } = meshInfo;
          if (mesh.userData.onPointerEnter) {
            mesh.removeEventListener('pointerenter', mesh.userData.onPointerEnter);
          }
          if (mesh.userData.onPointerLeave) {
            mesh.removeEventListener('pointerleave', mesh.userData.onPointerLeave);
          }
        });
      };
    }
  }, [isInitialized.current]);

  // Position updates from Leva controls - only after initial animation is complete
  useEffect(() => {
    if (partRef.current && !hasInitialAnimation) {
      partRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position.x, position.y, position.z, hasInitialAnimation]);

  // Position updates
  useEffect(() => {
    if (partRef.current && animationComplete) {
      partRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position.x, position.y, position.z, animationComplete]);

  // Custom raycaster component to handle mesh interactions
  const MeshInteractionHandler = () => {
    useFrame((state) => {
      if (!isInitialized.current || hasInitialAnimation) return;
      
      // Use Three.js raycaster for more precise intersection detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      // Get mouse position (this would need to be passed from the canvas)
      // For now, we'll rely on the primitive's built-in pointer events
    });
    
    return null;
  };

  return (
    <>
      <primitive 
        object={nodes[partName]} 
        ref={partRef}
        onPointerOver={(e) => {
          // Stop propagation to prevent bubbling
          e.stopPropagation();
          // Find the specific mesh that was intersected
          const intersectedMesh = e.object;
          const meshInfo = meshDataRef.current.find(info => info.mesh === intersectedMesh);
          if (meshInfo && isInitialized.current) {
            handleMeshHover(meshInfo, true);
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          const intersectedMesh = e.object;
          const meshInfo = meshDataRef.current.find(info => info.mesh === intersectedMesh);
          if (meshInfo && isInitialized.current) {
            handleMeshHover(meshInfo, false);
          }
        }}
      />
      <MeshInteractionHandler />
    </>
  );
}

export default FloatingPart;