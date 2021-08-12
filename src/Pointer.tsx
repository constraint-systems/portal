import { useEffect } from "react";
import State from "./State";
import * as THREE from "three";
import {
  setPointer,
  setPointerDown,
  getWorldPixelAtZ,
  updateLines,
  getSmallestTop,
  drawPointer,
  makePortal,
  getDimensions,
} from "./Actions";

// const colorCyan = new THREE.Color("rgb(152, 215, 170)");
const colorMagenta = new THREE.Color("rgb(238, 88, 181)");

const setIntersections = (pointer: any) => {
  const { portals, raycaster, camera, canvas } = State;
  if (camera && canvas) {
    const meshes = portals
      .map((portal) => portal.dst.mesh)
      .concat(portals.map((portal) => portal.src.mesh));

    raycaster.setFromCamera(pointer.clip2, camera);
    const intersects = State.raycaster
      .intersectObjects(meshes)
      .map((intersect) => intersect.object);

    const top = getSmallestTop(intersects);

    State.intersects = top;

    if (top.length > 0) {
      canvas.style.cursor = "default";
    } else {
      canvas.style.cursor = "crosshair";
    }

    const intersectIds = State.intersects.map((intersect) => intersect.uuid);
    for (let i = 0; i < portals.length; i++) {
      const portal = portals[i];
      const srcMesh = portal.src.mesh;
      const dstMesh = portal.dst.mesh;
      if (
        intersectIds.includes(srcMesh.uuid) ||
        intersectIds.includes(dstMesh.uuid)
      ) {
        // @ts-ignore
        portal.src.outline.material.color.set(colorMagenta);
        // @ts-ignore
        portal.dst.outline.material.color.set(colorMagenta);
        // @ts-ignore
        portal.line1.material.color.set(colorMagenta);
        // portal.src.outline.visible = true;
        // portal.dst.outline.visible = true;
        // portal.line1.visible = true;
      } else {
        // @ts-ignore
        portal.src.outline.material.color.setHex(0xaaaaaa);
        // @ts-ignore
        portal.dst.outline.material.color.setHex(0xaaaaaa);
        // @ts-ignore
        portal.line1.material.color.setHex(0xaaaaaa);
        // portal.src.outline.visible = false;
        // portal.dst.outline.visible = false;
        // portal.line1.visible = false;
      }
    }
  }
};

