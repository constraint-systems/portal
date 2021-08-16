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
  snap,
} from "./Actions";

// const colorCyan = new THREE.Color("rgb(152, 215, 170)");
const colorMagenta = new THREE.Color("rgb(238, 88, 181)");

const setIntersections = (pointer: any, e: any) => {
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
    if (State.pressed.includes("c")) State.intersects = [];

    if (State.intersects.length > 0) {
      canvas.style.cursor = "default";
    } else {
      canvas.style.cursor = "crosshair";
    }

    const intersectIds = State.intersects.map((intersect) => intersect.uuid);
    const selectedIds = State.selected.map((mesh) => mesh.uuid);
    for (let i = 0; i < portals.length; i++) {
      const portal = portals[i];
      const srcMesh = portal.src.mesh;
      const dstMesh = portal.dst.mesh;
      if (
        intersectIds.includes(srcMesh.uuid) ||
        intersectIds.includes(dstMesh.uuid)
      ) {
        // @ts-ignore
        portal.src.outline.material.color.set(0x00ffff);
        portal.src.outline.visible = true;
        // @ts-ignore
        portal.dst.outline.material.color.set(0xff00ff);
        portal.dst.outline.visible = true;
        // @ts-ignore
        portal.line1.material.color.set(colorMagenta);
      } else {
        if (
          !(
            selectedIds.includes(srcMesh.uuid) ||
            selectedIds.includes(dstMesh.uuid)
          )
        ) {
          // @ts-ignore
          portal.src.outline.material.color.setHex(0xaaaaaa);
          portal.src.outline.visible = State.outlinesVisible;
          // @ts-ignore
          portal.dst.outline.material.color.setHex(0xaaaaaa);
          portal.dst.outline.visible = State.outlinesVisible;
          // @ts-ignore
          portal.line1.material.color.setHex(0xaaaaaa);
        }
      }
    }
  }
};

