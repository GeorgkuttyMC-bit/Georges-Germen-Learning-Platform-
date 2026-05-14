import React, { useState } from 'react';
import { BookA, Hash, BookHeart, MessageSquare, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const lettersData = [
  { letter: "A a", name: "Ah", explanation: "Pronounced like the 'a' in 'father'.", words: [{ de: "Apfel", en: "Apple" }, { de: "Auto", en: "Car" }] },
  { letter: "B b", name: "Bay", explanation: "Pronounced like the English 'b'.", words: [{ de: "Baum", en: "Tree" }, { de: "Buch", en: "Book" }] },
  { letter: "C c", name: "Tsay", explanation: "Before a, o, u or consonants, it is pronounced like 'k'. Before ä, e, i, ö, ü it's pronounced like 'ts'.", words: [{ de: "Computer", en: "Computer" }, { de: "Cent", en: "Cent" }] },
  { letter: "D d", name: "Day", explanation: "Pronounced like the English 'd', but at the end of a word it sounds like 't'.", words: [{ de: "Dorf", en: "Village" }, { de: "Dach", en: "Roof" }] },
  { letter: "E e", name: "Ay", explanation: "Pronounced like the 'ay' in 'say', but shorter.", words: [{ de: "Elefant", en: "Elephant" }, { de: "Eis", en: "Ice cream" }] },
  { letter: "F f", name: "Eff", explanation: "Pronounced like the English 'f'.", words: [{ de: "Fisch", en: "Fish" }, { de: "Fenster", en: "Window" }] },
  { letter: "G g", name: "Gay", explanation: "Pronounced like the hard 'g' in 'go'. At the end of a word, it often sounds like 'k' or 'ch'.", words: [{ de: "Garten", en: "Garden" }, { de: "Geld", en: "Money" }] },
  { letter: "H h", name: "Hah", explanation: "At the beginning of a word it's pronounced like 'h' in 'house'. After a vowel, it is silent and makes the vowel longer.", words: [{ de: "Haus", en: "House" }, { de: "Hund", en: "Dog" }] },
  { letter: "I i", name: "Ee", explanation: "Pronounced like the 'ee' in 'see'.", words: [{ de: "Igel", en: "Hedgehog" }, { de: "Insel", en: "Island" }] },
  { letter: "J j", name: "Yot", explanation: "Pronounced like the English 'y' in 'yes'.", words: [{ de: "Jacke", en: "Jacket" }, { de: "Jahr", en: "Year" }] },
  { letter: "K k", name: "Kah", explanation: "Pronounced like the English 'k'.", words: [{ de: "Katze", en: "Cat" }, { de: "Kind", en: "Child" }] },
  { letter: "L l", name: "Ell", explanation: "Pronounced like the English 'l'.", words: [{ de: "Lampe", en: "Lamp" }, { de: "Löwe", en: "Lion" }] },
  { letter: "M m", name: "Em", explanation: "Pronounced like the English 'm'.", words: [{ de: "Maus", en: "Mouse" }, { de: "Mond", en: "Moon" }] },
  { letter: "N n", name: "En", explanation: "Pronounced like the English 'n'.", words: [{ de: "Nase", en: "Nose" }, { de: "Nacht", en: "Night" }] },
  { letter: "O o", name: "Oh", explanation: "Pronounced like the 'o' in 'go', but slightly more rounded.", words: [{ de: "Opa", en: "Grandpa" }, { de: "Ohr", en: "Ear" }] },
  { letter: "P p", name: "Pay", explanation: "Pronounced like the English 'p'.", words: [{ de: "Papagei", en: "Parrot" }, { de: "Pilz", en: "Mushroom" }] },
  { letter: "Q q", name: "Koo", explanation: "Always followed by 'u' and pronounced like 'kv'.", words: [{ de: "Qualle", en: "Jellyfish" }, { de: "Quark", en: "Quark (dairy)" }] },
  { letter: "R r", name: "Err", explanation: "Usually pronounced from the back of the throat (guttural). After a vowel, it sounds more like a soft 'a'.", words: [{ de: "Regen", en: "Rain" }, { de: "Rose", en: "Rose" }] },
  { letter: "S s", name: "Ess", explanation: "Before a vowel, it is pronounced like the English 'z'. At the end of a word or before a consonant, it's pronounced like 's'.", words: [{ de: "Sonne", en: "Sun" }, { de: "Schuh", en: "Shoe" }] },
  { letter: "T t", name: "Tay", explanation: "Pronounced like the English 't'.", words: [{ de: "Tisch", en: "Table" }, { de: "Tür", en: "Door" }] },
  { letter: "U u", name: "Oo", explanation: "Pronounced like the 'oo' in 'boot'.", words: [{ de: "Uhr", en: "Clock" }, { de: "Uhu", en: "Eagle owl" }] },
  { letter: "V v", name: "Fow", explanation: "Usually pronounced like the English 'f'. In some foreign words, it is pronounced like 'v'.", words: [{ de: "Vogel", en: "Bird" }, { de: "Vater", en: "Father" }] },
  { letter: "W w", name: "Vay", explanation: "Pronounced like the English 'v'.", words: [{ de: "Wasser", en: "Water" }, { de: "Wald", en: "Forest" }] },
  { letter: "X x", name: "Iks", explanation: "Pronounced like 'ks'. Few German words start with X.", words: [{ de: "Xylofon", en: "Xylophone" }] },
  { letter: "Y y", name: "Uu-psi-lon", explanation: "Pronounced like the German 'ü' or like the English 'y' depending on the word.", words: [{ de: "Yoga", en: "Yoga" }, { de: "Yacht", en: "Yacht" }] },
  { letter: "Z z", name: "Tset", explanation: "Pronounced like 'ts', never like the English 'z'.", words: [{ de: "Zug", en: "Train" }, { de: "Zebra", en: "Zebra" }] },
  { letter: "Ä ä", name: "A-Umlaut", explanation: "Pronounced somewhat like the 'e' in 'best' or 'ay' in 'say'.", words: [{ de: "Äpfel", en: "Apples" }, { de: "Ärger", en: "Anger" }] },
  { letter: "Ö ö", name: "O-Umlaut", explanation: "Pronounced by shaping your lips for 'o' but saying 'e'. Similar to the 'i' in 'bird'.", words: [{ de: "Öl", en: "Oil" }, { de: "Öffnen", en: "To open" }] },
  { letter: "Ü ü", name: "U-Umlaut", explanation: "Pronounced by shaping your lips for 'u' but saying 'ee'. No exact English equivalent.", words: [{ de: "Über", en: "Over/About" }, { de: "Übung", en: "Exercise" }] },
  { letter: "ß", name: "Eszett", explanation: "Pronounced like a sharp 's'. Used only after long vowels or diphthongs. Never begins a word.", words: [{ de: "Straße", en: "Street" }, { de: "Fuß", en: "Foot" }] },
];

function LettersLesson() {
  const [selectedLetter, setSelectedLetter] = useState(lettersData[0]);

  const playPronunciation = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectLetter = (l: typeof lettersData[0]) => {
    setSelectedLetter(l);
    playPronunciation(l.letter.split(' ')[0]);
  };

  return (
    <div className="space-y-8 text-gray-700">
      <p className="text-lg">The German alphabet has 26 standard letters, plus three umlauts (ä, ö, ü) and one special consonant (ß).</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {lettersData.map((l) => (
          <button 
             key={l.letter}
             onClick={() => handleSelectLetter(l)}
             className={`w-12 h-12 flex items-center justify-center rounded-xl font-serif font-bold text-xl transition-all ${
                selectedLetter.letter === l.letter
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 shadow-sm'
             }`}
          >
             {l.letter.split(' ')[0]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={selectedLetter.letter}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="bg-orange-50/50 p-6 md:p-8 rounded-3xl border border-orange-100 mt-6"
        >
          <div className="flex items-end gap-4 mb-4">
            <h3 className="text-5xl font-serif font-bold text-orange-900">{selectedLetter.letter}</h3>
            <div className="flex items-center gap-3 pb-1">
              <span className="text-xl text-orange-700 font-medium pb-1">[{selectedLetter.name}]</span>
              <button 
                onClick={() => playPronunciation(selectedLetter.letter.split(' ')[0])}
                className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-colors shadow-sm"
                aria-label={`Play pronunciation for ${selectedLetter.letter}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-lg text-gray-800 mb-8">{selectedLetter.explanation}</p>
          
          <div className="space-y-3">
             <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-sm">Example Words</h4>
             {selectedLetter.words.map((w, i) => (
               <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                 <button
                   onClick={() => playPronunciation(w.de)}
                   className="p-2 -ml-2 rounded-full text-orange-500 hover:bg-orange-50 transition-colors"
                   aria-label={`Play pronunciation for ${w.de}`}
                 >
                   <Volume2 className="w-4 h-4" />
                 </button>
                 <span className="font-bold text-lg text-gray-900 w-1/2">{w.de}</span>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-600">{w.en}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const lessons = [
  {
    id: 'letters',
    title: 'The Alphabet',
    icon: <BookA className="w-5 h-5" />,
    description: 'Learn the German letters and their pronunciation.',
    content: <LettersLesson />
  },
  {
    id: 'numbers',
    title: 'Numbers',
    icon: <Hash className="w-5 h-5" />,
    description: 'Learn to count from zero to ten in German.',
    content: (
      <div className="space-y-6 text-gray-700">
         <p className="text-lg">Counting is one of the first interactions you'll have in any new language. Let's learn to count to 10!</p>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {[
               { num: 0, de: 'null', pron: 'nool' },
               { num: 1, de: 'eins', pron: 'ayns' },
               { num: 2, de: 'zwei', pron: 'tsvy' },
               { num: 3, de: 'drei', pron: 'dry' },
               { num: 4, de: 'vier', pron: 'feer' },
               { num: 5, de: 'fünf', pron: 'fuunf' },
               { num: 6, de: 'sechs', pron: 'zex' },
               { num: 7, de: 'sieben', pron: 'zee-ben' },
               { num: 8, de: 'acht', pron: 'akht' },
               { num: 9, de: 'neun', pron: 'noyn' },
               { num: 10, de: 'zehn', pron: 'tsayn' }
             ].map(item => (
                <div key={item.num} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center shadow-sm">
                   <div className="text-3xl font-bold font-serif text-orange-500 w-12 text-center">{item.num}</div>
                   <div className="flex-1 ml-4 border-l border-gray-100 pl-4">
                      <div className="font-bold text-gray-900 text-lg">{item.de}</div>
                      <div className="text-sm text-gray-500 italic">[{item.pron}]</div>
                   </div>
                </div>
             ))}
         </div>
      </div>
    )
  },
  {
    id: 'basic-vocab',
    title: 'Basic Vocabulary',
    icon: <BookHeart className="w-5 h-5" />,
    description: 'Essential words to get you started on your German journey.',
    content: (
       <div className="space-y-6 text-gray-700">
          <p className="text-lg">Here are some very common words you'll use every day.</p>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                     { de: 'Hallo', en: 'Hello' },
                     { de: 'Tschüss', en: 'Bye' },
                     { de: 'Ja', en: 'Yes' },
                     { de: 'Nein', en: 'No' },
                     { de: 'Bitte', en: 'Please / You\'re welcome' },
                     { de: 'Danke', en: 'Thank you' },
                     { de: 'Gut', en: 'Good' },
                     { de: 'Schlecht', en: 'Bad' },
                     { de: 'Mann', en: 'Man (der)' },
                     { de: 'Frau', en: 'Woman (die)' },
                  ].map(word => (
                     <div key={word.de} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 md:odd:pr-4 md:even:pl-4 md:border-b md:nth-last-child(-n+2):border-0">
                         <span className="font-medium text-lg text-gray-900">{word.de}</span>
                         <span className="text-gray-500">{word.en}</span>
                     </div>
                  ))}
              </div>
          </div>
       </div>
    )
  },
  {
    id: 'phrases',
    title: 'Usage & Phrases',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Learn how to combine your basic vocabulary into simple phrases.',
    content: (
      <div className="space-y-6 text-gray-700">
         <p className="text-lg">Let's put those initial words to use in simple introductory phrases.</p>
         <div className="space-y-4">
             {[
               { phrase: 'Guten Morgen!', meaning: 'Good morning!', literal: 'Good morning' },
               { phrase: 'Wie geht es dir?', meaning: 'How are you? (informal)', literal: 'How goes it to you?' },
               { phrase: 'Mir geht es gut, danke.', meaning: 'I am fine, thank you.', literal: 'To me goes it good, thanks.' },
               { phrase: 'Ich heiße...', meaning: 'My name is...', literal: 'I am called...' },
               { phrase: 'Woher kommst du?', meaning: 'Where are you from?', literal: 'Wherefrom come you?' },
               { phrase: 'Ich spreche ein bisschen Deutsch.', meaning: 'I speak a little German.', literal: 'I speak a little German.' },
             ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                   <div className="font-bold text-xl text-orange-700 mb-2">{item.phrase}</div>
                   <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm md:text-base">
                       <span className="text-gray-900 font-medium">{item.meaning}</span>
                       <span className="hidden sm:inline text-gray-300">|</span>
                       <span className="text-gray-500 italic">Literal: "{item.literal}"</span>
                   </div>
                </div>
             ))}
         </div>
      </div>
    )
  }
];

export default function TeacherTab() {
  const [activeLesson, setActiveLesson] = useState(lessons[0].id);

  const activeContent = lessons.find(l => l.id === activeLesson);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-gray-900">Step-by-Step German</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Start your German language journey right here. Our beginner-friendly modules will guide you from your very first letter to basic conversation.
        </p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8 items-start">
         <div className="flex flex-col gap-2 sticky top-24">
             <h3 className="font-serif font-bold text-gray-900 px-3 uppercase tracking-wider text-xs mb-2">Curriculum</h3>
             {lessons.map(lesson => (
                 <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl transition-all ${
                       activeLesson === lesson.id 
                       ? 'bg-orange-600 text-white shadow-md shadow-orange-200' 
                       : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-900 border border-transparent shadow-sm'
                    }`}
                 >
                    <div className={activeLesson === lesson.id ? 'text-orange-200' : 'text-orange-500'}>
                       {lesson.icon}
                    </div>
                    <span className="font-medium">{lesson.title}</span>
                 </button>
             ))}
         </div>

         <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] border border-orange-100 p-6 md:p-10 shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
               {activeContent && (
                  <motion.div
                     key={activeContent.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                  >
                     <div className="mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                               {activeContent.icon}
                            </div>
                            <h2 className="font-serif text-3xl font-bold text-gray-900">{activeContent.title}</h2>
                        </div>
                        <p className="text-gray-600 text-lg">{activeContent.description}</p>
                     </div>

                     <div className="prose prose-orange max-w-none">
                        {activeContent.content}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
