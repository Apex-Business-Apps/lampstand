import os

passages = [
  { "id": "psalm-130-1-2", "book": "Psalms", "chapter": 130, "verseStart": 1, "verseEnd": 2, "text": "\"Out of the depths I cry to you, O LORD! O Lord, hear my voice! Let your ears be attentive to the voice of my pleas for mercy!\"", "translation": "ESV", "reference": "Psalm 130:1-2" },
  { "id": "isa-43-1-2", "book": "Isaiah", "chapter": 43, "verseStart": 1, "verseEnd": 2, "text": "\"Fear not, for I have redeemed you; I have called you by name, you are mine. When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you; when you walk through fire you shall not be burned, and the flame shall not consume you.\"", "translation": "ESV", "reference": "Isaiah 43:1-2" },
  { "id": "lam-3-19-21", "book": "Lamentations", "chapter": 3, "verseStart": 19, "verseEnd": 21, "text": "\"Remember my affliction and my wanderings, the wormwood and the gall! My soul continually remembers it and is bowed down within me. But this I call to mind, and therefore I have hope:\"", "translation": "ESV", "reference": "Lamentations 3:19-21" },
  { "id": "psalm-51-17", "book": "Psalms", "chapter": 51, "verseStart": 17, "verseEnd": 17, "text": "\"The sacrifices of God are a broken spirit; a broken and contrite heart, O God, you will not despise.\"", "translation": "ESV", "reference": "Psalm 51:17" },
  { "id": "2-cor-4-7-9", "book": "2 Corinthians", "chapter": 4, "verseStart": 7, "verseEnd": 9, "text": "\"But we have this treasure in jars of clay, to show that the surpassing power belongs to God and not to us. We are afflicted in every way, but not crushed; perplexed, but not driven to despair; persecuted, but not forsaken; struck down, but not destroyed;\"", "translation": "ESV", "reference": "2 Corinthians 4:7-9" },
  { "id": "mark-4-39-40", "book": "Mark", "chapter": 4, "verseStart": 39, "verseEnd": 40, "text": "\"And he awoke and rebuked the wind and said to the sea, 'Peace! Be still!' And the wind ceased, and there was a great calm. He said to them, 'Why are you so afraid? Have you still no faith?'\"", "translation": "ESV", "reference": "Mark 4:39-40" },
  { "id": "john-13-7", "book": "John", "chapter": 13, "verseStart": 7, "verseEnd": 7, "text": "\"Jesus answered him, 'What I am doing you do not understand now, but afterward you will understand.'\"", "translation": "ESV", "reference": "John 13:7" },
  { "id": "rom-8-26", "book": "Romans", "chapter": 8, "verseStart": 26, "verseEnd": 26, "text": "\"Likewise the Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us with groanings too deep for words.\"", "translation": "ESV", "reference": "Romans 8:26" },
  { "id": "job-13-15", "book": "Job", "chapter": 13, "verseStart": 15, "verseEnd": 15, "text": "\"Though he slay me, I will hope in him; yet I will argue my ways to his face.\"", "translation": "ESV", "reference": "Job 13:15" },
  { "id": "psalm-88-18", "book": "Psalms", "chapter": 88, "verseStart": 18, "verseEnd": 18, "text": "\"You have caused my beloved and my friend to shun me; my companions have become darkness.\"", "translation": "ESV", "reference": "Psalm 88:18" },
  { "id": "matt-26-39", "book": "Matthew", "chapter": 26, "verseStart": 39, "verseEnd": 39, "text": "\"And going a little farther he fell on his face and prayed, saying, 'My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as you will.'\"", "translation": "ESV", "reference": "Matthew 26:39" },
  { "id": "john-20-27-28", "book": "John", "chapter": 20, "verseStart": 27, "verseEnd": 28, "text": "\"Then he said to Thomas, 'Put your finger here, and see my hands; and put out your hand, and place it in my side. Do not disbelieve, but believe.' Thomas answered him, 'My Lord and my God!'\"", "translation": "ESV", "reference": "John 20:27-28" },
  { "id": "luke-22-31-32", "book": "Luke", "chapter": 22, "verseStart": 31, "verseEnd": 32, "text": "\"Simon, Simon, behold, Satan demanded to have you, that he might sift you like wheat, but I have prayed for you that your faith may not fail. And when you have turned again, strengthen your brothers.\"", "translation": "ESV", "reference": "Luke 22:31-32" },
  { "id": "psalm-27-13-14", "book": "Psalms", "chapter": 27, "verseStart": 13, "verseEnd": 14, "text": "\"I believe that I shall look upon the goodness of the LORD in the land of the living! Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!\"", "translation": "ESV", "reference": "Psalm 27:13-14" },
  { "id": "isa-54-10", "book": "Isaiah", "chapter": 54, "verseStart": 10, "verseEnd": 10, "text": "\"For the mountains may depart and the hills be removed, but my steadfast love shall not depart from you, and my covenant of peace shall not be removed, says the LORD, who has compassion on you.\"", "translation": "ESV", "reference": "Isaiah 54:10" },
  { "id": "1-kings-19-4", "book": "1 Kings", "chapter": 19, "verseStart": 4, "verseEnd": 4, "text": "\"But he himself went a day's journey into the wilderness and came and sat down under a broom tree. And he asked that he might die, saying, 'It is enough; now, O LORD, take away my life, for I am no better than my fathers.'\"", "translation": "ESV", "reference": "1 Kings 19:4" },
  { "id": "psalm-139-11-12", "book": "Psalms", "chapter": 139, "verseStart": 11, "verseEnd": 12, "text": "\"If I say, 'Surely the darkness shall cover me, and the light about me be night,' even the darkness is not dark to you; the night is bright as the day, for darkness is as light with you.\"", "translation": "ESV", "reference": "Psalm 139:11-12" },
  { "id": "rom-5-3-5", "book": "Romans", "chapter": 5, "verseStart": 3, "verseEnd": 5, "text": "\"Not only that, but we rejoice in our sufferings, knowing that suffering produces endurance, and endurance produces character, and character produces hope, and hope does not put us to shame...\"", "translation": "ESV", "reference": "Romans 5:3-5" },
  { "id": "heb-11-1", "book": "Hebrews", "chapter": 11, "verseStart": 1, "verseEnd": 1, "text": "\"Now faith is the assurance of things hoped for, the conviction of things not seen.\"", "translation": "ESV", "reference": "Hebrews 11:1" },
  { "id": "2-cor-1-8-9", "book": "2 Corinthians", "chapter": 1, "verseStart": 8, "verseEnd": 9, "text": "\"For we do not want you to be unaware, brothers, of the affliction we experienced in Asia. For we were so utterly burdened beyond our strength that we despaired of life itself. Indeed, we felt that we had received the sentence of death. But that was to make us rely not on ourselves but on God who raises the dead.\"", "translation": "ESV", "reference": "2 Corinthians 1:8-9" }
]

