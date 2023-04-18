// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })
import { OrbitControls, TransformControls, PivotControls, Html, Text, Sky, Float, MeshReflectorMaterial, Stars, useTexture, useCubeTexture, useProgress, useGLTF} 
        from '@react-three/drei';
import { useRef } from 'react'

import { useFrame, useThree } from '@react-three/fiber';
import CustomObject from './CustomObject';
export default function ReactFiber() {

    const TorusRef = useRef();
    const Three = useThree();


    // Tick Function 
        useFrame((state, delta) => {
            const ElapsedTime = state.clock.getElapsedTime();
            state.camera.lookAt(0,0,0)
            TorusRef.current.rotation.y += delta
        })

  return (
    <>
        {/* Camera */}
            <OrbitControls makeDefault />        

        {/* Light */}
            <directionalLight />
            <ambientLight intensity={0.2} />

        {/* Mesh */}
            <group>
                <mesh ref={TorusRef}> 
                    <torusKnotGeometry></torusKnotGeometry>
                    <meshStandardMaterial />
                </mesh>
                <mesh scale={[1, 1, 1]} position={[2, 2, 0]} position-x={2}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial wireframe={false} color="red"/>
                </mesh>
            </group>
            
        <CustomObject />
    </>
  )
}
