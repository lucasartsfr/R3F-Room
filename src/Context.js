import React, { createContext, useEffect, useState } from 'react';


export  const ThreeContext = createContext();

export const Context = ({ children }) => {

    const [debug, setDebug] = useState(false);  

    useEffect(() => {
        window.location.hash == "#debug" ? setDebug(true) : setDebug(false);
    },[])

    return (
      <ThreeContext.Provider value={{debug, setDebug}}>
        {children}
      </ThreeContext.Provider>
    );
}