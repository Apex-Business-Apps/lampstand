import type { Sermon, ScripturePassage, ToneStyle } from '@/types';

type SermonDraft = {
  title: string;
  reflection: string;
  relevance: string;
  prayer: string;
};

const TONE_SUFFIX: Record<ToneStyle, string> = {
  gentle: 'Read this passage slowly. Its weight is not meant to crush you, but to steady you.',
  balanced: 'The passage is not a slogan. It is a claim about reality, and it asks to be trusted in ordinary life.',
  traditional: 'The Church has received this kind of word by praying it, keeping it, and allowing it to correct the heart over time.',
};

const SERMON_LIBRARY: Record<string, SermonDraft> = {
  'john-14-27': {
    title: 'Peace on the Night Before Trouble',
    reflection: `John 14:27 belongs to the farewell words of Jesus. He speaks peace while betrayal, fear, and death are already pressing in. That matters. The peace he gives is not the calm that appears after every threat disappears. It is a gift placed inside the room before the disciples know how badly they will need it. Jesus names the heart honestly, troubled and afraid, then gives something deeper than reassurance.

This peace is not numbness. It does not ask the soul to pretend. It teaches the soul where to rest when circumstances refuse to become simple. ${TONE_SUFFIX.balanced}`,
    relevance: `This matters today because many people live with a low-grade alarm running underneath everything. News, bills, family pressure, health concerns, grief, and the constant demand to be available can train the heart to treat anxiety as wisdom. John 14:27 interrupts that training.

The practical invitation is not to manufacture serenity. It is to receive Christ's peace as a truer voice than panic. A faithful response may be very small: pause before reacting, breathe before answering, pray before spiraling, and refuse to let fear become the author of the next decision.`,
    prayer: `Lord Jesus, give me the peace you promised, not a thin calm that depends on everything going well, but your own peace. When my heart is troubled, teach it where to rest. Amen.`,
  },
  'psalm-23-1-4': {
    title: 'Led Through the Valley, Not Abandoned in It',
    reflection: `Psalm 23 is often treated like a soft image, but its comfort has muscle. The shepherd provides, restores, guides, protects, and stays close when the landscape turns dangerous. The psalm does not deny the valley. It names it, then refuses to let the valley have the final word. The rod and staff are not decoration. They are signs that guidance and protection are active, even when the sheep cannot see the whole terrain.

The center of the passage is not that life becomes gentle. The center is that the Lord remains present and attentive in terrain that is not gentle.`,
    relevance: `This matters today because exhaustion can make a person believe they must be their own shepherd. They must plan every path, defend every opening, anticipate every threat, and restore their own soul by force. Psalm 23 tells a better truth.

A faithful response is to stop confusing vigilance with faithfulness. There is work to do, but there is also being led. There are decisions to make, but there is also provision. The next step may be to ask where restoration is actually being offered, then accept it without shame.`,
    prayer: `Lord, shepherd me where I cannot shepherd myself. Restore what I have spent. Guide what I cannot untangle. Stay close in the valley, and make me brave enough to follow. Amen.`,
  },
  'matt-11-28-30': {
    title: 'The Yoke That Gives Rest',
    reflection: `Matthew 11:28-30 is not a vague invitation to relax. Jesus speaks to people worn down by burdens, including the religious weight of trying to prove themselves acceptable. A yoke is an image of being joined to a way of life. Jesus does not offer a life with no obedience. He offers an obedience shaped by his own heart, meek and humble, where the soul is not crushed by performance.

The rest here is not laziness. It is the relief of belonging to a Master who does not exploit the weary.`,
    relevance: `This matters today because many people are tired in a way sleep alone cannot repair. They are tired of measuring up, explaining themselves, optimizing everything, carrying family expectations, spiritual pressure, financial anxiety, and private guilt. This passage does not shame that tiredness. It calls it by name.

The practical invitation is to notice which burdens were never given by Christ. Some responsibilities are real. Some are inherited fear. Some are pride disguised as duty. Rest begins when the false yokes are named and the person returns to the one voice that is gentle enough to be trusted.`,
    prayer: `Jesus, I bring you the burdens that have made my soul tired. Teach me your way. Remove what is false, strengthen what is faithful, and give me the rest only you can give. Amen.`,
  },
  'phil-4-6-7': {
    title: 'Peace That Guards the Inner Room',
    reflection: `Philippians 4:6-7 does not treat anxiety like a character flaw. Paul writes to a community that knows pressure, conflict, and uncertainty. He gives them a pattern: bring everything to God by prayer and petition, with thanksgiving. Thanksgiving does not erase need. It keeps need from becoming the only thing the heart can see.

The promise is striking: peace will guard the heart and mind. Not explain everything. Guard. The image is protective. God places a sentry around the inner life when circumstances remain unresolved.`,
    relevance: `This matters today because anxiety often turns the mind into a courtroom where every fear gets to argue all night. The passage gives the heart somewhere else to send the case. It does not say, worry about nothing because nothing matters. It says, bring everything because God is near enough to receive it.

A faithful response is concrete: name the request, name one grace already present, and leave both before God. The peace may come before the answer. That does not make it imaginary. It makes it grace.`,
    prayer: `God of peace, take what keeps circling in my mind. Receive my requests, restore my gratitude, and guard the places in me that fear has been trying to occupy. Amen.`,
  },
  'isaiah-41-10': {
    title: 'Held by the Right Hand of God',
    reflection: `Isaiah 41:10 speaks to a frightened people who need more than encouragement. The passage piles up promises: I am with you, I am your God, I will strengthen you, I will help you, I will uphold you. The repetition matters. Fear repeats itself, so God answers with repeated presence.

This is not positive thinking. It is covenant language. The reason not to fear is not that the threat is fake. The reason is that God has bound himself to his people and does not withdraw when they become weak.`,
    relevance: `This matters today because fear often isolates. It tells a person they must become stronger before they can be helped, steadier before they can pray, clearer before they can move. Isaiah reverses that order. God strengthens the weak. God helps the one who needs help. God upholds before collapse becomes the whole story.

The practical invitation is to stop treating weakness as disqualification. A simple prayer, a call for help, a slower decision, a refusal to panic, these can become acts of faith when they rest on the promise that God is near.`,
    prayer: `Lord, I am not as strong as I want to be. Strengthen me. Help me. Uphold me. Let your presence be louder than the fear that keeps repeating itself. Amen.`,
  },
  'rom-8-28': {
    title: 'Good Without Denial',
    reflection: `Romans 8:28 is often flattened into a quick answer, but Paul places it inside a chapter full of suffering, groaning, waiting, weakness, and hope. The verse does not say all things are good. It says God works in all things for good for those who love him. That difference protects the wounded from cheap comfort.

The good in Romans 8 is not mere convenience. It is conformity to Christ, endurance in hope, and the final assurance that suffering does not get the last word over God's purpose.`,
    relevance: `This matters today because people often reach for this verse at the worst possible moment and use it too quickly. Used badly, it can silence grief. Used faithfully, it gives grief somewhere to stand.

The practical invitation is patience. Do not call evil good. Do not rush pain into a lesson. But do not surrender the story to chaos either. Faith can say, this hurts, this is not how it should be, and still God is not absent from the ruins. That is not denial. That is hope with its eyes open.`,
    prayer: `Father, keep me from cheap answers. Teach me to trust your purpose without pretending pain is good. Work in what I cannot repair, and hold me in hope. Amen.`,
  },
  'psalm-46-10': {
    title: 'Stillness in a Shaking World',
    reflection: `Psalm 46:10 is often quoted as a private calming verse, but the psalm itself is full of upheaval. Earth gives way, waters roar, nations rage, kingdoms totter. Into that noise comes the command to be still and know that God is God. The stillness is not passivity. It is the surrender of the illusion that panic keeps the world together.

This verse does not ask a person to become indifferent. It asks them to stop mistaking frantic control for faith. God is exalted before the storm obeys.`,
    relevance: `This matters today because acceleration has become a spiritual pressure. Faster replies, faster outrage, faster decisions, faster fear. The soul can begin to believe that if it stops moving, everything will collapse. Psalm 46 tells the truth: God is not held up by our nervous energy.

A faithful response may be one deliberate pause. Put the phone down. Let silence expose the fear beneath the noise. Say the verse slowly, not to escape responsibility, but to return responsibility to its proper size before God.`,
    prayer: `God, quiet the panic that pretends to protect me. Teach me stillness that is brave, not numb. Be God in the places I cannot control. Amen.`,
  },
  'jer-29-11': {
    title: 'Hope Written to Exiles',
    reflection: `Jeremiah 29:11 was first spoken to people in exile, not to people receiving an instant rescue. The wider letter tells them to build houses, plant gardens, seek the welfare of the city, and live faithfully in a place they did not choose. That context gives the promise its depth. God knows the plans, but the people still have to live through a long obedience.

The hope is not escape from time. It is God's faithful purpose inside time, even when the setting is unwanted and the wait is longer than anyone hoped.`,
    relevance: `This matters today because this verse is often treated like a guarantee of quick success. The real promise is stronger and more sobering. God can give a future and a hope without pretending the present is easy.

A faithful response is to build in the meantime. Make the phone call. Keep the discipline. Repair what can be repaired. Plant something good where you are, even if where you are is not where you wanted to be. Hope is not waiting with empty hands. It is faithfulness while God carries the horizon.`,
    prayer: `Lord, give me hope that can survive a long wait. Help me live faithfully where I am, not only where I wish I were. Hold my future in your hands. Amen.`,
  },
  'psalm-34-18': {
    title: 'Near to the Brokenhearted',
    reflection: `Psalm 34:18 gives one of Scripture's clearest answers to crushedness: nearness. It does not say the brokenhearted are embarrassing, spiritually deficient, or too much to bear. It says the Lord is close. That is not a small promise. When a spirit is crushed, distance can feel like the deepest wound. God answers that wound with presence.

The passage also refuses to romanticize pain. The crushed spirit needs saving, not a lecture. The Lord's closeness is compassionate and active.`,
    relevance: `This matters today because people often hide their grief until it becomes presentable. They wait to pray until they can sound composed. They wait to be honest until they can control the shape of the story. Psalm 34:18 gives permission to come broken.

A faithful response may be to stop editing the prayer. Say the truth plainly. Ask for nearness before answers. Let one trustworthy person know the heart is not okay. God does not move away from brokenhearted people. The passage says he moves close.`,
    prayer: `Lord, be close to the places in me that are broken. Save what feels crushed. I do not need to sound strong before you. I need your nearness. Amen.`,
  },
  '1-cor-13-4-7': {
    title: 'Love That Refuses to Perform',
    reflection: `First Corinthians 13 is not merely a wedding reading. Paul places it in the middle of a divided church arguing over status, gifts, knowledge, and spiritual importance. That context sharpens every line. Love is patient and kind because the community has become impatient and competitive. Love does not boast because the church has been using spiritual gifts as a stage.

Paul is not defining sentiment. He is describing the shape of Christlike life when ego has been dethroned. Love becomes the test of whether power, knowledge, and devotion are actually holy.`,
    relevance: `This matters today because people can use talent, conviction, competence, even religion, without love. The result may look impressive and still wound everyone nearby. This passage asks harder questions than whether someone means well. It asks whether their presence is patient, kind, truthful, enduring, and free from self-display.

A faithful response is to test one relationship honestly. Where am I keeping score? Where am I performing goodness? Where does truth need kindness, and where does kindness need truth? Love is not weakness. It is strength submitted to God.`,
    prayer: `Lord, teach me love that is patient, truthful, and free from performance. Dethrone my ego where it hides inside good intentions. Make my strength safe for others. Amen.`,
  },
  'prov-3-5-6': {
    title: 'Trust Beyond Self-Reliance',
    reflection: `Proverbs 3:5-6 does not insult the mind. It challenges the proud heart that treats its own understanding as final. Wisdom begins when the whole self leans on the Lord, not when thinking stops. To acknowledge God in all your ways is to bring decisions, habits, motives, and fears under his gaze.

The promise of straight paths is not a guarantee that every step will feel obvious. It is the assurance that life becomes rightly ordered when trust is placed where it belongs. God is not an accessory to the plan. He is the ground beneath it.`,
    relevance: `This matters today because self-reliance is often praised until it becomes a prison. A person can be capable, strategic, disciplined, and still be trapped inside their own perspective. Proverbs names the limit without humiliating the person who has reached it.

A faithful response is to invite God into the decision before the decision hardens. Ask what fear is pushing, what pride is protecting, and what obedience would look like if control were not the highest value. Trust is not anti-intelligence. It is intelligence humbled before God.`,
    prayer: `Lord, I bring you my plans, my reasoning, and my blind spots. Teach me to trust you with my whole heart. Make straight what I cannot straighten alone. Amen.`,
  },
  'matt-5-14-16': {
    title: 'Light Placed Where It Can Serve',
    reflection: `Matthew 5:14-16 comes immediately after the Beatitudes, so the light Jesus names is not celebrity brightness or religious performance. It is the visible life of people shaped by mercy, meekness, purity of heart, peacemaking, and courage under pressure. A city on a mountain cannot pretend to be invisible. A lamp is not lit so it can hide under a basket. Light is given for the sake of the house.

The final aim is important: good works are seen, but the Father is glorified. The disciple is visible, but not as the destination. The life points beyond itself.`,
    relevance: `This matters today because visibility is often confused with self-promotion. Jesus gives a different vision. Hiddenness is not always humility, and exposure is not always vanity. The question is whether the light serves.

A faithful response is to make goodness concrete enough to help someone else. Tell the truth without cruelty. Do the unseen task. Protect the vulnerable. Create warmth in a room that has gone cold. The passage does not call the disciple to glow for attention. It calls the disciple to be placed where the light can bless the house and direct praise to God.`,
    prayer: `Father, make my life useful light. Keep me from hiding out of fear and from shining for applause. Let my words and works serve others and point back to you. Amen.`,
  },
  'lam-3-22-23': {
    title: 'Mercy That Outlasts the Night',
    reflection: `Lamentations was written in the ruins of a destroyed city. The writer is not sitting in a comfortable room theorizing about God's goodness; he is sitting in ash. To speak of steadfast love here is not naive optimism; it is an act of fierce, defiant memory. He recalls God's character when all visible evidence suggests abandonment. The mercies are "new every morning" not because every morning is pleasant, but because God's refusal to let go is regenerated daily, outliving the exhaustion of the sufferer.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `This matters today because we often judge God's disposition toward us by the mood of our morning or the success of our plans. When things collapse, the immediate assumption is that mercy has run dry. This passage interrupts that despair. It insists that God's faithfulness is not a reaction to our performance, but the steady baseline of the universe.\n\nThe practical invitation is to let morning be an actual reset—not to erase yesterday's grief, but to receive today's specific, measured allocation of grace.`,
    prayer: `Lord, when the visible evidence around me suggests I am abandoned, give me the defiant memory of your character. Let your new mercies meet me today. Amen.`,
  },
  'isa-40-31': {
    title: 'The Subversive Act of Waiting',
    reflection: `Isaiah speaks to a people exhausted by exile, who feel their history has flatlined. The promise here is not an instant adrenaline shot; it is tied to the grueling, unglamorous posture of "waiting." In the biblical imagination, waiting is not passive delay. It is an active tethering of the soul to God's promised future. The progression—flying, running, walking—seems backward, but it traces the real arc of endurance. Sometimes faith is a soaring escape, sometimes it is a steady run, but most often, it is simply the capacity to keep walking when the adrenaline is gone.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We live in an economy of instant intervention. When pain or boredom hits, the instinct is to medicate, fix, or flee. To wait is to endure the terrifying vulnerability of being out of control. This text suggests that strength is not generated by frantic motion, but is given to those who stay planted in the tension.\n\nThe invitation is to look at one unresolved area of your life and choose not to force a premature resolution, trusting that God is working in the delay.`,
    prayer: `God, I do not want to wait, and I do not like being out of control. Tether my soul to your future. Give me the strength simply to keep walking today. Amen.`,
  },
  'josh-1-9': {
    title: 'Courage Grounded in Presence',
    reflection: `Joshua is standing on the edge of a terrifying transition. Moses is dead, the wilderness is behind, and fortified enemies are ahead. The command to "be strong" is not a demand to conjure up psychological bravery. God does not say "be courageous because you are prepared." The entire weight of the command rests on a single fact: "for the LORD your God is with you." Courage here is not the absence of terror; it is the refusal to let terror dictate the next step, based on the reality of God's accompanying presence.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Modern anxiety often isolates us, convincing us that we must cross our personal rivers alone, relying entirely on our own competence. When our competence fractures, panic sets in. This passage recalibrates courage.\n\nTrue courage is shifting your gaze from the size of the threat to the proximity of the God who walks with you. You can be trembling, utterly unsure of your own capacity, and still step forward faithfully because you do not step alone.`,
    prayer: `Lord, I am intimidated by what is ahead of me. Shift my gaze from the size of the threat to the reality of your presence. Walk with me today. Amen.`,
  },
  'zeph-3-17': {
    title: 'The Singing God',
    reflection: `Zephaniah delivers harsh judgments against idolatry, but the book turns on a breathtaking pivot. The God who purges evil is revealed not as a cold judge, but as a fiercely tender savior. The imagery is almost scandalous in its intimacy: God does not merely tolerate his people; he rejoices over them. He sings. To "quiet you by his love" suggests a mother calming a frantic child. The majesty of God is expressed in his capacity for tender, exultant affection.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Many people operate with a baseline assumption that God is perpetually disappointed in them—that they are a project to be managed. This passage shatters that cold theology. To be quieted by his love is to stop striving to earn your own existence.\n\nThe spiritual work here is actually quite difficult: to allow yourself to be loved without deflecting it, and to believe that the Creator's disposition toward you is one of profound, joyful song.`,
    prayer: `Father, quiet the frantic voices in my head with the reality of your love. Help me to believe that you actually rejoice over me. Amen.`,
  },
  'psalm-121-1-2': {
    title: 'Looking Past the Threat',
    reflection: `The "hills" in ancient Israel were places of danger—hiding spots for bandits. The pilgrim looks up at the intimidating ascent and asks a vulnerable question: "Where is my help?" The answer bypasses the immediate geography and appeals directly to the architect of reality. The one who made the hills is greater than the threats they conceal. The psalm does not promise the journey will be flat; it promises the traveler is relentlessly watched over by a God who does not sleep.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When in crisis, our vision naturally narrows. We fixate on the obstacle, the diagnosis, the financial cliff. The hills fill our entire field of vision. The psalmist models a deliberate redirecting of the gaze. Help does not come from out-maneuvering the hills; it comes from the Maker.\n\nThe practice for today is to name the intimidating "hill" in front of you, and then explicitly place it under the authority of the God who engineered the earth.`,
    prayer: `Lord, my eyes are fixed on the obstacles in front of me. Lift my gaze. Remind me that the One who made heaven and earth is the One who watches over my life. Amen.`,
  },
  'rom-12-2': {
    title: 'The Rebellion of a Renewed Mind',
    reflection: `Paul uses two distinct verbs here: conformity is passive, like being poured into a mold. Transformation is organic, happening from the inside out, driven by the renewal of the mind. The "world" exerts a gravitational pull toward cynicism, self-interest, and outrage. Resisting this requires an entirely new operating system. A renewed mind learns to see reality through the lens of the cross, enabling a person to discern God's good will in the midst of a distorted culture.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are discipled every day by algorithms, news cycles, and cultural scripts that teach us what to fear and what to buy. To not be conformed requires intentional, daily friction against these forces. The renewal of the mind is the rigorous practice of exposing our assumptions to the truth of Christ.\n\nThe challenge today is to identify one area where your thinking is merely echoing the culture's anxiety, and ask God to rewrite that specific script.`,
    prayer: `God, protect me from being poured into the mold of this anxious age. Renew my mind. Give me the clarity to discern what is truly good and acceptable in your sight. Amen.`,
  },
  '2-cor-12-9': {
    title: 'The Architecture of Grace',
    reflection: `Paul begged for the removal of a severe, humiliating affliction. God's response was not healing, but a radical redefinition of how power works. The sufficiency of grace is not that it makes the pain disappear, but that it makes the pain habitable. God's power reaches its absolute perfection precisely in the space hollowed out by human weakness. Paul's response is astonishing: he chooses to boast in his frailty, because his inadequacy becomes the landing pad for the power of Christ.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We spend enormous energy hiding our inadequacies, fearing that if our weakness is exposed, we will lose our value. This passage dismantles the exhausting architecture of self-sufficiency. If Christ's power is perfected in weakness, then our limitations are the exact coordinates where we meet grace.\n\nThe invitation is to stop agonizing over what you lack, and offer your actual, insufficient self to God without apology.`,
    prayer: `Jesus, I am exhausted from trying to hide my weakness. I offer my inadequacies to you today. Let your grace be entirely sufficient for me. Amen.`,
  },
  'eph-2-8-9': {
    title: 'The End of the Resume',
    reflection: `Grace is a scandalous concept. It defies the fundamental human economy of earning, deserving, and trading. Paul insists that salvation is entirely a gift, completely severed from human effort. If it could be earned by works, it would produce a spiritual caste system of the successful and the failures. By making it a pure gift, God levels the ground. The phrase "not your own doing" is both a profound relief and a blow to human pride. We bring nothing to the transaction except the need to be saved.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Even within faith, there is a constant, subtle drift back toward performance. We try to pay God back, or we feel we have disqualified ourselves when we fail. This passage demands that we drop the resume.\n\nYou cannot earn what was freely given, and you cannot un-earn what you never deserved in the first place. Stand in the terrifying, liberating reality that you are loved apart from your performance.`,
    prayer: `Father, strip away my pride and my attempts to earn your love. Help me to drop my resume and stand entirely upon the gift of your grace. Amen.`,
  },
  'col-3-12-14': {
    title: 'The Wardrobe of the Beloved',
    reflection: `Paul commands believers to "put on" virtues like clothing, rooted in an identity already established: "chosen ones, holy and beloved." You do not act kindly to become beloved; you put on kindness because you already are beloved. The virtues—compassion, humility, patience—are the shock absorbers of human community. The climax is forgiveness, modeled not on fairness, but on the staggering, asymmetrical forgiveness we have received from Christ.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Community is abrasive. People disappoint, misunderstand, and wound us. The natural response is to put on armor: defensiveness, cynicism, withdrawal. Paul says to put on vulnerability instead. "Bearing with one another" implies that people are heavy, and loving them requires endurance.\n\nThe practical step today is to look at someone frustrating you, remember what God has forgiven you, and extend a fraction of that grace toward them.`,
    prayer: `Lord, I am quick to put on defensiveness and pride. Clothe me instead with compassion, humility, and patience. Teach me to forgive as I have been forgiven. Amen.`,
  },
  'heb-4-15-16': {
    title: 'The Sympathetic Throne',
    reflection: `The ancient concept of the gods was that they were immune to human suffering. Hebrews presents a radical alternative: a High Priest who feels the weight of our frailty because he lived inside it. Jesus is a veteran of the human condition. Because he was tempted and tested, the "throne" is not a place of terrifying judgment for the struggling believer; it is a throne of grace. The invitation to "draw near with confidence" is based on his empathy, not our perfection.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we fail or feel overwhelmed, our instinct is to hide from God, projecting our own disgust with ourselves onto Him. This text tells us that precisely in our "time of need"—when we are at our weakest and most compromised—we are to run toward God, not away.\n\nThe High Priest understands the exhaustion of the trial. Draw near today without cleaning yourself up first; the grace is specifically for the messy.`,
    prayer: `Jesus, you know the exact weight of my struggles because you lived in this world. Give me the confidence to run toward your throne of grace in my time of need. Amen.`,
  },
  'jas-1-2-4': {
    title: 'The Strange Math of Joy',
    reflection: `James does not say "feel happy about your pain." He says "count it"—reckon it, evaluate it—as joy. This is an accounting term. It means assigning a different value to suffering because of what it produces. Trials act as a stress-test on faith, burning off what is theoretical and leaving only what is real. The result is "steadfastness," a muscular, active endurance. The goal of this painful process is not merely survival, but spiritual maturity—becoming whole, lacking nothing.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We typically view interruptions and hardships as meaningless interference to our plans. James asks us to view them as a forge. This does not mean romanticizing tragedy, but it does mean refusing to let suffering be wasted.\n\nWhen you hit a wall today, instead of asking "Why is this happening to me?", try asking "What is this producing in me?" Allow the trial to do its slow work.`,
    prayer: `Lord, this trial feels like nothing but interference. Give me the eyes to see what it is producing in me. Forge steadfastness in my soul, and make me whole. Amen.`,
  },
  '1-pet-5-7': {
    title: 'The Weight God Asks For',
    reflection: `The word for "casting" means to throw something with force, like throwing a heavy blanket over a horse. It is a decisive action. Peter tells a vulnerable church where to put their anxieties. The rationale is breathtakingly simple: "because he cares for you." God is not a distracted manager annoyed by our trivial concerns. He is a Father who asks for the weight we were never designed to carry.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often treat anxiety like a solitary burden we must manage through better planning or sheer willpower. Or we feel guilty for being anxious, adding spiritual shame to our stress.\n\nThis passage offers a mechanical transfer of weight. You do not have to solve the anxiety before you give it to God. Name the specific fear today, and consciously throw it onto the shoulders of the One who has the capacity to carry it.`,
    prayer: `Father, I am carrying weight I was not designed for. Because you care for me, I forcefully cast my anxiety onto you right now. Carry it for me. Amen.`,
  },
  '1-john-4-18': {
    title: 'The Eviction of Fear',
    reflection: `Fear and love are treated here as competing ecosystems; they cannot coexist. The fear John means is the dread of punishment—the lingering suspicion that God is fundamentally angry. "Perfect love" refers to the completeness of God's love for us. When the reality of that love fully occupies the heart, it acts as an eviction notice to fear. You cannot simultaneously trust that you are completely cherished and desperately fear that you are about to be condemned.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Much of our religious life can be driven by a low-grade terror of getting it wrong, of crossing a line and losing God's favor. This passage calls us to a radical shift in motivation.\n\nWe obey not to dodge a beating, but because we are safe in the house. If you are operating out of guilt or the fear of divine retaliation, stop. Let the absolute certainty of His affection cast out your dread.`,
    prayer: `God, cast the dread of punishment out of my heart. Let the sheer perfection of your love for me evict every shadow of fear today. Amen.`,
  },
  'rev-21-3-4': {
    title: 'The Final Healing',
    reflection: `This is the horizon toward which the entire biblical narrative is hurtling. The ultimate hope is that God brings His dwelling place to a renewed earth. The intimacy is stunning: God himself acts as the comforter, wiping tears from the eyes of his people. Death, grief, crying, and pain—the tyrants of human history—are rendered obsolete. The "former things" pass away not by being ignored, but by being definitively conquered and healed.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When the present moment is agonizing, we need a future robust enough to pull us forward. This passage is not a fairy tale to numb us to current injustice; it is the absolute guarantee of how the story ends.\n\nOur current weeping is temporary, and our ultimate joy is permanent. In the face of loss or deep depression, this text gives us permission to grieve, while insisting that grief will not have the last word.`,
    prayer: `Lord, the pain of this present world is heavy. Anchor my soul to the horizon of your final healing. Give me hope that outlasts my current grief. Amen.`,
  },
  'matt-6-33-34': {
    title: 'The Boundary of Today',
    reflection: `Jesus speaks to the very real anxieties of provision. He doesn't say these things don't matter; he reorders their priority. Seeking the Kingdom first means aligning one's primary allegiance with God's rule. Then Jesus offers profound psychological wisdom: borrowing trouble from the future ruins the present. Tomorrow's problems do not yet have tomorrow's grace. By dragging future anxieties into today, we crush ourselves under a weight we were not meant to bear simultaneously.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are chronic time-travelers, projecting our minds into hypothetical futures and fighting battles that haven't happened yet. Jesus calls us back to the boundary of the present.\n\nYou only have grace for the next 24 hours. Pull your attention away from the "what-ifs" of next month, and deal only with what is in front of you today. Let tomorrow remain in God's hands.`,
    prayer: `Jesus, I am constantly borrowing trouble from tomorrow. Pull my mind back to the present. Help me to seek your kingdom in the exact 24 hours I am living right now. Amen.`,
  },
  'john-16-33': {
    title: 'The Ground of Defiant Peace',
    reflection: `Jesus delivers this promise in the shadow of the cross. He offers no illusions about the life ahead; "tribulation" (pressure, affliction) is a guarantee. But he bifurcates reality: "in the world" there is pressure; "in me" there is peace. The reason for courage ("take heart") is not that we will win the fight, but that the fight has already been definitively won. Christ has overcome the world, and our peace is found by abiding in the Victor.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often feel betrayed when life gets hard, secretly believing that faith was supposed to be a shield against pain. Hardship is not a sign that the system is broken; it is the nature of the present age. But panic is not required.\n\nWhen the pressure of the world squeezes you this week, the faithful response is not to fight back with the world's weapons, but to retreat into the fortress of Christ's finished work.`,
    prayer: `Lord, the world is applying pressure to my life. I take heart not in my own ability to overcome, but in the fact that you have already overcome the world. Give me your peace. Amen.`,
  },
  'rom-15-13': {
    title: 'The Engine of Hope',
    reflection: `Paul ends his theological argument with a benediction that functions like a physics equation of the soul. God is the source. The mechanism is faith. The result is internal joy and peace. The fuel is divine—the Holy Spirit. And the output is excess ("abound in hope"). Hope here is not a fragile wish; it is a muscular, overflowing confidence. Joy and peace are not tied to favorable conditions, but to the act of trusting God's promises.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When the world feels cynical and depleted, generating our own optimism is exhausting and eventually fails. True hope is not self-generated; it is received.\n\nIf you are running on empty, the solution is not to force yourself to feel hopeful. It is to return to the act of believing—fixing your gaze on God's character—and asking the Spirit to fill you with a peace that defies the evidence.`,
    prayer: `God of hope, I cannot generate my own joy or peace today. Fill me by the power of your Holy Spirit, that I might abound in a hope that defies my circumstances. Amen.`,
  },
  'gal-5-22-23': {
    title: 'The Organic Life of the Spirit',
    reflection: `Paul contrasts the "works of the flesh" with the "fruit of the Spirit." Works are manufactured; fruit is cultivated. The qualities listed here are not a checklist of moral behaviors to try harder at. They are the natural, inevitable byproduct of a life rooted in the Holy Spirit. They describe the character of Jesus being reproduced in the believer. The fact that there is "no law" against them means this is the ultimate freedom: living out the exact design we were created for.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often approach our character flaws with an industrial mindset: "I need to manufacture more patience today." That usually leads to gritted teeth and eventual failure.\n\nThis passage changes the paradigm from manufacturing to abiding. If you lack gentleness or joy, the primary task is not to strain harder, but to draw closer to the Spirit, yielding to His control in the moment of frustration.`,
    prayer: `Holy Spirit, I stop trying to manufacture patience, love, and joy through sheer willpower. Cultivate your organic fruit in my life. Yielding to you is my only strategy. Amen.`,
  },
  'phil-1-6': {
    title: 'The Guarantee of Completion',
    reflection: `Paul writes from a Roman prison with unshakeable confidence. His certainty is not rooted in the Philippians' track record of good behavior, but in the faithfulness of the Initiator. God is not a hobbyist who abandons projects when they get difficult. He is the divine craftsman. The "good work" of salvation and transformation was started by His grace, is sustained by His grace, and will absolutely be consummated by His grace upon the return of Christ. The trajectory is secure.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are often paralyzed by the fear that we will mess up so badly that God will walk away, or that our slow spiritual growth is evidence that the process has failed.\n\nYour spiritual survival does not ultimately depend on your grip on God, but on His grip on you. When you are frustrated by your lack of progress, rest in this: the Architect of your soul has staked His reputation on finishing what He started.`,
    prayer: `Lord, I am often frustrated by how unfinished I am. Anchor my soul in the promise that you are the one who began this good work, and you are the one who will bring it to completion. Amen.`,
  },
  'gen-50-20': {
    title: 'The Alchemy of Sovereignty',
    reflection: `Joseph is speaking to the brothers who betrayed him, sold him, and essentially left him for dead. The profound nature of this verse is that Joseph does not excuse their sin. He looks them in the eye and says, "You meant evil." The betrayal was real, the malice was real, the resulting suffering in the pit and the prison was real. Yet, in the same breath, he introduces a massive theological plot twist: "God meant it for good." This is not a denial of trauma; it is the claim that human malice is not the ultimate author of history. God's sovereignty acts as an alchemy, taking the raw material of human evil and bending its trajectory toward salvation.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we are wronged, we usually have two default reactions: we either minimize the harm to play nice, or we let the bitterness consume us. Joseph's response offers a third way. You can call evil what it is, without letting it write the end of your story.\n\nThe practice today is not to pretend an injury didn't hurt, but to surrender the right to vengeance, trusting that the Composer of reality knows how to weave even the darkest notes into a redemptive symphony.`,
    prayer: `Lord, I have been hurt, and the harm was real. Keep me from minimizing the pain, but save me from the poison of bitterness. Take the evil meant against me and bend it toward your good purpose. Amen.`,
  },
  'exod-14-14': {
    title: 'The Silence of Surrender',
    reflection: `The Israelites are trapped between the impassable Red Sea and the charging Egyptian army. The natural human response to existential terror is noise: panic, strategizing, blaming, bargaining. Moses tells the terrified people to do the one thing that feels most counter-intuitive: be silent. This is not the silence of apathy; it is the silence of surrender. It is the terrifying act of dropping your weapons, ceasing your frantic attempts to save yourself, and making room for the Creator to act. To be silent here is to acknowledge that the battle has escalated beyond human capacity.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are conditioned to believe that our survival depends entirely on our hustle. When we face an impossible obstacle, we talk more, plan more, and panic more. This verse asks for a radical de-escalation of our nervous energy.\n\nWhat if the solution to your current crisis does not require another frantic email or another anxious defense? The challenge today is to identify the battle you are desperately trying to win in your own strength, and practice the frightening discipline of letting God fight it for you.`,
    prayer: `God of armies, my instinct when trapped is to panic and fight in my own strength. Teach me the discipline of holy silence. Fight for me where I am powerless. Amen.`,
  },
  '1-kings-19-11-12': {
    title: 'The God of the Whisper',
    reflection: `Elijah has just experienced the spectacular, adrenaline-fueled victory at Mount Carmel, yet he is running for his life, depressed and suicidal. He goes to Horeb expecting God to show up in the dramatic elements: wind, earthquake, fire. But God intentionally bypasses the spectacle. He arrives in a "low whisper" (or "a sound of sheer silence"). Elijah needed to learn that God's presence is not confined to the spectacular or the catastrophic. God often does His deepest work not in the thunder of a crisis, but in the quiet, unglamorous intimacy of a whisper.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are addicted to the spectacular. We look for God in the dramatic breakthroughs, the loud victories, the unmistakable signs. When life becomes quiet or monotonous, we assume God has left the building. This passage rebukes our demand for divine fireworks.\n\nIf you are exhausted from looking for God in the earthquake, stop. The invitation today is to lower the volume of your life enough to hear the whisper. God is speaking in the ordinary.`,
    prayer: `Father, I am addicted to the spectacular and the loud. Tune my ear to the sound of sheer silence. Meet me in the quiet, ordinary spaces where I have stopped looking for you. Amen.`,
  },
  'job-38-4': {
    title: 'The Comfort of Majesty',
    reflection: `Job has spent chapters demanding an audience with God to explain his catastrophic suffering. When God finally answers from the whirlwind, He does not offer a theological explanation for Job's pain. Instead, He asks a series of unanswerable questions about the architecture of the cosmos. "Where were you?" is not a bullying tactic; it is a profound reorientation. God is reminding Job that the universe is vast, complex, and governed by a wisdom far beyond human calculation. The comfort comes not from understanding the "why" of the pain, but from encountering the sheer magnitude of the One who holds the cosmos together.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When our world falls apart, our immediate demand is for an explanation. We want the spreadsheet that balances our suffering with some hidden purpose. Job 38 suggests that an explanation would not actually heal us. What heals is the encounter with majesty.\n\nThe practice today is not to stop asking questions, but to let your questions be swallowed up by the terrifying, comforting scale of God's sovereignty. You do not need to hold the universe together; the One who laid its foundations is already doing it.`,
    prayer: `Maker of the cosmos, my understanding is painfully limited, and I am exhausted from demanding explanations. Overwhelm my small questions with the comfort of your majesty. Amen.`,
  },
  'micah-6-8': {
    title: 'The Distillation of Duty',
    reflection: `The prophet is addressing a people who are offering increasingly extravagant sacrifices to appease God—thousands of rams, rivers of oil, even their own children. They think God wants spectacular religious performance. Micah cuts through the theatricality with staggering simplicity. God does not want religious pageantry; He wants character. "Do justice" means ensuring fairness for the vulnerable. "Love kindness" means a stubborn, loyal love. "Walk humbly" means recognizing your absolute dependence on the Creator. This is not a lower bar than sacrifice; it is a vastly higher one, because it demands the whole life.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often overcomplicate the Christian life, turning it into a complex system of theological mastery, emotional highs, or exhausting ministry performance. Micah brings us back to the bedrock.\n\nWhen you are paralyzed by the question of God's will for your life, the answer is already here. You don't need a vision for the next decade; you need to execute these three verbs today. Advocate for fairness. Show stubborn loyalty. Drop your pride before God right now.`,
    prayer: `Lord, I constantly try to offer you complex religious performances instead of my actual life. Strip away the pageantry. Teach me to do justice, love kindness, and walk humbly with you today. Amen.`,
  },
  'luke-15-20': {
    title: 'The Running Father',
    reflection: `In Middle Eastern culture of the first century, an older patriarch did not run. It was considered undignified. The father in this parable violates social protocol entirely. The son is returning with a rehearsed speech to negotiate his way back as a servant, but the father does not wait for the apology. He sees the boy "a long way off"—implying he was already watching the horizon—and runs. He absorbs the shame of the village by running, effectively shielding the son from judgment. This is Jesus' definitive portrait of God: not a distant, arms-crossed judge waiting for us to grovel, but a Father who abandons his dignity to close the distance.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Many of us have internalized a theology of the "arms-crossed God." We assume that when we mess up, we must painstakingly rebuild our spiritual resume before we can be accepted again. We rehearse our apologies, hoping to be hired back as a servant.\n\nThis parable destroys that legalism. If you are attempting to negotiate your way back into God's favor through better behavior, stop. The Father is already running toward you. Your only job is to let yourself be embraced before you even finish the apology.`,
    prayer: `Father, I am exhausted by trying to manage my own redemption. Thank you that you do not wait for me to get my act together. Help me to drop my rehearsed apologies and simply receive your embrace. Amen.`,
  },
  'luke-10-33-34': {
    title: 'The Disruption of Compassion',
    reflection: `Jesus tells this story in response to a lawyer looking for a loophole: "Who is my neighbor?" The lawyer wants to know exactly who he is obligated to love, and who he can safely ignore. Jesus answers by making the hero of the story a Samaritan—a despised outcast, a racial and religious enemy of the Jewish audience. The priest and the Levite bypass the bleeding man because touching a corpse would make them ritually unclean; they prioritize religious purity over human suffering. The Samaritan prioritizes compassion over protocol. He stops his journey, uses his own resources, and enters the mess.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are experts at drawing boundaries around our compassion. We love the people who look like us, vote like us, and agree with us. We use ideological purity to justify walking past the brokenness of "the other." This parable is a devastating critique of tribalism.\n\nThe question is not "who is worthy of my help?" The question is "who is bleeding on my road today?" The practical step is to allow your schedule and your prejudices to be disrupted by someone who can offer you nothing in return.`,
    prayer: `Lord, forgive me for using religious or political purity as an excuse to ignore the suffering of others. Give me the eyes of the Samaritan. Give me the courage to let my life be disrupted by compassion today. Amen.`,
  },
  'matt-13-44': {
    title: 'The Economics of Joy',
    reflection: `This parable is often misunderstood as a story about the heavy cost of discipleship—the grueling demand to give up everything. But look at the man's motivation. He does not sell everything out of grim duty or religious obligation. He sells everything "in his joy." He has stumbled upon something of such staggering, disproportionate value that liquidating his entire estate feels like the bargain of a lifetime. The kingdom of heaven is not a tax you pay; it is a treasure you discover. The surrender of everything else is just the logical, joyful math of obtaining the pearl.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often experience Christianity as a series of subtractions—a list of things we aren't allowed to do, a demand for sacrifice that leaves us feeling deprived. If following Jesus feels like a miserable, grinding duty, we have missed the treasure.\n\nThe invitation today is to stop staring at the cost and start staring at the value of the King. When the beauty of Christ actually captures the heart, surrender ceases to be a sacrifice and becomes the most joyful, rational transaction possible.`,
    prayer: `Jesus, I often treat obedience like a heavy tax rather than a joyful exchange. Open my eyes to the staggering value of your Kingdom, so that whatever I must leave behind feels like nothing compared to gaining you. Amen.`,
  },
  'matt-25-40': {
    title: 'The Disguise of the King',
    reflection: `In the ancient world, kings were encountered in palaces, surrounded by wealth and military might. Jesus completely subverts the locus of divine presence. He does not just say he cares about the hungry, the naked, the sick, and the imprisoned. He says he *is* them. The King has disguised himself in the most marginalized, discarded elements of society. The shocking part of the parable is that both the righteous and the unrighteous are surprised. True justice and mercy are not performed as a calculated strategy to impress God; they are the organic overflow of a heart that recognizes human dignity where the world sees only waste.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often look for profound spiritual experiences in highly curated environments—worship services, retreats, theological debates. This passage relocates our spiritual geography. If you want to encounter Christ, you have to go to the margins.\n\nHe is hiding in the people our society is trying to ignore. The challenge today is to look at the person who interrupts your day, who annoys you, who needs your help, and to treat them with the exact level of dignity you would offer to the King of the universe.`,
    prayer: `Lord, I constantly look for you in the spectacular and the successful. Forgive me for ignoring you in the vulnerable. Give me the eyes to see you disguised in the least of these, and the hands to serve you there. Amen.`,
  },
  'john-1-5': {
    title: 'The Physics of Light',
    reflection: `The word translated "overcome" can mean both "to understand" and "to conquer." The darkness is fundamentally incapable of doing either. It cannot comprehend the light of Christ, and it cannot extinguish it. John is not describing a balanced dualism where light and darkness are locked in an even arm-wrestle. In the physics of the universe, darkness is not a force; it is merely the absence of light. Therefore, the smallest flicker of a candle immediately destroys absolute darkness. The victory of the light is not a future possibility; it is a present, ontological certainty.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we look at the headlines, the corruption of institutions, or the shadows in our own minds, it feels as though the darkness is winning. Despair feels like the only realistic assessment of the data. John 1:5 refuses to let despair have the last word.\n\nThe darkness is loud, but it is fundamentally powerless to extinguish the Light that has entered the world. Your job today is not to defeat all the darkness on earth; your job is simply to strike a match. Stand in the light.`,
    prayer: `Jesus, true Light, the shadows around me often feel overwhelming and victorious. Remind my soul of the physics of your Kingdom: the darkness has not, and cannot, overcome you. Let me walk in your light today. Amen.`,
  },
  'john-15-5': {
    title: 'The Illusion of Independence',
    reflection: `Jesus uses an organic, agricultural metaphor to describe the absolute necessity of union with Him. A branch severed from the vine does not just become less productive; it dies. The word "abide" implies remaining, staying put, drawing life from the source. Notice that the branch does not strain and sweat to produce grapes; it simply stays connected to the sap of the vine, and the fruit is the inevitable result. The concluding phrase is devastating to the ego: "apart from me you can do nothing." Not "you can do less," but "nothing" of eternal value.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Western culture worships autonomy. We are trained to be self-made, self-sufficient, and independent. We often import this into our faith, trying to live the Christian life on our own horsepower, occasionally asking God to bless our independent efforts.\n\nThis verse exposes that strategy as spiritual suicide. If you are burning out, it is highly likely you are trying to produce fruit while disconnected from the Vine. The single most important task of your day is not to work harder, but to re-establish your connection to the source of life.`,
    prayer: `Lord, I am addicted to my own independence. I try to produce the fruit of your Kingdom using only my own willpower. Forgive my arrogance. Teach me how to simply abide in you today, trusting that the fruit will follow. Amen.`,
  },
  'rom-5-8': {
    title: 'The Timing of Love',
    reflection: `The shock of this verse is in the timing. Paul argues in the preceding verse that it is rare for someone to die for a righteous person. Human love is almost always conditional; it requires an object that is worthy, attractive, or at least promising. God's love detonates that logic. He does not wait for us to clean ourselves up, reach a moral baseline, or even ask for help. He acts "while we were still sinners"—while we were actively hostile to His rule. The cross is the ultimate proof that God's love is generated entirely by His own character, not by our lovability.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `The deepest fear of the human heart is that if we are fully known, we will be rejected. So we curate our image, hiding our failures even from God, hoping to become acceptable before we approach Him. Romans 5:8 annihilates the need for hiding.\n\nIf He loved you enough to die for you at your absolute worst, He is not going to abandon you now that you are His. Stop trying to make yourself presentable before you pray. Bring your unedited, messy self to the God who loved you first.`,
    prayer: `Father, my instinct is to clean myself up before I come to you. Thank you that you did not wait for me to become worthy. Anchor my security in the staggering truth that you died for me while I was still an enemy. Amen.`,
  },
  'eph-3-20-21': {
    title: 'The Collapse of Our Categories',
    reflection: `Paul runs out of vocabulary trying to describe the capacity of God. The Greek phrasing is explosive: meaning super-abundantly, over and above, beyond all measure. God is not bound by the limits of our imagination or the poverty of our requests. But notice where this limitless power is located: "according to the power at work *within us*." The engine that created the cosmos and raised Christ from the dead is currently operating inside the life of the believer. The goal of this power is not our personal comfort, but the eternal glory of God.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Our prayers are often tragically small. We ask God to tweak our circumstances, to make our lives 10% easier, to manage the status quo. We project our own limitations onto the Creator. This doxology challenges us to expand our categories.\n\nYou are praying to a God who views your most audacious, impossible request as a small thing. The challenge today is to stop insulting God with tiny, manageable prayers. Ask for the impossible, not to fund your own ego, but to see His glory displayed in your life.`,
    prayer: `Lord, forgive me for the smallness of my imagination and the timidity of my prayers. You are able to do exceedingly abundantly above all I ask or think. Blow the roof off my expectations today, for your glory. Amen.`,
  },
  '2-cor-4-16-17': {
    title: 'The Weight of Glory',
    reflection: `Paul was beaten, shipwrecked, starved, and imprisoned. To call his suffering a "light momentary affliction" is mathematically insane—unless it is placed on a scale opposite to eternity. Paul is not engaged in positive thinking; he is utilizing an eternal metric. The "outer self" (the physical body, the circumstances, the mortal life) is undeniably decaying. That is a fact. But simultaneously, the "inner self" is being regenerated. The suffering is not random; it is "preparing" or producing a glory that is so massive, so heavy, that the pain of this life cannot even be compared to it.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We live in a culture terrified of aging, decay, and suffering. When our bodies fail or our circumstances collapse, it feels like the end of the story. Paul provides a radically different lens. If you are in Christ, your decay is not the final reality; it is merely the scaffolding being removed.\n\nDo not lose heart when your strength fails today. The pain you are carrying is not meaningless; it is forging a weight of glory that will make you forget the affliction ever existed.`,
    prayer: `God, my outer self is wasting away, and my afflictions often feel anything but light. Give me the eternal metric of the Apostle Paul. Renew my inner self today, and anchor my hope in the coming weight of glory. Amen.`,
  },
  'luke-24-32': {
    title: 'The Burning Heart',
    reflection: `Two disciples are walking away from Jerusalem, deeply depressed. The man they thought was the Messiah has been crucified; their theology has collapsed. Jesus walks with them incognito. He does not immediately reveal his identity with a miracle; instead, he takes them on a long walk through the Scriptures, reinterpreting their tragic worldview through the lens of the cross. Only after he leaves do they realize what happened: the theology they were hearing wasn't just data; it was fire. The Word of God, when encountered truly, does not just inform the intellect; it ignites the affections.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often treat the Bible as an encyclopedia of religious facts, an instruction manual, or a source of ammunition for arguments. This passage reminds us that the primary purpose of Scripture is encounter.\n\nIf our theology does not eventually result in a burning heart—a deep, resonant love for Christ—we are doing it wrong. If your spiritual life feels cold and academic right now, do not try to manufacture emotion. Get on the road with Jesus. Ask Him to open the Scriptures to you.`,
    prayer: `Lord Jesus, my theology is often cold and my heart is often slow. Walk with me on the road today. Open the Scriptures to me, not just to inform my mind, but to make my heart burn with love for you. Amen.`,
  },
  'eccl-3-11': {
    title: 'The Ache of Eternity',
    reflection: `The writer of Ecclesiastes is brutally honest about the cyclical, often meaningless appearance of life under the sun. Yet here, he names a profound human paradox: we are finite creatures bound by time, but we have been given the appetite for eternity. We are haunted by the infinite. This explains the chronic dissatisfaction of the human heart; no temporary pleasure, no matter how exquisite, can satisfy an appetite designed for the eternal. We cannot comprehend the entire scope of God's work, which leaves us living in the painful, beautiful tension between the limits of our minds and the vastness of our desires.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Our culture insists that if you feel empty, you simply haven't acquired enough—enough success, enough intimacy, enough distraction. This text argues the exact opposite. Your chronic dissatisfaction is not a malfunction; it is proof of your design. You ache for eternity because you were built for it.\n\nThe practice today is not to try and fill the void with temporary things, but to let the ache do its proper work: pointing you toward the only One who can satisfy the eternal capacity of your heart.`,
    prayer: `Maker of time, you have placed eternity in my heart, and I am often frustrated by my inability to be satisfied by this world. Keep me from trying to fill an eternal void with temporary things. Let my ache point me to you. Amen.`,
  },
  'gen-16-13': {
    title: 'The God Who Sees the Invisible',
    reflection: `Hagar is arguably the most marginalized person in Genesis. She is an Egyptian slave, a surrogate mother exploited by Abram and Sarai, and now a fugitive dying in the desert. She is a woman without agency or protection. Yet, God does not send an angel to Abraham to fix the situation; He goes directly to the desert to find the discarded slave. Hagar is the first person in Scripture to give God a name: El Roi, the God of seeing. She realizes that the God of the cosmos is intimately attentive to the trauma of an anonymous, abused woman in the wilderness.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `It is incredibly easy to feel invisible—overlooked by systems, forgotten by the successful, unseen in our private grief. Hagar's story is a theological protest against the idea that God only pays attention to the powerful.\n\nHe is El Roi. He sees the panic attack in the bathroom, the quiet exhaustion of caregiving, the silent sting of rejection. The comfort today is not necessarily an immediate rescue, but the profound dignity of being deeply, attentively seen by the Creator when the world looks right past you.`,
    prayer: `El Roi, God of seeing, there are places in my life where I feel entirely invisible. Thank you that you do not reserve your attention for the powerful. Give me the dignity of knowing that you see me in my wilderness today. Amen.`,
  },
  'isa-53-3': {
    title: 'Acquainted with Grief',
    reflection: `This prophetic vision of the Suffering Servant dismantles the human expectation of what divine power should look like. We expect God to be insulated from pain, arriving in invulnerable majesty. Instead, Isaiah describes a Savior who is intimately fluent in suffering. "Acquainted with grief" is a profound translation; grief is not a stranger He briefly met, but a companion He knows thoroughly. He did not hover above human misery; He sank into it. He was subjected to the ultimate social alienation—the kind of suffering that makes people avert their eyes.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we are deep in sorrow, well-meaning people often offer bright platitudes because they cannot handle the gravity of our grief. They avert their eyes. But this passage tells us that Jesus does not flinch.\n\nHe does not need you to rush through your pain to make Him comfortable. If you are carrying a heavy sorrow today, you are not praying to a God who is confused by your tears. You are praying to a Man of Sorrows. Bring your unfiltered grief to the One who is fluent in it.`,
    prayer: `Lord Jesus, Man of Sorrows, I am so grateful that you do not demand forced optimism from me. You are acquainted with grief. Sit with me in my sorrow today, and let me find comfort in your solidarity. Amen.`,
  },
  'hosea-2-14': {
    title: 'The Romance of the Wilderness',
    reflection: `The context of Hosea is devastating: God commands the prophet to marry a chronically unfaithful woman to illustrate Israel's spiritual adultery. God has every right to respond with pure, unmitigated wrath. Instead, the text pivots to romance. The wilderness, historically a place of punishment and death, is reclaimed as a place of courtship. God does not drag His people back into line with threats; He "allures" them. He strips away the distractions of the city and the false idols, bringing them into the quiet of the desert for one purpose: to speak tenderly to their hearts.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often interpret the "wilderness" periods of our lives—times of isolation, lack, or spiritual dryness—as signs of God's anger or abandonment. Hosea suggests a radical alternative.\n\nWhat if the barrenness of your current season is not a punishment, but a rescue? Sometimes God removes our comforts and distractions not to punish us, but to get us alone. If you are in the wilderness today, stop fighting the silence. Listen. The God of the universe is attempting to speak tenderly to you.`,
    prayer: `Father, the wilderness feels barren and I want to escape it. Change my perspective. Help me to see this isolation not as punishment, but as your severe mercy, making room to speak tenderly to my heart. Amen.`,
  },
  'hab-3-17-18': {
    title: 'Defiant Joy',
    reflection: `Habakkuk lists an absolute economic and agricultural apocalypse. This is the ancient equivalent of losing your job, your savings, and your home simultaneously. In an agrarian society, this list means starvation. Yet, in the face of absolute material collapse, the prophet utters one of the most defiant "yets" in all of literature. His joy is utterly disconnected from his circumstances. It is not a denial of the catastrophe—he names the barrenness explicitly. His joy is violently anchored in the character of God, proving that God Himself is the treasure, not merely the provider of the treasure.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Our joy is usually highly conditional. It rises and falls with our bank accounts, our health, and our relationships. We love God because of the fruit on the vine. Habakkuk challenges us to a vastly deeper, bulletproof faith.\n\nCan you worship when the fields are empty? If everything you are currently relying on for stability were removed, would God be enough? The invitation today is to practice defiant joy: to look at an empty stall in your life and choose to rejoice in the God of your salvation anyway.`,
    prayer: `Lord, my joy is fragile and tied to my circumstances. I ask for the defiant faith of Habakkuk. When the fig tree does not blossom and the fields are empty, teach me how to find my complete joy in you alone. Amen.`,
  },
  'mark-9-24': {
    title: 'The Honesty of the Broken',
    reflection: `A father is desperate for the healing of his demon-possessed son. Jesus challenges him regarding his faith, and the man's response is a masterpiece of spiritual paradox. He does not fake a robust, bulletproof faith to impress the Rabbi. He simultaneously claims belief and confesses massive doubt. He holds both realities in the same breath. And crucially, Jesus does not reject him for the contradiction. The man's small, fractured faith, when directed honestly toward Christ, is enough. Jesus responds to the cry, not to the perfection of the theology.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are often paralyzed by the idea that we must resolve our doubts before we can approach God. We feel like hypocrites if we pray while struggling with skepticism. This father gives us permission to bring our contradictions into the open.\n\nYou do not have to curate your faith before you ask for a miracle. The most profound prayer you can pray today might simply be: "I am trying to trust you, but I am terrified. Help the parts of me that cannot believe."`,
    prayer: `Jesus, my faith is often fractured and mixed with profound doubt. I bring you my contradictions. I believe; help my unbelief. Step into the gap where my certainty fails. Amen.`,
  },
  'luke-7-47': {
    title: 'The Metric of Love',
    reflection: `A woman with a scandalous reputation crashes a dinner party at a Pharisee's house, weeping on Jesus' feet. The Pharisee is disgusted by her impurity. Jesus contrasts their two approaches to God. The Pharisee assumes he owes God very little, and consequently, his love is cold, polite, and calculated. The woman knows the staggering weight of her debt, and therefore her love is extravagant, reckless, and beautiful. Jesus establishes a terrifying metric: the depth of our love for Him is directly proportional to our awareness of how much we have been forgiven.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we become comfortable in our religion, we start to believe we are basically good people who occasionally need minor adjustments. Consequently, our worship becomes sterile. We lose the capacity for tears. This passage is a warning to the religiously secure.\n\nIf your love for Christ has grown cold, the solution is not to try to manufacture emotion. The solution is to take a long, honest look at the absolute ruin of your own sin, and then stare at the cross. Deep love is the inevitable byproduct of deep grace.`,
    prayer: `Lord, preserve me from the cold, polite religion of the Pharisee. Never let me forget the staggering weight of what you have forgiven me, so that my love for you remains extravagant and true. Amen.`,
  },
  'john-11-35': {
    title: 'The Theology of Tears',
    reflection: `It is the shortest verse in the English Bible, and perhaps the most theologically dense. Jesus is standing at the tomb of His friend Lazarus. The profound paradox here is that Jesus knows exactly what He is about to do. In five minutes, He is going to raise Lazarus from the dead. He knows the grief is temporary. Yet, He does not bypass the mourning. He does not tell Mary and Martha to "cheer up because the victory is coming." Staring into the abyss of death and the agony of His friends, the Son of God breaks down. He validates the deep trauma of human loss by participating in it.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often try to rush ourselves and others through grief, using the hope of heaven as an anesthetic. We imply that if we really believed in the resurrection, we wouldn't cry so hard. Jesus destroys that stoicism.\n\nHe is the Resurrection, and He still weeps. Your tears are not a failure of faith; they are the proper human response to the fracture of the world. Do not rush your grief today. The God of the universe wept at a tomb; you are allowed to weep at yours.`,
    prayer: `Lord Jesus, thank you that you did not bypass the pain of the tomb. Thank you for validating human sorrow. When I am overwhelmed by grief, remind me that you are not rushing me, but weeping with me. Amen.`,
  },
  'acts-17-27-28': {
    title: 'The Proximity of the Divine',
    reflection: `Paul is speaking to Greek philosophers in Athens, men who viewed the divine as abstract, distant, and emotionally detached. Paul introduces a God who orchestrates history specifically so that humans might grope in the dark and find Him. Then he delivers the staggering claim: He is not far. God is not geographically distant, nor is He hidden behind complex religious rituals. He is the very environment in which we exist. To say "in Him we live and move" means the air we breathe is thick with His presence, even when we are entirely unaware of it.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often feel that we have to make a long, exhausting journey to find God—that we must climb a spiritual mountain to get His attention. Paul says the journey is an illusion.\n\nYou do not have to travel to find Him; you only have to wake up to the reality that you are already immersed in Him. The practice today is to stop striving to reach a distant deity, and simply acknowledge the terrifying, comforting reality that God is closer to you than your own breath.`,
    prayer: `Father, I often act as though you are millions of miles away, hiding behind the clouds. Wake me up to your proximity. Let me realize that in every ordinary moment today, in you I live and move and have my being. Amen.`,
  },
  'rom-8-1': {
    title: 'The End of the Verdict',
    reflection: `The word "therefore" points back to the agonizing struggle Paul described in Romans 7—the wretched civil war of wanting to do good but constantly failing. It is in the immediate aftermath of this failure that Paul drops the hammer of the Gospel. "No condemnation" is a legal term; the verdict of "guilty" has been permanently removed from the ledger. This is not because the believer suddenly achieved moral perfection, but because they are "in Christ Jesus." The penalty was absorbed by the proxy. There is no asterisk, no footnote, no probation period. The condemnation is gone.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `The human mind is a courtroom that is in perpetual session. We constantly prosecute ourselves, playing the tapes of our failures, our inadequacies, and our sins. We assume God is sitting on the bench, nodding in agreement with our self-hatred. Romans 8:1 shuts down the courtroom.\n\nIf the Supreme Judge of the universe has thrown out the case, you do not have the authority to keep prosecuting it. The challenge today is to stop holding yourself in contempt of court when Christ has declared you free.`,
    prayer: `Lord, the courtroom in my mind is loud, and I am constantly prosecuting my own failures. Silence the accusations with the authority of your cross. Help me to stand in the staggering reality of no condemnation. Amen.`,
  },
  '2-cor-1-3-4': {
    title: 'The Currency of Comfort',
    reflection: `Paul gives God a beautiful double-title: Father of mercies, God of all comfort. But he immediately moves from theology to mechanics. God's comfort is not a dead end. It is poured into the afflicted believer not just to soothe their pain, but to transform them into an agent of mercy. Our suffering, once comforted by God, becomes the exact currency we use to heal others. The pain is not wasted; it becomes the credential that allows us to walk into someone else's darkness and speak with authority, because we have been there, and we have survived by grace.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `When we suffer, we tend to isolate, believing our pain makes us useless. This passage redefines the purpose of your affliction.\n\nYour survived trauma is the most powerful tool you possess for the Kingdom. You have a PhD in a specific kind of pain, which means you have the exact comfort someone else is dying for today. The practice is to look around and ask: who is currently walking through the darkness I have already survived? How can I spend the comfort God gave me on them?`,
    prayer: `God of all comfort, thank you for meeting me in my affliction. Do not let my pain be wasted. Take the comfort you poured into my wounds and use it to heal someone else who is hurting today. Amen.`,
  },
  'gal-2-20': {
    title: 'The Execution of the Ego',
    reflection: `Paul is not speaking in metaphors. He views his old, ego-driven, self-justifying life as having been literally executed on the cross with Jesus. The "I" that was obsessed with performance and reputation is dead. What occupies the space now is the living presence of Christ. This is the radical core of Christian identity: it is not about a bad person trying to become a good person. It is about a dead person waking up to a completely new, borrowed life. The motive for this new life is not fear, but the staggering realization that the Son of God "loved me and gave himself for me."\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We spend so much energy trying to improve our "self"—trying to make it stronger, more impressive, more spiritual. Paul says the old self cannot be improved; it had to be crucified.\n\nTrue freedom is the realization that your life is no longer your own project. You don't have to defend your reputation, because you are dead. You don't have to manufacture righteousness, because Christ lives in you. The invitation today is to drop the exhausting project of self-improvement and surrender to the life of Christ operating within you.`,
    prayer: `Jesus, I am exhausted from trying to manage and improve my old self. Thank you that it was crucified with you. Live your life through me today. I surrender my ego to the reality of your love. Amen.`,
  },
  'phil-2-5-7': {
    title: 'The Upward Path of Descent',
    reflection: `This is the great "kenosis" (emptying) hymn. The Greco-Roman world viewed power as something to be seized, hoarded, and used to dominate others. Jesus, possessing the ultimate power of the cosmos, views it entirely differently. He does not view equality with God as a treasure to be tightly grasped for His own advantage. Instead, He pours it out. The trajectory of divinity is downward. He descends from the throne to the towel, from the towel to the cross. He redefines power not as the capacity to control, but as the capacity to serve at absolute cost to Himself.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `Every room we enter has an invisible ladder, and human nature demands that we climb it—competing for status, influence, and recognition. This passage demands a total inversion of our instincts. "Have this mind" is a command to step off the ladder.\n\nThe most Christ-like thing you can do today is to look at whatever privilege, power, or advantage you possess, and refuse to use it for your own insulation. Empty yourself. Take the posture of a servant in the exact place where you have the power to demand to be served.`,
    prayer: `Lord Jesus, my instinct is always to grasp for power, status, and comfort. Give me your mind. Teach me the terrifying, beautiful freedom of emptying myself for the sake of others. Amen.`,
  },
  'heb-12-1-2': {
    title: 'The Aerodynamics of Faith',
    reflection: `The imagery is of an ancient stadium. The saints of the past (the "cloud of witnesses") are not sitting in the stands judging; their lives are testifying that the race can be finished. The writer commands us to strip down. Notice he distinguishes between "weight" and "sin." Sin will obviously destroy you, but a weight is not necessarily evil—it is simply something that slows you down. A runner cannot sprint in an overcoat. But the secret to the endurance is not looking at your feet or obsessing over your speed; it is fixing your eyes exclusively on Jesus.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We are often exhausted not because we are engaged in massive rebellion, but because we are carrying too much weight. We carry the weight of other people's expectations, the weight of constant distraction, the weight of our own ambitions.\n\nYou cannot run the race carrying a suitcase. The challenge today is to identify one specific "weight" that is not necessarily a sin, but is tangling your feet and slowing your pursuit of Christ. Drop it, and shift your gaze back to the finish line.`,
    prayer: `Lord, I am out of breath and tangled in things that are slowing me down. Give me the courage to drop the weights I have been carrying. Lock my eyes on you, the perfecter of my faith, so I can run with endurance. Amen.`,
  },
  'rev-3-20': {
    title: 'The Courtesy of the King',
    reflection: `This verse is often used in evangelism, but Jesus is actually speaking to a church (Laodicea)—a group of wealthy, self-satisfied believers who have locked Him outside their own fellowship. The image is astonishing. The Sovereign Lord, whose eyes are like fire and whose voice is like the roar of many waters, is standing outside a door like a humble guest. He does not kick the door down. He honors human agency. He knocks, and He speaks, offering the deepest form of ancient intimacy: sharing a meal. The King of the universe is waiting to be invited into the mess of the living room.\n\n${TONE_SUFFIX.balanced}`,
    relevance: `We often treat God as a cosmic manager who lives in a distant office. But Jesus is asking for dinner. He wants access to the ordinary, unpolished spaces of our lives. We keep Him outside because we are embarrassed by the mess inside, or because we are content with our own self-sufficiency.\n\nIf your faith feels dry, it may be because you have left the King on the porch. Listen for the knock today. The solution is incredibly simple: turn the handle, open the door, and let Him sit at the table with you.`,
    prayer: `Jesus, forgive me for keeping you on the porch of my life while I manage the house on my own. I hear you knocking. I open the door to you today. Come in, sit at my table, and share this life with me. Amen.`,
  },
};

