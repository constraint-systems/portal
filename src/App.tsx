import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import State from "./State";
import Pointer from "./Pointer";
import {
  getDimensions,
  getWorldPixelAtZ,
  loadImage,
  updateLines,
  createPortal,
  makePortal,
} from "./Actions";
import { outlineVertices } from "./Constants";

const App = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    State.canvas = canvas;

    if (canvas !== null) {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      State.camera = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.autoClear = false;
      State.renderer = renderer;

      setLoaded(true);

      State.scene.add(State.image.mesh);
      loadImage(State.image, "bowiebig.png");

      camera.position.z = 5;

      State.drawBox.outline.visible = false;
      State.drawBox.outline.renderOrder = 999;
      State.scene3.add(State.drawBox.outline);

      // makePortal([-1, -1, 2, 1], [2, 1, 2, 1], State.portals, camera);
      // makePortal([-3, -1, 1, 1], [-2, 1, 1, 1], State.portals, camera);

      const vector = new THREE.Vector2();

      const animate = () => {
        requestAnimationFrame(animate);

        renderer.clear();
        renderer.render(State.scene, camera);

        const worldPixel = getWorldPixelAtZ(camera.position.z, State.camera);
        for (let i = 0; i < State.portals.length; i++) {
          const portal = State.portals[i];
          vector.x = portal.src.min.x / worldPixel + window.innerWidth / 2;
          vector.y = portal.src.min.y / worldPixel + window.innerHeight / 2;

          renderer.copyFramebufferToTexture(
            vector,
            // @ts-ignore
            portal.dst.mesh.material.map
          );
          renderer.render(portal.dst.scene, camera);
        }

        renderer.render(State.scene2, camera);
        renderer.clearDepth();
        renderer.render(State.scene3, camera);
      };
      animate();
    }
  }, []);

  useEffect(() => {
    const { camera, renderer } = State;
    if (camera && renderer) {
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      {loaded ? (
        <>
          <Pointer />
        </>
      ) : null}
    </>
  );
};

export default App;
