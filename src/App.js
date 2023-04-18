import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Import from './Import'
import React, { useContext } from 'react';
import * as THREE from 'three';
import { ThreeContext } from './Context';
import { Perf } from 'r3f-perf';
import Mountain from './Mountain'
import { PivotControls } from '@react-three/drei';

export default function App(){

    // Run When Canvas is Executed
    const Created = ({gl, scene}) => {
        const Color = "#ffffff";
        //gl.setClearColor(Color); // Also possible on Scene   
        scene.fog = new THREE.Fog(Color, 0, 100000);
    }

    const { debug } = useContext(ThreeContext);

    return(
        <>
            
            <Leva hidden={!debug} />

            <Canvas
                flat
                shadows
                dpr={[1, 2]}
                camera={ { zoom : 1, fov: 45, near: 0.1, far: 500, position: [ 13.5, 15.5, 13.5 ] } }
                gl={{antialias : false}}
                onCreated={Created}
            >   

                {debug && <Perf position="top-left" minimal={false}/>}

                <Import />
                {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false}>
                    <Mountain options={{bW: 0.12, bH: 1, joints: 5}} width={500} instances={50} flat={2} groundColor="#f504c6"/>  
                </PivotControls> */}

            </Canvas>
        </>
    )
}