import type { DailyLight, GuidanceResult, ScripturePassage } from '@/types';
import { SEED_PASSAGES } from './seed';

const EXTRA_PASSAGES: ScripturePassage[] = [
  {
    id: 'lamentations-3-22-23',
    book: 'Lamentations',
    chapter: 3,
    verseStart: 22,
    verseEnd: 23,
    text: '"The steadfast love of the LORD never ceases, his mercies never come to an end; they are new every morning; great is your faithfulness."',
    translation: 'NABRE',
    reference: 'Lamentations 3:22-23',
  },
  {
    id: 'psalm-121-1-2',
    book: 'Psalms',
    chapter: 121,
    verseStart: 1,
    verseEnd: 2,
    text: '"I raise my eyes toward the mountains. From whence shall come my help? My help comes from the LORD, the maker of heaven and earth."',
    translation: 'NABRE',
    reference: 'Psalm 121:1-2',
  },
  {
    id: 'romans-15-13',
    book: 'Romans',
    chapter: 15,
    verseStart: 13,
    verseEnd: 13,
    text: '"May the God of hope fill you with all joy and peace in believing, so that you may abound in hope by the power of the holy Spirit."',
    translation: 'NABRE',
    reference: 'Romans 15:13',
  },
  {
    id: 'james-1-5',
    book: 'James',
    chapter: 1,
    verseStart: 5,
    verseEnd: 5,
    text: '"If any of you lacks wisdom, he should ask God who gives to all generously and ungrudgingly, and he will be given it."',
    translation: 'NABRE',
    reference: 'James 1:5',
  },
  {
    id: 'deut-31-8',
    book: 'Deuteronomy',
    chapter: 31,
    verseStart: 8,
    verseEnd: 8,
    text: '"It is the LORD who goes before you; he will be with you and will never fail you or forsake you. So do not fear or be dismayed."',
    translation: 'NABRE',
    reference: 'Deuteronomy 31:8',
  },
  {
    id: 'psalm-62-5-6',
    book: 'Psalms',
    chapter: 62,
    verseStart: 5,
    verseEnd: 6,
    text: '"My soul, be at rest in God alone, from whom comes my hope. God alone is my rock and my salvation, my fortress; I shall not be shaken."',
    translation: 'NABRE',
    reference: 'Psalm 62:5-6',
  },
  {
    id: 'gal-6-9',
    book: 'Galatians',
    chapter: 6,
    verseStart: 9,
    verseEnd: 9,
    text: '"Let us not grow tired of doing good, for in due time we shall reap our harvest, if we do not give up."',
    translation: 'NABRE',
    reference: 'Galatians 6:9',
  },
  {
    id: '2-cor-12-9',
    book: '2 Corinthians',
    chapter: 12,
    verseStart: 9,
    verseEnd: 9,
    text: '"My grace is sufficient for you, for power is made perfect in weakness."',
    translation: 'NABRE',
    reference: '2 Corinthians 12:9',
  },
  {
    id: 'col-3-12-15',
    book: 'Colossians',
    chapter: 3,
    verseStart: 12,
    verseEnd: 15,
    text: '"Put on, as God’s chosen ones, holy and beloved, heartfelt compassion, kindness, humility, gentleness, and patience... and let the peace of Christ control your hearts."',
    translation: 'NABRE',
    reference: 'Colossians 3:12-15',
  },
  {
    id: 'hebrews-10-23',
    book: 'Hebrews',
    chapter: 10,
    verseStart: 23,
    verseEnd: 23,
    text: '"Let us hold unwaveringly to our confession that gives us hope, for he who made the promise is trustworthy."',
    translation: 'NABRE',
    reference: 'Hebrews 10:23',
  },
  {
    id: 'psalm-27-1',
    book: 'Psalms',
    chapter: 27,
    verseStart: 1,
    verseEnd: 1,
    text: '"The LORD is my light and my salvation; whom should I fear? The LORD is my life’s refuge; of whom should I be afraid?"',
    translation: 'NABRE',
    reference: 'Psalm 27:1',
  },
  {
    id: 'hebrews-4-15-16',
    book: 'Hebrews',
    chapter: 4,
    verseStart: 15,
    verseEnd: 16,
    text: '"For we do not have a high priest who is unable to sympathize with our weaknesses... So let us confidently approach the throne of grace to receive mercy."',
    translation: 'NABRE',
    reference: 'Hebrews 4:15-16',
  },
  {
    id: 'psalm-139-13-14',
    book: 'Psalms', chapter: 139, verseStart: 13, verseEnd: 14,
    text: '"You formed my inmost being; you knit me in my mother\'s womb. I praise you, because I am wonderfully made; wonderful are your works!"',
    translation: 'NABRE', reference: 'Psalm 139:13-14',
  },
  {
    id: 'micah-6-8',
    book: 'Micah', chapter: 6, verseStart: 8, verseEnd: 8,
    text: '"You have been told, O mortal, what is good, and what the LORD requires of you: Only to do justice and to love goodness, and to walk humbly with your God."',
    translation: 'NABRE', reference: 'Micah 6:8',
  },
  {
    id: 'psalm-91-1-2',
    book: 'Psalms', chapter: 91, verseStart: 1, verseEnd: 2,
    text: '"You who dwell in the shelter of the Most High, who abide in the shade of the Almighty, say to the LORD, \'My refuge and fortress, my God in whom I trust.\'"',
    translation: 'NABRE', reference: 'Psalm 91:1-2',
  },
  {
    id: 'isaiah-43-1-2',
    book: 'Isaiah', chapter: 43, verseStart: 1, verseEnd: 2,
    text: '"Fear not, for I have redeemed you; I have called you by name: you are mine. When you pass through waters, I will be with you."',
    translation: 'NABRE', reference: 'Isaiah 43:1-2',
  },
  {
    id: 'rom-12-2',
    book: 'Romans', chapter: 12, verseStart: 2, verseEnd: 2,
    text: '"Do not conform yourselves to this age but be transformed by the renewal of your mind, that you may discern what is the will of God, what is good and pleasing and perfect."',
    translation: 'NABRE', reference: 'Romans 12:2',
  },
  {
    id: 'psalm-103-2-4',
    book: 'Psalms', chapter: 103, verseStart: 2, verseEnd: 4,
    text: '"Bless the LORD, my soul; and do not forget all his gifts, who pardons all your sins, and heals all your ills, who redeems your life from the pit, and crowns you with mercy and compassion."',
    translation: 'NABRE', reference: 'Psalm 103:2-4',
  },
  {
    id: 'matt-6-33-34',
    book: 'Matthew', chapter: 6, verseStart: 33, verseEnd: 34,
    text: '"But seek first the kingdom of God and his righteousness, and all these things will be given you besides. Do not worry about tomorrow; tomorrow will take care of itself."',
    translation: 'NABRE', reference: 'Matthew 6:33-34',
  },
  {
    id: 'john-15-4-5',
    book: 'John', chapter: 15, verseStart: 4, verseEnd: 5,
    text: '"Remain in me, as I remain in you. Just as a branch cannot bear fruit on its own unless it remains on the vine, so neither can you unless you remain in me. I am the vine, you are the branches."',
    translation: 'NABRE', reference: 'John 15:4-5',
  },
  {
    id: 'eph-3-20-21',
    book: 'Ephesians', chapter: 3, verseStart: 20, verseEnd: 21,
    text: '"Now to him who is able to accomplish far more than all we ask or imagine, by the power at work within us, to him be glory in the church and in Christ Jesus."',
    translation: 'NABRE', reference: 'Ephesians 3:20-21',
  },
  {
    id: 'psalm-16-8-9',
    book: 'Psalms', chapter: 16, verseStart: 8, verseEnd: 9,
    text: '"I keep the LORD always before me; with him at my right hand, I shall never be shaken. Therefore my heart is glad, my soul rejoices; my body also dwells secure."',
    translation: 'NABRE', reference: 'Psalm 16:8-9',
  },
  {
    id: 'isaiah-40-31',
    book: 'Isaiah', chapter: 40, verseStart: 31, verseEnd: 31,
    text: '"They that hope in the LORD will renew their strength, they will soar on eagles\' wings; they will run and not grow weary, walk and not grow faint."',
    translation: 'NABRE', reference: 'Isaiah 40:31',
  },
  {
    id: 'psalm-37-4-5',
    book: 'Psalms', chapter: 37, verseStart: 4, verseEnd: 5,
    text: '"Find your delight in the LORD who will give you your heart\'s desire. Commit your way to the LORD; trust in him and he will act."',
    translation: 'NABRE', reference: 'Psalm 37:4-5',
  },
  {
    id: '2-tim-1-7',
    book: '2 Timothy', chapter: 1, verseStart: 7, verseEnd: 7,
    text: '"For God did not give us a spirit of cowardice but rather of power and love and self-control."',
    translation: 'NABRE', reference: '2 Timothy 1:7',
  },
  {
    id: 'josh-1-9',
    book: 'Joshua', chapter: 1, verseStart: 9, verseEnd: 9,
    text: '"I command you: be strong and steadfast! Do not fear nor be dismayed, for the LORD, your God, is with you wherever you go."',
    translation: 'NABRE', reference: 'Joshua 1:9',
  },
  {
    id: 'eccl-3-1',
    book: 'Ecclesiastes', chapter: 3, verseStart: 1, verseEnd: 1,
    text: '"There is an appointed time for everything, and a time for every affair under the heavens."',
    translation: 'NABRE', reference: 'Ecclesiastes 3:1',
  },
];

