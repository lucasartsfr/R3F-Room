// Based on https://codepen.io/al-ro/pen/jJJygQ by al-ro, but rewritten in react-three-fiber
import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react"
import SimplexNoise from "simplex-noise"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
//These have been taken from "Realistic real-time grass rendering" by Eddie Lee, 2010
import bladeDiffuse from "./resources/genshin_grass/blade_diffuse.jpg"
import bladeAlpha from "./resources/genshin_grass/blade_alpha.jpg"
import "./MountainMaterial"
import { PivotControls, Mask, useMask } from "@react-three/drei"
import { useControls } from "leva"

const simplex = new SimplexNoise(Math.random)

export default function Mountain({ options = { bW: 0.12, bH: 1, joints: 5 }, flat = 0, width = 50, instances = 50000, groundColor="#000f00", ...props }) {

  const { bW, bH, joints } = options;

  const THR = useThree();

  const {uRadius, uCircle, uInstances, uBH, uBW, uJoints, uWidth, uFlat, uHoleRadius, uHole, uSquareHole, uSquareSize } = useControls("Mountain",
     {        
        uCircle : false,
        uRadius : {value : 16.0, step : 0.1, min : 1.0, max : 30.0},        
        uHole : false,
        uSquareHole : false,
        uSquareSize : {
          value : {x : 0.49, y : 0.49},
          step : 0.05
        },
        uHoleRadius : {value : 3.0, step : 0.1, min : 1.0, max : 30.0},    
        uInstances : {value : instances, min : 1, max : 100000, step : 1},
        uBH : { value : bH, min : 0, max : 3, step : 0.001},
        uBW : { value : bW, min : 0, max : 3, step : 0.001},
        uJoints : { value : joints, min : 0, max : 5, step : 1},
        uWidth : { value : width, min : 1, max : 100, step : 1},
        uFlat : { value : flat, min : 0, max : 3, step : 0.01},
  })

  
  const materialRef = useRef();
  const groundRed = useRef();

  const [texture, alphaMap] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha])

  const attributeData = useMemo(() => getAttributeData(uInstances, uWidth, uFlat), [uInstances, uWidth, uFlat])

  // Grass Geometry
  const baseGeom = useMemo(() => new THREE.PlaneGeometry(uBW, uBH, 1, uJoints).translate(0, uBH / 2, 0), [uBH, uBW, uJoints])

 
  useFrame((state) => (materialRef.current.uniforms.time.value = state.clock.elapsedTime / 4))


  // Ground
  const groundGeo = useMemo(() => {    
    const geo = new THREE.PlaneGeometry(uWidth, uWidth, 512, 512);
    geo.verticesNeedUpdate = true; //Probably not needed...
    geo.lookAt(new THREE.Vector3(0, 1, 0))
    let a= geo.attributes.position.array

    let vec = new THREE.Vector3();
    for(let len=a.length,i=0;i<len;i+=3){
    vec.set(a[i+0],a[i+1],a[i+2]);
    if(vec.length()>uRadius && uCircle) vec.setLength(uRadius);
        vec.y = getYPosition(vec.x, vec.z, uFlat);
        a[i+0] = vec.x;
        a[i+1] = vec.y;
        a[i+2] = vec.z;
    }


    return {geo, a}
  }, [uWidth, uRadius, uFlat, uCircle])


  return (
    <group {...props}>
      <mesh frustumCulled={false}>
        <instancedBufferGeometry index={baseGeom.index} attributes-position={baseGeom.attributes.position} attributes-uv={baseGeom.attributes.uv}>
          <instancedBufferAttribute attach="attributes-offset" args={[new Float32Array(attributeData.offsets), 3]} />
          <instancedBufferAttribute attach="attributes-orientation" args={[new Float32Array(attributeData.orientations), 4]} />
          <instancedBufferAttribute attach="attributes-stretch" args={[new Float32Array(attributeData.stretches), 1]} />
          <instancedBufferAttribute attach="attributes-halfRootAngleSin" args={[new Float32Array(attributeData.halfRootAngleSin), 1]} />
          <instancedBufferAttribute attach="attributes-halfRootAngleCos" args={[new Float32Array(attributeData.halfRootAngleCos), 1]} />
        </instancedBufferGeometry>

        <mountainMaterial 
          ref={materialRef}
          map={texture} 
          alphaMap={alphaMap} 
          toneMapped={false} 
          uCircle={uCircle} 
          uRadius={uRadius}
          uHole={uHole}
          uHoleRadius={uHoleRadius}
          uSquareHole={uSquareHole}
          uSquareSize={new THREE.Vector2(uSquareSize.x, uSquareSize.y)}
          tipColor={new THREE.Color(0.0, 0.8, 0.0).convertSRGBToLinear()}
          bottomColor={new THREE.Color(0.0, 0.1, 0.0).convertSRGBToLinear()}     

          uFogNear={THR.scene.fog &&THR.scene.fog.near}
          uFogFar={THR.scene.fog &&THR.scene.fog.far}
          uFogColor={THR.scene.fog && new THREE.Color(THR.scene.fog.color.r, THR.scene.fog.color.g, THR.scene.fog.color.b).convertSRGBToLinear()}
        />

      </mesh>
    
      
        <mesh position={[0, 0, 0]} ref={groundRed} geometry={groundGeo.geo} scale={1} >
          <meshStandardMaterial attach="material" color={groundColor} flatShading={true} side={THREE.DoubleSide} />
        </mesh>        

    </group>
  )
}

