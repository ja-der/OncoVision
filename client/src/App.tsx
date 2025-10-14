import { useState } from "react";
import { motion } from "motion/react";

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

    try {
      const response = await fetch("/api/predict", {
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-30"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500 rounded-full opacity-20"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      ></motion.div>

      <div className="relative z-10 max-w-lg text-center space-y-8">
        <motion.h1
          className="text-6xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          OncoVision
        </motion.h1>
        <motion.h3
          className="text-lg text-gray-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Upload an image to get a quick and reliable analysis!
        </motion.h3>
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-gray-800 file:text-gray-300
      hover:file:bg-gray-700"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Upload Image
          </button>
        </motion.div>
        {prediction && (
          <motion.p
            className="mt-8 text-xl font-semibold text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Prediction: {prediction}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default App;
