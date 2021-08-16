import * as THREE from "three";
import State, { PointerType, PortalType, ImageType } from "./State";
import { MeshLine, MeshLineMaterial } from "meshline";

export const getWorldPixelAtZ = (
  z: number,
  camera: THREE.PerspectiveCamera | null
) => {
  if (camera) {
    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * z;
    // convert to ratio based on pixel
    return visibleHeight / window.innerHeight;
  } else {
    return 1;
  }
};

export const snap2 = (val: number): number => {
  const snap = getWorldPixelAtZ(5, State.camera) * 16;
  return Math.round(val / snap) * snap;
};

export const snap = (val: number): number => {
  const snap = getWorldPixelAtZ(5, State.camera) * 8;
  return Math.round(val / snap) * snap;
};

export const setRay = (
  target: THREE.Vector3,
  tempClip: THREE.Vector3,
  clip: THREE.Vector3,
  camera: THREE.PerspectiveCamera | null,
  projectToZ: number
) => {
  if (camera !== null) {
    tempClip.copy(clip);
    tempClip.unproject(camera);
    tempClip.sub(camera.position).normalize();
    const distance = (projectToZ - camera.position.z) / tempClip.z;
    target.copy(camera.position).add(tempClip.multiplyScalar(distance));
    target.x = snap(target.x);
    target.y = snap(target.y);
  }
};

export const loadImage = async (image: ImageType, src: string) => {
  const loader = new THREE.TextureLoader();
  loader.load(src, function (texture) {
    const img = texture.image;

    // TODO temp scale down for bowie, usually 5
    const worldPixel = getWorldPixelAtZ(1.5, State.camera);
    const w = snap2(img.width * worldPixel);
    const h = snap2(img.height * worldPixel);

    image.mesh.scale.set(w, h, 1);
    image.material.map = texture;
  });
};

export const setPointer = (pointer: PointerType, x: number, y: number) => {
  pointer.mouse.set(x, y);
  pointer.clip.set(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.5
  );
  pointer.clip2.set(pointer.clip.x, pointer.clip.y);
  if (State.camera !== null) {
    setRay(pointer.ray, pointer.tempClip, pointer.clip, State.camera, 0);
  }
};

export const setPointerDown = (pointer: PointerType) => {
  // Assumes pointer is up to date
  pointer.down.mouse.copy(pointer.mouse);
  pointer.down.clip.copy(pointer.clip);
  pointer.down.ray.copy(pointer.ray);
};

export const getDimensions = (portal: PortalType) => {
  const srcWidth = portal.src.max.x - portal.src.min.x;
  const srcHeight = portal.src.max.y - portal.src.min.y;
  const dstWidth = portal.dst.max.x - portal.dst.min.x;
  const dstHeight = portal.dst.max.y - portal.dst.min.y;
  return { srcWidth, srcHeight, dstWidth, dstHeight };
};

export const updateLines = (portal: any) => {
  portal.line1.geometry.attributes.position.array[0] =
    portal.src.mesh.position.x;
  portal.line1.geometry.attributes.position.array[1] =
    portal.src.mesh.position.y;
  portal.line1.geometry.attributes.position.array[3] =
    portal.dst.mesh.position.x;
  portal.line1.geometry.attributes.position.array[4] =
    portal.dst.mesh.position.y;
  portal.line1.geometry.attributes.position.needsUpdate = true;
};

export const getTop = (meshes: Array<THREE.Object3D>) => {
  if (meshes.length === 1) {
    return meshes;
  } else if (meshes.length === 0) {
    return [];
  } else {
    const renderOrder = meshes.map((mesh) => mesh.renderOrder);
    const max = Math.max(...renderOrder);
    const maxIndex = renderOrder.indexOf(max);
    return [meshes[maxIndex]];
  }
};

export const getSmallestTop = (meshes: Array<THREE.Object3D>) => {
  if (meshes.length === 1) {
    return meshes;
  } else if (meshes.length === 0) {
    return [];
  } else {
    const areas = meshes.map((mesh) => mesh.scale.x * mesh.scale.y);
    const min = Math.min(...areas);
    const minIndex = areas.indexOf(min);
    // const renderOrder = meshes.map((mesh) => mesh.renderOrder);
    // const max = Math.max(...renderOrder);
    // const maxIndex = renderOrder.indexOf(max);
    return [meshes[minIndex]];
  }
};

export const makeOutline = (color: string, lineWidth: number) => {
  const points = [
    -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0,
  ];
  const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const material = new MeshLineMaterial({
    color,
    lineWidth: lineWidth,
    sizeAttenuation: 0,
    resolution,
  });
  const line = new MeshLine();
  line.setPoints(points);
  const outline = new THREE.Mesh(line, material);
  return outline;
};

const makeLine = () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, 1, 0]), 3)
  );
  const material = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    linewidth: 8,
  });
  return new THREE.Line(geometry, material);
};

export const createPortal = (
  s: Array<number>,
  d: Array<number>
): PortalType => {
  const [dx, dy, dw, dh] = d;
  const [sx, sy, sw, sh] = s;
  return {
    line1: makeLine(),
    src: {
      outline: makeOutline("#aaaaaa", 8),
      mesh: new THREE.Mesh(),
      occluder: new THREE.Mesh(),
      min: new THREE.Vector3(sx - sw / 2, sy - sh / 2, 0),
      max: new THREE.Vector3(sx + sw / 2, sy + sh / 2, 0),
      scale: new THREE.Vector3(sw, sh, 1),
    },
    dst: {
      outline: makeOutline("#aaaaaa", 8),
      mesh: new THREE.Mesh(),
      scene: new THREE.Scene(),
      occluder: new THREE.Mesh(),
      min: new THREE.Vector3(dx - dw / 2, dy - dh / 2, 0),
      max: new THREE.Vector3(dx + dw / 2, dy + dh / 2, 0),
      scale: new THREE.Vector3(dw, dh, 1),
    },
  };
};

