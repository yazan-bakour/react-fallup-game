import { ContactShadows, Environment } from '@react-three/drei'
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from '@react-three/rapier'
import { Stage } from './Stage'

import { CharacterController } from "./CharacterController";

export const Experience = () => {
  return (
    <>
      {/* LIGHTS */}
      <Environment preset='sunset' />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3}
        castShadow
        color={'#9e69da'}
      />

      <group position-y={-1}>
        {/* FLOOR */}
        <RigidBody colliders={false} type='fixed' name='void'>
          <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color='#e3daf7' toneMapped={false} />
          </mesh>
          <CuboidCollider position={[0, -3.5, 0]} args={[50, 0.1, 50]} sensor />
        </RigidBody>

        <ContactShadows
          frames={1}
          position={[0, -0.88, 0]}
          scale={80}
          opacity={0.42}
          far={50}
          blur={0.8}
          color={'#aa9acd'}
        />

        {/* STAGE */}
        <Stage position-y={-0.92} />
        <RigidBody
          colliders={false}
          type='fixed'
          position-y={-0.5}
          friction={2}>
          <CylinderCollider args={[1 / 2, 5]} />
        </RigidBody>

        {/* CHARACTER */}
        <CharacterController />
      </group>
    </>
  )
}
