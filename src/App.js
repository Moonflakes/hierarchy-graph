import React, { useState, useRef } from "react";
import TreeNodeRoot from "./components/Tree";
import { GraphContext } from "./GraphContext";
import { Grid, Button } from "@mui/material";

import Papa from "papaparse";
import Chart from "./components/LineChart";
import { getHierarchy, verifData } from "./Tools";

function App() {
  // Init states
  const [verifHierarchy, setVerifHierarchy] = useState(
    "Please upload your hierarchy file."
  );
  const [hierarchy, setHierarchy] = useState([]);
  const [dataGraph, setDataGraph] = useState({});

  // Use ref to associate button component click to input change
  const inputRef = useRef();

  const changeHandler = (event) => {
    // Passing file data to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Verif data
        setVerifHierarchy(verifData(results.data));
        // Parsed Data Response in array hierarchy
        verifHierarchy && setHierarchy([...getHierarchy(results.data, 1)]);
      },
    });
    //Reset input value
    event.target.value = null;
  };

  //Setup data graph context
  const graphContextValues = {
    setDataGraph: setDataGraph,
    dataGraph: dataGraph,
  };

  return (
    <div className="App">
      {/* File Uploader */}
      <Grid container justifyContent="center">
        <Grid item style={{ margin: "30px" }}>
          <Button
            variant="contained"
            component="label"
            onKeyDown={(e) => e.keyCode === 32 && inputRef.current?.click()}
          >
            Upload File
            <input
              ref={inputRef}
              type="file"
              name="file"
              onChange={changeHandler}
              accept=".csv"
              hidden
            />
          </Button>
        </Grid>
      </Grid>

      <GraphContext.Provider value={graphContextValues}>
        <Grid container>
          {verifHierarchy !== 1 ? (
            <>
              {/* Error sentence */}
              <Grid item style={{ textAlign: "center", color: "red" }} xs={12}>
                {verifHierarchy}
              </Grid>
            </>
          ) : (
            <>
              {/* Hierarchy list */}
              <Grid item xs={12} md={4}>
                <TreeNodeRoot data={hierarchy} />
              </Grid>
              {/* Node graph data */}
              <Grid item xs={12} md={8}>
                <Chart />
              </Grid>
            </>
          )}
        </Grid>
      </GraphContext.Provider>
    </div>
  );
}

export default App;
