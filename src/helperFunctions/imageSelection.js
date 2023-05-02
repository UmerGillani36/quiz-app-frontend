import birthday from '../assets/images/birthday.png';
import brainStorm from '../assets/images/brainStorm.png';
import family from '../assets/images/family.png';
import feedback from '../assets/images/feedback.png';
import friday from '../assets/images/friday.png';
import hello from '../assets/images/hello.png';
import iceBreaker from '../assets/images/iceBreaker.png';
import learnLanguage from '../assets/images/learnLanguage.png';
import memory from '../assets/images/memory.png';
import myth from '../assets/images/myth.png';
import party from '../assets/images/party.png';
import sports from '../assets/images/sports.png';
import wedding from '../assets/images/wedding.png';
import who from '../assets/images/who.png';

const data = [
  { title: 'birthday', image: birthday },
  { title: 'brainStorm', image: brainStorm },
  { title: 'family', image: family },
  { title: 'feedback', image: feedback },
  { title: 'friday', image: friday },
  { title: 'hello', image: hello },
  { title: 'iceBreaker', image: iceBreaker },
  { title: 'learnLanguage', image: learnLanguage },
  { title: 'memory', image: memory },
  { title: 'myth', image: myth },
  { title: 'party', image: party },
  { title: 'sports', image: sports },
  { title: 'wedding', image: wedding },
  { title: 'who', image: who },
];
// This function will give us an image for a game after execution
export const getImage = (query) => {
  let image = who;
  data?.forEach((element) => {
    if (query.toLowerCase().includes(element.title)) {
      image = element.image;
      return 1;
    }
  });
  return image;
};
