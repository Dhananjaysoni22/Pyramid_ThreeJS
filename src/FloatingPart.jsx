import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

function FloatingPart({ nodes, partName, position, scale = [1, 1, 1], animationComplete, initialPosition }) {
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
          // Get world position for distance calculations
          const worldPosition = new THREE.Vector3();
          object.getWorldPosition(worldPosition);
          
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
            },
            worldPosition: worldPosition.clone()
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

  // Find nearby meshes based on distance
  const findNearbyMeshes = (targetMesh, maxDistance = 2.0, maxCount = 3) => {
    const targetInfo = meshDataRef.current.find(info => info.mesh === targetMesh);
    if (!targetInfo) return [];

    const nearbyMeshes = meshDataRef.current
      .filter(info => info.mesh !== targetMesh) // Exclude the target mesh itself
      .map(info => {
        const distance = targetInfo.worldPosition.distanceTo(info.worldPosition);
        return { ...info, distance };
      })
      .filter(info => info.distance <= maxDistance) // Only meshes within range
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, maxCount); // Take only the closest ones

    return nearbyMeshes;
  };

  // Handle individual mesh hover with ripple effect
  const handleMeshHover = (meshInfo, isHovered) => {
    if (!isInitialized.current || hasInitialAnimation) return;

    const { mesh } = meshInfo;
    console.log(`${partName} - Mesh ${mesh.name || 'unnamed'} hover: ${isHovered}`);

    if (isHovered) {
      // Find nearby meshes for ripple effect
      const nearbyMeshes = findNearbyMeshes(mesh);
      console.log(`Found ${nearbyMeshes.length} nearby meshes for ripple effect`);

      // Animate the main hovered mesh
      animateMeshFloat(meshInfo, true, 1.0); // Full intensity

      // Animate nearby meshes with reduced intensity
      nearbyMeshes.forEach((nearbyInfo, index) => {
        const intensity = Math.max(0.3, 1.0 - (nearbyInfo.distance / 2.0)); // Intensity based on distance
        const delay = index * 0.05; // Small stagger delay
        setTimeout(() => {
          animateMeshFloat(nearbyInfo, true, intensity);
        }, delay * 1000);
      });

    } else {
      // Find nearby meshes that were affected
      const nearbyMeshes = findNearbyMeshes(mesh);

      // Return main mesh to original position
      animateMeshFloat(meshInfo, false, 1.0);

      // Return nearby meshes to original positions
      nearbyMeshes.forEach((nearbyInfo, index) => {
        const delay = index * 0.03; // Small stagger delay for return
        setTimeout(() => {
          animateMeshFloat(nearbyInfo, false, 1.0);
        }, delay * 1000);
      });
    }
  };

  // Animate individual mesh floating
  const animateMeshFloat = (meshInfo, isFloating, intensity = 1.0) => {
    const { mesh, originalPosition, originalRotation } = meshInfo;

    // Kill any existing animations on this mesh
    gsap.killTweensOf([mesh.position, mesh.rotation]);
    
    if (isFloating) {
      // Create floating effect with intensity scaling
      const floatDistance = 0.5 * intensity;
      const direction = {
        x: (Math.random() - 0.5) * floatDistance,
        y: Math.random() * floatDistance * 0.5 + (0.05 * intensity),
        z: (Math.random() - 0.5) * floatDistance
      };
      
      const rotationAmount = 0.3 * intensity;
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

  // NEW: Scale updates from Leva controls
  useEffect(() => {
    if (partRef.current) {
      partRef.current.scale.set(scale[0], scale[1], scale[2]);
    }
  }, [scale[0], scale[1], scale[2]]);

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