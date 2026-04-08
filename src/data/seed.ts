import type { ScripturePassage, Sermon, GuidanceResult, DailyLight, ContentTheme } from '@/types';

export const SEED_PASSAGES: ScripturePassage[] = [
  {
    id: 'john-14-27', book: 'John', chapter: 14, verseStart: 27, verseEnd: 27,
    text: '"Peace I leave with you; my peace I give to you. Not as the world gives do I give it to you. Do not let your hearts be troubled or afraid."',
    translation: 'NABRE', reference: 'John 14:27',
  },
  {
    id: 'psalm-23-1-4', book: 'Psalms', chapter: 23, verseStart: 1, verseEnd: 4,
    text: '"The LORD is my shepherd; there is nothing I lack. In green pastures he makes me lie down; to still waters he leads me; he restores my soul. He guides me along right paths for the sake of his name. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff comfort me."',
    translation: 'NABRE', reference: 'Psalm 23:1-4',
  },
  {
    id: 'matt-11-28-30', book: 'Matthew', chapter: 11, verseStart: 28, verseEnd: 30,
    text: '"Come to me, all you who labor and are burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am meek and humble of heart; and you will find rest for yourselves. For my yoke is easy, and my burden light."',
    translation: 'NABRE', reference: 'Matthew 11:28-30',
  },
  {
    id: 'phil-4-6-7', book: 'Philippians', chapter: 4, verseStart: 6, verseEnd: 7,
    text: '"Have no anxiety at all, but in everything, by prayer and petition, with thanksgiving, make your requests known to God. Then the peace of God that surpasses all understanding will guard your hearts and minds in Christ Jesus."',
    translation: 'NABRE', reference: 'Philippians 4:6-7',
  },
  {
    id: 'isaiah-41-10', book: 'Isaiah', chapter: 41, verseStart: 10, verseEnd: 10,
    text: '"Do not fear: I am with you; do not be anxious: I am your God. I will strengthen you, I will help you, I will uphold you with my victorious right hand."',
    translation: 'NABRE', reference: 'Isaiah 41:10',
  },
  {
    id: 'rom-8-28', book: 'Romans', chapter: 8, verseStart: 28, verseEnd: 28,
    text: '"We know that all things work for good for those who love God, who are called according to his purpose."',
    translation: 'NABRE', reference: 'Romans 8:28',
  },
  {
    id: 'psalm-46-10', book: 'Psalms', chapter: 46, verseStart: 10, verseEnd: 10,
    text: '"Be still, and know that I am God!"',
    translation: 'NABRE', reference: 'Psalm 46:10',
  },
  {
    id: 'jer-29-11', book: 'Jeremiah', chapter: 29, verseStart: 11, verseEnd: 11,
    text: '"For I know well the plans I have in mind for you—oracle of the LORD—plans for your welfare and not for woe, so as to give you a future of hope."',
    translation: 'NABRE', reference: 'Jeremiah 29:11',
  },
  {
    id: 'psalm-34-18', book: 'Psalms', chapter: 34, verseStart: 18, verseEnd: 18,
    text: '"The LORD is close to the brokenhearted, and saves those whose spirit is crushed."',
    translation: 'NABRE', reference: 'Psalm 34:18',
  },
  {
    id: '1-cor-13-4-7', book: '1 Corinthians', chapter: 13, verseStart: 4, verseEnd: 7,
    text: '"Love is patient, love is kind. It is not jealous, it is not pompous, it is not inflated, it is not rude, it does not seek its own interests, it is not quick-tempered, it does not brood over injury, it does not rejoice over wrongdoing but rejoices with the truth. It bears all things, believes all things, hopes all things, endures all things."',
    translation: 'NABRE', reference: '1 Corinthians 13:4-7',
  },
  {
    id: 'prov-3-5-6', book: 'Proverbs', chapter: 3, verseStart: 5, verseEnd: 6,
    text: '"Trust in the LORD with all your heart, on your own intelligence do not rely; In all your ways be mindful of him, and he will make straight your paths."',
    translation: 'NABRE', reference: 'Proverbs 3:5-6',
  },
  {
    id: 'matt-5-14-16', book: 'Matthew', chapter: 5, verseStart: 14, verseEnd: 16,
    text: '"You are the light of the world. A city set on a mountain cannot be hidden. Nor do they light a lamp and then put it under a bushel basket; it is set on a lampstand, where it gives light to all in the house. Just so, your light must shine before others, that they may see your good deeds and glorify your heavenly Father."',
    translation: 'NABRE', reference: 'Matthew 5:14-16',
  },
];

