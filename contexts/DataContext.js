"use client"
//Imports

import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [updateSidebar, setUpdateSidebar] = useState(true);

    return (
        <DataContext.Provider value={[updateSidebar, setUpdateSidebar]}>
            {children}
        </DataContext.Provider>
    );
};
