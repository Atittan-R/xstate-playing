import './App.css';
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';
import { useState } from 'react';

import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';

const ENUM = {
  ClickStart: 'Click Start Recording',
  ClickStop: 'Click Stop Recording',
}
const toggleMachine = createMachine({
  id: "isRecording",
  initial: "stopRecording",
  states: {
    stopRecording: {
      on: {
        click: {
          target: "speechRecording",
        },
      },
    },
    speechRecording: {
      entry: "startRecording",
      exit: "stopRecording",
      invoke: {
        src: "recording",
        id: "recording",
      },
      after: {
        "30000": {
          target: "#isRecording.stopRecording",
          actions: [],
          internal: false,
        },
      },
      on: {
        click: {
          target: "stopRecording",
        },
      },
    },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
});

export const App = () => {
  const [time, setTime] = useState({
    active: false,
    duration: 10000
  })
  const [state, send] = useMachine(toggleMachine, {
    actions: {
      startRecording: () => {
        console.log("startRecording");
      },
      stopRecording: () => {
        console.log("stopRecording");
        setTime({ active: false })
      }
    },
    services: {
      recording: () => {
        setTime({ active: true })
        console.log("recording")
      }
    }
  });

  return (
    <div className='App'>
      <div>
        {state.value === 'speechRecording' ? 'Recording...' : `Not Recording...`}
      </div>
      <div>
        {
          state.value === 'speechRecording' && TimeCounterComponent(time)
        }

      </div>
      <button onClick={() => send('click')}> {state.value === 'speechRecording' ? ENUM.ClickStop : ENUM.ClickStart} </button>
    </div>
  );
};

const TimeCounterComponent = ({ active, duration }) => {

  return (
    <div>
      <Timer
        active={active}
        duration={duration}>
        <Timecode time={duration} />
      </Timer>
    </div>
  )
}
export default App;
