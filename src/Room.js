import * as THREE from "three";
import { useGLTF, useTexture, Environment } from '@react-three/drei';

useGLTF.preload('./Models/Room/RoomWithNormal.glb')

export default function Room({scale}) {

  const Model = useGLTF('./Models/Room/RoomWithNormal.glb');
  const Texture = useTexture('./Models/Room/Bake.jpg');
  Texture.flipY = false;

 

  return (
    <>        
        <Environment preset="sunset" />
        <mesh 
            geometry={Model.nodes.Room.geometry} 
            position-y={7}
            rotation={Model.nodes.Room.rotation} 
            scale={scale} 
        >
            <meshStandardMaterial map={Texture} side={THREE.FrontSide} envMapIntensity={.2}  metalness={0} roughness={1} />
        </mesh>
    </>
  )
}
