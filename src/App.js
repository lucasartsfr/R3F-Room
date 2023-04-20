import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Import from './Import'
import React, { Suspense, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeContext } from './Context';
import { Perf } from 'r3f-perf';
import { OrbitControls, PivotControls } from '@react-three/drei';
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

    const { debug, setDebug } = useContext(ThreeContext);
    const orbitRef = useRef();

    const limitPan = () =>{
        // Limit Pan Camera if no debug
    
        if(debug){
            orbitRef.current.maxDistance = 300;
            orbitRef.current.minDistance = 0;
            orbitRef.current.minPolarAngle = 0;
            orbitRef.current.maxPolarAngle = Infinity;
            orbitRef.current.maxAzimuthAngle = Infinity 
            orbitRef.current.minAzimuthAngle= Infinity; 
        }
        else{            
            orbitRef.current.target.x = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.x));
            orbitRef.current.target.z = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.z));
            orbitRef.current.target.y = Math.max(1, Math.min(orbitRef.current.maxPan, orbitRef.current.target.y));
            orbitRef.current.maxDistance = 30;
            orbitRef.current.minDistance = 4;
            orbitRef.current.minPolarAngle = Math.PI / 5;
            orbitRef.current.maxPolarAngle = Math.PI / 2.2;
            orbitRef.current.maxAzimuthAngle = Math.PI / 2 
            orbitRef.current.minAzimuthAngle= -Math.PI / 6; 
        }               
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

                <PivotControls anchor={[0, 0, 0]} activeAxes={[debug, debug, debug]}  visible={debug} depthTest={false}>
                    <mesh position={[0.18,3.5,0.7]} 
                        onClick={() => setDebug((prev) => !prev)}
                        onPointerEnter={() => document.body.style.cursor = 'pointer'} 
                        onPointerLeave={() => document.body.style.cursor = 'default'}
                    >
                        <boxGeometry args={[2.2,1.2,0.3]} />
                        <meshBasicMaterial color="red" wireframe={debug} transparent opacity={debug ? 1 : 0}/>
                    </mesh>
                </PivotControls>

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