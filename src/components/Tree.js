import React, { useState, useContext } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Checkbox,
  Grid,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { GraphContext } from "../GraphContext";

const TreeNode = ({ node }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!node.values.filter((v) => v.key).length;
  const context = useContext(GraphContext);
  const isChecked = context.selectedNode === node.key;

  return (
    <Grid container direction="row" wrap="nowrap">
      <Grid item>
        <Checkbox
          checked={isChecked}
          onChange={() => {
            const dataGraph = isChecked ? [] : node;
            const selectedNode = isChecked ? null : node.key;
            context.setDataGraph(dataGraph);
            context.setSelectedNode(selectedNode);
          }}
        />
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <ListItemButton
          key={node.key}
          onClick={() => {
            hasChildren && setOpen(!open);
          }}
          selected={context.selectedNode === node.key}          
        >
          <ListItemText primary={node.key} />
          {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.values.map((childNode, i) => (
              <TreeNode node={childNode} key={`${childNode.key}-${i}`} />
            ))}
          </List>
        </Collapse>
      </Grid>
    </Grid>
  );
};

const TreeNodeRoot = ({ data }) => {
  return (
    <List sx={{ width: "100%" }}>
      {data.map((node, i) => (
        <TreeNode node={node} key={`${node.key}-${i}`} level={1} />
      ))}
    </List>
  );
};

export default TreeNodeRoot;
