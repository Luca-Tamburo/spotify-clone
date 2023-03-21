"use client"
//Imports

import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [updateSidebar, setUpdateSidebar] = useState(true);
    const [updateLikedSong, setUpdateLikedSong] = useState(true);

    return (
        <DataContext.Provider value={[updateSidebar, setUpdateSidebar, updateLikedSong, setUpdateLikedSong]}>
            {children}
        </DataContext.Provider>
    );
};
