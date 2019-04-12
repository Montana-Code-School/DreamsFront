import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';

const steps = [
  {
    id: '0',
    message: 'Welcome to react chatbot!',
    trigger: '1',
  },
  {
    id: '1',
    user: true,
    trigger: '3',
  },
  {
    id: '3',
    message: 'Hi {previousValue}, nice to meet you!',
    end: true,
  },
];

class Chat extends Component {


  render() {
    return(
      <div>
        <p>Sup</p>
        <ChatBot 
          steps={steps} 
          headerTitle="Speech Recognition"
          recognitionEnable={true}
        />
      </div>
    )
  }
}

export default Chat;