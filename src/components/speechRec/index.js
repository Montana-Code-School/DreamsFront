let nlp = require('compromise');

// let dino = nlp('dinosaur')
// let dinoStr = dino.nouns().toPlural().out('text')
// let dinoTags = dino.out('tags')
// console.log(dinoTags)

// let kids = nlp('Hey, teacher! leave those kids alone').match('those #Plural').out('text')
// console.log(kids)


  //declare new tags in a plugin,
  let doc = nlp('i went and saw Boston') //interprets this as a #Place
  //grab the one word..
  let word = doc.match('boston')
  //give it a new tag,
  word.tag('RockBand')
  //now this word can be found this way:
  doc.match('#RockBand').out('text');

  let plugin = {
    tags:{
      RockBand:{
      	isA: 'Organization'
      }
    }
  }

  nlp.plugin(plugin)
  //parse the document again
  doc = nlp('boston was loud')
  //grab the word, and tag it
  doc.match('boston').tag('RockBand')
  //see if it's still a #Place now
  return doc.match('#Place').length
