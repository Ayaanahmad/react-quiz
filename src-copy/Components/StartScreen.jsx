import React from 'react'

const StartScreen = ({numOfQuestions, dispatch}) => {
  return (
    <div className='start'>
      <h2>Welcome to the React Quiz</h2>
      <h3>{numOfQuestions} questions to test your react mastery</h3>
      <button className='btn btn-ui' onClick={() => dispatch({type: "start", status: "active"})}>Let's Start</button>
    </div>
  )
}

export default StartScreen
