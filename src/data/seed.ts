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
    text: '"For I know well the plans I have in mind for you-oracle of the LORD-plans for your welfare and not for woe, so as to give you a future of hope."',
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
  {
    id: 'lam-3-22-23', book: 'Lamentations', chapter: 3, verseStart: 22, verseEnd: 23,
    text: '"The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness."', translation: 'ESV', reference: 'Lamentations 3:22-23',
  },
  {
    id: 'isa-40-31', book: 'Isaiah', chapter: 40, verseStart: 31, verseEnd: 31,
    text: '"but those who wait for the LORD shall renew their strength, they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint."', translation: 'ESV', reference: 'Isaiah 40:31',
  },
  {
    id: 'josh-1-9', book: 'Joshua', chapter: 1, verseStart: 9, verseEnd: 9,
    text: '"Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go."', translation: 'ESV', reference: 'Joshua 1:9',
  },
  {
    id: 'zeph-3-17', book: 'Zephaniah', chapter: 3, verseStart: 17, verseEnd: 17,
    text: '"The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing."', translation: 'ESV', reference: 'Zephaniah 3:17',
  },
  {
    id: 'psalm-121-1-2', book: 'Psalms', chapter: 121, verseStart: 1, verseEnd: 2,
    text: '"I lift up my eyes to the hills. From where does my help come? My help comes from the LORD, who made heaven and earth."', translation: 'ESV', reference: 'Psalm 121:1-2',
  },
  {
    id: 'rom-12-2', book: 'Romans', chapter: 12, verseStart: 2, verseEnd: 2,
    text: '"Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect."', translation: 'ESV', reference: 'Romans 12:2',
  },
  {
    id: '2-cor-12-9', book: '2 Corinthians', chapter: 12, verseStart: 9, verseEnd: 9,
    text: '"But he said to me, \'My grace is sufficient for you, for my power is made perfect in weakness.\' Therefore I will boast all the more gladly of my weaknesses, so that the power of Christ may rest upon me."', translation: 'ESV', reference: '2 Corinthians 12:9',
  },
  {
    id: 'eph-2-8-9', book: 'Ephesians', chapter: 2, verseStart: 8, verseEnd: 9,
    text: '"For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."', translation: 'ESV', reference: 'Ephesians 2:8-9',
  },
  {
    id: 'col-3-12-14', book: 'Colossians', chapter: 3, verseStart: 12, verseEnd: 14,
    text: '"Put on then, as God\'s chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience, bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive."', translation: 'ESV', reference: 'Colossians 3:12-14',
  },
  {
    id: 'heb-4-15-16', book: 'Hebrews', chapter: 4, verseStart: 15, verseEnd: 16,
    text: '"For we do not have a high priest who is unable to sympathize with our weaknesses, but one who in every respect has been tempted as we are, yet without sin. Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need."', translation: 'ESV', reference: 'Hebrews 4:15-16',
  },
  {
    id: 'jas-1-2-4', book: 'James', chapter: 1, verseStart: 2, verseEnd: 4,
    text: '"Count it all joy, my brothers, when you meet trials of various kinds, for you know that the testing of your faith produces steadfastness. And let steadfastness have its full effect, that you may be perfect and complete, lacking in nothing."', translation: 'ESV', reference: 'James 1:2-4',
  },
  {
    id: '1-pet-5-7', book: '1 Peter', chapter: 5, verseStart: 7, verseEnd: 7,
    text: '"casting all your anxieties on him, because he cares for you."', translation: 'ESV', reference: '1 Peter 5:7',
  },
  {
    id: '1-john-4-18', book: '1 John', chapter: 4, verseStart: 18, verseEnd: 18,
    text: '"There is no fear in love, but perfect love casts out fear. For fear has to do with punishment, and whoever fears has not been perfected in love."', translation: 'ESV', reference: '1 John 4:18',
  },
  {
    id: 'rev-21-3-4', book: 'Revelation', chapter: 21, verseStart: 3, verseEnd: 4,
    text: '"And I heard a loud voice from the throne saying, \'Behold, the dwelling place of God is with man... He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore, for the former things have passed away.\'"', translation: 'ESV', reference: 'Revelation 21:3-4',
  },
  {
    id: 'matt-6-33-34', book: 'Matthew', chapter: 6, verseStart: 33, verseEnd: 34,
    text: '"But seek first the kingdom of God and his righteousness, and all these things will be added to you. Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble."', translation: 'ESV', reference: 'Matthew 6:33-34',
  },
  {
    id: 'john-16-33', book: 'John', chapter: 16, verseStart: 33, verseEnd: 33,
    text: '"I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world."', translation: 'ESV', reference: 'John 16:33',
  },
  {
    id: 'rom-15-13', book: 'Romans', chapter: 15, verseStart: 13, verseEnd: 13,
    text: '"May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope."', translation: 'ESV', reference: 'Romans 15:13',
  },
  {
    id: 'gal-5-22-23', book: 'Galatians', chapter: 5, verseStart: 22, verseEnd: 23,
    text: '"But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law."', translation: 'ESV', reference: 'Galatians 5:22-23',
  },
  {
    id: 'phil-1-6', book: 'Philippians', chapter: 1, verseStart: 6, verseEnd: 6,
    text: '"And I am sure of this, that he who began a good work in you will bring it to completion at the day of Jesus Christ."', translation: 'ESV', reference: 'Philippians 1:6',
  },
  {
    id: 'gen-50-20', book: 'Genesis', chapter: 50, verseStart: 20, verseEnd: 20,
    text: '"As for you, you meant evil against me, but God meant it for good, to bring it about that many people should be kept alive, as they are today."', translation: 'ESV', reference: 'Genesis 50:20',
  },
  {
    id: 'exod-14-14', book: 'Exodus', chapter: 14, verseStart: 14, verseEnd: 14,
    text: '"The LORD will fight for you, and you have only to be silent."', translation: 'ESV', reference: 'Exodus 14:14',
  },
  {
    id: '1-kings-19-11-12', book: '1 Kings', chapter: 19, verseStart: 11, verseEnd: 12,
    text: '"And after the earthquake a fire, but the LORD was not in the fire. And after the fire the sound of a low whisper."', translation: 'ESV', reference: '1 Kings 19:11-12',
  },
  {
    id: 'job-38-4', book: 'Job', chapter: 38, verseStart: 4, verseEnd: 4,
    text: '"Where were you when I laid the foundation of the earth? Tell me, if you have understanding."', translation: 'ESV', reference: 'Job 38:4',
  },
  {
    id: 'micah-6-8', book: 'Micah', chapter: 6, verseStart: 8, verseEnd: 8,
    text: '"He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?"', translation: 'ESV', reference: 'Micah 6:8',
  },
  {
    id: 'luke-15-20', book: 'Luke', chapter: 15, verseStart: 20, verseEnd: 20,
    text: '"And he arose and came to his father. But while he was still a long way off, his father saw him and felt compassion, and ran and embraced him and kissed him."', translation: 'ESV', reference: 'Luke 15:20',
  },
  {
    id: 'luke-10-33-34', book: 'Luke', chapter: 10, verseStart: 33, verseEnd: 34,
    text: '"But a Samaritan, as he journeyed, came to where he was, and when he saw him, he had compassion. He went to him and bound up his wounds, pouring on oil and wine."', translation: 'ESV', reference: 'Luke 10:33-34',
  },
  {
    id: 'matt-13-44', book: 'Matthew', chapter: 13, verseStart: 44, verseEnd: 44,
    text: '"The kingdom of heaven is like treasure hidden in a field, which a man found and covered up. Then in his joy he goes and sells all that he has and buys that field."', translation: 'ESV', reference: 'Matthew 13:44',
  },
  {
    id: 'matt-25-40', book: 'Matthew', chapter: 25, verseStart: 40, verseEnd: 40,
    text: '"And the King will answer them, \'Truly, I say to you, as you did it to one of the least of these my brothers, you did it to me.\'"', translation: 'ESV', reference: 'Matthew 25:40',
  },
  {
    id: 'john-1-5', book: 'John', chapter: 1, verseStart: 5, verseEnd: 5,
    text: '"The light shines in the darkness, and the darkness has not overcome it."', translation: 'ESV', reference: 'John 1:5',
  },
  {
    id: 'john-15-5', book: 'John', chapter: 15, verseStart: 5, verseEnd: 5,
    text: '"I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing."', translation: 'ESV', reference: 'John 15:5',
  },
  {
    id: 'rom-5-8', book: 'Romans', chapter: 5, verseStart: 8, verseEnd: 8,
    text: '"But God shows his love for us in that while we were still sinners, Christ died for us."', translation: 'ESV', reference: 'Romans 5:8',
  },
  {
    id: 'eph-3-20-21', book: 'Ephesians', chapter: 3, verseStart: 20, verseEnd: 21,
    text: '"Now to him who is able to do far more abundantly than all that we ask or think, according to the power at work within us, to him be glory in the church and in Christ Jesus throughout all generations, forever and ever. Amen."', translation: 'ESV', reference: 'Ephesians 3:20-21',
  },
  {
    id: '2-cor-4-16-17', book: '2 Corinthians', chapter: 4, verseStart: 16, verseEnd: 17,
    text: '"So we do not lose heart. Though our outer self is wasting away, our inner self is being renewed day by day. For this light momentary affliction is preparing for us an eternal weight of glory beyond all comparison."', translation: 'ESV', reference: '2 Corinthians 4:16-17',
  },
  {
    id: 'luke-24-32', book: 'Luke', chapter: 24, verseStart: 32, verseEnd: 32,
    text: '"They said to each other, \'Did not our hearts burn within us while he talked to us on the road, while he opened to us the Scriptures?\'"', translation: 'ESV', reference: 'Luke 24:32',
  },
  {
    id: 'eccl-3-11', book: 'Ecclesiastes', chapter: 3, verseStart: 11, verseEnd: 11,
    text: '"He has made everything beautiful in its time. Also, he has put eternity into man\'s heart, yet so that he cannot find out what God has done from the beginning to the end."', translation: 'ESV', reference: 'Ecclesiastes 3:11',
  },
  {
    id: 'gen-16-13', book: 'Genesis', chapter: 16, verseStart: 13, verseEnd: 13,
    text: '"So she called the name of the LORD who spoke to her, \'You are a God of seeing,\' for she said, \'Truly here I have seen him who looks after me.\'"', translation: 'ESV', reference: 'Genesis 16:13',
  },
  {
    id: 'isa-53-3', book: 'Isaiah', chapter: 53, verseStart: 3, verseEnd: 3,
    text: '"He was despised and rejected by men, a man of sorrows and acquainted with grief; and as one from whom men hide their faces he was despised, and we esteemed him not."', translation: 'ESV', reference: 'Isaiah 53:3',
  },
  {
    id: 'hosea-2-14', book: 'Hosea', chapter: 2, verseStart: 14, verseEnd: 14,
    text: '"Therefore, behold, I will allure her, and bring her into the wilderness, and speak tenderly to her."', translation: 'ESV', reference: 'Hosea 2:14',
  },
  {
    id: 'hab-3-17-18', book: 'Habakkuk', chapter: 3, verseStart: 17, verseEnd: 18,
    text: '"Though the fig tree should not blossom, nor fruit be on the vines, the produce of the olive fail and the fields yield no food, the flock be cut off from the fold and there be no herd in the stalls, yet I will rejoice in the LORD; I will take joy in the God of my salvation."', translation: 'ESV', reference: 'Habakkuk 3:17-18',
  },
  {
    id: 'mark-9-24', book: 'Mark', chapter: 9, verseStart: 24, verseEnd: 24,
    text: '"Immediately the father of the child cried out and said, \'I believe; help my unbelief!\'"', translation: 'ESV', reference: 'Mark 9:24',
  },
  {
    id: 'luke-7-47', book: 'Luke', chapter: 7, verseStart: 47, verseEnd: 47,
    text: '"Therefore I tell you, her sins, which are many, are forgiven—for she loved much. But he who is forgiven little, loves little."', translation: 'ESV', reference: 'Luke 7:47',
  },
  {
    id: 'john-11-35', book: 'John', chapter: 11, verseStart: 35, verseEnd: 35,
    text: '"Jesus wept."', translation: 'ESV', reference: 'John 11:35',
  },
  {
    id: 'acts-17-27-28', book: 'Acts', chapter: 17, verseStart: 27, verseEnd: 28,
    text: '"that they should seek God, and perhaps feel their way toward him and find him. Yet he is actually not far from each one of us, for \'In him we live and move and have our being.\'"', translation: 'ESV', reference: 'Acts 17:27-28',
  },
  {
    id: 'rom-8-1', book: 'Romans', chapter: 8, verseStart: 1, verseEnd: 1,
    text: '"There is therefore now no condemnation for those who are in Christ Jesus."', translation: 'ESV', reference: 'Romans 8:1',
  },
  {
    id: '2-cor-1-3-4', book: '2 Corinthians', chapter: 1, verseStart: 3, verseEnd: 4,
    text: '"Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our affliction, so that we may be able to comfort those who are in any affliction, with the comfort with which we ourselves are comforted by God."', translation: 'ESV', reference: '2 Corinthians 1:3-4',
  },
  {
    id: 'gal-2-20', book: 'Galatians', chapter: 2, verseStart: 20, verseEnd: 20,
    text: '"I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me."', translation: 'ESV', reference: 'Galatians 2:20',
  },
  {
    id: 'phil-2-5-7', book: 'Philippians', chapter: 2, verseStart: 5, verseEnd: 7,
    text: '"Have this mind among yourselves, which is yours in Christ Jesus, who, though he was in the form of God, did not count equality with God a thing to be grasped, but emptied himself, by taking the form of a servant, being born in the likeness of men."', translation: 'ESV', reference: 'Philippians 2:5-7',
  },
  {
    id: 'heb-12-1-2', book: 'Hebrews', chapter: 12, verseStart: 1, verseEnd: 2,
    text: '"Therefore, since we are surrounded by so great a cloud of witnesses, let us also lay aside every weight, and sin which clings so closely, and let us run with endurance the race that is set before us, looking to Jesus, the founder and perfecter of our faith..."', translation: 'ESV', reference: 'Hebrews 12:1-2',
  },
  {
    id: 'rev-3-20', book: 'Revelation', chapter: 3, verseStart: 20, verseEnd: 20,
    text: '"Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and eat with him, and he with me."', translation: 'ESV', reference: 'Revelation 3:20',
  },
];

