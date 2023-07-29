import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { kanas } from './constants'

export const gameStates = {
  MENU: 'MENU',
  GAME: 'GAME',
  GAME_OVER: 'GAME_OVER',
}

export const playAudio = (
  path: string,
  callback?: {
    (): void
    (): void
    (): void
    (): void
    (this: HTMLAudioElement, ev: Event): any
  }
) => {
  const audio = new Audio(`./sounds/${path}.mp3`)
  if (callback) {
    audio.addEventListener('ended', callback)
  }
  audio.play()
}

export const generateGameLevel = ({ nbStages }: { nbStages: number }) => {
  const level = []
  const goodKanas: {
    name: string
    character: { hiragana: string; katakana: string }
    dakuten: boolean
    handakuten: boolean
    combination: boolean
  }[] = []

  for (let i = 0; i < nbStages; i++) {
    const stage: any[] = []
    const nbOptions = 3 + i
    for (let j = 0; j < nbOptions; j++) {
      let kana = null
      while (!kana || stage.includes(kana) || goodKanas.includes(kana)) {
        kana = kanas[Math.floor(Math.random() * kanas.length)]
      }
      stage.push(kana)
    }
    const goodKana = stage[Math.floor(Math.random() * stage.length)]
    goodKana.correct = true
    goodKanas.push(goodKana)
    level.push(stage)
  }
  return level
}

export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    level: null,
    currentStage: 0,
    currentKana: null,
    lastWrongKana: null,
    mode: 'hiragana',
    gameState: gameStates.GAME,
    wrongAnswers: 0,
    startGame: ({ mode }) => {
      const level = generateGameLevel({ nbStages: 5 })
      const currentKana = level[0].find((kana) => kana.correct)
      playAudio('start', () => {
        playAudio(`kanas/${currentKana.name}`)
      })
      set({
        level,
        currentStage: 0,
        currentKana,
        gameState: gameStates.GAME,
        mode,
        wrongAnswers: 0,
      })
    },
    nextStage: () => {
      set((state: { currentStage: number; level: string | any[] }) => {
        if (state.currentStage + 1 === state.level.length) {
          playAudio('congratulations')
          return {
            currentStage: 0,
            currentKana: null,
            level: null,
            gameState: gameStates.GAME_OVER,
            lastWrongKana: null,
          }
        }
        const currentStage = state.currentStage + 1
        const currentKana = state.level[currentStage].find(
          (kana: { correct: any }) => kana.correct
        )
        playAudio('good')
        playAudio(`correct${currentStage % 3}`, () => {
          playAudio(`kanas/${currentKana.name}`)
        })
        return { currentStage, currentKana, lastWrongKana: null }
      })
    },
    goToMenu: () => {
      set({
        gameState: gameStates.MENU,
      })
    },
    kanaTouched: (kana: { name: any }) => {
      const currentKana = get().currentKana
      if (currentKana.name === kana.name) {
        get().nextStage()
      } else {
        playAudio('wrong')
        playAudio(`kanas/${kana.name}`, () => {
          playAudio('fail')
        })
        set((state: { wrongAnswers: number }) => ({
          wrongAnswers: state.wrongAnswers + 1,
          lastWrongKana: kana,
        }))
      }
    },
    // CHARACTER CONTROLLER
    characterState: 'Idle',
    setCharacterState: (characterState: any) =>
      set({
        characterState,
      }),
  }))
)
