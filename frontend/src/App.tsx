import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        setMessage(JSON.stringify(response.data));
      })
      .catch(() => {
        setMessage("Unable to connect to backend");
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-blue-600">
          CloudVault
        </h1>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;