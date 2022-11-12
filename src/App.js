import React, { useState, useRef } from "react";
import TreeNodeRoot from "./components/Tree";
import { nest } from "d3-collection";
import { GraphContext } from "./GraphContext";
import { Grid, Button } from "@mui/material";

import Papa from "papaparse";
import Chart from "./components/LineChart";

function App() {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  const [dataGraph, setDataGraph] = useState({});

  const inputRef = useRef();

  const changeHandler = (event) => {
    // Passing file data to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Parsed Data Response in array format
        setParsedData(results.data);
      },
    });
  };

  const getCumulData = (data, key) => {
    const dateEntries = nest()
      .key((d) => {
        return d.date;
      })
      .entries(data);

    return dateEntries.map((date) =>
      date.values.reduce(
        (acc, curr) => {
          return {
            date: curr.date,
            value: acc.value + parseInt(curr.ventes),
          };
        },
        { value: 0 }
      )
    );
  };

  //Setup hierarchy
  const getHierarchy = (data, i) => {
    const verifData = data.filter((d) => {
      const hasLevels = Object.keys(d).filter((key) =>
        key.match(/^niveau_\d+$/)
      ).length;
      const hasDate = Object.keys(d).includes("date");
      const hasValue = Object.keys(d).includes("ventes");
      return hasLevels > 0 && hasValue && hasDate;
    }).length;

    if (verifData === 0) return -1;

    const nbLevel = data.reduce((acc, curr) => {
      const accNbLevels = Object.keys(acc).filter((key) =>
        key.includes("niveau")
      ).length;
      const currNbLevels = Object.keys(curr).filter((key) =>
        key.includes("niveau")
      ).length;
      return accNbLevels > currNbLevels ? accNbLevels : currNbLevels;
    }, 0);

    var entries = nest()
      .key((d) => {
        return d[`niveau_${i}`];
      })
      .entries(data);

    if (nbLevel >= i) {
      entries = entries.map((e) => {
        return {
          ...e,
          values: nbLevel === i ? e.values : getHierarchy(e.values, i + 1),
          cumul: getCumulData(e.values, e.key),
        };
      });
    }
    return entries;
  };

  const hierarchy = getHierarchy(parsedData, 1);

  //Setup data graph context
  const graphContextValues = {
    setDataGraph: setDataGraph,
    dataGraph: dataGraph,
  };

  return (
    <div className="App">
      {/* File Uploader */}
      <Grid container justifyContent="center" >
        <Grid item style={{margin: "30px"}}>
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
          {hierarchy === -1 ? (
            <Grid item style={{ textAlign: "center" }} xs={12}>
              Incorrect data
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <TreeNodeRoot data={hierarchy} />
              </Grid>
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
