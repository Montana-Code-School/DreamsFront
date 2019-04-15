import React, { Component } from 'react';
import ChatBot from '../../chatbotHack';
import ColorBlob from '../ColorBlob';
import { ThemeProvider } from 'styled-components';
import blob from './blob.png'
import styled from 'styled-components';

let nlp = require('compromise');

const theme = {
  background: 'transparent',
  fontFamily: 'Helvetica Neue',
  headerBgColor: 'rgba(255,255,255,0.3)',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      steps: [
        {
          id: '1',
          message: `Tell me about your dream? I see that your dream contains several archetypes: ${this.propHandler(props)}`,
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
    console.log("props ", props.location.state);
    let passedArchs = props.location.state;
    let archString = "";
    for (let i = 0; i < passedArchs.length; i++) {
      if (i === passedArchs.length-1){
        archString += "and " + passedArchs[i] + "."
      } else {
        archString += passedArchs[i] + ", ";
      }
      
    }
    return archString;
  }

  elizaBot = (input) =>{
    const plugin = {
      words:{
        'facebook': 'Software',
        'google': 'Software',
        'salesforce': 'Software'
      },
      patterns:{
        "how do? i (can|should)? (log|sign|get) into my? #Software" : 'LoginIssue',
        "i can't (log|sign|get) into my? #Software" : 'LoginIssue',
        "#Software won't let me (log|sign|get) in" : 'LoginIssue',
      }
    }
    nlp.plugin(plugin)
    let doc = nlp(input)
    const archetypesOpts = this.props.location.state.join('|');
    //templates
    if(doc.has('i #Adverb? (am|feel) #Adverb? #Adjective')){
        let feeling = doc.match('i #Adverb? am #Adverb? [#Adjective]').out('normal');
        return `When did you become ${feeling}?`;
    } else if(doc.has(`(${archetypesOpts})`)){
        let whichArch = doc.match(`(${archetypesOpts})`).out('normal')
        return `Why don't you tell me more about the ${whichArch}.`
    } else if(doc.has('#LoginIssue')){
        let whichSoftware = doc.match('#Software').out('normal')
        return `OK, just delete ${whichSoftware}`
    } else {
        return 'can you elaborate on that?'
    }
  }
  
  render() {
    console.log("voice from state ", this.state.voice)
    return(
      <div>
        <ThemeProvider theme={theme}>
        <ChatBot
          botAvatar={`${blob}`}
          steps={this.state.steps} 
          headerTitle="Shaman says..."
          recognitionEnable={true}
          speechSynthesis={{ enable: true, lang: 'en'}}
        />
        </ThemeProvider>
        <BlobInputContainerSS>
          <ColorBlob/>
        </BlobInputContainerSS>
      </div>
    )
  }
}

const BlobInputContainerSS = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

export default Chat;