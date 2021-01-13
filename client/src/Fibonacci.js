import React, { Component, useEffect, useState } from "react";
import axios from "axios";

const Fibonacci = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    async function fetchValues() {
      const values = await axios.get("api/values/current");
      setValues(values.data);
    }
    fetchValues();
  }, []);
  useEffect(() => {
    async function fetchIndexes() {
      const indexes = await axios.get("api/values/all");
      setSeenIndexes(indexes.data);
    }
    fetchIndexes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/values", {
      index,
    });
    setIndex("");
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(", ");
  };

  const renderValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index</label>
        <input
          type="text"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>
      <br />
      <h3>Indexes I have seen</h3>
      {renderSeenIndexes()}
      <h3>Calculated values</h3>
      {renderValues()}
    </div>
  );
};

export default Fibonacci;
