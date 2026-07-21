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
  {
    id: 'psalm-130-1-2', book: 'Psalms', chapter: 130, verseStart: 1, verseEnd: 2,
    text: '"Out of the depths I cry to you, O LORD! O Lord, hear my voice! Let your ears be attentive to the voice of my pleas for mercy!"', translation: 'ESV', reference: 'Psalm 130:1-2',
  },
  {
    id: 'isa-43-1-2', book: 'Isaiah', chapter: 43, verseStart: 1, verseEnd: 2,
    text: '"Fear not, for I have redeemed you; I have called you by name, you are mine. When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you; when you walk through fire you shall not be burned, and the flame shall not consume you."', translation: 'ESV', reference: 'Isaiah 43:1-2',
  },
  {
    id: 'lam-3-19-21', book: 'Lamentations', chapter: 3, verseStart: 19, verseEnd: 21,
    text: '"Remember my affliction and my wanderings, the wormwood and the gall! My soul continually remembers it and is bowed down within me. But this I call to mind, and therefore I have hope:"', translation: 'ESV', reference: 'Lamentations 3:19-21',
  },
  {
    id: 'psalm-51-17', book: 'Psalms', chapter: 51, verseStart: 17, verseEnd: 17,
    text: '"The sacrifices of God are a broken spirit; a broken and contrite heart, O God, you will not despise."', translation: 'ESV', reference: 'Psalm 51:17',
  },
  {
    id: '2-cor-4-7-9', book: '2 Corinthians', chapter: 4, verseStart: 7, verseEnd: 9,
    text: '"But we have this treasure in jars of clay, to show that the surpassing power belongs to God and not to us. We are afflicted in every way, but not crushed; perplexed, but not driven to despair; persecuted, but not forsaken; struck down, but not destroyed;"', translation: 'ESV', reference: '2 Corinthians 4:7-9',
  },
  {
    id: 'mark-4-39-40', book: 'Mark', chapter: 4, verseStart: 39, verseEnd: 40,
    text: '"And he awoke and rebuked the wind and said to the sea, \'Peace! Be still!\' And the wind ceased, and there was a great calm. He said to them, \'Why are you so afraid? Have you still no faith?\'"', translation: 'ESV', reference: 'Mark 4:39-40',
  },
  {
    id: 'john-13-7', book: 'John', chapter: 13, verseStart: 7, verseEnd: 7,
    text: '"Jesus answered him, \'What I am doing you do not understand now, but afterward you will understand.\'"', translation: 'ESV', reference: 'John 13:7',
  },
  {
    id: 'rom-8-26', book: 'Romans', chapter: 8, verseStart: 26, verseEnd: 26,
    text: '"Likewise the Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us with groanings too deep for words."', translation: 'ESV', reference: 'Romans 8:26',
  },
  {
    id: 'job-13-15', book: 'Job', chapter: 13, verseStart: 15, verseEnd: 15,
    text: '"Though he slay me, I will hope in him; yet I will argue my ways to his face."', translation: 'ESV', reference: 'Job 13:15',
  },
  {
    id: 'psalm-88-18', book: 'Psalms', chapter: 88, verseStart: 18, verseEnd: 18,
    text: '"You have caused my beloved and my friend to shun me; my companions have become darkness."', translation: 'ESV', reference: 'Psalm 88:18',
  },
  {
    id: 'matt-26-39', book: 'Matthew', chapter: 26, verseStart: 39, verseEnd: 39,
    text: '"And going a little farther he fell on his face and prayed, saying, \'My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as you will.\'"', translation: 'ESV', reference: 'Matthew 26:39',
  },
  {
    id: 'john-20-27-28', book: 'John', chapter: 20, verseStart: 27, verseEnd: 28,
    text: '"Then he said to Thomas, \'Put your finger here, and see my hands; and put out your hand, and place it in my side. Do not disbelieve, but believe.\' Thomas answered him, \'My Lord and my God!\'"', translation: 'ESV', reference: 'John 20:27-28',
  },
  {
    id: 'luke-22-31-32', book: 'Luke', chapter: 22, verseStart: 31, verseEnd: 32,
    text: '"Simon, Simon, behold, Satan demanded to have you, that he might sift you like wheat, but I have prayed for you that your faith may not fail. And when you have turned again, strengthen your brothers."', translation: 'ESV', reference: 'Luke 22:31-32',
  },
  {
    id: 'psalm-27-13-14', book: 'Psalms', chapter: 27, verseStart: 13, verseEnd: 14,
    text: '"I believe that I shall look upon the goodness of the LORD in the land of the living! Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!"', translation: 'ESV', reference: 'Psalm 27:13-14',
  },
  {
    id: 'isa-54-10', book: 'Isaiah', chapter: 54, verseStart: 10, verseEnd: 10,
    text: '"For the mountains may depart and the hills be removed, but my steadfast love shall not depart from you, and my covenant of peace shall not be removed, says the LORD, who has compassion on you."', translation: 'ESV', reference: 'Isaiah 54:10',
  },
  {
    id: '1-kings-19-4', book: '1 Kings', chapter: 19, verseStart: 4, verseEnd: 4,
    text: '"But he himself went a day\'s journey into the wilderness and came and sat down under a broom tree. And he asked that he might die, saying, \'It is enough; now, O LORD, take away my life, for I am no better than my fathers.\'"', translation: 'ESV', reference: '1 Kings 19:4',
  },
  {
    id: 'psalm-139-11-12', book: 'Psalms', chapter: 139, verseStart: 11, verseEnd: 12,
    text: '"If I say, \'Surely the darkness shall cover me, and the light about me be night,\' even the darkness is not dark to you; the night is bright as the day, for darkness is as light with you."', translation: 'ESV', reference: 'Psalm 139:11-12',
  },
  {
    id: 'rom-5-3-5', book: 'Romans', chapter: 5, verseStart: 3, verseEnd: 5,
    text: '"Not only that, but we rejoice in our sufferings, knowing that suffering produces endurance, and endurance produces character, and character produces hope, and hope does not put us to shame..."', translation: 'ESV', reference: 'Romans 5:3-5',
  },
  {
    id: 'heb-11-1', book: 'Hebrews', chapter: 11, verseStart: 1, verseEnd: 1,
    text: '"Now faith is the assurance of things hoped for, the conviction of things not seen."', translation: 'ESV', reference: 'Hebrews 11:1',
  },
  {
    id: '2-cor-1-8-9', book: '2 Corinthians', chapter: 1, verseStart: 8, verseEnd: 9,
    text: '"For we do not want you to be unaware, brothers, of the affliction we experienced in Asia. For we were so utterly burdened beyond our strength that we despaired of life itself. Indeed, we felt that we had received the sentence of death. But that was to make us rely not on ourselves but on God who raises the dead."', translation: 'ESV', reference: '2 Corinthians 1:8-9',
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
  {
    id: 'daily-new-0',
    date: new Date(Date.now() - 0).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'psalm-130-1-2')!,
    reflection: 'We often feel that our prayers are invalid if we are depressed, failing, or overwhelmed. We think we need to clean ourselves up before God will listen. This text shatters that requirement. If you are in the depths today, do not waste your energy trying to pretend you are standing on solid ground. Let your plea for mercy be honest. The God of the heights is listening to the depths.',
    prayer: 'Lord, I am crying out to you from the depths. I cannot pull myself out. Hear my voice. Let your ears be attentive to my plea for mercy today. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'isa-43-1-2')!,
    reflection: 'When disaster strikes, our first conclusion is often that God has abandoned us, because we equate His love with a comfortable life. Isaiah redefines safety. True safety is not the absence of the flood; it is the presence of God in the flood. The invitation today is to stop demanding a life without fire, and to lean entirely on the One who promises to walk through it with you.',
    prayer: 'Father, I am terrified of the waters and the fire in front of me. Anchor my soul in your promise. Remind me that I belong to you, and that you are with me in the flood. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-2',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'lam-3-19-21')!,
    reflection: 'Trauma has a way of hijacking our memory, forcing us to replay our worst moments until they feel like our only reality. Jeremiah offers a survival tactic. When the bitter memories threaten to pull you under, you must actively call to mind the character of God. The practice today is to intercept your spiraling thoughts with deliberate, stubborn remembrance of grace.',
    prayer: 'Lord, my mind is bowing down under the weight of bitter memories. Give me the strength to forcefully call your faithfulness to mind. Let my hope be anchored in your character. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-3',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'psalm-51-17')!,
    reflection: 'When we fail, our instinct is to manage our image, make excuses, or try to balance the scales with good deeds. David stops the cover-up. The most liberating thing you can do when you are crushed by your own failure is to hand the broken pieces directly to God without a PR spin. He does not despise the broken; He heals them.',
    prayer: 'God, I have nothing impressive to offer you today. I bring you the only acceptable sacrifice: a broken and contrite heart. Do not despise my failure. Heal me. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-4',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === '2-cor-4-7-9')!,
    reflection: 'We spend our lives trying to pretend we are titanium vaults, hiding our cracks and our weariness. Paul says the cracks are precisely where the light gets out. You do not have to be unbreakable to carry the glory of God. If you feel like a fragile, crumbling jar of clay today, you are the exact vessel God designed to demonstrate His surviving power.',
    prayer: 'Lord, I feel fragile and easily broken. Forgive my desperate attempts to look strong. Let my cracks display your surpassing power. Hold me together today. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-5',
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'mark-4-39-40')!,
    reflection: 'We often interpret God\'s silence during our crises as abandonment. We want Him to wake up and panic with us. But His calm is evidence of His control. The storm in your life is terrifying to you, but it is entirely subject to His voice. The invitation today is to stop demanding that God panic, and instead, rest in the boat with Him.',
    prayer: 'Jesus, the storm around me is loud, and I am terrified that you are asleep. Rebuke the chaos. Give me the faith to trust that a life anchored to you cannot sink. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-6',
    date: new Date(Date.now() - 518400000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'john-13-7')!,
    reflection: 'We are obsessed with the \'why\' of our circumstances. We feel entitled to an explanation before we submit to the process. Jesus asks for the exact opposite. He is doing something in your life right now that makes no sense to you. The challenge is to let Him wash your feet—to let Him work—without demanding the blueprint first. The understanding will come later.',
    prayer: 'Lord, I am deeply confused by what you are allowing in my life right now. I surrender my demand for an immediate explanation. Help me to trust what you are doing in the dark. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-7',
    date: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'rom-8-26')!,
    reflection: 'If you are too exhausted, too grieving, or too confused to pray today, do not add guilt to your burden. You do not need to construct a coherent theological argument to get God\'s attention. Your silence and your tears are already being translated by the Spirit. Rest in the profound comfort that you are being prayed for, even when you cannot pray.',
    prayer: 'Holy Spirit, I have no words left. I do not know what to ask for. Take my confusion and my groaning, and intercede for me according to the will of God. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-8',
    date: new Date(Date.now() - 691200000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'job-13-15')!,
    reflection: 'Faith is often presented as a serene, untroubled disposition. Job proves that true faith can look like a furious, heartbroken argument with the Almighty. You are allowed to be angry. You are allowed to demand answers. But true faith takes its argument directly to God, refusing to walk away. The practice today is to stay in the room with God, even if all you have is tears and questions.',
    prayer: 'Lord, my life feels like a paradox, and I am struggling to understand your hand in my pain. Though I am crushed, give me the fierce grace to keep hoping in you. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-9',
    date: new Date(Date.now() - 777600000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'psalm-88-18')!,
    reflection: 'If you are in a season of darkness that refuses to lift, the church often makes you feel like a spiritual failure for not \'getting over it.\' Psalm 88 is your defense attorney. You do not have to fake a breakthrough. The fact that you are still crying out to God, even when the only answer is darkness, is an act of profound, stubborn faith.',
    prayer: 'God, the darkness feels absolute, and the isolation is heavy. I have no praise left to offer today. Accept my raw lament as my prayer. Sit with me in the dark. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-10',
    date: new Date(Date.now() - 864000000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'matt-26-39')!,
    reflection: 'We are often taught that if we just have enough faith, God will give us what we want. Gethsemane shatters that theology. Sometimes, the cup does not pass. True faith is not the ability to command God to change our circumstances; it is the agonizing, beautiful surrender to His ultimate purpose, even when it costs us everything.',
    prayer: 'Father, I am begging for this cup of suffering to pass from me. But if it cannot, give me the strength of Christ to say: nevertheless, not my will, but yours be done. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-11',
    date: new Date(Date.now() - 950400000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'john-20-27-28')!,
    reflection: 'We often feel shame over our doubts, believing that God is disgusted by our need for proof. This passage reveals a Savior who moves toward the skeptic. Furthermore, it reminds us that our God knows what it is to be wounded. If you are struggling to believe today, you don\'t need a philosophical argument; you need to look at the scars of the God who suffered for you.',
    prayer: 'Jesus, I am struggling with doubt and I need reassurance. Thank you that you do not despise my questions. Let me see your scars, and let my doubt turn into worship. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-12',
    date: new Date(Date.now() - 1036800000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'luke-22-31-32')!,
    reflection: 'When we undergo intense spiritual or emotional sifting, we assume we are outside of God\'s protection. But the sifting is often permitted to destroy our deadly self-reliance. Your security does not rest on your flawless performance; it rests on the fact that the Son of God is actively praying for you right now. Your failure will not be fatal.',
    prayer: 'Lord, the sifting is intense, and my courage is failing. I take refuge in the fact that you are praying for me. Hold my faith together when I cannot hold it myself. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-13',
    date: new Date(Date.now() - 1123200000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'psalm-27-13-14')!,
    reflection: 'We are a culture that demands immediate resolution. When God delays, we assume He is denying. David challenges us to an active, courageous waiting. The command to \'let your heart take courage\' implies that courage is a choice you make while waiting in the dark. Do not abandon your post today. The goodness of God is coming.',
    prayer: 'God, I am exhausted from waiting, and I am tempted to take control of the situation. Give my heart the courage to stay at my post. Let me see your goodness in the land of the living. Amen.',
    theme: 'peace',
  },
  {
    id: 'daily-new-14',
    date: new Date(Date.now() - 1209600000).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === 'isa-54-10')!,
    reflection: 'When the structures of our lives—our health, our careers, our relationships—begin to shake and crumble, we feel like we are in freefall. Isaiah offers a tether. The things you thought were permanent may depart, but the steadfast love of God will not. If your mountains are shaking today, shift your weight onto the only promise that survives the earthquake.',
    prayer: 'Father, the foundations of my life feel like they are shaking, and I am terrified. Anchor my soul to your covenant of peace. Remind me that your steadfast love outlasts the mountains. Amen.',
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
