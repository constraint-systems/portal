import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import State from "./State";
import Pointer from "./Pointer";
import { applyOutlineVisible, getWorldPixelAtZ, loadImage } from "./Actions";
import GitInfo from "./GitInfo";
import Keyboard from "./Keyboard";
import Tips from "./Tips";

const App = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = 8;
    const inner = 2;
    canvas.width = size;
    canvas.height = size;
    const cx = canvas.getContext("2d");
    if (cx) {
      cx.fillStyle = "#222";
      cx.fillRect(size / 2 - inner / 2, size / 2 - inner / 2, inner, inner);
      const url = canvas.toDataURL();
      document.body.style.backgroundImage = `url("${url}")`;
    }
  }, []);

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

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
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

      const vector = new THREE.Vector2();

      applyOutlineVisible();

      // {
      //   const canvas = document.createElement("canvas");
      //   const size = 32;
      //   canvas.width = size;
      //   canvas.height = size;
      //   const cx = canvas.getContext("2d");
      //   if (cx) {
      //     console.log("fill");
      //     cx.fillStyle = "pink";
      //     const inner = 2;
      //     cx.fillRect(0, 0, inner, inner);
      //     cx.fillRect(size - inner, 0, inner, inner);
      //     cx.fillRect(size - inner, size - inner, inner, inner);
      //     cx.fillRect(0, size - inner, inner, inner);
      //     const texture = new THREE.CanvasTexture(canvas);
      //     texture.wrapS = THREE.RepeatWrapping;
      //     texture.wrapT = THREE.RepeatWrapping;
      //     const cols = Math.floor(window.innerWidth / size);
      //     const rows = Math.floor(window.innerHeight / size);
      //     texture.repeat.set(cols, rows);
      //     State.scene.background = texture;
      //   }
      // }
      // console.log(State.scene);

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
        renderer.render(State.scene4, camera);
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
          <Keyboard />
          <Tips />
        </>
      ) : null}
      <GitInfo />
    </>
  );
};

export default App;
