import React, { createContext, useEffect, useState } from 'react';


export  const ThreeContext = createContext();

export const Context = ({ children }) => {

    const [debug, setDebug] = useState(false);  
    const [perf, setPerf] = useState(false);  

    useEffect(() => {
        window.location.hash == "#debug" ? setDebug(true) : setDebug(false);
        window.location.hash == "#perf" ? setPerf(true) : setPerf(false);
    },[])

    return (
      <ThreeContext.Provider value={{debug, setDebug, perf}}>
        {children}
      </ThreeContext.Provider>
    );
}