function buildFallbackDraft(passage: ScripturePassage, tone: ToneStyle): SermonDraft {
  const cleanText = passage.text.replace(/^"|"$/g, '');
  const firstSentence = cleanText.split(/[.!?]/).find(Boolean)?.trim() || cleanText;
  return {
    title: `A Closer Reading of ${passage.reference}`,
    reflection: `${passage.reference} deserves more than a reusable devotional frame. Its own words set the direction: ${firstSentence}. Start there. The passage names something particular about God, human need, obedience, hope, or mercy, and the reflection must stay close to that actual claim instead of floating above it.

${TONE_SUFFIX[tone]}`,
    relevance: `This matters today because generic comfort cannot carry real weight. A faithful reading asks what this passage specifically reveals, what it corrects, and what kind of response it invites now. The next step is to choose one concrete act that matches the text rather than one vague feeling that fades by noon.`,
    prayer: `Lord, keep me close to the words actually given here. Save me from vague comfort. Show me the truth of this passage, and shape one faithful response in me today. Amen.`,
  };
}

export function buildGroundedSermon(passage: ScripturePassage, tone: ToneStyle): Sermon {
  const draft = SERMON_LIBRARY[passage.id] ?? buildFallbackDraft(passage, tone);
  return {
    id: `sermon-${passage.id}-${tone}`,
    title: tone === 'traditional' ? `Meditation: ${draft.title}` : draft.title,
    passage,
    reflection: tone === 'gentle'
      ? draft.reflection.replace(TONE_SUFFIX.balanced, TONE_SUFFIX.gentle)
      : tone === 'traditional'
        ? draft.reflection.replace(TONE_SUFFIX.balanced, TONE_SUFFIX.traditional)
        : draft.reflection,
    relevance: draft.relevance,
    prayer: draft.prayer,
    createdAt: new Date().toISOString(),
  };
}

export function getGroundedSermonDrafts(): Record<string, SermonDraft> {
  return SERMON_LIBRARY;
}