export const SEED_SERMONS: Sermon[] = [
  {
    id: 'sermon-john-14-27',
    title: 'The Peace That Stays',
    passage: SEED_PASSAGES[0],
    reflection: "There's a particular kind of peace that the world offers — it's conditional, fleeting, tied to circumstances. Jesus speaks of something altogether different here. A peace that doesn't depend on things going well. A peace that remains even when the ground shifts beneath us.\n\nThis isn't a command to stop feeling troubled. It's an invitation to remember that peace is already present, already given, already yours. You don't have to earn it or achieve it. You simply receive it.",
    relevance: "In a world that moves relentlessly fast, where our attention is pulled in every direction, these words are an anchor. When anxiety rises, when the news overwhelms, when the future feels uncertain — this peace is still offered. Not as an escape from difficulty, but as a steady presence within it.",
    prayer: "Lord, help me receive the peace you offer — not the world's version, but yours. When my heart is troubled, remind me that your peace does not depend on my circumstances. Let me rest in it today. Amen.",
    createdAt: new Date().toISOString(),
  },
];

export const SEED_GUIDANCE_MAP: Record<string, Omit<GuidanceResult, 'id' | 'concern' | 'themes' | 'createdAt'>> = {
  fear: {
    passage: SEED_PASSAGES[4], // Isaiah 41:10
    pastoralFraming: "Fear is one of the most human experiences there is. It doesn't mean you lack faith — it means you're paying attention. A passage to sit with right now is one where God speaks directly to that feeling, not with disappointment, but with reassurance.",
    reflectionQuestions: [
      "What specifically feels uncertain or threatening right now?",
      "Can you recall a time when you felt afraid and found your way through? What carried you?"
    ],
    prayer: "God of comfort, I bring my fear to you — not because I should be ashamed of it, but because I trust you can hold it. Help me find steady ground today. Amen.",
  },
  grief: {
    passage: SEED_PASSAGES[8], // Psalm 34:18
    pastoralFraming: "Grief is not something to rush through or fix. It is the natural response of a heart that loved deeply. You may find light in knowing that scripture speaks of God being especially close in moments like this — not distant, not disappointed, but near.",
    reflectionQuestions: [
      "What do you most need to express or release right now?",
      "Is there a memory you'd like to hold gently today?"
    ],
    prayer: "Lord, you are close to the brokenhearted. Be close to me now. I don't need answers — I need your presence. Amen.",
  },
  loneliness: {
    passage: SEED_PASSAGES[1], // Psalm 23
    pastoralFraming: "Loneliness can feel like a vast, empty space. But here is a scripture many people turn to in moments like this — a psalm that speaks of being led, restored, and accompanied, even in the darkest valley. You are not walking alone, even when it feels that way.",
    reflectionQuestions: [
      "When have you felt most connected to something greater than yourself?",
      "What is one small way you could reach out or open up today?"
    ],
    prayer: "Good Shepherd, walk with me through this loneliness. Help me sense your presence in the quiet. Amen.",
  },
  forgiveness: {
    passage: SEED_PASSAGES[9], // 1 Cor 13:4-7
    pastoralFraming: "Forgiveness is rarely simple and never instant. Whether you're seeking to forgive someone else or yourself, it's a process that unfolds over time. Scripture doesn't demand that you feel forgiveness immediately — it invites you toward it, at your own pace.",
    reflectionQuestions: [
      "Is there something you need to forgive in yourself, or in someone else?",
      "What would it feel like to release even a small part of this weight?"
    ],
    prayer: "Merciful God, soften the places in me that have hardened. Help me move, even slowly, toward the freedom that forgiveness brings. Amen.",
  },
  purpose: {
    passage: SEED_PASSAGES[7], // Jeremiah 29:11
    pastoralFraming: "Feeling uncertain about your direction is more common than you might think. It doesn't mean you've failed or lost your way — sometimes it means you're standing at a threshold. Here is a passage that speaks to God's intentions, even when the path isn't clear yet.",
    reflectionQuestions: [
      "What brings you a sense of meaning, even in small moments?",
      "If you could trust that things are unfolding as they should, how would that change today?"
    ],
    prayer: "Lord, I don't need the whole map — just enough light for the next step. Help me trust your plan, even when I can't see it. Amen.",
  },
  peace: {
    passage: SEED_PASSAGES[6], // Psalm 46:10
    pastoralFraming: "Sometimes the most powerful thing we can do is simply stop. Not to give up, but to let go of the need to control everything. This passage invites you into stillness — not emptiness, but a fullness of presence.",
    reflectionQuestions: [
      "What would it mean for you to 'be still' right now?",
      "What are you holding onto that you might gently set down?"
    ],
    prayer: "God of peace, quiet my restless heart. Help me be still and know that you are here. Amen.",
  },
  gratitude: {
    passage: SEED_PASSAGES[3], // Phil 4:6-7
    pastoralFraming: "Gratitude has a way of shifting our perspective, not by denying what's hard, but by widening our view to include what's also good. This passage weaves thanksgiving right into the act of prayer — they go hand in hand.",
    reflectionQuestions: [
      "What is one thing today, however small, that you can be thankful for?",
      "How might gratitude change the way you approach a current challenge?"
    ],
    prayer: "Generous God, open my eyes to the gifts I've overlooked. Fill my heart with thanksgiving, even amid difficulty. Amen.",
  },
  temptation: {
    passage: SEED_PASSAGES[2], // Matt 11:28-30
    pastoralFraming: "Struggling with temptation doesn't make you a failure — it makes you human. Jesus doesn't stand apart from our struggle; he invites us to bring our burdens, including the ones we're ashamed of, to him. There is no judgment here, only an offer of rest.",
    reflectionQuestions: [
      "What is the deeper need that this temptation is trying to meet?",
      "Who in your life could you trust with this struggle?"
    ],
    prayer: "Lord, I bring my weakness to you without shame. Strengthen me, not through force, but through your gentle presence. Amen.",
  },
  conflict: {
    passage: SEED_PASSAGES[0], // John 14:27
    pastoralFraming: "Conflict stirs up powerful emotions — anger, hurt, the desire to be right. Before acting, you might find it helpful to sit with these words about peace. Not peace as the absence of conflict, but peace as a foundation to stand on while navigating it.",
    reflectionQuestions: [
      "What outcome would truly bring you peace in this situation?",
      "Can you see the other person's hurt, even if you disagree?"
    ],
    prayer: "Prince of Peace, help me approach this conflict with a heart open to understanding. Guide my words and soften my defensiveness. Amen.",
  },
  uncertainty: {
    passage: SEED_PASSAGES[10], // Prov 3:5-6
    pastoralFraming: "Not knowing what comes next can be deeply uncomfortable. But uncertainty isn't the opposite of faith — it may be where faith begins. This passage doesn't promise you'll understand everything; it promises that the path will become clear as you walk it.",
    reflectionQuestions: [
      "What would it look like to trust, even without full clarity?",
      "What is the next small step you can take, even without seeing the whole road?"
    ],
    prayer: "God, I trust you with what I cannot see. Guide my steps and give me courage for the unknown. Amen.",
  },
};

