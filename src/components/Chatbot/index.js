import React, { Component, Fragment } from 'react';
import ChatBot from '../../chatbotHack';
import ColorBlob from '../ColorBlob';
import blob from './blob.png'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';
import { archsLowercase } from '../NewOrEditDream/archetypes';

let nlp = require('compromise');
let otherwise = [
  `A little bird once told me, "The unconscious pushes us into one suffering after another, 
    one impossible mess after another, 
    until we are finally willing to wake up, 
    see that it is we who are choosing these impossible paths, 
    and take responsibility for our own decisions."`,
  'Can you elaborate on that?',
  `The unconscious has the habit of borrowing images from an external situation,
    and using those images to symbolize something that is going on within the dreamer.`,
  `What do you think is the central message your dream is trying to communicate?`,
  `How will you integrate your dream experience into your conscious, waking life?`,
  `How interesting, let's explore that a little further. Please continue...`,
  `Remember, archetypes are only forms with which we populate our psyche.`,
  `One would do well to treat every dream as though it was a completely unknown project, 
    look at it from all sides, take it in one’s hand, carry it around, 
    and let one’s imagination play around with it`,
  `Hmmm... tell me more.`,
  `When we sleep and dream, episodic memory is disconnected; 
    therefore, we cannot recall the specific event, but the emotional context of that event, 
    if unresolved, comes to the surface to be processed.`,
  `Dreams convey specific and appropriately timed messages, 
    which can assist the dreamer with problem-solving, artistic inspiration, 
    psychological development and spiritual deepening, and they are important for healing.`,
  `Knowing your own darkness is the best method for dealing with the darknesses of other people.`,
  `Oh my! Now I am deeply intrigued! Go on, do tell...`,
  `We cannot change anything until we accept it. Condemnation does not liberate, it oppresses.`,
  `Well then, anything else?`,
  `Have you told anyone else about this?`,
  `I do not understand, can you explain that a little more simply?`,
  `Can you explain that a little more?`,
  `Could you perhaps say the same thing in a different way, tying it back into your dream?`,
  `What causes you to say that?`,
  `A wise old sorceress said something similar to me once. I'm sorry, what else were saying, about your dream?`,
  `Isn't there a Greatful Dead song about that?`,


];
let deepArch = "";
let deepArchQuestions = [
  `Tell me more about the %.`,
  `How do the properties of the % relate to the % itself?`,
  `What is existence for a %, or what does it mean for a % to be?`,
  `What constitutes the identity of a %?`,
  `What other types of % can you think of, and how do they compare to the % from your dream?`,
  `What if I told you that no % can be separated from the person who dreams it?`,
  `Which parts of your inner self does the % relate to?`,
  `Does the % have any qualties you might interpret as moral or ethical elements?`,

]

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

  deepArchQuestionMaker = (archetype) => {
    let currentPhrase = deepArchQuestions.shift();
    deepArchQuestions.push(currentPhrase);
    currentPhrase = currentPhrase.replace(/%/gi, archetype);
    return `${currentPhrase}`;
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
        "why (is|was|does|are) the? #Adjective? #Archetype #Adjective? #Adverb? #Verb #Adverb?" : 'WhyArch',
        "the #Archetype (is|are|was|were) #Adjective?" : "ArchDescription",
        "(i|i'm) (not|don't|can't|do not) (know|sure|remember|recall)" : "IDunno",
        "i dunno" : "IDunno",
      }
    }
    nlp.plugin(plugin)
    let doc = nlp(input)
    let people = doc.people().firstNames().out('topk')
    
    // here is where all the conversations are templated
    if(doc.has('i #Adverb? (am|feel|feeling) like? a? #Noun? #Adverb? #Adjective?')){
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
    else if(doc.has(`#IDunno`)){
      return `Well perhaps you can think about it overnight, and get back to me tomorrow. What else about the dream?`
    }
    else if(doc.has('#SelfDefeat')){
      let whichICant = doc.match('#SelfDefeat').normalize().out('normal');
      return `Don't worry. It's okay, ${whichICant} either.`;
    } 
    else if(doc.has('#LoginIssue')){
      let whichSoftware = doc.match('#Software').setPunctuation("").out('normal');
      return `Are you trying to log in to ${whichSoftware}, or is ${whichSoftware} trying to log in to you?`;
    } 
    else if(doc.has('#Person')){
      return `Perhaps ${people[0].normal} appearing in your dream represents a quality of ${people[0].normal} you see in yourself?`
    } 
    else if(doc.has('#Duration')){
      let duration = doc.match(`#Value #Duration`).out('normal');
      return `hmmm, during that ${duration}, what kind of experiences did you have?`
    }
    else if(doc.has('#Place')){
      let whichPlace = doc.match(`#Place`).out('normal');
      return `${whichPlace}... have you had many meaningful experiences there?`
    } 
    else if(doc.has('what does the fox say')){
      return `Jakachachachacha-chow! Chacha-cha cha-cha cha-chow! 
      Cha cha-cha cha-cha cha-chow! What does the fox say!`
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
    else if(doc.has('#ArchDescription')){
      let descriptionVerb = doc.match('#Verb').out('normal');
      let arch = doc.match('#Archetype').out('normal');
      let adj = doc.match('#Adjective').out('normal')
      return `Why ${descriptionVerb} the ${arch} so ${adj}?`;
    } 
    else if(doc.has(`(${archetypesOpts})`)){
      deepArch = doc.match('#Archetype').out('normal');
      let currentPhrase = this.deepArchQuestionMaker(deepArch);
      return `${currentPhrase}`;
    } 
    else {
      let currentPhrase = otherwise.shift();
      otherwise.push(currentPhrase);
      return `${currentPhrase}`;
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
