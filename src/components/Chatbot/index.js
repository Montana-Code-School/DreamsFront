import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      steps: [
        {
          id: '1',
          message: 'What is your name?',
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          message: 'Hi {previousValue}, nice to meet you!',
          end: true,
        },
      ]
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