export const SEED_SERMONS: Sermon[] = [
  {
    id: 'sermon-john-14-27',
    title: 'The Peace That Stays',
    passage: SEED_PASSAGES[0],
    reflection: "There's a particular kind of peace that the world offers - it's conditional, fleeting, tied to circumstances. Jesus speaks of something altogether different here. A peace that doesn't depend on things going well. A peace that remains even when the ground shifts beneath us.\n\nThis isn't a command to stop feeling troubled. It's an invitation to remember that peace is already present, already given, already yours. You don't have to earn it or achieve it. You simply receive it.",
    relevance: "In a world that moves relentlessly fast, where our attention is pulled in every direction, these words are an anchor. When anxiety rises, when the news overwhelms, when the future feels uncertain - this peace is still offered. Not as an escape from difficulty, but as a steady presence within it.",
    prayer: "Lord, help me receive the peace you offer - not the world's version, but yours. When my heart is troubled, remind me that your peace does not depend on my circumstances. Let me rest in it today. Amen.",
    createdAt: new Date().toISOString(),
  },
];

export const SEED_GUIDANCE_MAP: Record<string, Omit<GuidanceResult, 'id' | 'concern' | 'themes' | 'createdAt'>> = {
  fear: {
    passage: SEED_PASSAGES[4], // Isaiah 41:10
    pastoralFraming: "Fear is one of the most human experiences there is. It doesn't mean you lack faith - it means you're paying attention. A passage to sit with right now is one where God speaks directly to that feeling, not with disappointment, but with reassurance.",
    reflectionQuestions: [
      "What specifically feels uncertain or threatening right now?",
      "Can you recall a time when you felt afraid and found your way through? What carried you?"
    ],
    prayer: "God of comfort, I bring my fear to you - not because I should be ashamed of it, but because I trust you can hold it. Help me find steady ground today. Amen.",
  },
  grief: {
    passage: SEED_PASSAGES[8], // Psalm 34:18
    pastoralFraming: "Grief is not something to rush through or fix. It is the natural response of a heart that loved deeply. You may find light in knowing that scripture speaks of God being especially close in moments like this - not distant, not disappointed, but near.",
    reflectionQuestions: [
      "What do you most need to express or release right now?",
      "Is there a memory you'd like to hold gently today?"
    ],
    prayer: "Lord, you are close to the brokenhearted. Be close to me now. I don't need answers - I need your presence. Amen.",
  },
  loneliness: {
    passage: SEED_PASSAGES[1], // Psalm 23
    pastoralFraming: "Loneliness can feel like a vast, empty space. But here is a scripture many people turn to in moments like this - a psalm that speaks of being led, restored, and accompanied, even in the darkest valley. You are not walking alone, even when it feels that way.",
    reflectionQuestions: [
      "When have you felt most connected to something greater than yourself?",
      "What is one small way you could reach out or open up today?"
    ],
    prayer: "Good Shepherd, walk with me through this loneliness. Help me sense your presence in the quiet. Amen.",
  },
  forgiveness: {
    passage: SEED_PASSAGES[9], // 1 Cor 13:4-7
    pastoralFraming: "Forgiveness is rarely simple and never instant. Whether you're seeking to forgive someone else or yourself, it's a process that unfolds over time. Scripture doesn't demand that you feel forgiveness immediately - it invites you toward it, at your own pace.",
    reflectionQuestions: [
      "Is there something you need to forgive in yourself, or in someone else?",
      "What would it feel like to release even a small part of this weight?"
    ],
    prayer: "Merciful God, soften the places in me that have hardened. Help me move, even slowly, toward the freedom that forgiveness brings. Amen.",
  },
  purpose: {
    passage: SEED_PASSAGES[7], // Jeremiah 29:11
    pastoralFraming: "Feeling uncertain about your direction is more common than you might think. It doesn't mean you've failed or lost your way - sometimes it means you're standing at a threshold. Here is a passage that speaks to God's intentions, even when the path isn't clear yet.",
    reflectionQuestions: [
      "What brings you a sense of meaning, even in small moments?",
      "If you could trust that things are unfolding as they should, how would that change today?"
    ],
    prayer: "Lord, I don't need the whole map - just enough light for the next step. Help me trust your plan, even when I can't see it. Amen.",
  },
  peace: {
    passage: SEED_PASSAGES[6], // Psalm 46:10
    pastoralFraming: "Sometimes the most powerful thing we can do is simply stop. Not to give up, but to let go of the need to control everything. This passage invites you into stillness - not emptiness, but a fullness of presence.",
    reflectionQuestions: [
      "What would it mean for you to 'be still' right now?",
      "What are you holding onto that you might gently set down?"
    ],
    prayer: "God of peace, quiet my restless heart. Help me be still and know that you are here. Amen.",
  },
  gratitude: {
    passage: SEED_PASSAGES[3], // Phil 4:6-7
    pastoralFraming: "Gratitude has a way of shifting our perspective, not by denying what's hard, but by widening our view to include what's also good. This passage weaves thanksgiving right into the act of prayer - they go hand in hand.",
    reflectionQuestions: [
      "What is one thing today, however small, that you can be thankful for?",
      "How might gratitude change the way you approach a current challenge?"
    ],
    prayer: "Generous God, open my eyes to the gifts I've overlooked. Fill my heart with thanksgiving, even amid difficulty. Amen.",
  },
  temptation: {
    passage: SEED_PASSAGES[2], // Matt 11:28-30
    pastoralFraming: "Struggling with temptation doesn't make you a failure - it makes you human. Jesus doesn't stand apart from our struggle; he invites us to bring our burdens, including the ones we're ashamed of, to him. There is no judgment here, only an offer of rest.",
    reflectionQuestions: [
      "What is the deeper need that this temptation is trying to meet?",
      "Who in your life could you trust with this struggle?"
    ],
    prayer: "Lord, I bring my weakness to you without shame. Strengthen me, not through force, but through your gentle presence. Amen.",
  },
  conflict: {
    passage: SEED_PASSAGES[0], // John 14:27
    pastoralFraming: "Conflict stirs up powerful emotions - anger, hurt, the desire to be right. Before acting, you might find it helpful to sit with these words about peace. Not peace as the absence of conflict, but peace as a foundation to stand on while navigating it.",
    reflectionQuestions: [
      "What outcome would truly bring you peace in this situation?",
      "Can you see the other person's hurt, even if you disagree?"
    ],
    prayer: "Prince of Peace, help me approach this conflict with a heart open to understanding. Guide my words and soften my defensiveness. Amen.",
  },
  uncertainty: {
    passage: SEED_PASSAGES[10], // Prov 3:5-6
    pastoralFraming: "Not knowing what comes next can be deeply uncomfortable. But uncertainty isn't the opposite of faith - it may be where faith begins. This passage doesn't promise you'll understand everything; it promises that the path will become clear as you walk it.",
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
    reflection: "You are the light of the world. Not because of perfection, but because of presence. Today, this passage invites you to simply show up - as you are, where you are - and let your light be visible. Not for recognition, but as a quiet act of love.",
    prayer: "Lord, let my life be a gentle light today - not to impress, but to serve. Help me shine where I'm planted. Amen.",
    theme: 'light',
  },
  {
    id: 'daily-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    passage: SEED_PASSAGES[0], // John 14:27
    reflection: "Peace isn't the absence of noise - it's a presence that holds you in the middle of it. Today, you're invited to receive a peace that doesn't depend on everything being okay. It simply is, and it's offered freely.",
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
