import React from 'react';

export const GraphContext = React.createContext({
    setDataGraph: () => {},
    dataGraph: {},
    setSelectedNode: () => {},
    selectedNode: null,
});