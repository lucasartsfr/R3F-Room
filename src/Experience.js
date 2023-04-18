import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })
// Install LEVA for Debug
import { OrbitControls, TransformControls, PivotControls, Html, Text, Text3D,  Sky, Float, MeshReflectorMaterial, Stars, useTexture, useCubeTexture, useProgress, useGLTF, BakeShadows, softShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Environment, Lightformer} from '@react-three/drei';
import { useRef } from 'react';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

// softShadows({frustum : 3.75, size : 0.005, near : 0.2, samples : 17, rings : 11});


export default function Experience() {


  // Debug With Leva
    const { position, color, visible, Interval } = useControls("Test",
      {  
        position: {
          value : {x : 0, y : 0},
          step : 0.1
        },
        color : "#ff0000",
        visible : true,
        Interval : { min : 0, max : 10, value : [4, 5]},
        click : button(() => {console.log('ok')}),
        choice : {options : ['a', 'b','c','d']},
        scale : {value : 1, step : 0.1, min : 0, max : 5}
      })

      const { sunPositions } = useControls("Sun",      {  
        sunPositions: {
          value : {x : 1, y : 2, z : 3},
          step : 0.1
        },
      })


  //const { camera, gl } = useThree()
  const cube = useRef();
  const sphere = useRef();
  const light = useRef();
  const envMapIntensity = 2;

  return (
    <>            
      {/* <color args={['ivory']} attach="background" /> */}

      <Perf position="top-left"/>
    
      {/* <AccumulativeShadows position={[0,-0.99,0]} scale={10} color='#316d39' opacity={1} frames={300} temporal blend={100}>
        <RandomizedLight position={[1, 2, 3]} amount={8} radius={1} ambient={0.5} intensity={1} bias={0.001} />
      </AccumulativeShadows> */}

      {/* <ContactShadows position={[0, -0.99, 0]} scale={10} resolution={512} far={5} blur={5} opacity={1} frames={1}/> */}

      {/* <BakeShadows /> */}      

      {/* <Sky castShadow sunPosition={[sunPositions.x, sunPositions.y, sunPositions.z]} /> */}

      <Environment
      background
        // files={[
        //   './environmentMaps/2/px.jpg',
        //   './environmentMaps/2/nx.jpg',
        //   './environmentMaps/2/py.jpg',
        //   './environmentMaps/2/ny.jpg',
        //   './environmentMaps/2/pz.jpg',
        //   './environmentMaps/2/nz.jpg',
        // ]}

        files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
        preset='night'
        // resolution={32}
        ground={{height: 7, radius:28, scale: 100}} // Fix Offset with position-y of each object
      >
        {/* <Lightformer position-z={-5} color="red" intensity={10} scale={5} form="ring"/> */}
      </Environment>

      
      <OrbitControls makeDefault />

      <directionalLight ref={light} castShadow position={[sunPositions.x, sunPositions.y, sunPositions.z]} shadow-normalBias={0.04} intensity={1.5} shadow-mapSize={[1024, 1024]} />
      <ambientLight intensity={0.5} />


    {/* Pivot Circle */}
      {/* <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={4}
            axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
            scale={100}
            fixed={true}
          >
            <mesh castShadow position-x={position.x} position-y={-position.y} ref={sphere}>
              <Html
                position={[1, 1, 0]}
                wrapperClass="label"
                center
                distanceFactor={8}
                occlude={[sphere, cube]}
              >
                That's a sphere 👍
              </Html>
              <sphereGeometry />
              <MeshReflectorMaterial
                resolution={512}
                blur={[1000, 1000]}
                mixBlur={1}
                mirror={0.5}
                color={color}
              />
            </mesh>
          </PivotControls> */}

      {/* Circle */}
        <mesh castShadow position-x={position.x} position-y={-position.y} ref={sphere}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
        </mesh>



      {/* Plane */}
      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.8}
          color="greenyellow"
        /> */}
         <meshStandardMaterial
          color="greenyellow"
          // envMapIntensity={envMapIntensity}
          envMapIntensity={envMapIntensity}
        />
      </mesh>

      <Html>
        <div className="container">
          <h1>React Three Fiber</h1>
          <p>3D in React</p>
        </div>
      </Html>


      <Float speed={5} floatIntensity={2}>
        <Text
          font="./bangers-v20-latin-regular.woff"
          color={'black'}
          fontSize={1}
          // position={[0, 2, 0]}
          position-y={2}
          // maxWidth={2}
          textAlign="center"
        >
          Test
          <meshNormalMaterial />
        </Text>
      </Float>

        
    </>
  )
}
