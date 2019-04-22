import { isString } from './utils';

export const getSpeakText = step => {
  const { message, metadata = {} } = step;
  if (isString(metadata.speak)) {
    return metadata.speak;
  }
  if (isString(message)) {
    return message;
  }
  return '';
};

export const speakFn = speechSynthesisOptions => (step, previousValue) => {
  const { lang, enable } = speechSynthesisOptions;
  const { user } = step;

  if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
    return;
  }
  if (user) {
    return;
  }
  if (!enable) {
    return;
  }
  let text = getSpeakText(step);
  text = text.replace(/{previousValue}/g, previousValue);
  const sentences = text.split(",");
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i]
    let msg = new SpeechSynthesisUtterance(sentence)
    msg.rate=0.8;
    msg.pitch=2.0;
    msg.lang = lang;
    msg.voice = window.speechSynthesis.getVoices()[50];
    window.speechSynthesis.speak(msg)
  }
};
