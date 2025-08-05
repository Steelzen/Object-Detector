import * as tf from "@tensorflow/tfjs";
import { drawRect } from "../common/utilities";

const parseGloveDetections = (predictions, width, height, threshold = 0.3) => {
  const [boxes, scores, _, validDetections] = predictions;
  const detections = [];

  const count = validDetections?.dataSync?.()[0] ?? 0;
  const scoresArr = scores?.arraySync?.()[0] ?? [];
  const boxesArr = boxes?.arraySync?.()[0] ?? [];

  for (let i = 0; i < count; i++) {
    if (scoresArr[i] > threshold) {
      const [ymin, xmin, ymax, xmax] = boxesArr[i];
      detections.push({
        class: "gloves",
        score: scoresArr[i],
        bbox: [
          xmin * width,
          ymin * height,
          (xmax - xmin) * width,
          (ymax - ymin) * height,
        ],
      });
    }
  }

  return detections;
};

/** Draw visual mesh  **/
export const draw = async (
  net,
  gloveModel,
  videoRef,
  canvasRef,
  safetyItems,
  setNoProtection,
  toggleStates,
  handlePeopleCounting
) => {
  if (
    typeof videoRef.current !== "undefined" &&
    videoRef.current !== null &&
    videoRef.current.video.readyState === 4
  ) {
    const videoWidth = videoRef.current.video.videoWidth;
    const videoHeight = videoRef.current.video.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const video = videoRef.current.video;

    /* Objects Detection */
    // Get objects by coco-ssd
    const ctx = canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = "20px Arial";

    const obj = await net.current.detect(video);

    let noProtection = true; // Assume no protection initially

    // Include only safety items
    const relevantObjects = obj.filter((item) =>
      safetyItems.includes(item.class)
    );

    const persons = relevantObjects.filter((item) => item.class === "person");

    // 🧤 Glove detection
    let gloveDetections = [];
    if (gloveModel?.current && toggleStates["odBtn"]) {
      const inputTensor = tf.browser
        .fromPixels(video)
        .resizeNearestNeighbor([416, 416])
        .toFloat()
        .div(255.0)
        .expandDims();

      // const predictionMap = await gloveModel.current.executeAsync(inputTensor);
      // const boxes = predictionMap['detected_boxes'] || predictionMap[0];
      // const scores = predictionMap['detected_scores'] || predictionMap[1];
      // const classes = predictionMap['detected_classes'] || predictionMap[2];
      // const valid = predictionMap['num_detections'] || predictionMap[3];

      let boxes, scores, classes, valid;
      const predictionMap = await gloveModel.current.execute(inputTensor);

      if (Array.isArray(predictionMap)) {
        [boxes, scores, classes, valid] = predictionMap;
      } else {
        boxes = predictionMap['boxes'] || predictionMap['detected_boxes'];
        scores = predictionMap['scores'] || predictionMap['detected_scores'];
        classes = predictionMap['classes'] || predictionMap['detected_classes'];
        valid = predictionMap['valid_detections'] || predictionMap['num_detections'];
      }

      // Normalize to array
      gloveDetections = parseGloveDetections(
        [boxes, scores, classes, valid],
        videoWidth,
        videoHeight
      );

      // console.log("Prediction map:", predictionMap);
      console.log("Glove detections:", gloveDetections);
      tf.dispose([inputTensor, boxes, scores, classes, valid]);
    }

    /* From here functional logic for each toggle button options*/
    // draw object detection
    if (toggleStates["odBtn"]) {
      drawRect([...relevantObjects, ...gloveDetections], ctx);
    }

    // draw ppe
    if (toggleStates["ppeBtn"]) {
      // Check if there's at least one person with helmet and gloves
      console.log("PPE" + persons);
      for (const person of persons) {
        const hasHelmet = relevantObjects.some(
          (item) =>
            item.class === "helmet" &&
            isBoundingBoxOverlap(person.bbox, item.bbox)
        );

        const hasGloves = gloveDetections.some((item) =>
          isBoundingBoxOverlap(person.bbox, item.bbox)
        );

        if (hasHelmet && hasGloves) {
          setNoProtection(false);
          break; // Exit the loop if a person with both helmet and gloves is found
        }
      }

      if (noProtection) {
        ctx.fillStyle = "yellow";
        ctx.fillText("Wear Protection!", 10, 30);
      }
    }

    // draw people counting
    if (toggleStates["pcBtn"]) {
      const personCount = persons.length;

      // // draw person count on canvas
      // const ctx = canvasRef.current.getContext("2d");

      // ctx.fillStyle = "red";

      // ctx.fillText(`Person Count: ${personCount}`, 10, 30);

      handlePeopleCounting(personCount);
    }

    // draw virtual fence
    if (toggleStates["vfBtn"]) {
    }

    // draw pose estimation
    if (toggleStates["peBtn"]) {
    }

    // draw fall detection
    if (toggleStates["fdBtn"]) {
    }
  }
};

const isBoundingBoxOverlap = (bbox1, bbox2) => {
  return (
    bbox1[0] < bbox2[0] + bbox2[2] &&
    bbox1[0] + bbox1[2] > bbox2[0] &&
    bbox1[1] < bbox2[1] + bbox2[3] &&
    bbox1[1] + bbox1[3] > bbox2[1]
  );
};