export const makePortal = (
  srcDims: Array<number>,
  dstDims: Array<number>,
  portals: Array<PortalType>,
  camera: THREE.Camera
) => {
  const portal = createPortal(srcDims, dstDims);

  const { srcWidth, srcHeight, dstWidth, dstHeight } = getDimensions(portal);
  const worldPixel = getWorldPixelAtZ(camera.position.z, State.camera);

  // TODO hide line for now
  portal.line1.visible = false;

  const makeSrcTexture = () => {
    return new THREE.DataTexture(
      new Uint8Array((srcWidth / worldPixel) * (srcHeight / worldPixel) * 3),
      srcWidth / worldPixel,
      srcHeight / worldPixel,
      THREE.RGBAFormat
    );
  };

  const x = portal.dst.min.x + dstWidth / 2;
  const y = portal.dst.min.y + dstHeight / 2;

  // set src mesh
  {
    const mesh = portal.src.mesh;
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    mesh.geometry = geometry;
    mesh.material = material;
    mesh.userData.kind = "src";

    mesh.scale.set(srcWidth, srcHeight, 1);
    mesh.position.x = portal.src.min.x + srcWidth / 2;
    mesh.position.y = portal.src.min.y + srcHeight / 2;

    if (State.scene) State.scene.add(mesh);
  }

  const dstOffset = 0;

  // set dst mesh
  {
    const texture = makeSrcTexture();
    const mesh = portal.dst.mesh;

    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaTest: 0.5,
    });
    mesh.userData.kind = "dst";
    mesh.geometry = geometry;
    mesh.material = material;

    mesh.scale.set(dstWidth, dstHeight, 1);
    mesh.position.x = x + dstOffset;
    mesh.position.y = y + dstOffset;

    portal.dst.scene.add(mesh);
  }

  // set dst line
  State.scene2.add(portal.line1);

  // set src occluder
  {
    const occluder = portal.src.occluder;
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    occluder.geometry = geometry;
    occluder.material = material;
    occluder.scale.set(srcWidth, srcHeight, 1);
    occluder.position.x = portal.src.min.x + srcWidth / 2;
    occluder.position.y = portal.src.min.y + srcHeight / 2;
    occluder.position.z = 0.00001;
    occluder.material.colorWrite = false;
    State.scene2.add(occluder);
  }

  // set dst occluder
  {
    const occluder = portal.dst.occluder;
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    occluder.geometry = geometry;
    occluder.material = material;
    occluder.scale.set(dstWidth, dstHeight, 1);
    occluder.position.x = portal.dst.min.x + dstWidth / 2 + dstOffset;
    occluder.position.y = portal.dst.min.y + dstHeight / 2 + dstOffset;
    occluder.position.z = 0.00001;
    occluder.material.colorWrite = false;
    State.scene2.add(occluder);
  }

  // set src outline
  {
    const srcOutline = portal.src.outline;
    srcOutline.scale.set(srcWidth, srcHeight, 1);
    console.log(srcOutline.scale);
    srcOutline.position.x = portal.src.min.x + srcWidth / 2;
    srcOutline.position.y = portal.src.min.y + srcHeight / 2;
    srcOutline.visible = State.outlinesVisible;
    State.scene3.add(portal.src.outline);
  }

  // set dst outline
  {
    const dstOutline = portal.dst.outline;
    dstOutline.scale.set(dstWidth, dstHeight, 1);
    dstOutline.position.x = portal.dst.min.x + dstWidth / 2 + dstOffset;
    dstOutline.position.y = portal.dst.min.y + dstHeight / 2 + dstOffset;
    dstOutline.visible = State.outlinesVisible;
    // portal.dst.scene.add(portal.dst.outline);
    State.scene3.add(portal.dst.outline);
  }

  const maxOrder =
    portals.length > 0
      ? Math.max(...portals.map((portal) => portal.src.mesh.renderOrder)) + 1
      : 0;

  const minOrder =
    portals.length > 0
      ? Math.min(...portals.map((portal) => portal.dst.outline.renderOrder)) - 1
      : 999;

  portal.src.mesh.renderOrder = maxOrder;
  portal.dst.mesh.renderOrder = maxOrder + 1;

  portal.line1.renderOrder = minOrder;
  portal.src.occluder.renderOrder = minOrder - 1;
  portal.dst.occluder.renderOrder = minOrder - 2;
  portal.src.outline.renderOrder = minOrder - 3;

  portal.dst.outline.renderOrder = minOrder - 2;

  State.portals.push(portal);

  updateLines(portal);

  // State.selected = [portal.dst.mesh];
};

export const drawPointer = (ray1: THREE.Vector3, ray2: THREE.Vector3) => {
  const { outline, min, max, diff } = State.drawBox;
  outline.visible = true;
  min.copy(ray1).min(ray2);
  max.copy(ray1).max(ray2);
  diff.subVectors(max, min);
  outline.position.x = min.x + diff.x / 2;
  outline.position.y = min.y + diff.y / 2;
  outline.scale.x = diff.x;
  outline.scale.y = diff.y;
};

export const applyOutlineVisible = () => {
  for (let portal of State.portals) {
    portal.src.outline.visible = State.outlinesVisible;
    portal.dst.outline.visible = State.outlinesVisible;
  }
};

export const toggleOutlines = () => {
  State.outlinesVisible = !State.outlinesVisible;
  applyOutlineVisible();
};
