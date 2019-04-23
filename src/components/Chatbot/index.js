import React, { Component, Fragment } from 'react';
import ChatBot from '../../chatbotHack';
import ColorBlob from '../ColorBlob';
import blob from './blob.png'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';
import { archsLowercase } from '../NewOrEditDream/archetypes';

let nlp = require('compromise');

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      steps: [
        {
          id: '1',
          message: `Tell me about your dream... I see that your dream contains ${props.location.state.length === 1 ? "an archetype: " : "several archetypes: "}${!!props ? this.propHandler(props) : "oh wait there aren't any archetypes in your dream"}`,
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          message: ({ previousValue, steps }) => {return this.elizaBot(previousValue)},
          trigger: '2',
        },
      ]
    }
  }

  propHandler = (props) => {
    let passedArchs = props.location.state;
    let archString = "";
    for (let i = 0; i < passedArchs.length; i++) {
      if (i > 0 && i === passedArchs.length-1){
        archString += "and " + passedArchs[i] + ".";
      } else if (passedArchs.length === 1) {
        archString += passedArchs[i] + ".";
      } else {
        archString += passedArchs[i] + ", ";
      }
    }
    return archString;
  }

  elizaBot = (input) =>{
    const archetypesOpts = this.props.location.state.join('|');
    const archsWords = this.props.location.state.reduce((a, key) => Object.assign(a, { [key]: "Archetype" }), {});
    const plugin = {
      words:{
        ...archsWords,
        'facebook': 'Software',
        'google': 'Software',
        'salesforce': 'Software',
        "i can't" : 'iCant',
      },
      patterns:{
        "how (can|should|do)? i (can|should)? (log|login|sign|get) (in|into|to) my? #Software" : 'LoginIssue',
        "i can't (log|sign|get) into my? #Software" : 'LoginIssue',
        "#iCant (log|login|sign|get) (in|into) my? #Software" : 'LoginIssue',
        "#Software won't let me (log|sign|get) in" : 'LoginIssue',
        "what does the? #Archetype mean" : 'Question',
        "i can't *" : 'SelfDefeat',
        "i #Verb (the|a) #Archetype" : 'VerbTheArch',
        "why (is|was|does|are) the? #Archetype #Adjective? #Adverb? #Verb #Adverb?" : 'WhyArch',
      }
    }
    nlp.plugin(plugin)
    let doc = nlp(input)
    let people = doc.people().firstNames().out('topk')
    
    // here to render is where all the conversations are templated
    if(doc.has('i #Adverb? (am|feel|feeling) #Adverb? #Adjective')){
      let feeling = doc.match('i #Adverb? am #Adverb? [#Adjective]').out('normal');
      return `When did you become ${feeling}?`;
    } 
    else if(doc.has('#Question')){
      let archQuest = doc.match(`(${archetypesOpts})`).out('normal')
      return `That is for you and you alone to decide. 
        There are many mysteries surrounding ${archQuest},
        and all we really can know is that it represents ${archsLowercase[archQuest]}.
        What do you think about that?`
    } 
    else if(doc.has('#SelfDefeat')){
      let whichICant = doc.match('#SelfDefeat').normalize().out('normal');
      return `Don't worry. It's okay, ${whichICant} either.`;
    } 
    else if(doc.has('#LoginIssue')){
      let whichSoftware = doc.match('#Software').out('normal');
      return `That's okay, you're probably better off not using ${whichSoftware} anyway`;
    } 
    else if(doc.has('#Person')){
      return `How do you know ${people[0].normal}?`
    } 
    else if(doc.has('#Place')){
      let whichPlace = doc.match(`#Place`).out('normal');
      return `${whichPlace}... have you had many meaningful experiences there?`
    } 
    else if(doc.has('what does the fox say')){
      return `Jacha-chacha-chacha-chow! Chacha-cha cha-cha cha-chow! 
      Cha cha-cha cha-cha cha-chow! What does the fox say!`
    }
    else if(doc.has(`i don't know`)){
      return `Well perhaps you can think about it overnight, and get back to me tomorrow. Is there anything you do know for sure?`
    }
    else if(doc.has('#WhyArch')){
      let whichVerb = doc.match('#Verb').out('normal').split(" ");
      let whichArch = doc.match('#Archetype').out('normal');
      let whichAdjective = doc.match('#Adjective').setPunctuation("").out('normal'); 

      if (whichAdjective){
        return `The ${whichArch} is ${whichAdjective} because the old Gods deemed it so.`
      } else if (whichVerb) {
        return `The ${whichArch} ${whichVerb[0]} ${whichVerb[1]} simply because it can.`
      }
    }
    else if(doc.has('#VerbTheArch')){
      let whichVerb = doc.verbs().out('normal');
      let whichArch = doc.match('#Archetype').out('normal')
      return `You ${whichVerb} the ${whichArch}?`;
    }
    else if(doc.has(`(${archetypesOpts})`)){
      let whichArch = doc.match(`(${archetypesOpts})`).out('normal');
      return `Tell me more about the ${whichArch}.`;
    } 
    else {
      return 'can you elaborate on that?'
    }
  }
  
  render() {
    return(
      <Fragment>
        <BlobInputContainerSS>
          <ColorBlob/>
        </BlobInputContainerSS>
        <ChatbotContentS>
          <ChatBot
            botAvatar={`${blob}`}
            steps={this.state.steps} 
            headerTitle={"Shaman says"}
            recognitionEnable={true}
            speechSynthesis={{ enable: true, lang: 'en'}}
          />
          <br />
          <Link
            to={ROUTES.DREAM_ARCHIVE}
          >Go Back to Dream Archive</Link>
        </ChatbotContentS>
      </Fragment>
    )
  }
}

const ChatbotContentS = styled.div`
  position: relative;
`

const BlobInputContainerSS = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

export default Chat;
