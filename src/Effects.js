import { PivotControls, useMask } from '@react-three/drei'
import { EffectComposer, Noise, Vignette, HueSaturation, GodRays } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import { ThreeContext } from './Context'
import { Resizer, KernelSize } from "postprocessing";
import * as THREE from "three";
import { useThree } from '@react-three/fiber'


export default function Effects() {
  const { gl, scene, camera, size } = useThree();
  const [material, setMaterial] = useState();
  const rayRef = useRef();
  const {debug} = useContext(ThreeContext);
  const composerRef = useRef();


  const stencilLeft = useMask(1, true);
  const outMask = useMask(999, false);

  // const invisibleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
  // const invisibleGeometry = new THREE.BoxGeometry(3, 3, 3);
  // const invisibleMesh = new THREE.Mesh(invisibleGeometry, invisibleMaterial);
  

  useEffect(() => {
    setMaterial(rayRef);
  }, [])

  const { samples, density, decay, weight, exposure, clampMax, color, blend  } = useControls('GodRay', {
    samples : {value : 45, min : 0, max : 100, step : 0.01},
    density : {value : 0.55, min : 0, max : 20, step : 0.01},
    decay : {value : 0.94, min : 0, max : 1, step : 0.01},
    weight : {value : 0.6, min : 0, max : 5, step : 0.01},
    exposure : {value : 0.33, min : 0, max : 5, step : 0.01},
    clampMax : {value : 0.7, min : 0, max : 1, step : 0.01},
    blend : { value : "SOFT_LIGHT", options : [
      "SKIP",
      "ADD",
      "ALPHA",
      "AVERAGE",
      "COLOR_BURN",
      "COLOR_DODGE",
      "DARKEN",
      "DIFFERENCE",
      "EXCLUSION",
      "LIGHTEN",
      "MULTIPLY",
      "DIVIDE",
      "NEGATION",
      "NORMAL",
      "OVERLAY",
      "REFLECT",
      "SCREEN",
      "SOFT_LIGHT",
      "HARD_LIGHT",
      "SUBTRACT",
      "VIVID_LIGHT",
      "SATURATION",
      "PIN_LIGHT",
      "SRC",
      "LUMINOSITY",
      "LINEAR_LIGHT",
      "LINEAR_DODGE",
      "LINEAR_BURN",
      "HUE",
      "HARD_MIX",
      "DST",
      "COLOR"
    ]},
    color : "#ffffff"
  })

  // const scene = useRef()
  // const { camera } = useThree()
  // useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(scene.current, camera)), 10)

  return (
    <>

      {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false} visible={debug}>
      <mesh position={[-10, 8, 0]} ref={rayRef} scale={[16, 16, 16]} rotation={[0, Math.PI/2, 0]}>
        <sphereGeometry attach="geometry" args={[3, 12]} />      
        <meshBasicMaterial color={color} transparent opacity={1}  {...outMask} side={THREE.DoubleSide} />
      </mesh>
      </PivotControls> */}

    {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false} visible={debug}>
      <mesh position={[-44, 10, 0]} ref={rayRef} scale={[16, 16, 16]} rotation={[0, Math.PI/2, 0]}>
        <sphereGeometry args={[0.5, 32]} />          
        <meshBasicMaterial color={color} transparent opacity={1}   {...outMask} side={THREE.DoubleSide} />
      </mesh>
      </PivotControls> */}

      <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false} visible={debug}>
      <mesh position={[-38, 8, 0]} ref={rayRef} scale={[10, 10, 10]} rotation={[0, Math.PI/2, 0]}>
        <circleGeometry args={[5, 32]} />        
        <meshBasicMaterial color={color} transparent opacity={1} {...outMask} />
      </mesh>
      </PivotControls>

      <EffectComposer stencilBuffer multisampling={0} ref={composerRef}>
        {
          (material) &&
          <GodRays
            sun={material.current}
            blendFunction={BlendFunction[blend]} // The blend function of this effect.
            samples={samples} // The number of samples per pixel.
            density={density} // The density of the light rays.
            decay={decay} // An illumination decay factor.
            weight={weight} // A light ray weight factor.
            exposure={exposure} // A constant attenuation coefficient.
            clampMax={clampMax} // An upper bound for the saturation of the overall effect.
            width={Resizer.AUTO_SIZE} // Render width.
            height={Resizer.AUTO_SIZE} // Render height.
            kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
            blur={true} // Whether the god rays should be blurred to reduce artifacts.
          />
        }
        
      </EffectComposer>
    </>
  )
}


{/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false} visible={debug}>
      <mesh position={[-10, 8, 0]} ref={rayRef} scale={[10, 10, 10]} rotation={[0, Math.PI/2, 0]}>
        <circleGeometry args={[0.5, 32]} />        
        <meshBasicMaterial color={color} transparent opacity={1} {...outMask} />
      </mesh>
      </PivotControls> */}