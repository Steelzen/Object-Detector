import { drawRect } from "../common/utilities";

/** Draw visual mesh  **/
export const draw = async (
  net,
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
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const video = webcamRef.current.video;

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

    /* From here functional logic for each toggle button options*/
    // draw object detection
    if (toggleStates["odBtn"]) {
      drawRect(relevantObjects, ctx);
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

        const hasGloves = relevantObjects.some(
          (item) =>
            item.class === "gloves" &&
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
