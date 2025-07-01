import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

export default function CameraAnimation() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(202.4179, 200, -207.857);
    camera.lookAt(0, 0, 0);

    //Animate down to final position
    gsap.to(camera.position, {
      duration: 3,
      y: 27.2324,
      x: 66.3704,
      z: -42.5657,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(0, 0, 0),
    });
  }, [camera]);
  return null;
}
