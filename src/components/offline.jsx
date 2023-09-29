import React, { useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utilities";

function Offline({ toggleStates }) {
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [personCount, setPersonCount] = useState(0);

  const detectImage = async (imageElement) => {
    const net = await cocossd.load();
    const obj = await net.detect(imageElement);

    const safetyItems = ["helmet", "vest", "gloves", "person"];
    const relevantObjects = obj.filter((item) =>
      safetyItems.includes(item.class)
    );

    const personObjects = relevantObjects.filter(
      (item) => item.class === "person"
    );
    setPersonCount(personObjects.length);

    const ctx = canvasRef.current.getContext("2d");
    const scale = 700 / Math.max(imageElement.width, imageElement.height);
    drawRect(relevantObjects, ctx, scale);
  };

  function handleImageUpload(event) {
    const imageFile = event.target.files[0];

    const imageElement = new Image();
    imageElement.onload = () => {
      setSelectedImage(imageElement);
      setPersonCount(0);
      detectImage(imageElement);
    };
    imageElement.src = URL.createObjectURL(imageFile);
  }

  function handleButtonClick() {
    inputRef.current.click();
  }

  const inputRef = useRef(null);

  return (
    // <div style={styles.container}>
    //   <h2 style={styles.heading}>
    //     Please wait for a couple minutes after upload photo
    //   </h2>
    //   {selectedImage ? (
    //     <div style={styles.imageContainer}>
    //       <img src={selectedImage.src} alt="Uploaded" style={styles.image} />
    //       <canvas ref={canvasRef} style={styles.canvas} />
    //       <div style={styles.personCount}>Person Count: {personCount}</div>
    //     </div>
    //   ) : (
    //     <div style={styles.buttonContainer}>
    //       <button onClick={handleButtonClick} style={styles.button}>
    //         Upload Image
    //       </button>
    //       <input
    //         type="file"
    //         accept="image/*"
    //         onChange={handleImageUpload}
    //         ref={inputRef}
    //         style={{ display: "none" }}
    //       />
    //     </div>
    //   )}
    // </div>
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-xl">Coming Soon</h2>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  heading: {
    marginBottom: "20px",
  },
  imageContainer: {
    position: "relative",
    width: "700px",
    height: "700px",
  },
  image: {
    width: "100%",
    height: "100%",
    display: "block",
  },
  canvas: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 8,
    width: "700px",
    height: "700px",
  },
  personCount: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 9,
    width: "700px",
    height: "700px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "red",
    fontSize: "24px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    margin: "10px",
    padding: "8px 12px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    background: "#4CAF50",
  },
};

export default Offline;
