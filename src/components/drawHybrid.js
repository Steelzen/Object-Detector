import * as tf from "@tensorflow/tfjs";
import { drawRect } from "../common/utilities";

const isBoundingBoxOverlap = (bbox1, bbox2) => {
  return (
    bbox1[0] < bbox2[0] + bbox2[2] &&
    bbox1[0] + bbox1[2] > bbox2[0] &&
    bbox1[1] < bbox2[1] + bbox2[3] &&
    bbox1[1] + bbox1[3] > bbox2[1]
  );
};

const parseGloveDetections = (predictions, videoWidth, videoHeight, confidenceThreshold = 0.3) => {
  const parsed = [];

  if (!predictions || !Array.isArray(predictions) || predictions.length < 4) {
    console.warn("Invalid predictions from glove model:", predictions);
    return parsed;
  }

  const [boxes, scores, _, validDetections] = predictions;

  if (!validDetections || !validDetections[0]) {
    return parsed;
  }

  for (let i = 0; i < validDetections[0]; i++) {
    const score = scores[0][i];
    if (score > confidenceThreshold) {
      const bbox = boxes[0][i];
      parsed.push({
        class: "gloves",
        score,
        bbox: [
          bbox[1] * videoWidth,
          bbox[0] * videoHeight,
          (bbox[3] - bbox[1]) * videoWidth,
          (bbox[2] - bbox[0]) * videoHeight,
        ],
      });
    }
  }

  return parsed;
};

export const drawHybrid = async (
  cocoNet,
  gloveModel,
  webcamRef,
  canvasRef,
  safetyItems,
  setNoProtection,
  toggleStates,
  handlePeopleCounting
) => {
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.font = "20px Arial";

    // Run COCO-SSD
    const cocoObjects = await cocoNet.current.detect(video);
    const persons = cocoObjects.filter((item) => item.class === "person");

    // Run Glove model
    const inputTensor = tf.tidy(() =>
      tf.browser
        .fromPixels(video)
        .resizeBilinear([640, 640])
        .div(255.0)
        .expandDims(0)
    );

    const [boxes, scores, classes, validDetections] = await gloveModel.executeAsync(
      { [gloveModel.inputs[0].name]: inputTensor },
      gloveModel.outputs.map((o) => o.name)
    );

    const gloveObjects = parseGloveDetections([boxes, scores, classes, validDetections], videoWidth, videoHeight);

    tf.dispose([inputTensor, boxes, scores, classes, validDetections]);

    const allObjects = [...cocoObjects, ...gloveObjects];

    // Toggle: Object Detection
    if (toggleStates["odBtn"]) {
      drawRect(allObjects, ctx);
    }

    // Toggle: PPE Detection
    if (toggleStates["ppeBtn"]) {
      let noProtectionFlag = true;

      for (const person of persons) {
        const hasHelmet = allObjects.some(
          (item) =>
            item.class === "helmet" && isBoundingBoxOverlap(person.bbox, item.bbox)
        );

        const hasGloves = allObjects.some(
          (item) =>
            item.class === "gloves" && isBoundingBoxOverlap(person.bbox, item.bbox)
        );

        if (hasHelmet && hasGloves) {
          setNoProtection(false);
          noProtectionFlag = false;
          break;
        }
      }

      if (noProtectionFlag) {
        ctx.fillStyle = "yellow";
        ctx.fillText("Wear Protection!", 10, 30);
        setNoProtection(true);
      }
    }

    // Toggle: People Counting
    if (toggleStates["pcBtn"]) {
      handlePeopleCounting(persons.length);
    }

    // Toggle: Virtual Fence
    if (toggleStates["vfBtn"]) {
      // TODO: draw virtual fence
    }

    // Toggle: Pose Estimation
    if (toggleStates["peBtn"]) {
      // TODO: draw pose
    }

    // Toggle: Fall Detection
    if (toggleStates["fdBtn"]) {
      // TODO: draw fall alerts
    }
  }
};
