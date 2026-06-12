import { GroqAIAdapter } from './src/lib/groq';
import { LocalAIAdapter } from './src/lib/adapters';

const dummyPassage = {
    id: '1',
    book: 'John',
    chapter: 11,
    verseStart: 35,
    verseEnd: 35,
    text: 'Jesus wept.',
    translation: 'KJV',
    reference: 'John 11:35'
};

const local = new LocalAIAdapter();
local.generateReflection(dummyPassage, 'gentle').then(res => {
    console.log("Local response:");
    console.log(res);
});

const groq = new GroqAIAdapter();
groq.generateReflection(dummyPassage, 'gentle').then(res => {
    console.log("Groq response:");
    console.log(res);
});
