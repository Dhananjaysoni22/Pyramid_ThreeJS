import { useThree, useFrame } from "@react-three/fiber";

function CameraTracker() {
  const { camera } = useThree();

  useFrame(() => {
    console.log("Position:", camera.position.toArray());
    console.log("Rotation:", camera.rotation.toArray());
  },[camera]);

  return null;
}

export default CameraTracker;