export const CONTENT_PASSAGES: ScripturePassage[] = [...SEED_PASSAGES, ...EXTRA_PASSAGES];

const passagesById = Object.fromEntries(CONTENT_PASSAGES.map((passage) => [passage.id, passage])) as Record<string, ScripturePassage>;

type GuidanceTemplate = Omit<GuidanceResult, 'id' | 'concern' | 'themes' | 'createdAt'>;
type DailyLightTemplate = Omit<DailyLight, 'id' | 'date'>;

export function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const DAILY_LIGHT_LIBRARY: DailyLightTemplate[] = [
  {
    passage: passagesById['matt-5-14-16'],
    reflection: 'You do not need a dramatic moment to carry light. Faithfulness often looks like staying kind, staying honest, and staying present in ordinary rooms.',
    prayer: 'Lord, let your light in me stay warm, steady, and useful today. Amen.',
    theme: 'light',
  },
  {
    passage: passagesById['john-14-27'],
    reflection: 'Peace is not proof that everything is solved. It is the quiet strength to stand without panic while the day is still unfinished.',
    prayer: 'Jesus, teach my heart to receive your peace before I try to manufacture my own. Amen.',
    theme: 'peace',
  },
  {
    passage: passagesById['lamentations-3-22-23'],
    reflection: 'Today does not have to carry yesterday’s emotional weather forever. Mercy arrives again, and it arrives on time.',
    prayer: 'God of new mornings, meet me with fresh mercy and enough hope for today. Amen.',
    theme: 'renewal',
  },
  {
    passage: passagesById['psalm-121-1-2'],
    reflection: 'When your attention keeps drifting upward in worry, let it drift upward in trust instead. Help still comes from somewhere greater than your own reserves.',
    prayer: 'Lord, lift my eyes above the pressure and remind me where my help comes from. Amen.',
    theme: 'help',
  },
  {
    passage: passagesById['romans-15-13'],
    reflection: 'Hope grows best when it is fed by something sturdier than mood. Let joy and peace become conditions you receive, not conditions you wait to earn.',
    prayer: 'God of hope, expand my courage and make room in me for joy again. Amen.',
    theme: 'hope',
  },
  {
    passage: passagesById['james-1-5'],
    reflection: 'Clarity may not come all at once, but wisdom often begins with one honest request. Ask plainly. God is not irritated by your need.',
    prayer: 'Generous God, give me wisdom for the next faithful step and a calm mind to receive it. Amen.',
    theme: 'wisdom',
  },
  {
    passage: passagesById['deut-31-8'],
    reflection: 'You are not walking into this day first. God is already ahead of you, already in the room you are nervous about, already near the thing you are avoiding.',
    prayer: 'Lord, go before me today and steady what feels uncertain. Amen.',
    theme: 'courage',
  },
  {
    passage: passagesById['psalm-62-5-6'],
    reflection: 'Rest is not only for vacations. It is also the discipline of returning your soul to God before anxiety decides the tone of the day.',
    prayer: 'God my rock, gather my restless thoughts and settle them in your care. Amen.',
    theme: 'rest',
  },
  {
    passage: passagesById['gal-6-9'],
    reflection: 'Slow faithfulness can feel invisible, but it is not wasted. The work of staying tender and steady still matters, even before results appear.',
    prayer: 'Lord, keep me from giving up on the good you have already started in me. Amen.',
    theme: 'perseverance',
  },
  {
    passage: passagesById['2-cor-12-9'],
    reflection: 'Weakness is not always a wall; sometimes it is the doorway through which grace becomes visible. You do not have to sound strong to be held by God.',
    prayer: 'Christ, meet me in my weakness and make your grace unmistakable there. Amen.',
    theme: 'grace',
  },
  {
    passage: passagesById['col-3-12-15'],
    reflection: 'Compassion is not a personality type. It is a practice. Let peace govern your responses before urgency or irritation takes over.',
    prayer: 'Lord, clothe me in gentleness and let your peace choose my pace today. Amen.',
    theme: 'compassion',
  },
  {
    passage: passagesById['hebrews-10-23'],
    reflection: 'Holding on does not always look dramatic. Sometimes it is simply refusing to let hope go silent while you wait.',
    prayer: 'Faithful God, keep my hope steady because you are steady. Amen.',
    theme: 'steadfastness',
  },
  {
    passage: passagesById['psalm-27-1'],
    reflection: 'Fear speaks loudly, but it does not deserve final authority. Let the presence of God become larger than the thing you are bracing against.',
    prayer: 'Lord my light, outshine what is trying to intimidate me today. Amen.',
    theme: 'confidence',
  },
  {
    passage: passagesById['hebrews-4-15-16'],
    reflection: 'You do not need polished language to approach grace. Bring the honest version. Mercy is available before you finish explaining yourself.',
    prayer: 'Jesus, meet me with mercy and teach me to come to you without hiding. Amen.',
    theme: 'mercy',
  },
  {
    passage: passagesById['psalm-139-13-14'],
    reflection: 'You were not assembled carelessly. Every part of you was intended. On days when you feel like too much or not enough, remember you are the deliberate work of a loving Creator.',
    prayer: 'God who formed me, quiet the voice that says I am not enough and remind me I am wonderfully made. Amen.',
    theme: 'identity',
  },
  {
    passage: passagesById['micah-6-8'],
    reflection: 'Faithfulness does not always require grand gestures. Sometimes it looks like being fair, being kind, and walking through the day without pretending you have all the answers.',
    prayer: 'Lord, make my steps humble, my hands just, and my heart kind today. Amen.',
    theme: 'justice',
  },
  {
    passage: passagesById['psalm-91-1-2'],
    reflection: 'Shelter is not always a physical location. It can be a posture of the heart — turning toward God before turning toward anxiety.',
    prayer: 'Most High God, be my refuge today when the world feels exposing. Amen.',
    theme: 'shelter',
  },
  {
    passage: passagesById['isaiah-43-1-2'],
    reflection: 'God does not promise the absence of deep water. He promises presence in the middle of it. That is a different kind of safety — one that does not require circumstances to cooperate.',
    prayer: 'Lord, walk with me through what I cannot go around. Amen.',
    theme: 'presence',
  },
  {
    passage: passagesById['rom-12-2'],
    reflection: 'Transformation is not one dramatic moment. It is the quiet daily practice of letting God reshape how you see, think, and respond.',
    prayer: 'God, renew my mind today and help me see clearly what is good. Amen.',
    theme: 'transformation',
  },
  {
    passage: passagesById['psalm-103-2-4'],
    reflection: 'Memory can be short when it comes to grace. This psalm is a deliberate act of remembering — every pardon, every healing, every rescue from the pit.',
    prayer: 'Generous God, keep my memory of your mercy long and my gratitude fresh. Amen.',
    theme: 'remembrance',
  },
  {
    passage: passagesById['matt-6-33-34'],
    reflection: 'Tomorrow is not yours to carry today. There is enough grace for this day, this hour, this decision. Let the rest wait.',
    prayer: "Jesus, free me from borrowing tomorrow's worries and teach me to live today. Amen.",
    theme: 'trust',
  },
  {
    passage: passagesById['john-15-4-5'],
    reflection: 'Productivity culture says bear fruit faster. Jesus says remain connected. The fruitfulness will follow, but only from rootedness, not from rushing.',
    prayer: 'Lord, keep me rooted in you before I try to be useful to anyone else. Amen.',
    theme: 'abiding',
  },
  {
    passage: passagesById['eph-3-20-21'],
    reflection: 'Your imagination is not the ceiling. God works beyond what you can picture, through power that is already at work within you — not someday, but now.',
    prayer: 'God of immeasurably more, stretch my expectations and surprise me with your faithfulness. Amen.',
    theme: 'abundance',
  },
  {
    passage: passagesById['psalm-16-8-9'],
    reflection: 'Stability is not the absence of disruption. It is keeping the Lord before you so that when disruption comes, your center holds.',
    prayer: 'Lord, be at my right hand today and keep my heart glad in your nearness. Amen.',
    theme: 'stability',
  },
  {
    passage: passagesById['isaiah-40-31'],
    reflection: 'Waiting on God is not idleness. It is the active choice to trade your exhaustion for a strength that outlasts your own capacity.',
    prayer: 'God of renewal, lift me above the fatigue and give me strength I cannot manufacture. Amen.',
    theme: 'endurance',
  },
  {
    passage: passagesById['psalm-37-4-5'],
    reflection: 'Delight is not a performance requirement. It is an invitation to enjoy God before you ask God for things. The desires of your heart may change in the presence of that kind of enjoyment.',
    prayer: 'Lord, teach me to delight in you and trust you with the desires I carry. Amen.',
    theme: 'delight',
  },
  {
    passage: passagesById['2-tim-1-7'],
    reflection: 'The spirit you received is not one of timidity. Power, love, and self-control — these are already part of your equipment. Use them.',
    prayer: 'God, activate the courage and love you have already placed inside me. Amen.',
    theme: 'boldness',
  },
  {
    passage: passagesById['josh-1-9'],
    reflection: 'This command to be strong is not issued to shame your weakness. It is backed by a promise: God is with you wherever you go. Strength comes from companionship, not willpower.',
    prayer: 'Lord of hosts, go with me into every room, every meeting, every unknown today. Amen.',
    theme: 'strength',
  },
  {
    passage: passagesById['eccl-3-1'],
    reflection: 'Not every season demands the same thing from you. Some seasons are for planting, some for resting, some for letting go. Honor the one you are in.',
    prayer: 'God of all seasons, give me the wisdom to honor the time I am in right now. Amen.',
    theme: 'seasons',
  },
  {
    passage: passagesById['rom-8-28'],
    reflection: 'This verse is not a promise that everything will feel good. It is a promise that nothing is wasted — not the pain, not the confusion, not the waiting.',
    prayer: 'Lord, help me trust that you are weaving good from what I cannot yet understand. Amen.',
    theme: 'providence',
  },
];