function getAttributeData(uInstances, uWidth, uFlat) {
  const width = uWidth;
  const flat = uFlat;
  const offsets = []
  const orientations = []
  const stretches = []
  const halfRootAngleSin = []
  const halfRootAngleCos = []

  let quaternion_0 = new THREE.Vector4()
  let quaternion_1 = new THREE.Vector4()

  //The min and max angle for the growth direction (in radians)
  const min = -0.25
  const max = 0.25

  //For each instance of the grass blade
  for (let i = 0; i < uInstances; i++) {
    //Offset of the roots
    const offsetX = Math.random() * width - width / 2
    const offsetZ = Math.random() * width - width / 2
    const offsetY = getYPosition(offsetX, offsetZ, flat)
    offsets.push(offsetX, offsetY, offsetZ)

    //Define random growth directions
    //Rotate around Y
    let angle = Math.PI - Math.random() * (2 * Math.PI)
    halfRootAngleSin.push(Math.sin(0.5 * angle))
    halfRootAngleCos.push(Math.cos(0.5 * angle))

    let RotationAxis = new THREE.Vector3(0, 1, 0)
    let x = RotationAxis.x * Math.sin(angle / 2.0)
    let y = RotationAxis.y * Math.sin(angle / 2.0)
    let z = RotationAxis.z * Math.sin(angle / 2.0)
    let w = Math.cos(angle / 2.0)
    quaternion_0.set(x, y, z, w).normalize()

    //Rotate around X
    angle = Math.random() * (max - min) + min
    RotationAxis = new THREE.Vector3(1, 0, 0)
    x = RotationAxis.x * Math.sin(angle / 2.0)
    y = RotationAxis.y * Math.sin(angle / 2.0)
    z = RotationAxis.z * Math.sin(angle / 2.0)
    w = Math.cos(angle / 2.0)
    quaternion_1.set(x, y, z, w).normalize()

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1)

    //Rotate around Z
    angle = Math.random() * (max - min) + min
    RotationAxis = new THREE.Vector3(0, 0, 1)
    x = RotationAxis.x * Math.sin(angle / 2.0)
    y = RotationAxis.y * Math.sin(angle / 2.0)
    z = RotationAxis.z * Math.sin(angle / 2.0)
    w = Math.cos(angle / 2.0)
    quaternion_1.set(x, y, z, w).normalize()

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1)

    orientations.push(quaternion_0.x, quaternion_0.y, quaternion_0.z, quaternion_0.w)

    //Define variety in height
    if (i < uInstances / 3) {
      stretches.push(Math.random() * 1.8)
    } else {
      stretches.push(Math.random())
    }
  }

  return {
    offsets,
    orientations,
    stretches,
    halfRootAngleCos,
    halfRootAngleSin,
  }
}

function multiplyQuaternions(q1, q2) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w
  return new THREE.Vector4(x, y, z, w)
}

function getYPosition(x, z, flat) {
  var y = 2 * simplex.noise2D(x / 50, z / 50) * flat // flat *0
  y += 4 * simplex.noise2D(x / 100, z / 100) * flat // flat *0
  y += 0.2 * simplex.noise2D(x / 10, z / 10) * flat // flat *0
  return y
}
