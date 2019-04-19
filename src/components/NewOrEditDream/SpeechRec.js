import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import {
  DreamTextareaS,
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
  recognition,
  abortListening,
  listening,
  textAreaOnFocus,
  initialContent,
  handleChange,
  handleSpeechRec,
  resetTranscript,
  browserSupportsSpeechRecognition,
  startListening,
  stopListening,
  finalTranscript,
  interimTranscript
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const [content, setContent] = useState(initialContent);

  const handleLocalChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContent(e.target.value);
    handleChange(e);
  }

  const onLocalBlur = (e) => {
    stopListening();
    handleChange(e);
  }

  const onLocalFocus = () => {
    resetTranscript();
    textAreaOnFocus();
  }

  useEffect(() => {
    setContent(content + finalTranscript + " ");
    resetTranscript();
    handleSpeechRec(content);
  }, [finalTranscript]);

  useEffect(()=>{
    const cleanup = () => {
      // we need to call onend and abort to prevent state updates
      // if we navigate away from page while speech rec is running.
      recognition.onend = () => {};
      recognition.abort();
    };
    return cleanup;
  }, []);

  return (
    <div>
      <DreamTextareaS
        onSubmit={ (e) => {e.preventDefault()}}
        type="textarea"
        rows="3"
        cols="25"
        name="content"
        id="DreamText"
        placeholder="Enter Dream Text (required)"
        onFocus={onLocalFocus}
        onBlur={e => onLocalBlur(e)}
        value={content}
        onChange={e => handleLocalChange(e)}
      />
      <div>{interimTranscript}</div>
      {!listening && <button onClick={startListening}>Start Listening</button>}
      {listening && <button onClick={stopListening}>Stop Listening</button>}
    </div>
  );
};

const options = {
  autoStart: false,
  continuous: true,
}

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(options)(Dictaphone);
