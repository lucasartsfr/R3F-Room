import * as THREE from "three";
import { Sky, useMask} from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useRef } from "react";


export default function Sun({props}){

    useEffect(() =>{
      for(let key in stencil) {
        skyRef.current.material[key] = stencil[key]
      }
    }, [])

    const sun = useControls("Sun",
    {   
      uMaskWindow : {value : true},
      distance :  {value : 1000.0, step : 10, min : 1, max : 3000.0}, 
      sunPosition  : {
        value : {x : -1, y : 0, z : -0.1},
        step : 0.1
    },
      inclination :  {value : 25.0, step : 0.1, min : 1.0, max : 100.0},  
      elevation :  {value : 45.0, step : 0.1, min : 0.0, max : 90.0}, 
      azimuth :  {value : 0.0, step : 0.01, min : -1.0, max : 1.0},  
      elevation :  {value : 0.0, step : 0.1, min : -180.0, max : 180.0},  
      exposure :  {value : 0.5, step : 0.1, min : 0.0, max : 1.0},  
      turbidity :  {value : 10.5, step : 0.1, min : 0.0, max : 20.0},  
      rayleigh :  {value : 2.0, step : 0.1, min : 0.0, max : 4.0}, 
      mieCoefficient :  {value : 0.05, step : 0.01, min : 0.0, max : 0.1},  
      mieDirectionalG:  {value : 0.87, step : 0.01, min : 0.0, max : 1.0},   
    })

    
    const stencil = sun.uMaskWindow && useMask(1, false)
    const skyRef = useRef();
   

    

    return(
      <>
        <Sky ref={skyRef} distance={sun.distance} sunPosition={[sun.sunPosition.x, sun.sunPosition.y, sun.sunPosition.z]} inclination={sun.inclination} elevation={sun.elevation} azimuth={sun.azimuth} exposure={sun.exposure} turbidity={sun.turbidity} rayleigh={sun.rayleigh} mieCoefficient={sun.mieCoefficient} mieDirectionalG={sun.mieDirectionalG} {...props} 
        />
      </>
    )
}