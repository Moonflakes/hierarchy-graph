import React, { useState, useContext } from "react";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { GraphContext } from "../GraphContext";

const TreeNode = ({node}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!node.values.filter(v => v.key).length;
  const context = useContext(GraphContext);

  return (
    <>
      <ListItemButton key={node.key} onClick={() => {
        hasChildren && setOpen(!open);
        context.setDataGraph(node)
        context.setSelectedNode(node.key)
        }} selected={context.selectedNode === node.key}>
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
    </>
  );
};

const TreeNodeRoot = ({ data }) => {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {data.map((node, i) => (
        <TreeNode node={node} key={`${node.key}-${i}`} />
      ))}
    </List>
  );
};

export default TreeNodeRoot;
