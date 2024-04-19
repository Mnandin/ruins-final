import React,{ useState, useRef, useEffect } from 'react'
import React, { useState, useRef } from 'react'
import React, { useState, useRef } from 'react'
import { Box, OrbitControls } from '@react-three/drei'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { Cylinder } from '@react-three/drei'
import GirlController from '../character/GirlController'
// import Box1 from './box';

export default function Experience() {
  const [hover, setHover] = useState(false)
  const cube = useRef()
  const jump = () => {
    cube.current.applyImpulse({ x:0, y:7, z:0 });
  };
  useEffect(() => {
    // 在客戶端渲染時初始化相關功能
    // 例如：設置事件監聽器，初始化動畫，等等
  }, []);
  
    cube.current.applyImpulse({ x: 0, y: 7, z: 0 })
  }

  return (
    <>
      <group>
        {/* LIGHT */}
        <OrbitControls />
        {/* <ambientLight intensity={1}/> */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          color={'#9e69da'}
        />
        {/* STAGE */}
        <RigidBody colliders={false} type="fixed" position-y={1}>
          <CylinderCollider args={[0.5, 13.5]} />
          <Cylinder scale={[13.5, 0.5, 13.5]} receiveShadow>
            <meshStandardMaterial color="white" />
          </Cylinder>
        </RigidBody>
        <RigidBody position={[6, 5, 0]} ref={cube}>
          <Box
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={jump}
          />
          <meshStandardMaterial color={hover ? 'hotpink' : 'royalblue'} />
          <group>
            {/* LIGHT */}
            <OrbitControls />
            <ambientLight intensity={1} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              castShadow
              color={'#9e69da'}
            />
            {/* STAGE */}
            <RigidBody colliders={false} type="fixed" position-y={0.5}>
              <CylinderCollider args={[1 / 2, 5]} />
              <Cylinder scale={[5, 1, 5]} receiveShadow>
                <meshStandardMaterial color="white" />
              </Cylinder>
            </RigidBody>
            <RigidBody position={[-2.5, 1, 0]}>
              <Box
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                // onClick={jump}
              >
                {/* <meshStandardMaterial color={hovered ? 'hotpink' : 'royalblue'} /> */}
              </Box>
            </RigidBody>
            {/* <RigidBody type="fixes" restitution={2}>
        <Box position={[0,4,0]} args={[10,1,10]}>
          <meshStandardMaterial color="springgreen"/>
        </Box>
      </RigidBody> */}
            <GirlController onPointerEnter={() => setHover(true)} />
          </group>
        </RigidBody>
        <GirlController onPointerEnter={() => setHover(true)} />
      </group>
    </>
  )
}
