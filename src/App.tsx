import { Suspense, useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/rune.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GameState } from './logic.ts'

import {
  KeyboardControls,
  Loader,
  useFont,
  useProgress,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CylinderCollider, Physics, RigidBody } from '@react-three/rapier'
import { Stage } from './components/Stage.tsx'
import { Experience } from './components/Experience.tsx'

export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
}

function App() {
  const [game, setGame] = useState<GameState>()

  const { progress } = useProgress()

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ],
    []
  )

  useEffect(() => {
    Rune.initClient({
      onChange: (e) => {
        console.log(e)
        setGame(e.newGame)
      },
    })
  }, [])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas
          style={{
            height: '100%',
            width: '100%',
          }}
          shadows
          camera={{ position: [0, 50, 5], fov: 42, near: 0.3, far: 500 }}>
          <color attach='background' args={['#e3daf7']} />
          <Suspense>
            <Physics>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>

        <Loader />
      </KeyboardControls>
    </>
  )
}

export default App
