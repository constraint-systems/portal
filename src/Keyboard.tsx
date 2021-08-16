import { useEffect } from "react";
import { getWorldPixelAtZ, toggleOutlines } from "./Actions";
import State from "./State";

function Keyboard() {
  useEffect(() => {
    const pressed = (key: string) => {
      if (State.camera) {
        const worldPixel = getWorldPixelAtZ(
          State.camera.position.z,
          State.camera
        );
        if (key === "arrowdown") {
          State.image.mesh.position.y -= worldPixel * 32;
        } else if (key === "arrowup") {
          State.image.mesh.position.y += worldPixel * 32;
        } else if (key === "arrowleft") {
          State.image.mesh.position.x -= worldPixel * 32;
        } else if (key === "arrowright") {
          State.image.mesh.position.x += worldPixel * 32;
        } else if (key === "v") {
          toggleOutlines();
        } else if (key === "c") {
          if (State.canvas) State.canvas.style.cursor = "crosshair";
        }
      }
    };

    const downHandler = (e: KeyboardEvent) => {
      let press = e.key.toLowerCase();
      if (!e.repeat) State.pressed.push(press);
      pressed(press);
    };

    const upHandler = (e: KeyboardEvent) => {
      let press = e.key.toLowerCase();
      const index = State.pressed.indexOf(press);
      if (index !== -1) {
        State.pressed.splice(index, 1);
        console.log(State.pressed);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return null;
}

export default Keyboard;
