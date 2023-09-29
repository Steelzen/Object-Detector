// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function Live({ toggleStates }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const net = useRef(null);
  const [noProtection, setNoProtection] = useState(false);
  const safetyItems = ["helmet", "vest", "gloves", "person"];

  /** Draw visual mesh  **/
  const draw = async (net) => {
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
      // console.log(obj);

      // Include only safety items
      const relevantObjects = obj.filter((item) =>
        safetyItems.includes(item.class)
      );

      const persons = relevantObjects.filter((item) => item.class === "person");

      /* From here functional logic for each toggle button options*/
      // draw virtual fence
      if (toggleStates["vfBtn"]) {
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
            noProtection = false;
            break; // Exit the loop if a person with both helmet and gloves is found
          }
        }

        if (noProtection) {
          ctx.fillStyle = "yellow";
          ctx.fillText("Wear Protection!", 10, 60);
        }
      }

      // draw face recognition
      if (toggleStates["frBtn"]) {
        drawRect(relevantObjects, ctx);
      }

      // draw people counting
      if (toggleStates["pcBtn"]) {
        const personCount = persons.length;

        const ctx = canvasRef.current.getContext("2d");

        ctx.fillStyle = "red";

        ctx.fillText(`Person Count: ${personCount}`, 10, 30);
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

  // Load ML model
  useEffect(() => {
    const runCoco = async () => {
      net.current = await cocossd.load();
      console.log("Model loaded. ");
    };

    runCoco();
  }, []);

  // Draw mesh at each requestAnimationFrame
  useEffect(() => {
    let intervalId;

    const runDraw = () => {
      if (net.current) {
        draw(net);
      }
    };

    intervalId = setInterval(runDraw, 10);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "640px",
            margin: "0 auto",
          }}
        >
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />

          {noProtection && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zindex: 10,
                color: "yellow",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Wear Protect
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Live;