const setSelected = (toSelect: Array<THREE.Object3D>) => {
  const { portals } = State;
  State.selected = toSelect;

  if (State.selected.length > 0) {
    const selectedIds = State.selected.map((mesh) => mesh.uuid);
    for (let i = 0; i < portals.length; i++) {
      const portal = portals[i];
      const srcMesh = portal.src.mesh;
      const dstMesh = portal.dst.mesh;
      if (
        selectedIds.includes(srcMesh.uuid) ||
        selectedIds.includes(dstMesh.uuid)
      ) {
        // @ts-ignore
        portal.src.outline.material.color.set(0x00ffff);
        // @ts-ignore
        portal.src.outline.material.lineWidth = 12;
        portal.src.outline.visible = true;

        // @ts-ignore
        portal.dst.outline.material.color.set(0xff00ff);
        // @ts-ignore
        portal.dst.outline.material.lineWidth = 12;
        portal.dst.outline.visible = true;
      } else {
        // @ts-ignore
        portal.src.outline.material.color.setHex(0xaaaaaa);
        portal.src.outline.visible = State.outlinesVisible;
        // @ts-ignore
        portal.src.outline.material.lineWidth = 8;
        // @ts-ignore
        portal.dst.outline.material.color.setHex(0xaaaaaa);
        portal.dst.outline.visible = State.outlinesVisible;
        // @ts-ignore
        portal.dst.outline.material.lineWidth = 8;
        // @ts-ignore
        portal.line1.material.color.setHex(0xaaaaaa);
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

        setIntersections(pointer, e);

        if (State.intersects.length > 0 && !e.ctrlKey) {
          setSelected(State.intersects);

          const mesh = State.intersects[0];
          mesh.userData.origin = new THREE.Vector3();
          mesh.userData.origin.copy(mesh.position);
        } else {
          drawPointer(pointer.down.ray, pointer.ray);
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
            image.mesh.position.setX(snap(image.down.x + dx));
            image.mesh.position.setY(snap(image.down.y - dy));
          } else {
            if (State.drawBox.outline.visible) {
              drawPointer(pointer.down.ray, pointer.ray);
            } else if (State.selected.length > 0) {
              const mesh = State.selected[0];
              if (mesh.userData.kind === "dst") {
                const index = portals
                  .map((portal) => portal.dst.mesh.uuid)
                  .indexOf(mesh.uuid);
                const portal = portals[index];
                const x =
                  snap(mesh.userData.origin.x - mesh.scale.x / 2 + dx) +
                  mesh.scale.x / 2;
                const y =
                  snap(mesh.userData.origin.y - mesh.scale.y / 2 - dy) +
                  mesh.scale.y / 2;
                mesh.position.setX(x);
                mesh.position.setY(y);
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
                const x =
                  snap(mesh.userData.origin.x - mesh.scale.x / 2 + dx) +
                  mesh.scale.x / 2;
                const y =
                  snap(mesh.userData.origin.y - mesh.scale.y / 2 - dy) +
                  mesh.scale.y / 2;
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

                portal.src.outline.position.setX(x);
                portal.src.outline.position.setY(y);

                updateLines(portal);
              }
            }
          }
        } else {
          setIntersections(pointer, e);
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
        const worldPixel = getWorldPixelAtZ(camera.position.z, State.camera);

        // const visibleHeight = window.innerHeight;
        // @ts-ignore
        // const adjusted = visibleHeight + e.deltaY;
        // @ts-ignore
        const sign = e.deltaY > 0 ? -1 : 1;
        // @ts-ignore
        // const adjust = worldPixel * 32 * sign;

        if (State.selected.length > 0) {
          const selectedIds = State.selected.map((mesh) => mesh.uuid);

          for (let mesh of State.intersects) {
            if (selectedIds.includes(mesh.uuid)) {
              let portal, keyname;
              if (mesh.userData.kind === "dst") {
                const index = portals
                  .map((portal) => portal.dst.mesh.uuid)
                  .indexOf(mesh.uuid);
                portal = portals[index];
                keyname = "dst";
              } else if (mesh.userData.kind === "src") {
                const index = portals
                  .map((portal) => portal.src.mesh.uuid)
                  .indexOf(mesh.uuid);
                portal = portals[index];
                keyname = "src";
              }

              if (portal && keyname) {
                const aspect =
                  // @ts-ignore
                  portal[keyname].scale.x / portal[keyname].scale.y;
                if (aspect > 1) {
                  // @ts-ignore
                  portal[keyname].scale.x += worldPixel * 16 * sign;
                  // @ts-ignore
                  portal[keyname].scale.y = portal[keyname].scale.x / aspect;
                } else {
                  // @ts-ignore
                  portal[keyname].scale.y += worldPixel * 16 * sign;
                  // @ts-ignore
                  portal[keyname].scale.x = portal[keyname].scale.y * aspect;
                }

                // const prevScaleX = mesh.scale.x;
                // const prevScaleY = mesh.scale.y;
                // @ts-ignore
                const nextScaleX = snap(portal[keyname].scale.x);
                // @ts-ignore
                const nextScaleY = snap(portal[keyname].scale.y);

                // const diffx = pointer.ray.x - mesh.position.x;
                // const rx = diffx / prevScaleX;
                // const newRx = diffx / nextScaleX;

                // const x =
                //   snap(
                //     mesh.position.x - nextScaleX / 2 + (newRx - rx) * nextScaleX
                //   ) +
                //   nextScaleX / 2;

                // const diffy = pointer.ray.y - mesh.position.y;
                // const ry = diffy / prevScaleY;
                // const newRy = diffy / nextScaleY;
                // const y =
                //   snap(
                //     mesh.position.y - nextScaleY / 2 + (newRy - ry) * nextScaleY
                //   ) +
                //   nextScaleY / 2;

                const x = mesh.position.x;
                const y = mesh.position.y;
                mesh.position.x = x;
                mesh.position.y = y;
                mesh.scale.x = nextScaleX;
                mesh.scale.y = nextScaleY;

                if (mesh.userData.kind === "dst") {
                  const index = portals
                    .map((portal) => portal.dst.mesh.uuid)
                    .indexOf(mesh.uuid);
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
            }
          }
        } else {
          // const prevScaleX = image.mesh.scale.x;
          // const prevScaleY = image.mesh.scale.y;
          // const nextScaleX = prevScaleX * ratio;
          // const nextScaleY = prevScaleY * ratio;
          // const diffx = pointer.ray.x - image.mesh.position.x;
          // const rx = diffx / prevScaleX;
          // const newRx = diffx / nextScaleX;
          // const x = image.mesh.position.x + (newRx - rx) * nextScaleX;
          // const diffy = pointer.ray.y - image.mesh.position.y;
          // const ry = diffy / prevScaleY;
          // const newRy = diffy / nextScaleY;
          // const y = image.mesh.position.y + (newRy - ry) * nextScaleY;
          // image.mesh.position.x = x;
          // image.mesh.position.y = y;
          // image.mesh.scale.multiplyScalar(ratio);
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
