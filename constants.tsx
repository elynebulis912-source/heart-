import React from 'react';
import { Quote, LoveWord, Letter } from './types';

export const START_DATE = new Date('2025-01-17T00:00:00');

export const DAKAR_COORDS = { lat: 14.7167, lng: -17.4677 };
export const ISTANBUL_COORDS = { lat: 41.0082, lng: 28.9784 };

export const LOVE_WORDS: LoveWord[] = [
  // "Je t'aime" dans toutes les langues du monde
  { lang: 'Français', text: 'Je t\'aime' },
  { lang: 'Turc', text: 'Seni seviyorum' },
  { lang: 'Wolof', text: 'Dama la nob' },
  { lang: 'Anglais', text: 'I love you' },
  { lang: 'Espagnol', text: 'Te amo' },
  { lang: 'Italien', text: 'Ti amo' },
  { lang: 'Allemand', text: 'Ich liebe dich' },
  { lang: 'Portugais', text: 'Eu te amo' },
  { lang: 'Arabe', text: 'Ana behibak' },
  { lang: 'Japonais', text: 'Aishiteru' },
  { lang: 'Coréen', text: 'Saranghae' },
  { lang: 'Russe', text: 'Ya lyublyu tebya' },
  { lang: 'Grec', text: 'S\'agapo' },
  { lang: 'Néerlandais', text: 'Ik hou van jou' },
  { lang: 'Suédois', text: 'Jag älskar dig' },
  { lang: 'Polonais', text: 'Kocham cię' },
  { lang: 'Tchèque', text: 'Miluji tě' },
  { lang: 'Hongrois', text: 'Szeretlek' },
  { lang: 'Roumain', text: 'Te iubesc' },
  { lang: 'Bulgare', text: 'Обичам те' },
  { lang: 'Serbe', text: 'Volim te' },
  { lang: 'Croate', text: 'Volim te' },
  { lang: 'Slovène', text: 'Ljubim te' },
  { lang: 'Biélorusse', text: 'Ya lyublyu tebya' },
  { lang: 'Kazakh', text: 'Men seni seveymin' },
  { lang: 'Géorgien', text: 'Mikvarxar' },
  { lang: 'Arménien', text: 'Yes siruem' },
  { lang: 'Turc', text: 'Seni seviyorum' },
  { lang: 'Persan', text: 'Duset daram' },
  { lang: 'Hébreu', text: 'Ani ohev otcha' },
  { lang: 'Hindi', text: 'Main tumse pyar karta hoon' },
  { lang: 'Bengali', text: 'Ami tomar bhalobashi' },
  { lang: 'Thaï', text: 'Phom rak khun' },
  { lang: 'Vietnamien', text: 'Em yêu anh' },
  { lang: 'Cambodgien', text: 'Khnhom srolanh neuk' },
  { lang: 'Lao', text: 'Koy hak jao' },
  { lang: 'Malais', text: 'Aku cinta kamu' },
  { lang: 'Indonésien', text: 'Aku cinta kamu' },
  { lang: 'Tagalog', text: 'Mahal kita' },
  { lang: 'Vietnamien du Nord', text: 'Em yêu anh' },
  { lang: 'Tibétain', text: 'Nga khyod la prags po yod' },
  { lang: 'Mongol', text: 'Bi chuluutai hiih durtai' },
  { lang: 'Finnois', text: 'Rakastan sinua' },
  { lang: 'Hongrois Classique', text: 'Szeretlek' },
  { lang: 'Islandais', text: 'Ég elska þig' },
  { lang: 'Danois', text: 'Jeg elsker dig' },
  { lang: 'béninois', text: 'Mo nifẹ rẹ' },
  { lang: 'Swahili', text: 'Nakupenda' },
  { lang: 'Peul', text: 'Ninakunja' },
  { lang: 'Norvégien', text: 'Jeg elsker deg' },
  { lang: 'Afrikaans', text: 'Ek het jou lief' },
  { lang: 'Swahili', text: 'Nakupenda' },
  { lang: 'Hausa', text: 'Ina sonka' },
  { lang: 'Yoruba', text: 'Mo nifé rè' },
  { lang: 'Zoulou', text: 'Ngiyakuthanda' },
  { lang: 'Quechua', text: 'Qamta munani' },
  { lang: 'Aymara', text: 'Janiw amist\'awi' },
  {lang: 'lingala', text: 'Nalingi yo',  }
];