drafts = {
  "psalm-130-1-2": {
    "title": "The Voice from the Depths",
    "reflection": "The psalmist does not pray from a place of spiritual triumph. He prays from 'the depths'—the Hebrew imagery for the chaotic, drowning waters of the abyss. This is the prayer of a person who is entirely overwhelmed. The radical theology here is that the depths are not outside of God's jurisdiction. God's ear is attentive even to the voice that is drowning. He does not demand that we climb out of the abyss before we pray; He invites us to cry out from the bottom.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We often feel that our prayers are invalid if we are depressed, failing, or overwhelmed. We think we need to clean ourselves up before God will listen. This text shatters that requirement. If you are in the depths today, do not waste your energy trying to pretend you are standing on solid ground. Let your plea for mercy be honest. The God of the heights is listening to the depths.",
    "prayer": "Lord, I am crying out to you from the depths. I cannot pull myself out. Hear my voice. Let your ears be attentive to my plea for mercy today. Amen."
  },
  "isa-43-1-2": {
    "title": "The Promise of Presence in the Fire",
    "reflection": "God does not promise His people immunity from suffering. The text does not say 'if' you pass through the waters, but 'when'. Fire and flood are guarantees in a fractured world. The promise is not evasion; the promise is presence. 'I will be with you.' God claims ownership of His people—'you are mine'—and that ownership means He will walk directly into the floodwaters and the furnace with them, ensuring that the suffering will not be the final word.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When disaster strikes, our first conclusion is often that God has abandoned us, because we equate His love with a comfortable life. Isaiah redefines safety. True safety is not the absence of the flood; it is the presence of God in the flood. The invitation today is to stop demanding a life without fire, and to lean entirely on the One who promises to walk through it with you.",
    "prayer": "Father, I am terrified of the waters and the fire in front of me. Anchor my soul in your promise. Remind me that I belong to you, and that you are with me in the flood. Amen."
  },
  "lam-3-19-21": {
    "title": "The Discipline of Memory",
    "reflection": "Jeremiah is drowning in the memory of his trauma. The wormwood and the gall are vivid metaphors for intense, bitter suffering. His soul is 'bowed down' by the intrusive repetition of his grief. But in verse 21, he executes a violent pivot of the mind: 'But this I call to mind, and therefore I have hope.' He does not try to erase the bitter memory; he intentionally introduces a superior memory—the memory of God's steadfast love. Hope is not a feeling here; it is the refusal to let trauma dictate the entire narrative.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "Trauma has a way of hijacking our memory, forcing us to replay our worst moments until they feel like our only reality. Jeremiah offers a survival tactic. When the bitter memories threaten to pull you under, you must actively call to mind the character of God. The practice today is to intercept your spiraling thoughts with deliberate, stubborn remembrance of grace.",
    "prayer": "Lord, my mind is bowing down under the weight of bitter memories. Give me the strength to forcefully call your faithfulness to mind. Let my hope be anchored in your character. Amen."
  },
  "psalm-51-17": {
    "title": "The Acceptable Sacrifice",
    "reflection": "David wrote this psalm after the catastrophic moral failure with Bathsheba. He knows that no amount of religious ritual can buy off God's anger. A million slaughtered bulls will not fix the wreckage of his sin. The only sacrifice God will not despise is the one thing we instinctively try to hide from Him: a broken and contrite heart. God is not looking for a polished religious performance; He is looking for the absolute surrender of a shattered ego.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When we fail, our instinct is to manage our image, make excuses, or try to balance the scales with good deeds. David stops the cover-up. The most liberating thing you can do when you are crushed by your own failure is to hand the broken pieces directly to God without a PR spin. He does not despise the broken; He heals them.",
    "prayer": "God, I have nothing impressive to offer you today. I bring you the only acceptable sacrifice: a broken and contrite heart. Do not despise my failure. Heal me. Amen."
  },
  "2-cor-4-7-9": {
    "title": "The Theology of Jars of Clay",
    "reflection": "In the ancient world, valuables were stored in thick, secure vaults. Paul uses a shocking metaphor: God has placed the ultimate treasure—the glory of the Gospel—into cheap, fragile, easily broken clay pots. The fragility is not a design flaw; it is the point. If the container were indestructible, people would praise the container. Because the container is weak, afflicted, and struck down, it becomes undeniable that the surviving power belongs entirely to God. Weakness is the stage for divine power.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We spend our lives trying to pretend we are titanium vaults, hiding our cracks and our weariness. Paul says the cracks are precisely where the light gets out. You do not have to be unbreakable to carry the glory of God. If you feel like a fragile, crumbling jar of clay today, you are the exact vessel God designed to demonstrate His surviving power.",
    "prayer": "Lord, I feel fragile and easily broken. Forgive my desperate attempts to look strong. Let my cracks display your surpassing power. Hold me together today. Amen."
  },
  "mark-4-39-40": {
    "title": "The Sleep of Sovereignty",
    "reflection": "The disciples are experienced fishermen panicking in a lethal storm, while Jesus is asleep on a cushion. His sleep is not apathy; it is the profound rest of absolute sovereignty. When He wakes, He speaks to the chaos of the sea the way one scolds a disruptive child: 'Peace! Be still!' The storm instantly submits. But His question to the disciples is piercing: 'Have you still no faith?' He expected them to know that a boat carrying the Son of God could not sink, regardless of the weather.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We often interpret God's silence during our crises as abandonment. We want Him to wake up and panic with us. But His calm is evidence of His control. The storm in your life is terrifying to you, but it is entirely subject to His voice. The invitation today is to stop demanding that God panic, and instead, rest in the boat with Him.",
    "prayer": "Jesus, the storm around me is loud, and I am terrified that you are asleep. Rebuke the chaos. Give me the faith to trust that a life anchored to you cannot sink. Amen."
  },
  "john-13-7": {
    "title": "The Postponement of Understanding",
    "reflection": "Jesus is washing Peter's feet—an act of staggering divine humiliation that offends Peter's sense of propriety. Peter demands an explanation. Jesus refuses to give one in the moment, offering only a promise: 'afterward you will understand.' Jesus claims the right to act in our lives in ways that are deeply confusing, disorienting, and seemingly contradictory, asking for obedience before comprehension. Understanding is not a prerequisite for trust; it is the eventual reward.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We are obsessed with the 'why' of our circumstances. We feel entitled to an explanation before we submit to the process. Jesus asks for the exact opposite. He is doing something in your life right now that makes no sense to you. The challenge is to let Him wash your feet—to let Him work—without demanding the blueprint first. The understanding will come later.",
    "prayer": "Lord, I am deeply confused by what you are allowing in my life right now. I surrender my demand for an immediate explanation. Help me to trust what you are doing in the dark. Amen."
  },
  "rom-8-26": {
    "title": "The Groaning Spirit",
    "reflection": "Paul identifies a common, agonizing human experience: the paralysis of prayer. There are times when suffering is so dense, or confusion so profound, that we simply do not know what to ask for. We have no words. In this precise moment of weakness, the Holy Spirit steps in as our proxy. The Spirit does not offer polite, articulate sentences; He intercedes with 'groanings too deep for words.' God the Spirit takes our inarticulate agony and translates it perfectly to God the Father.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "If you are too exhausted, too grieving, or too confused to pray today, do not add guilt to your burden. You do not need to construct a coherent theological argument to get God's attention. Your silence and your tears are already being translated by the Spirit. Rest in the profound comfort that you are being prayed for, even when you cannot pray.",
    "prayer": "Holy Spirit, I have no words left. I do not know what to ask for. Take my confusion and my groaning, and intercede for me according to the will of God. Amen."
  },
  "job-13-15": {
    "title": "The Paradox of Desperate Trust",
    "reflection": "Job utters what might be the most staggering declaration of faith in the entire biblical canon. His life is a smoking crater. He believes God is the one actively destroying him. Yet, in the same breath that he accuses God of slaying him, he declares his absolute hope in Him. This is not passive resignation; the second half of the verse says, 'yet I will argue my ways to his face.' It is a fierce, wrestling, bleeding trust that refuses to let go of God, even when God seems like the enemy.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "Faith is often presented as a serene, untroubled disposition. Job proves that true faith can look like a furious, heartbroken argument with the Almighty. You are allowed to be angry. You are allowed to demand answers. But true faith takes its argument directly to God, refusing to walk away. The practice today is to stay in the room with God, even if all you have is tears and questions.",
    "prayer": "Lord, my life feels like a paradox, and I am struggling to understand your hand in my pain. Though I am crushed, give me the fierce grace to keep hoping in you. Amen."
  },
  "psalm-88-18": {
    "title": "The Psalm Without a Resolution",
    "reflection": "Psalm 88 is the darkest chapter in the Bible. It is a relentless, suffocating lament from a person suffering from chronic illness and isolation. Unlike almost every other psalm of lament, it does not end with a sudden pivot to praise. The final word in the Hebrew text is literally 'darkness.' Yet, this psalm is canonized. The Holy Spirit inspired it and preserved it. By doing so, God validates the experience of absolute, unresolved depression as a legitimate part of the life of faith.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "If you are in a season of darkness that refuses to lift, the church often makes you feel like a spiritual failure for not 'getting over it.' Psalm 88 is your defense attorney. You do not have to fake a breakthrough. The fact that you are still crying out to God, even when the only answer is darkness, is an act of profound, stubborn faith.",
    "prayer": "God, the darkness feels absolute, and the isolation is heavy. I have no praise left to offer today. Accept my raw lament as my prayer. Sit with me in the dark. Amen."
  },
  "matt-26-39": {
    "title": "The Agony of the Cup",
    "reflection": "In Gethsemane, the Son of God is sweating blood, terrified of the impending cross. He prays for an escape hatch: 'let this cup pass from me.' The humanity of Jesus is on full, agonizing display. He does not want to suffer. But the turning point of human history hinges on the next phrase: 'nevertheless, not as I will, but as you will.' He subordinates His legitimate human desire for safety to the terrifying, redemptive will of the Father. This is the ultimate definition of obedience.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We are often taught that if we just have enough faith, God will give us what we want. Gethsemane shatters that theology. Sometimes, the cup does not pass. True faith is not the ability to command God to change our circumstances; it is the agonizing, beautiful surrender to His ultimate purpose, even when it costs us everything.",
    "prayer": "Father, I am begging for this cup of suffering to pass from me. But if it cannot, give me the strength of Christ to say: nevertheless, not my will, but yours be done. Amen."
  },
  "john-20-27-28": {
    "title": "The Wounds of God",
    "reflection": "Thomas missed the initial resurrection appearance and demanded empirical proof. When Jesus finally appears, He does not scold Thomas for his skepticism. He accommodates it. He offers His scars. The profound theological reality here is that Jesus kept His wounds after the resurrection. The scars are not a flaw in His glorified body; they are His eternal credentials of love. Thomas touches the trauma of God, and his skepticism instantly collapses into the highest christological confession in the Gospel: 'My Lord and my God!'\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We often feel shame over our doubts, believing that God is disgusted by our need for proof. This passage reveals a Savior who moves toward the skeptic. Furthermore, it reminds us that our God knows what it is to be wounded. If you are struggling to believe today, you don't need a philosophical argument; you need to look at the scars of the God who suffered for you.",
    "prayer": "Jesus, I am struggling with doubt and I need reassurance. Thank you that you do not despise my questions. Let me see your scars, and let my doubt turn into worship. Amen."
  },
  "luke-22-31-32": {
    "title": "The Sifting and the Surety",
    "reflection": "Jesus informs Peter of a terrifying reality: Satan has requested permission to crush him, and God has allowed it. But Jesus does not say, 'I have prayed that you won't be sifted.' He says, 'I have prayed for you that your faith may not fail.' Jesus knows Peter is about to violently deny Him. But Jesus looks past the impending failure to the eventual restoration: 'when you have turned again.' Peter's survival does not depend on his own courage, which is about to evaporate; it depends entirely on the intercession of Christ.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When we undergo intense spiritual or emotional sifting, we assume we are outside of God's protection. But the sifting is often permitted to destroy our deadly self-reliance. Your security does not rest on your flawless performance; it rests on the fact that the Son of God is actively praying for you right now. Your failure will not be fatal.",
    "prayer": "Lord, the sifting is intense, and my courage is failing. I take refuge in the fact that you are praying for me. Hold my faith together when I cannot hold it myself. Amen."
  },
  "psalm-27-13-14": {
    "title": "Confidence in the Waiting",
    "reflection": "David is surrounded by false witnesses and violent enemies. The pressure is crushing. Verse 13 is a gasp for air: 'I believe that I shall look upon the goodness of the LORD in the land of the living!' He refuses to postpone God's goodness entirely to the afterlife. He expects grace here, in the dirt and blood of the present world. But the mechanism for experiencing this is grueling: 'Wait for the LORD.' Waiting requires an active, muscular courage. It is the refusal to panic and take matters into your own hands.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We are a culture that demands immediate resolution. When God delays, we assume He is denying. David challenges us to an active, courageous waiting. The command to 'let your heart take courage' implies that courage is a choice you make while waiting in the dark. Do not abandon your post today. The goodness of God is coming.",
    "prayer": "God, I am exhausted from waiting, and I am tempted to take control of the situation. Give my heart the courage to stay at my post. Let me see your goodness in the land of the living. Amen."
  },
  "isa-54-10": {
    "title": "The Unshakeable Covenant",
    "reflection": "In the ancient world, mountains were the symbols of ultimate permanence and stability. Isaiah uses apocalyptic imagery: even if the most permanent fixtures of the earth dissolve into chaos, there is one reality that will not fracture—God's 'covenant of peace.' This is not a contract based on our performance; it is a one-sided promise anchored entirely in the 'compassion' of the Lord. The steadfast love (hesed) of God is more durable than geology.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When the structures of our lives—our health, our careers, our relationships—begin to shake and crumble, we feel like we are in freefall. Isaiah offers a tether. The things you thought were permanent may depart, but the steadfast love of God will not. If your mountains are shaking today, shift your weight onto the only promise that survives the earthquake.",
    "prayer": "Father, the foundations of my life feel like they are shaking, and I am terrified. Anchor my soul to your covenant of peace. Remind me that your steadfast love outlasts the mountains. Amen."
  },
  "1-kings-19-4": {
    "title": "The Exhaustion of the Prophet",
    "reflection": "Elijah has just defeated the prophets of Baal and called down fire from heaven. But one threat from Jezebel breaks him. He runs into the desert, collapses under a broom tree, and asks God to kill him. He is suffering from profound physical, emotional, and spiritual burnout. The remarkable thing is God's response. God does not rebuke his lack of faith or give him a theological lecture. God lets him sleep, and sends an angel to bake him bread. God treats the prophet's depression with radical, practical tenderness.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We often spiritualize our exhaustion, assuming that our depression or burnout is a sign of spiritual failure. This text gives us permission to be entirely, humanly depleted. Sometimes the most spiritual thing you can do is not to pray harder, but to sleep, eat, and let God care for your physical body. You do not have to be strong today.",
    "prayer": "Lord, I am depleted, exhausted, and running on empty. Thank you that you do not rebuke my frailty. Give me the grace to stop striving, to rest, and to receive your practical care. Amen."
  },
  "psalm-139-11-12": {
    "title": "The Illumination of the Dark",
    "reflection": "The psalmist contemplates the terrifying possibility of being swallowed by absolute darkness—whether literal danger, depression, or hiding from God. But he arrives at a stunning realization: darkness is only an obstacle to human eyes. To the Creator of light, the darkness is utterly transparent. 'The night is bright as the day.' God does not need to turn on a light to find us in the abyss; His presence is the light that penetrates the thickest gloom.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When depression or anxiety descends, it feels like a heavy blanket that cuts us off from God and humanity. We feel hidden and lost. This psalm promises that your darkness does not confuse God. He can see you perfectly in the pitch black. You do not have to find your way back to the light; the Light has already found you in the dark.",
    "prayer": "God, the darkness feels overwhelming, and I feel entirely lost. Remind my soul that the night is not dark to you. See me in this place, and sit with me until the light returns. Amen."
  },
  "rom-5-3-5": {
    "title": "The Chain Reaction of Suffering",
    "reflection": "Paul makes a claim that sounds insane to modern ears: 'we rejoice in our sufferings.' He is not a masochist; he rejoices because he understands the mechanics of grace. Suffering is the catalyst for a divine chain reaction. It produces endurance (the muscle to keep going), which produces character (a soul tested in the fire), which produces hope (an unshakeable confidence in God). This hope 'does not put us to shame' because it is not based on human optimism, but on the Holy Spirit poured into our hearts.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We typically view suffering as a meaningless interruption to our lives. Paul demands that we view it as a forge. Your pain is not random, and it is not wasted. It is the exact tool God is using to forge a bulletproof hope in your soul. The challenge today is to stop fighting the process, and let the suffering do its holy work.",
    "prayer": "Lord, I despise this suffering, and I want an exit. Change my perspective. Let this pain produce endurance, character, and an unshakeable hope that will not put me to shame. Amen."
  },
  "heb-11-1": {
    "title": "The Architecture of Faith",
    "reflection": "The writer defines faith not as a blind leap in the dark, but as a solid, structural reality. 'Assurance' (hypostasis) is a word used for a title deed or a foundation. 'Conviction' is the legal evidence presented in a courtroom. Faith is treating the promises of God as absolute, concrete realities, even when they are completely invisible to the physical eye. It is the ability to live in the present based on the absolute certainty of God's future.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "We are trained to only trust what we can see, measure, and control. Biblical faith demands a completely different operating system. It asks you to bet your entire life on a God you cannot see. If your circumstances look bleak today, faith is the defiant refusal to let the visible world have the final say. Hold the title deed of God's promise.",
    "prayer": "Father, my eyes are overwhelmed by the visible problems around me. Give me the assurance of things hoped for. Let my faith be a solid foundation when everything else gives way. Amen."
  },
  "2-cor-1-8-9": {
    "title": "The Death of Self-Reliance",
    "reflection": "Paul, the great apostle, admits to an episode of absolute psychological and physical collapse. He was 'burdened beyond strength' and 'despaired of life itself.' He felt the executioner's sword on his neck. But then he reveals the theological purpose of this absolute crushing: 'to make us rely not on ourselves but on God who raises the dead.' God allowed the pressure to exceed Paul's human capacity so that his illusion of self-reliance would be permanently shattered.\\n\\n${TONE_SUFFIX.balanced}",
    "relevance": "When we are pushed beyond our limits, we feel like we are failing. Paul says that reaching the end of your strength is actually the beginning of true faith. If you are utterly burdened today, do not try to manufacture more strength. Let your self-reliance die, and fall entirely on the God who raises the dead. You are exactly where He wants you.",
    "prayer": "Lord, I am burdened beyond my strength, and I am despairing. I have nothing left. Break my illusion of self-reliance, and teach me to rely entirely on the God who raises the dead. Amen."
  }
}