const GUIDANCE_THEME_LIBRARY: Record<string, GuidanceTemplate[]> = {
  fear: [
    {
      passage: passagesById['isaiah-41-10'],
      pastoralFraming: 'Fear often exaggerates the size of what is in front of you and shrinks the sense of who is with you. Start by letting God speak presence before you demand certainty.',
      reflectionQuestions: ['What feels most threatening right now?', 'What would calm look like in the next hour?'],
      prayer: 'God, stay close to me in what feels overwhelming and steady my heart. Amen.',
    },
    {
      passage: passagesById['psalm-27-1'],
      pastoralFraming: 'The point is not to shame fear out of existence. The point is to let the light of God stand beside it until fear is no longer running the whole room.',
      reflectionQuestions: ['What fear has the loudest voice today?', 'Where do you need courage, not certainty?'],
      prayer: 'Lord my light, keep fear from writing the whole story of this day. Amen.',
    },
  ],
  grief: [
    {
      passage: passagesById['psalm-34-18'],
      pastoralFraming: 'Grief does not need to be hurried into meaning. It needs room, honesty, and the assurance that God is especially near to broken hearts.',
      reflectionQuestions: ['What grief feels sharpest today?', 'What memory do you want to hold gently?'],
      prayer: 'Lord, stay near to my sorrow and keep me company in it. Amen.',
    },
    {
      passage: passagesById['lamentations-3-22-23'],
      pastoralFraming: 'Loss can make every morning feel heavy before it begins. Even so, mercy still arrives, not to erase grief, but to carry you through it a little further.',
      reflectionQuestions: ['What does mercy look like today?', 'What would it mean to be tender with yourself?'],
      prayer: 'God of mercy, carry me through this grief one honest breath at a time. Amen.',
    },
  ],
  loneliness: [
    {
      passage: passagesById['psalm-23-1-4'],
      pastoralFraming: 'Loneliness can distort the landscape and make every path feel empty. This psalm reminds you that accompaniment is not imaginary, even when it is hard to feel.',
      reflectionQuestions: ['Where do you feel most alone right now?', 'Who could receive one honest message from you today?'],
      prayer: 'Good Shepherd, stay close to me in the quiet places that ache. Amen.',
    },
    {
      passage: passagesById['deut-31-8'],
      pastoralFraming: 'Sometimes loneliness is less about being physically alone and more about feeling unseen. Let this moment begin with the truth that God does not withdraw from your path.',
      reflectionQuestions: ['What makes you feel unseen lately?', 'What small act of connection is possible today?'],
      prayer: 'Lord, be near to me and help me notice the companionship you still provide. Amen.',
    },
  ],
  forgiveness: [
    {
      passage: passagesById['1-cor-13-4-7'],
      pastoralFraming: 'Forgiveness is often slower than people admit. It usually begins with honesty about the wound before it becomes any kind of release.',
      reflectionQuestions: ['What part still hurts the most?', 'What would release look like without pretending?'],
      prayer: 'Merciful God, soften what has hardened in me and guide me toward freedom. Amen.',
    },
    {
      passage: passagesById['hebrews-4-15-16'],
      pastoralFraming: 'If shame is tangled into this, start with mercy before you start with improvement. Grace creates the conditions where real forgiveness can begin.',
      reflectionQuestions: ['Where do you need mercy first?', 'What truth are you afraid to say aloud?'],
      prayer: 'Jesus, meet my shame with mercy and lead me toward honest forgiveness. Amen.',
    },
  ],
  purpose: [
    {
      passage: passagesById['jer-29-11'],
      pastoralFraming: 'Feeling directionless does not mean your life is empty. It may simply mean the next season has not fully come into focus yet.',
      reflectionQuestions: ['What has felt meaningful lately?', 'What next step feels quietly faithful?'],
      prayer: 'Lord, give me enough light for the next step and trust for what I cannot yet see. Amen.',
    },
    {
      passage: passagesById['james-1-5'],
      pastoralFraming: 'When purpose feels cloudy, wisdom often matters more than a five-year map. Ask for what helps you move well through today.',
      reflectionQuestions: ['Where do you need wisdom most?', 'What simple choice would honor God today?'],
      prayer: 'Generous God, shape my decisions with wisdom and quiet conviction. Amen.',
    },
  ],
  peace: [
    {
      passage: passagesById['psalm-46-10'],
      pastoralFraming: 'Stillness is not passivity. It is the refusal to let panic set the terms of your inner life.',
      reflectionQuestions: ['What needs to slow down in you?', 'What can be set down for this hour?'],
      prayer: 'God of peace, settle what is racing in me and hold me in your stillness. Amen.',
    },
    {
      passage: passagesById['psalm-62-5-6'],
      pastoralFraming: 'Peace often begins when your soul stops asking a dozen places to save it and returns to God as its center again.',
      reflectionQuestions: ['What have you been leaning on too heavily?', 'What helps you return to center?'],
      prayer: 'Lord, gather my scattered attention and rest my soul in you alone. Amen.',
    },
  ],
  gratitude: [
    {
      passage: passagesById['phil-4-6-7'],
      pastoralFraming: 'Gratitude is not denial. It is a widening of the frame so anxiety does not become the only truth you can see.',
      reflectionQuestions: ['What gift have you missed today?', 'What changes when thanksgiving leads your prayer?'],
      prayer: 'Lord, enlarge my sight so I can notice the gifts you are still giving. Amen.',
    },
    {
      passage: passagesById['romans-15-13'],
      pastoralFraming: 'Thankfulness becomes deeper when it is tied to hope. Joy does not have to be loud to be real.',
      reflectionQuestions: ['What quietly good thing is present today?', 'How has God sustained you lately?'],
      prayer: 'God of hope, make me grateful without making me shallow. Amen.',
    },
  ],
  temptation: [
    {
      passage: passagesById['matt-11-28-30'],
      pastoralFraming: 'Temptation often grows louder when you are tired, ashamed, or carrying too much alone. Rest and honesty are part of spiritual resistance.',
      reflectionQuestions: ['What deeper need is underneath this?', 'Who can help you not carry this alone?'],
      prayer: 'Jesus, meet me in my weakness and guide me toward what is life-giving. Amen.',
    },
    {
      passage: passagesById['hebrews-4-15-16'],
      pastoralFraming: 'Do not begin with disgust. Begin with grace. Christ understands weakness and invites you toward mercy, not hiding.',
      reflectionQuestions: ['What usually makes this harder?', 'What would choosing mercy over hiding look like?'],
      prayer: 'Lord, keep me close to grace so I can walk honestly and steadily. Amen.',
    },
  ],
  conflict: [
    {
      passage: passagesById['john-14-27'],
      pastoralFraming: 'Conflict narrows your imagination until winning feels like the only goal. Peace reopens the possibility of wisdom, restraint, and truth spoken without violence.',
      reflectionQuestions: ['What outcome would actually bring peace?', 'Where do you need less defensiveness?'],
      prayer: 'Prince of Peace, guide my words and keep me rooted in truth and gentleness. Amen.',
    },
    {
      passage: passagesById['col-3-12-15'],
      pastoralFraming: 'Before you resolve the conflict, choose the posture you want to carry into it. Compassion and patience are not weakness; they are strength under control.',
      reflectionQuestions: ['What posture do you want to bring?', 'What needs to soften before you respond?'],
      prayer: 'Lord, clothe me in compassion and keep peace in command of my reactions. Amen.',
    },
  ],
  uncertainty: [
    {
      passage: passagesById['prov-3-5-6'],
      pastoralFraming: 'Uncertainty feels painful because it exposes how much you want control. Faith does not erase that discomfort, but it does keep you moving without full visibility.',
      reflectionQuestions: ['What do you wish you knew today?', 'What is the next clear step, even if small?'],
      prayer: 'God, guide me where I cannot yet see and keep me steady while I wait. Amen.',
    },
    {
      passage: passagesById['hebrews-10-23'],
      pastoralFraming: 'When answers are delayed, faithfulness often looks like holding hope without pretending certainty. Trust the character of the One who made the promise.',
      reflectionQuestions: ['What promise do you need to remember?', 'How can hope stay active while you wait?'],
      prayer: 'Faithful God, keep my hope from unraveling while the path is still unclear. Amen.',
    },
  ],
};

export function pickGuidanceVariant(theme: string, concern: string): GuidanceTemplate {
  const normalizedTheme = GUIDANCE_THEME_LIBRARY[theme] ? theme : 'peace';
  const options = GUIDANCE_THEME_LIBRARY[normalizedTheme];
  return options[hashString(`${normalizedTheme}:${concern.toLowerCase()}`) % options.length];
}

export { hashString };