const Pointer = () => {
  useEffect(() => {
    const { canvas, pointer, camera, cameraDown, image, portals } = State;
    if (canvas && camera) {
      const pointerDown = (e: PointerEvent) => {
        setPointer(pointer, e.clientX, e.clientY);
        setPointerDown(pointer);
        image.down.copy(image.mesh.position);
        cameraDown.copy(camera.position);
        pointer.active = true;
        pointer.middle = e.which === 2;

        if (State.intersects.length > 0) {
          const mesh = State.intersects[0];
          mesh.userData.origin = new THREE.Vector3();
          mesh.userData.origin.copy(mesh.position);
        } else {
          drawPointer(pointer.down.ray, pointer.ray);
          // makePortal(
          //   [pointer.ray.x, pointer.ray.y, 1, 1],
          //   [pointer.ray.x, pointer.ray.y, 1, 1],
          //   State.portals,
          //   camera,
          //   State.scene2
          // );
          // setIntersections(pointer);
          // if (State.intersects.length > 0) {
          //   const mesh = State.intersects[0];
          //   mesh.userData.origin = new THREE.Vector3();
          //   mesh.userData.origin.copy(mesh.position);
          // }
        }

        canvas.setPointerCapture(e.pointerId);
      };

      const pointerMove = (e: PointerEvent) => {
        setPointer(pointer, e.clientX, e.clientY);

        if (pointer.active) {
          pointer.diffMouse.copy(pointer.mouse).sub(pointer.down.mouse);
          const worldPixel = getWorldPixelAtZ(camera.position.z, camera);
          const dx = pointer.diffMouse.x * worldPixel;
          const dy = pointer.diffMouse.y * worldPixel;

          if (pointer.middle) {
            // pan when mousewheel button is pressed
            // pan actually means ove image
            image.mesh.position.setX(image.down.x + dx);
            image.mesh.position.setY(image.down.y - dy);
          } else {
            if (State.drawBox.outline.visible) {
              drawPointer(pointer.down.ray, pointer.ray);
            } else if (State.intersects.length > 0) {
              const mesh = State.intersects[0];
              if (mesh.userData.kind === "dst") {
                const index = portals
                  .map((portal) => portal.dst.mesh.uuid)
                  .indexOf(mesh.uuid);
                const portal = portals[index];
                mesh.position.setX(mesh.userData.origin.x + dx);
                mesh.position.setY(mesh.userData.origin.y - dy);
                const x = mesh.userData.origin.x + dx;
                const y = mesh.userData.origin.y - dy;
                portal.dst.min.setX(x - mesh.scale.x / 2);
                portal.dst.min.setY(y - mesh.scale.y / 2);
                portal.dst.max.setX(x + mesh.scale.x / 2);
                portal.dst.max.setY(y + mesh.scale.y / 2);

                portals[index].dst.occluder.position.setX(x);
                portals[index].dst.occluder.position.setY(y);
                portals[index].dst.outline.position.setX(x);
                portals[index].dst.outline.position.setY(y);

                updateLines(portal);
              } else if (mesh.userData.kind === "src") {
                const index = portals
                  .map((portal) => portal.src.mesh.uuid)
                  .indexOf(mesh.uuid);
                const portal = portals[index];
                const x = mesh.userData.origin.x + dx;
                const y = mesh.userData.origin.y - dy;
                mesh.position.setX(x);
                mesh.position.setY(y);
                portal.src.min.setX(x - mesh.scale.x / 2);
                portal.src.min.setY(y - mesh.scale.y / 2);
                portal.src.max.setX(x + mesh.scale.x / 2);
                portal.src.max.setY(y + mesh.scale.y / 2);

                portals[index].src.occluder.position.setX(x);
                portals[index].src.occluder.position.setY(y);
                portals[index].src.outline.position.setX(x);
                portals[index].src.outline.position.setY(y);

                portal.src.outline.position.setX(mesh.userData.origin.x + dx);
                portal.src.outline.position.setY(mesh.userData.origin.y - dy);

                updateLines(portal);
              }
            }
          }
        } else {
          setIntersections(pointer);
        }
      };

      const pointerUp = (e: PointerEvent) => {
        pointer.active = false;
        pointer.middle = false;

        if (State.drawBox.outline.visible === true) {
          const width = State.drawBox.diff.x;
          const height = State.drawBox.diff.y;
          const dims = [
            State.drawBox.min.x + width / 2,
            State.drawBox.min.y + height / 2,
            width,
            height,
          ];
          if (State.scene2) {
            makePortal(dims, dims, State.portals, camera);
            State.drawBox.outline.visible = false;
          }
        }

        canvas.releasePointerCapture(e.pointerId);
      };

      const mouseWheel = (e: Event) => {
        const visibleHeight = window.innerHeight;
        // @ts-ignore
        const adjusted = visibleHeight + e.deltaY;
        const ratio = visibleHeight / adjusted;

        if (State.intersects.length > 0) {
          for (let mesh of State.intersects) {
            // if (group.userData.selected) {
            const prevScaleX = mesh.scale.x;
            const prevScaleY = mesh.scale.y;
            const nextScaleX = prevScaleX * ratio;
            const nextScaleY = prevScaleY * ratio;

            const diffx = pointer.ray.x - mesh.position.x;
            const rx = diffx / prevScaleX;
            const newRx = diffx / nextScaleX;
            const x = mesh.position.x + (newRx - rx) * nextScaleX;

            const diffy = pointer.ray.y - mesh.position.y;
            const ry = diffy / prevScaleY;
            const newRy = diffy / nextScaleY;
            const y = mesh.position.y + (newRy - ry) * nextScaleY;

            mesh.position.x = x;
            mesh.position.y = y;
            mesh.scale.multiplyScalar(ratio);

            if (mesh.userData.kind === "dst") {
              const index = portals
                .map((portal) => portal.dst.mesh.uuid)
                .indexOf(mesh.uuid);
              const portal = portals[index];
              portals[index].dst.occluder.position.setX(x);
              portals[index].dst.occluder.position.setY(y);
              portals[index].dst.outline.position.setX(x);
              portals[index].dst.outline.position.setY(y);
              portals[index].dst.outline.scale.copy(mesh.scale);
              portals[index].dst.occluder.scale.copy(mesh.scale);

              portal.dst.min.setX(x - mesh.scale.x / 2);
              portal.dst.min.setY(y - mesh.scale.y / 2);
              portal.dst.max.setX(x + mesh.scale.x / 2);
              portal.dst.max.setY(y + mesh.scale.y / 2);

              updateLines(portal);
            } else if (mesh.userData.kind === "src") {
              const index = portals
                .map((portal) => portal.src.mesh.uuid)
                .indexOf(mesh.uuid);
              const portal = portals[index];
              mesh.position.setX(x);
              mesh.position.setY(y);
              portals[index].src.occluder.position.setX(x);
              portals[index].src.occluder.position.setY(y);
              portals[index].src.outline.position.setX(x);
              portals[index].src.outline.position.setY(y);

              portal.src.outline.position.setX(x);
              portal.src.outline.position.setY(y);

              portals[index].src.outline.scale.copy(mesh.scale);
              portals[index].src.occluder.scale.copy(mesh.scale);

              portal.src.min.setX(x - mesh.scale.x / 2);
              portal.src.min.setY(y - mesh.scale.y / 2);
              portal.src.max.setX(x + mesh.scale.x / 2);
              portal.src.max.setY(y + mesh.scale.y / 2);

              const { srcWidth, srcHeight } = getDimensions(portal);
              const worldPixel = getWorldPixelAtZ(
                camera.position.z,
                State.camera
              );
              const makeSrcTexture = () => {
                return new THREE.DataTexture(
                  new Uint8Array(
                    (srcWidth / worldPixel) * (srcHeight / worldPixel) * 3
                  ),
                  srcWidth / worldPixel,
                  srcHeight / worldPixel,
                  THREE.RGBFormat
                );
              };
              const newTexture = makeSrcTexture();
              // @ts-ignore
              portal.dst.mesh.material.map = newTexture;

              updateLines(portal);
            }
          }
        } else {
          const prevScaleX = image.mesh.scale.x;
          const prevScaleY = image.mesh.scale.y;
          const nextScaleX = prevScaleX * ratio;
          const nextScaleY = prevScaleY * ratio;

          const diffx = pointer.ray.x - image.mesh.position.x;
          const rx = diffx / prevScaleX;
          const newRx = diffx / nextScaleX;
          const x = image.mesh.position.x + (newRx - rx) * nextScaleX;

          const diffy = pointer.ray.y - image.mesh.position.y;
          const ry = diffy / prevScaleY;
          const newRy = diffy / nextScaleY;
          const y = image.mesh.position.y + (newRy - ry) * nextScaleY;

          image.mesh.position.x = x;
          image.mesh.position.y = y;
          image.mesh.scale.multiplyScalar(ratio);
        }
      };

      canvas.addEventListener("pointerdown", pointerDown);
      canvas.addEventListener("pointermove", pointerMove);
      canvas.addEventListener("pointerup", pointerUp);
      canvas.addEventListener("pointercancel", pointerUp);
      canvas.addEventListener("mousewheel", mouseWheel, { passive: false });
      return () => {
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.removeEventListener("mousewheel", mouseWheel);
      };
    }
  }, []);

  return null;
};

export default Pointer;
