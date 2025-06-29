import { Canvas } from "@react-three/fiber";
import "./App.css";
import Pyramid from "./Pyramid.jsx";
import Background from "./background.jsx";
import Triangle from "./Triangle.jsx";
import CameraTracker from "./CameraTracker.jsx";

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
      <Canvas camera={{ position: [92.9884, 16.3418, 107.8031], fov: 45 }}>
        {/* <Triangle/> */}
        <Pyramid />
        {/* <CameraTracker/> */}
        <Background/>
      </Canvas>
    </div>
  );
}

export default App;
