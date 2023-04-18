import * as THREE from "three";
import { useEffect } from 'react';
import { Center, useAnimations, useGLTF, useTexture, Mask, useMask, PivotControls } from '@react-three/drei'
import { useControls } from 'leva'

useGLTF.preload('./Models/Room/BlenderRoomV2.glb')

export default function Room({scale}) {

  const Model = useGLTF('./Models/Room/BlenderRoomV2.glb');
  const Texture = useTexture('./Models/Room/Bake.jpg');
  Texture.flipY = false;
//   const invert = false;
//   const stencil = useMask(1, invert)

  return (
    <>        
        {/* <primitive object={Model.scene} scale={scale} map={Texture}/> */}        
        <mesh 
            geometry={Model.nodes.Room.geometry} 
            position-y={7}
            rotation={Model.nodes.Room.rotation} 
            scale={scale} 
        >
            <meshBasicMaterial map={Texture} map-flipY={false}  side={THREE.DoubleSide} />
        </mesh>
    </>
  )
}
