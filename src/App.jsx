import { Canvas } from "@react-three/fiber";
import "./App.css";
import Pyramid from "./Pyramid.jsx";
import Background from "./background.jsx";
import Triangle from "./Triangle.jsx";
import CameraTracker from "./CameraTracker.jsx";
import PyramidFinal from "./PyramidFinal.jsx";
import { Leva } from "leva";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg,rgb(3, 3, 3) 0%,rgb(143, 129, 129) 100%)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [102.7661, 24.7664, 107.6092], fov: 45 }}>
        {/* <Triangle/> */}
        {/* <Pyramid /> */}
        <PyramidFinal/>
        {/* <CameraTracker/> */}
        <Background/>
              <Leva hidden={true} /> {/* Set to false to show */}

      </Canvas>
    </div>
  );
}

export default App;
