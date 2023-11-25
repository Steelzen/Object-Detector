// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "../common/utilities";
import { draw } from "../components/draw";

function Live({ toggleStates, handlePeopleCounting }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const net = useRef(null);
  const [noProtection, setNoProtection] = useState(false);
  const safetyItems = ["helmet", "vest", "gloves", "person"];

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
        // draw(net);
        draw(
          net,
          webcamRef,
          canvasRef,
          safetyItems,
          setNoProtection,
          toggleStates,
          handlePeopleCounting
        );
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
