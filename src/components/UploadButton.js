import React, { useRef, useContext } from "react";
import { Button } from "@mui/material";
import { GraphContext } from "../GraphContext";
import { getHierarchy, verifData } from "../Tools";

import Papa from "papaparse";

const UploadButton = ({ setHierarchy, setVerifHierarchy, verifHierarchy }) => {
  const context = useContext(GraphContext);
  // Use ref to associate button component click to input change
  const inputRef = useRef();

  const changeHandler = (event) => {
    setHierarchy([]);
    context.setSelectedNode(null);
    context.setDataGraph({});
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

  return (
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
  );
};

export default UploadButton;