seed_path = "src/data/seed.ts"
with open(seed_path, "r", encoding="utf-8") as f:
    seed_content = f.read()

new_passages_str = ""
for p in passages:
    new_passages_str += f"""  {{
    id: '{p['id']}', book: '{p['book']}', chapter: {p['chapter']}, verseStart: {p['verseStart']}, verseEnd: {p['verseEnd']},
    text: '{p['text'].replace("'", "\\'")}', translation: '{p['translation']}', reference: '{p['reference']}',
  }},\n"""

seed_content = seed_content.replace('];\n\nexport const SEED_SERMONS', new_passages_str + '];\n\nexport const SEED_SERMONS')

# Generate new daylight passages out of these
import datetime
new_daily_lights_str = ""
for i, p in enumerate(passages[:15]): # Just take first 15 for daily lights
    # extract a short reflection
    reflection_text = drafts[p['id']]['relevance'].replace('\\n\\n', ' ').replace("'", "\\'")
    prayer_text = drafts[p['id']]['prayer'].replace("'", "\\'")
    new_daily_lights_str += f"""  {{
    id: 'daily-new-{i}',
    date: new Date(Date.now() - {i * 86400000}).toISOString().split('T')[0],
    passage: SEED_PASSAGES.find(p => p.id === '{p['id']}')!,
    reflection: '{reflection_text}',
    prayer: '{prayer_text}',
    theme: 'peace',
  }},\n"""

seed_content = seed_content.replace('];\n\nexport const SEED_THEMES', new_daily_lights_str + '];\n\nexport const SEED_THEMES')

with open(seed_path, "w", encoding="utf-8") as f:
    f.write(seed_content)

lib_path = "src/data/sermonLibrary.ts"
with open(lib_path, "r", encoding="utf-8") as f:
    lib_content = f.read()

new_drafts_str = ""
for k, v in drafts.items():
    new_drafts_str += f"""  '{k}': {{
    title: '{v['title'].replace("'", "\\'")}',
    reflection: `{v['reflection']}`,
    relevance: `{v['relevance']}`,
    prayer: `{v['prayer']}`,
  }},\n"""

lib_content = lib_content.replace('};\n\nfunction buildFallbackDraft', new_drafts_str + '};\n\nfunction buildFallbackDraft')
with open(lib_path, "w", encoding="utf-8") as f:
    f.write(lib_content)

print("Successfully updated seed.ts and sermonLibrary.ts with 20 MORE deep passages.")
