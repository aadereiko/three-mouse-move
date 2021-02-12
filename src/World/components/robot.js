import { AnimationMixer, LoopOnce, MathUtils, Vector2, Vector3 } from "three";
import { Box3, Plane } from "three/build/three.module";
import { gltfLoader } from "../systems/gltfLoader";
import { createCurveFromTo } from "./trackCurve";

let robotRoot = null;
let currentCurve = null;
let t = 0;
let lastPlaneIntersection = new Vector3();

async function createRobot() {
  const gltfModel = await gltfLoader.loadAsync(
    "../../assets/models/robot/scene.gltf"
  );

  robotRoot = gltfModel.scene;

  robotRoot.position.setY(13);
  const clip = gltfModel.animations[0];

  const mixer = new AnimationMixer(robotRoot);
  const action = mixer.clipAction(clip);

  action.play();

  robotRoot.tick = (delta) => {
    if (currentCurve) {
      const prevY = robotRoot.position.y;
      t += 0.0009;
      const currentPoint = currentCurve.curveData.getPoint(t);
      robotRoot.position.copy(currentPoint);
      robotRoot.position.setY(prevY);
    }

    mixer.update(delta);
  };

  return robotRoot;
}

function robotHandleMouseClick(planeIntersection) {
  if (currentCurve) {
    currentCurve = null;
    t = 0;
  }

  lastPlaneIntersection.copy(planeIntersection);
  robotRoot.lookAt(planeIntersection);

  currentCurve = createCurveFromTo(robotRoot.position, planeIntersection);
}

const getRobotModel = () => robotRoot;

export { createRobot, getRobotModel, robotHandleMouseClick };
