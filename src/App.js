import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Import from './Import'
import React, { Suspense, useContext, useRef } from 'react';
import * as THREE from 'three';
import { ThreeContext } from './Context';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import Background from './Background';
import Effects from './Effects';
import Placeholder from './Placeholder';

export default function App(){

    // Run When Canvas is Executed
    const Created = ({gl, scene}) => {
        const Color = "#ff0000";
        //gl.setClearColor(Color); // Also possible on Scene   
        // gl.setClearColor(0x000000, 0);
        //gl.antialias = true;
        //gl.setClearAlpha(0.0)
        //console.log(gl)
        scene.fog = new THREE.Fog(Color, 0, 100000);
    }

    const { debug } = useContext(ThreeContext);
    const orbitRef = useRef();

    const limitPan = () =>{
        // Limit Pan Camera
        orbitRef.current.target.x = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.x));
        orbitRef.current.target.z = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.z));
        orbitRef.current.target.y = Math.max(1, Math.min(orbitRef.current.maxPan, orbitRef.current.target.y));
      }
    

    return(
        <>
            
            <Leva hidden={!debug} />
           
            <Canvas
                flat
                shadows
                dpr={[1, 2]}
                camera={ { zoom : 1, fov: 45, near: 0.1, far: 5000, position: [ 13.5, 15.5, 13.5 ] } }
                gl={{antialias : true}}
                onCreated={Created}
            >   
             <OrbitControls makeDefault  
                ref={orbitRef}
                minPolarAngle={Math.PI / 5} 
                maxPolarAngle={ Math.PI / 2.2 }        
                maxDistance={30} 
                minDistance={4}         
                maxAzimuthAngle={ Math.PI / 2 } 
                minAzimuthAngle={-Math.PI / 6 }
                target={[0,2.5,0]}
                minPan={-5}
                maxPan={5}
                onChange={limitPan}
            />

                {debug && <Perf position="top-left" minimal={false}/>}

                {/* Models */}
                <Suspense fallback={<Placeholder position-y={3} scale={[9, 9, 9]} />}>
                    <Import render={1} />
                </Suspense>

                {/* POST PROCESSING */}
                <Background render={2}/>

                {/* POST PROCESSING */}
                <Effects />
           

            </Canvas>
        </>
    )
}