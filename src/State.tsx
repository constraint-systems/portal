import * as THREE from "three";
import { makeOutline } from "./Actions";

export type PointerType = {
  mouse: THREE.Vector2;
  clip: THREE.Vector3;
  clip2: THREE.Vector2;
  tempClip: THREE.Vector3;
  ray: THREE.Vector3;
  diff: THREE.Vector3;
  diffMouse: THREE.Vector2;
  active: boolean;
  middle: boolean;
  down: {
    mouse: THREE.Vector2;
    clip: THREE.Vector3;
    clip2: THREE.Vector2;
    tempClip: THREE.Vector3;
    ray: THREE.Vector3;
  };
};

export type PortalType = {
  line1: THREE.Line;
  src: {
    outline: THREE.Line;
    occluder: THREE.Mesh;
    mesh: THREE.Mesh;
    min: THREE.Vector3;
    max: THREE.Vector3;
  };
  dst: {
    outline: THREE.Line;
    occluder: THREE.Mesh;
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    min: THREE.Vector3;
    max: THREE.Vector3;
  };
};

export type ImageType = {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
  box: THREE.Box3;
  down: THREE.Vector3;
};

type DrawBoxType = {
  min: THREE.Vector3;
  max: THREE.Vector3;
  diff: THREE.Vector3;
  outline: THREE.Line;
};

type StateType = {
  canvas: HTMLCanvasElement | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  raycaster: THREE.Raycaster;
  drawBox: DrawBoxType;
  scene: THREE.Scene;
  scene2: THREE.Scene;
  scene3: THREE.Scene;
  scene4: THREE.Scene;
  zoomRay: {
    ray: THREE.Vector3;
    tempClip: THREE.Vector3;
    clip: THREE.Vector3;
  };
  pointer: PointerType;
  intersects: Array<THREE.Object3D>;
  image: ImageType;
  cameraDown: THREE.Vector3;
  portals: Array<PortalType>;
};

let imageMesh, imageMeshMaterial, imageGeometry;
{
  const geometry = new THREE.PlaneGeometry();
  const texture = new THREE.Texture();
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  imageGeometry = geometry;
  imageMeshMaterial = material;
  imageMesh = mesh;
}

const State: StateType = {
  canvas: null,
  camera: null,
  renderer: null,
  scene: new THREE.Scene(),
  scene2: new THREE.Scene(),
  scene3: new THREE.Scene(),
  scene4: new THREE.Scene(),
  raycaster: new THREE.Raycaster(),
  zoomRay: {
    clip: new THREE.Vector3(),
    tempClip: new THREE.Vector3(),
    ray: new THREE.Vector3(),
  },
  drawBox: {
    min: new THREE.Vector3(),
    max: new THREE.Vector3(),
    diff: new THREE.Vector3(),
    outline: makeOutline(0xffffff, 2),
  },
  intersects: [],
  image: {
    mesh: imageMesh,
    material: imageMeshMaterial,
    geometry: imageGeometry,
    box: new THREE.Box3(),
    down: new THREE.Vector3(),
  },
  cameraDown: new THREE.Vector3(),
  portals: [],
  pointer: {
    mouse: new THREE.Vector2(),
    clip: new THREE.Vector3(),
    clip2: new THREE.Vector2(),
    tempClip: new THREE.Vector3(),
    ray: new THREE.Vector3(),
    diffMouse: new THREE.Vector2(),
    diff: new THREE.Vector3(),
    active: false,
    middle: false,
    down: {
      mouse: new THREE.Vector2(),
      clip: new THREE.Vector3(),
      clip2: new THREE.Vector2(),
      tempClip: new THREE.Vector3(),
      ray: new THREE.Vector3(),
    },
  },
};

export default State;
