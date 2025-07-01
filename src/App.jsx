import { Canvas } from "@react-three/fiber";
import "./App.css";
import Pyramid from "./Pyramid.jsx";
import Background from "./background.jsx";
import CameraTracker from "./CameraTracker.jsx";
import PyramidFinal from "./PyramidFinal.jsx";
import { Leva } from "leva";
import CameraControls from "./CameraControls.jsx";
import CameraAnimation from "./CameraAnimation.jsx";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg,rgb(3, 3, 3) 0%,rgb(27, 27, 27) 100%)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      
      {/* <Canvas camera={{ position: [59.4179, 21.2290,-31.8570], fov: 70 }}> */}
      <Canvas shadows camera={{ fov: 70 }}>
      <CameraAnimation/>
        {/* <Pyramid /> */}
        <PyramidFinal/>
        <CameraControls/>
        {/* <CameraTracker/> */}
        <Background/>
        {/* <Leva hidden={true} /> Set to false to show */}

      </Canvas>
    </div>
  );
}

export default App;
