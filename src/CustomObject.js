// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })
import { OrbitControls, TransformControls, PivotControls, Html, Text, Sky, Float, MeshReflectorMaterial, Stars, useTexture, useCubeTexture, useProgress, useGLTF} 
        from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CustomObject() {

    const verticesCount = 10 * 3; // 10 Triangles * 3 Vertices
    const bufferGeometryRef = useRef();

    const positions = useMemo(() => {
        const positions = new Float32Array(verticesCount * 3); // 3 = x, y and Z for Each Triangle

        for(let i = 0; i < verticesCount * 3; i++){
            positions[i] = (Math.random() - 0.5) * 3;
        }
        return positions;

    }, [])


    useEffect(() => {        
        bufferGeometryRef.current.computeVertexNormals();
    }, [])

  return (
    <>
        <mesh scale={[1, 1, 1]} >
            <bufferGeometry
                ref={bufferGeometryRef}
            >
                <bufferAttribute 
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={positions}
                />
            </bufferGeometry>
            <meshStandardMaterial wireframe={false} color="blue" side={ THREE.DoubleSide}/>
        </mesh>        
    </>
  )
}
