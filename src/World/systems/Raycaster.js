import { Raycaster, Vector2 } from "three/build/three.module";
import { robotHandleMouseClick } from "../components/robot";

let raycaster = null;
const mouse = new Vector2();
let intersectableObjects = [];
let camera = null;

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(intersectableObjects);

  if (intersects && intersects.length) {
    const planeIntersected = intersects[0];

    robotHandleMouseClick(planeIntersected.point);
  }
}

function createRaycaster(objectsToIntersect, cam) {
  raycaster = new Raycaster();
  intersectableObjects = objectsToIntersect;
  camera = cam;
  return raycaster;
}

function getRaycasterInfo() {
  return { raycaster, mouse };
}

export { createRaycaster, getRaycasterInfo };

window.addEventListener("click", onMouseMove, false);
