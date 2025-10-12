import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<String | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(JSON.stringify(data.prediction));
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      <h1>OncoVision</h1>
      <h3>
        Simply upload your image and get your peace of mind that you are safe!
      </h3>
      <input type="file" onChange={handleFileChange}></input>
      <button onClick={handleUpload}>Upload Image</button>
      {prediction && <p>Prediction: {prediction}</p>}
    </>
  );
}

export default App;
