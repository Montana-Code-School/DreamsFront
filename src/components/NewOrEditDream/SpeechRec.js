import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import {
  DreamTextarea,
} from './styled';

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  startListening: PropTypes.func,
  stopListening: PropTypes.func
};

const Dictaphone = ({
  textAreaOnFocus,
  initialContent,
  handleChange,
  id,
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  startListening,
  stopListening,
  abortListening,
  finalTranscript,
  interimTranscript
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  
  const [content, setContent] = useState(initialContent);
  
  const handleLocalChange = (e) => {
    console.log("speech rec handlelocalchange", e.target.value);
    e.preventDefault();
    e.stopPropagation();
    setContent(e.target.value);
    handleChange(e);
  }

  const onLocalFocus = () => {
    resetTranscript();
    textAreaOnFocus();
  }

  useEffect(() => {
    console.log("effect called");
    setContent(content + finalTranscript + " ");
    resetTranscript();
  }, [finalTranscript]);

  return (
    <div>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <div>{interimTranscript}</div>
      <DreamTextarea
        onSubmit={ (e) => {e.preventDefault()}}
        type="textarea"
        rows="3"
        cols="25"
        name="content"
        id="DreamText"
        placeholder="Enter Dream Text (required)"
        onChange={e => this.handleChange(e)}
        onFocus={onLocalFocus}
        onBlur={stopListening}
        value={content}
        onChange={e => handleLocalChange(e)}
      />
    </div>
  );
};

const options = {
  autoStart: false
}

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(options)(Dictaphone);