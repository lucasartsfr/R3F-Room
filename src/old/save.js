
{/* <CustomMask id={2} position={[0, 5.25, -6]} innerSize={1.8} outerSize={2.2} segments={24} axis={true} /> */}


       {/* GALAXY MASK */}
       {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false}>
        <Mask id={3} position={[0,5,-6]} rotation={[0,0,0]} depthWrite={false}>
          <sphereGeometry attach="geometry" args={[3, 24, 10, 0, Math.PI]} />
        </Mask>
      </PivotControls> */}

             {/* Load Environment */}
        {/* <Environment
          background
            files={[
              './environmentMaps/2/px.jpg',
              './environmentMaps/2/nx.jpg',
              './environmentMaps/2/py.jpg',
              './environmentMaps/2/ny.jpg',
              './environmentMaps/2/pz.jpg',
              './environmentMaps/2/nz.jpg',
            ]}
            // files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
            preset='night'
            resolution={32}
            ground={{height: 7, radius:28, scale: 100}} // Fix Offset with position-y of each object
          >
          <Lightformer position-z={-5} color="red" intensity={10} scale={5} form="ring"/>
        </Environment> */}

      {/* Load Element */}


          {/* <directionalLight
        ref={lightRef}
        //castShadow
        position={[-5, 8, -5]}
        intensity={1.5}
        // shadow={{ normalBias: 0.05 }}
        //shadow-normalBias={0.04}
        target-position={[-10,2.5,10]}
      /> */}

      {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[false, false, false]}  depthTest={false}>
        <Grass options={{bW: 0.12, bH: 1, joints: 5}} width={50} instances={50000} flat={0} groundColor="#361b11" segments={24} stencilCheck={true}/>  
      </PivotControls> */}
       


    //   const { uBigWavesElevation,
    //     uWavesFrequency,
    //     uWavesSpeed,
    //     uColorOffset,
    //     uColorMultiplier,
    //     uDetails,
    //     uSmallWavesElevation,
    //     uSmallWavesFrequency,
    //     uSallWavesSpeed,
    //     uDepthColor,
    //     uSurfaceColor,
    //     cSize,
    //     cSegment,
    //     uRadius,
    //     uCircle,
    //     uHoleRadius,
    //     uHole,
    //     uSquareHole,
    //     uSquareSize } = useControls("Water",
    //  {  
    //    uBigWavesElevation : {value : 0.1, step : 0.01, min : 0, max : 3},
    //    uWavesFrequency : {
    //         value : {x : 1.4, y : 0.7},
    //         step : 0.1
    //     },
    //    uWavesSpeed : {value : 0.75, step : 0.01, min : -3, max : 3},
    //    uColorOffset : {value : 0.22, step : 0.01, min : 0, max : 1},
    //    uColorMultiplier : {value : 2.6, step : 0.01, min : 0, max : 5},
    //    uDetails : {value : 2, step : 1, min : 0, max : 10},
    //    uSmallWavesElevation : {value : 0.15, step : 0.01, min : 0, max : 3},
    //    uSmallWavesFrequency : {value : 0.95, step : 0.01, min : 0, max : 10},
    //    uSallWavesSpeed : {value : 1.0, step : 0.01, min : 0, max : 3},
    //    uDepthColor : "#3da8ff",
    //    uSurfaceColor : "#ebebeb",
    //    cSize : {value : 80, step : 0.5, min : 0, max : 200},
    //    cSegment : {value : 128, step : 2, min : 4, max : 2048},
    //    uCircle : false,
    //    uRadius : {value : 50.0, step : 0.1, min : 1.0, max : 100.0},        
    //    uHole : false,
    //    uSquareHole : false,
    //    uSquareSize : {
    //      value : {x : 0.5, y : 0.5},
    //      step : 0.05
    //    },
    //    uHoleRadius : {value : 16.0, step : 0.1, min : 1.0, max : 50.0},    
    //  })

    
  // const scene = useRef()
  // const { camera } = useThree()
  // useFrame(({ gl }) => void ((gl.autoClear = true), gl.clearDepth(),gl.render(scene.current, camera)), render)
  //  ref={scene}