export const SEED_DAILY_LIGHTS: DailyLight[] = [
  {
    id: 'daily-1',
    date: new Date().toISOString().split('T')[0],
    passage: SEED_PASSAGES[11], // Matt 5:14-16
    reflection: "You are the light of the world. Not because of perfection, but because of presence. Today, this passage invites you to simply show up — as you are, where you are — and let your light be visible. Not for recognition, but as a quiet act of love.",
    prayer: "Lord, let my life be a gentle light today — not to impress, but to serve. Help me shine where I'm planted. Amen.",
    theme: 'light',
  },
  {
    id: 'daily-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    passage: SEED_PASSAGES[0], // John 14:27
    reflection: "Peace isn't the absence of noise — it's a presence that holds you in the middle of it. Today, you're invited to receive a peace that doesn't depend on everything being okay. It simply is, and it's offered freely.",
    prayer: "Jesus, let your peace settle over me like morning light. Not because everything is resolved, but because you are here. Amen.",
    theme: 'peace',
  },
];

export const SEED_THEMES: ContentTheme[] = [
  { id: 'theme-peace', name: 'Peace', passages: ['John 14:27', 'Psalm 46:10', 'Philippians 4:6-7'], active: true, order: 1 },
  { id: 'theme-courage', name: 'Courage', passages: ['Isaiah 41:10', 'Psalm 23:1-4'], active: true, order: 2 },
  { id: 'theme-rest', name: 'Rest', passages: ['Matthew 11:28-30'], active: true, order: 3 },
  { id: 'theme-purpose', name: 'Purpose', passages: ['Jeremiah 29:11', 'Proverbs 3:5-6'], active: true, order: 4 },
  { id: 'theme-love', name: 'Love', passages: ['1 Corinthians 13:4-7'], active: true, order: 5 },
  { id: 'theme-light', name: 'Light', passages: ['Matthew 5:14-16'], active: true, order: 6 },
];
