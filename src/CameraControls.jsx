// import { OrbitControls } from '@react-three/drei';
// import { useEffect, useRef } from 'react';

// function CameraControls() {
//   const controlsRef = useRef();

//   useEffect(() => {
//     if (controlsRef.current) {
//       // Set new target point
//       controlsRef.current.target.set(0, 0, -100); // <-- change this to your desired focus point
//       controlsRef.current.update();
//     }
//   }, []);

//   return <OrbitControls ref={controlsRef} />;
// }

// export default CameraControls;


//This is given to stop Orbitalcontrol for user
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

function CameraControls() {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      // Lock all user interactions
      controlsRef.current.enableRotate = false;
      controlsRef.current.enableZoom = false;
      controlsRef.current.enablePan = false;

      // Optional: set fixed target to prevent drift
      controlsRef.current.target.set(0, 0, -100); // Set to your model center
      controlsRef.current.update();
    }
  }, []);

  return <OrbitControls ref={controlsRef} />;
}

export default CameraControls;
