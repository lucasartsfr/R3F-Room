import { Suspense, useContext, useEffect, useRef } from 'react'
import * as THREE from "three";
import { Sparkles, useHelper} from '@react-three/drei'
import Sun from './Sun';
import { ThreeContext } from './Context';

export default function Lights(){

    const lightRef = useRef();
    const {debug} = useContext(ThreeContext);

    useEffect(() => {
        lightRef.current.target.position.set( -5, 5, 5 );
        lightRef.current.target.updateMatrixWorld();   
      }, [])
    
    const HideLight = (debug) ? THREE.DirectionalLightHelper : THREE.PointLightHelper; 
    useHelper(lightRef, HideLight, debug ? 0.2 : 0, "Cyan")


    return(
        <>
            <ambientLight intensity={1.5} />
            <directionalLight ref={lightRef} intensity={1} position={[-5, 10, -5]} angle={Math.PI / 15}   />      
            <Sun />  
            <Sparkles key={Math.random()} size={10} scale={15} radius={10} position={[0, 5, 0]} speed={5} intensity={1} count={10}/>   
        </>
    )
}