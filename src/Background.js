import { useContext, useRef } from 'react'
import * as THREE from "three";
import { PivotControls, useMask, useMatcapTexture, useTexture} from '@react-three/drei'
import { ThreeContext } from './Context';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

export default function Background({render}) {

 
//   const { camera } = useThree();
//   const scene = useRef();
//   useFrame(({ gl }) => void ((gl.autoClear = false), gl.render(scene.current, camera)), render)
// scene ref={scene}


const {HideBackground} = useControls("Background",
{   
  HideBackground : {value : true},
})

const { debug } = useContext(ThreeContext);  
const windowsMask = HideBackground && useMask(1, true);  
const texture = useTexture("./SimsOrigin.png");






  return (
    <>
         
      <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false} visible={debug}>
        <mesh position={[0,0,0]} rotation={[0,0,0]} scale={[12,12,12]}>
          <sphereGeometry attach="geometry" args={[3, 14, 14]} />
          <meshMatcapMaterial matcap={texture}  attach="material" side={THREE.BackSide} {...windowsMask} transparent opacity={HideBackground ? 1 : 0}/>
        </mesh>
      </PivotControls>

    </>
  )
}
