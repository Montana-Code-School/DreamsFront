import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';

let nlp = require('compromise');

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      steps: [
        {
          id: '1',
          message: 'Tell me about your dream?',
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
          trigger: 2, 
        },
      ]
    }
  }

  

  elizaBot = (input) =>{
    let doc = nlp(input)
    console.log("elizaarch ", this.props.archetypes)
    const archetypesOpts = this.props.archetypes.join('|');
    console.log("archOPts", archetypesOpts)
    //our canned-templates
    if(doc.has('i #Adverb? (am|feel) #Adverb? #Adjective')){
        let feeling = doc.match('i #Adverb? am #Adverb? [#Adjective]').out('normal')
        return `When did you become ${feeling}?`
    } else if(doc.has(`(${archetypesOpts})`)){
      let whichArch = doc.match(`(${archetypesOpts})`).out('normal')
      return `Why don't you tell me about your ${whichArch}.`
    } else {
        return 'can you elaborate on that?'
    }
  }
  
  render() {
    console.log("steps prop ", this.props.steps);
    return(
      <div>
        <ChatBot
          steps={this.props.steps || this.state.steps} 
          headerTitle="Shaman says..."
          recognitionEnable={true}
          speechSynthesis={{ enable: true, lang: 'en'}}
        />
      </div>
    )
  }
}

export default Chat;