export const LETTERS: Letter[] = [
  { id: 1, title: "Confidence", content: "Si un jour il arrivait que tu doutes de mon amour, lis ces lettres car c'est le reflet de mon coeur." , date: " 2026" },
  { id: 2, title: "Waiitttt", content: "Je ne peux pas continuer sans parler ma galerie. Ce sourire, ces yeux, ces lèvres ? Mais waouh j'adore la façon dont Dieu t'a malaxée, je bave..", date: "Février 2026" },
  { id: 3, title: "Toi", content: "Ta voix est ma mélodie préférée. Ton sourire, ma seule boussole.", date: "Toujours" },
  { id: 4, title: "L'Avenir", content: "Je rêve du jour où nos matins ne seront plus séparés par un écran.", date: "Bientôt" },
  { id: 5, title: "Ton Regard", content: "Il y a dans tes yeux une promesse que je n'ai trouvée nulle part ailleurs.", date: "2026" },
  { id: 6, title: "Soulmate", content: "You're more myself than I am. Whatever our souls are made of, yours and mine are the same", date: "Éternellement" },
  { id: 7, title: "Fall in love", content: "Je ne suis pas tombée amoureuse de toi parce que j'avais besoin d'une relation, je suis tombée amoureuse de toi parce que pour la première fois depuis une éternité je me sentais en paix et à ma place : dans tes bras.", date: "Amour" },
  { id: 8, title: "Heard my heart", content: "So close no matter how far. Couldn't be much more from the heart.", date: "Baby" },
  { id: 9, title: "Promesse", content: "Peu importe ce que les gens pourront dire de toi de toi, je te croirai toujours.", date: "Fidélité" },
  { id: 10, title: "Dingue de toi", content: "Merci d'aimer les neufs personnalités de Nana..", date: "Bipolarité" },
  { id: 11, title: "Envie", content: "Je me demande quel goût ont tes lèvres..", date: "Supplice" },
  { id: 12, title: "Douceur", content: "Ta tendresse traverse les ondes et vient réchauffer mon âme.", date: "Tendresse" },
  { id: 13, title: "Unique", content: "Il y a des milliards de personnes, mais il n'y a que toi.", date: "Exception" },
  { id: 14, title: "Infini ☯", content: "Mon amour pour toi ne connaît ni début ni fin.", date: "88" },
  { id: 15, title: "Gift ", content: "C'est ton jour de chance, je répondrai à tous tes demandes. Joyeuse Saint-Valentin.", date: "Just remind me the code" },
  { id: 16, title: "Essence", content: "Tu es l'essence même de ma raison d'être. Chaque pensée me ramène à toi.", date: "Éternité" },
  { id: 17, title: "On my Mind", content: "I got addicted to you. Attracted to you in ways i can't explain. No words are amazing enough to describe how fantastic you make me feel.", date: "Wholeness" },
  { id: 18, title: "Cupidon 💘", content: "Love looks not with the eyes, but with the mind, and therefore is winged Cupid painted blind.", date: "Songe d'une nuit été" },
  { id: 19, title: "Sorry", content: "I humbly do beseech of your pardon, for too much loving you", date: "All time" },
  { id: 20, title: "Alliance", content: "Chaque jour je regarde ma bague, la promesse faite et je ne peux m'empecher de sourire.", date: "A Sign Of Affection" },
  { id: 21, title: "Avœu", content: "Je te pense plus que je ne devrais, et moins que je ne le voudrais. Tu occupes cet espace précis entre le manque et l’attente. Celui qui fait battre le cœur un peu trop lentement.", date: "❥" },
  { id: 22, title: "Evidence", content: "Entre toi et moi, ce n'était jamais une coincidence. Nous étions un pacte éternel. ", date: "Eternity" },
  { id: 23, title: "Désir", content: "Je pourrais rester sage, mais ce serait te mentir. Il y a en moi cette envie de toi qui ne demande qu’à être réveillée. Et je sais que tu sais exactement comment t’y prendre..", date: "Daddy" },
  { id: 24, title: "Just The Way You Are", content: "And when you smile, the whole world stops and stares for a while, cause baby you're amazing, just the way you are..", date: "love" },
  { id: 25, title: "-Nana Shakespeare", content: "Tout ce que je sais, c'est que je n'aime que toi.", date: "Calme" },
  { id: 26, title: "Fact", content: "Je suis la plus heureuse des soumises.", date: "Paradise" },
  
  { id: 27, title: "Only You", content: "I got my eyes on you, you're everything that I see, I want your hot love and emotion, endlessly..", date: "Baby" },
  { id: 28, title: "Allo Police", content: "Je suis une criminelle et ma sentence est de t'aimer pour toujours.", date: "Menottes" },
  { id: 29, title: "Voleur", content: "Espéce d'Aladin va, tu as volé mon coeur.", date: "Reve Bleu" },
  { id: 30, title: "Dream", content: "All I dream of is your eyes. All I long for is your touch", date: "Fantasme" },
  { id: 31, title: "Home", content: "Il n'y a qu' avec toi que je me sens vraiment chez moi.", date: "Okaerinasai" },
  { id: 32, title: "If", content: "Si j'avais mille ames je te les donnerais toutes. Je n'en ai qu'une. Alors prends la milles fois." ,date:"Soul"},
  { id: 33, title: "Wolof", content: "Minimum je te déclare mon amour dans mes langues. Hubert Ilunga Kyungu dama la nopp ba doff, na lingiyo so much" ,date: "Congolese du coté de mon congolais"},
  { id: 34, title: "Master", content: "Ta soumise a besoin que tu refasses son éducation..", date: "#BabyDaddy" },
   { id: 35, title:"– Hey Sweetheart", content: "You must allow me to tell you how ardently I admire and love you. ", date: "Romance"},
    { id: 36, title: "Fin et Début", content: "C'est fou quand je pense qu' au début on était juste des connaissances sur le virtuel mais maintenant je n'imagine point ma vie sans toi. Tu es la fin de ma solitude et le début de mon évidence.", date: "Renaissance" },
  { id: 37, title: "Éternité", content: `Je voulais t’offrir quelques mots légers, de simples citations.
Mais mon cœur refuse la brièveté quand il s’agit de toi.
Tu es ce port discret où mon âme accoste sans même y penser, fatiguée du monde, mais jamais de toi.
Merci d’être là, de me soutenir sans bruit, d’accueillir mes larmes pour les transformer en sourire, de m’aimer telle que je suis, jusque dans mes caprices.
Tu es mon roc, celui que je veux rendre fier, cette présence sûre qui éclaire même mes nuits les plus sombres.
Chaque jour, je me demande encore ce que j’ai fait pour mériter une âme aussi belle que la tienne.
Et je peux le dire sans détour, avec une certitude paisible : tu es la personne la plus importante de ma vie.`, date:"Perpétuel"},
];

// Exemple de structure pour centraliser les liens Google Drive
export const mediaLinks = {
  '15mp4': 'https://drive.google.com/uc?id=ID_DU_FICHIER_15MP4',
  '7gif': 'https://drive.google.com/uc?id=ID_DU_FICHIER_7GIF',
  'Images1mp4': 'https://drive.google.com/uc?id=ID_DU_FICHIER_IMAGES1MP4'
  // Ajoute ici tous tes autres fichiers
};
