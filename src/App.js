import React, { useState } from "react";
import TreeNodeRoot from "./components/Tree";
import { GraphContext } from "./GraphContext";
import { Grid } from "@mui/material";
import Chart from "./components/LineChart";
import UploadButton from "./components/UploadButton";

function App() {
  // Init states
  const [verifHierarchy, setVerifHierarchy] = useState(
    "Please upload your hierarchy file."
  );
  const [hierarchy, setHierarchy] = useState([]);
  const [dataGraph, setDataGraph] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  //Setup data graph context
  const graphContextValues = {
    setDataGraph: setDataGraph,
    dataGraph: dataGraph,
    setSelectedNode: setSelectedNode,
    selectedNode: selectedNode,
  };

  return (
    <div className="App">
      <GraphContext.Provider value={graphContextValues}>
        {/* File Uploader */}
        <Grid container justifyContent="center">
          <Grid item style={{ margin: "30px" }}>
            <UploadButton
              setHierarchy={setHierarchy}
              setVerifHierarchy={setVerifHierarchy}
              verifHierarchy={verifHierarchy}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="normal">
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
              <Grid item xs={12} md={5}>
                <TreeNodeRoot data={hierarchy} />
              </Grid>
              {/* Node graph data */}
              <Grid container item xs={12} md={7} justifyContent="center">
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
