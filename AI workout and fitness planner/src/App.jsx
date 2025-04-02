import { useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./index.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function App() {
  const [inputs, setInputs] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "Female",
    fitnessLevel: "Beginner",
    goal: "Weight Loss",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const generateWorkoutPlan = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(
        `Generate a detailed workout plan for a ${inputs.age}-year-old ${inputs.gender} 
        with a height of ${inputs.height} cm and weight of ${inputs.weight} kg. 
        The user is at a ${inputs.fitnessLevel} level and wants to achieve ${inputs.goal}.`
      );
      const result = await response.response.text();
      setPlan(result.replace(/\n/g, "<br/>"));
    } catch (error) {
      console.error("API Error:", error);
      setPlan("Error generating workout plan.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1><span className="highlight">AI</span> Workout <span className="highlight-blue">Wizard</span></h1>
      <p>Get personalized exercise plans tailored to your needs. <strong>Start your fitness journey today!</strong></p>

      <div className="form-container">
        <label>Height (cm)</label>
        <input type="number" name="height" value={inputs.height} onChange={handleChange} />

        <label>Weight (kg)</label>
        <input type="number" name="weight" value={inputs.weight} onChange={handleChange} />

        <label>Age (yr)</label>
        <input type="number" name="age" value={inputs.age} onChange={handleChange} />

        <label>Gender</label>
        <select name="gender" value={inputs.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Fitness Level</label>
        <select name="fitnessLevel" value={inputs.fitnessLevel} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label>Goal</label>
        <select name="goal" value={inputs.goal} onChange={handleChange}>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Endurance">Endurance</option>
        </select>

        <button onClick={generateWorkoutPlan} disabled={loading}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </div>

      <div className="solution-container">
        <h3>Workout Plan:</h3>
        <p dangerouslySetInnerHTML={{ __html: plan || "Waiting for input..." }}></p>
      </div>
    </div>
    
  );
}

export default App;
