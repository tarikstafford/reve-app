export interface Guide {
  slug: string
  title: string
  description: string
  readTime: string
  publishedAt: string
  content: GuideSection[]
}

export interface GuideSection {
  heading: string
  content: string
}

export const guides: Guide[] = [
  {
    slug: 'image-rehearsal-therapy',
    title: 'How to Practice Image Rehearsal Therapy',
    description: 'Learn the evidence-based technique for transforming nightmares and manifesting your ideal self through visualization.',
    readTime: '5 min read',
    publishedAt: '2024-01-10',
    content: [
      {
        heading: 'What is Image Rehearsal Therapy?',
        content: `Image Rehearsal Therapy (IRT) is a cognitive-behavioral technique originally developed to treat recurring nightmares. Research published in the Journal of the American Medical Association (PMC4120639) shows that IRT reduces nightmare frequency by 50-70% in just 3-6 weeks.

The core principle is simple but powerful: **your brain can't distinguish between vividly imagined experiences and real ones**. By repeatedly visualizing positive outcomes, you create new neural pathways that reshape your subconscious expectations and beliefs.`
      },
      {
        heading: 'How Rêve Uses IRT',
        content: `Rêve adapts IRT from nightmare treatment to manifestation. Instead of rewriting bad dreams, you're creating and rehearsing your ideal future self:

1. **Dream Analysis**: AI interprets your dreams to understand your current subconscious patterns
2. **Manifestation Creation**: Generate positive narratives and videos of your ideal self
3. **Daily Rehearsal**: Watch and internalize these manifestations to reprogram your beliefs
4. **Subconscious Integration**: Over time, your mind begins to expect and create opportunities aligned with your vision`
      },
      {
        heading: 'The Science Behind Visualization',
        content: `Stanford neuroscientist Dr. Andrew Huberman's research shows that mental rehearsal activates the same brain regions as actual experience. When you vividly imagine yourself as your ideal self:

- **Motor cortex** fires as if you're performing the actions
- **Visual cortex** processes the imagined scenes
- **Prefrontal cortex** strengthens self-belief circuits
- **Amygdala** (fear center) activity decreases

This isn't just positive thinking—it's **neuroplasticity in action**. You're literally rewiring your brain's default patterns.`
      },
      {
        heading: 'How to Practice IRT with Rêve',
        content: `**Step 1: Create Your Manifestations**
During onboarding, Rêve generates three "seed" manifestations based on your ideal self. These are your starting templates.

**Step 2: Daily Rehearsal Routine**
- Watch manifestation videos **1-2 times per day**
- Best times: morning (sets intention) and before sleep (embeds in subconscious)
- Duration: 1-3 minutes per session
- Focus: Don't just watch passively—**feel** the emotions of already being that person

**Step 3: Active Visualization**
While watching:
- Close your eyes periodically and recreate the scene mentally
- Engage all senses: What do you see? Hear? Feel physically and emotionally?
- Embody the confidence and energy of your ideal self

**Step 4: Create New Manifestations**
As you evolve, create new manifestations that reflect:
- Specific goals you're working toward
- Qualities you want to strengthen
- Scenarios you want to prepare for mentally`
      },
      {
        heading: 'Expected Timeline & Results',
        content: `**Week 1-2: Familiarization**
You're learning the practice. It may feel awkward or "fake" at first. This is normal—you're introducing new patterns to a skeptical subconscious.

**Week 3-4: Subtle Shifts**
You'll notice:
- Increased confidence in specific areas
- Small opportunities appearing
- Less resistance to taking aligned actions
- Dreams reflecting your manifestation themes

**Week 5-8: Integration**
- Your ideal self vision feels more natural and "real"
- You unconsciously make choices aligned with your vision
- Other people may notice changes in your energy
- Synchronicities and opportunities increase

**3+ Months: Transformation**
Your subconscious has adopted new default patterns. You're not "trying" to be your ideal self—you're **being** it.`
      },
      {
        heading: 'Pro Tips for Maximum Effect',
        content: `**1. Consistency > Intensity**
Better to watch manifestations for 2 minutes daily than 30 minutes once a week. Neural pathways strengthen through repetition.

**2. Emotional Engagement**
The key is **feeling**, not just seeing. Research shows emotionally-charged visualization is 3x more effective at creating neural changes.

**3. Combine with Action**
IRT isn't a substitute for action—it's a catalyst. Use the confidence and clarity it builds to take real-world steps toward your goals.

**4. Track Your Dreams**
Your dreams will show you what's shifting in your subconscious. After 10 dreams, unlock Subconscious AI chat to explore patterns.

**5. Update Manifestations**
As you grow, your vision should evolve. Create new manifestations every 4-6 weeks to reflect your expanding possibilities.`
      },
      {
        heading: 'Research References',
        content: `- **IRT Meta-Analysis**: [PMC4120639](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4120639/) - JAMA review of 20+ controlled trials
- **Visualization & Performance**: Dr. James Doty (Stanford Center for Compassion and Altruism Research)
- **Neuroplasticity**: Dr. Andrew Huberman (Stanford School of Medicine)
- **Dream Integration**: American Academy of Sleep Medicine guidelines

IRT is one of the most well-researched psychological interventions. Rêve simply extends its proven mechanism from nightmare treatment to conscious self-transformation.`
      }
    ]
  },
  {
    slug: 'dream-logging',
    title: 'The Art of Dream Journaling',
    description: 'Master the practice of capturing dreams effectively. Techniques to improve recall and extract meaningful insights.',
    readTime: '4 min read',
    publishedAt: '2024-01-08',
    content: [
      {
        heading: 'Why Dream Journaling Matters',
        content: `Dream journaling isn't just about remembering what happened while you slept—it's a **direct line to your subconscious mind**.

Research published in PMC8935176 (a meta-analysis of 20 randomized controlled trials) found that regular journaling produces:
- **20-45% reduction** in depression and anxiety symptoms
- **23% decrease** in cortisol (stress hormone) levels
- **Improved immune function** and cognitive performance
- Maximum benefits appear after **30+ days** of consistent practice

Your dreams reveal patterns, fears, desires, and solutions that your conscious mind filters out during waking hours.`
      },
      {
        heading: 'The Critical Window: First 5 Minutes',
        content: `**90% of dream content is forgotten within 10 minutes of waking.**

The transition from sleep to wakefulness rapidly degrades dream memories as your brain switches from subconscious to conscious processing modes. This is why the **first 5 minutes after waking** are crucial.

**Optimal Dream Capture Strategy:**
1. **Don't move immediately** - Physical movement accelerates memory loss
2. **Keep eyes closed** for 30-60 seconds while you recall
3. **Grab key images** - Focus on 3-5 vivid moments, not the full narrative
4. **Speak or write immediately** - Use Rêve's voice recording or quick text entry
5. **Details can come later** - Get the skeleton down first, flesh it out within 5 minutes`
      },
      {
        heading: 'Voice vs. Text: When to Use Each',
        content: `**Voice Recording (Recommended for Most)**
Best when:
- You wake up groggy and typing feels difficult
- The dream had strong emotions you want to capture in your tone
- You remember a lot of details and speaking is faster
- You're still half-asleep and want minimal friction

Rêve's voice transcription (powered by OpenAI Whisper) captures your raw account, including emotional inflection that can help AI interpretation.

**Text Entry**
Best when:
- You're fully awake and can type quickly
- You want to organize thoughts as you write
- You're in a public/shared space
- The dream was short and simple

**Pro Tip**: Use voice immediately upon waking, then add text notes later if needed.`
      },
      {
        heading: 'What to Include in Your Dream Log',
        content: `**Essential Elements:**

**1. Emotions** (Most Important)
- How did you *feel* in the dream?
- How do you feel *about* the dream now?
- Emotions are the key to interpretation—facts are secondary

**2. Key Symbols & Characters**
- Who appeared? (people, animals, entities)
- What objects stood out?
- Unusual or impossible elements

**3. Setting & Atmosphere**
- Where did it take place?
- Time of day, weather, colors, mood of the environment
- Was it familiar or strange?

**4. Narrative Arc**
- What happened? (Brief summary is fine)
- Any major shifts or turning points?
- How did it end?

**5. Waking Life Context** (Optional but valuable)
- What happened yesterday?
- Current stresses or excitements
- This helps AI find connections`
      },
      {
        heading: 'How AI Interprets Your Dreams',
        content: `Rêve uses GPT-4o to analyze your dream logs, identifying:

**Themes**: Recurring patterns across multiple dreams (e.g., "transformation", "seeking approval", "overcoming obstacles")

**Emotions**: The emotional landscape of your subconscious (fear, joy, confusion, empowerment)

**Symbols**: What objects and characters might represent based on psychological research and your personal context

**Interpretation**: A narrative synthesis explaining possible meanings

**Important**: AI interpretation is a **starting point**, not absolute truth. Your subconscious speaks in a personal language. Use AI insights as prompts for your own reflection.`
      },
      {
        heading: 'Improving Dream Recall',
        content: `Most people think they "don't dream" or "can't remember dreams." This is false—everyone dreams 4-6 times per night during REM sleep. You just need to train recall.

**Proven Techniques:**

**1. Set Intention Before Sleep**
Tell yourself: "I will remember my dreams tonight." Sounds simple, but research shows **intention predicts recall**.

**2. Keep Rêve Accessible**
Phone next to bed, app open to dream log screen. Zero friction = higher capture rate.

**3. Wake Naturally When Possible**
Alarms often jolt you out of REM before you can encode the memory. On weekends, try waking without an alarm.

**4. Consistent Sleep Schedule**
Your brain enters deeper REM cycles when sleep patterns are regular. Irregular sleep = fragmented dream recall.

**5. Review Past Dreams**
Reading old entries signals to your brain that dreams are important, increasing future recall.

**6. Avoid Alcohol Before Bed**
Alcohol suppresses REM sleep, reducing dream frequency and vividness.`
      },
      {
        heading: 'Common Mistakes to Avoid',
        content: `**❌ Waiting Too Long**
"I'll write it down after breakfast" = you'll forget 80% of it. Log immediately.

**❌ Over-Filtering**
Don't dismiss dreams as "too weird" or "not important enough." The strangest dreams often carry the most valuable insights.

**❌ Judging Yourself**
Your dreams can be violent, sexual, embarrassing, or nonsensical. This is **normal**. The subconscious doesn't follow social rules. Rêve is private—be honest.

**❌ Forcing Interpretation**
Not every dream needs deep analysis. Some are just brain maintenance. Log it, let AI interpret, move on.

**❌ Inconsistent Practice**
Journaling 1-2 times won't show patterns. Commit to **10+ dreams** to unlock real insights (and Subconscious AI chat in Rêve).`
      },
      {
        heading: 'The 10-Dream Milestone',
        content: `In Rêve, after logging 10 dreams, you unlock **Subconscious AI Chat**—a conversational interface that can:
- Identify cross-dream patterns you might have missed
- Answer questions about recurring symbols
- Suggest manifestations based on your subconscious themes
- Help you understand emotional patterns

10 dreams gives the AI enough data to move from isolated interpretations to **holistic understanding** of your inner world.

**Typical timeline**: 2-4 weeks if logging dreams consistently (most people remember 3-5 dreams per week once they build the habit).`
      }
    ]
  },
  {
    slug: 'dream-interpretation',
    title: 'Understanding Your Dreams',
    description: 'Decode the symbols and patterns in your dreams. How AI analysis reveals your subconscious patterns.',
    readTime: '6 min read',
    publishedAt: '2024-01-05',
    content: [
      {
        heading: 'Dreams as Subconscious Messages',
        content: `Dreams aren't random neural noise—they're your subconscious mind processing emotions, memories, fears, and desires that your conscious mind suppresses or ignores during waking hours.

**What Science Says:**
Research in *Current Biology* and sleep medicine journals shows dreams play proven roles in:
- **Memory consolidation** (integrating daily experiences into long-term storage)
- **Emotional regulation** (processing difficult feelings in a safe space)
- **Creative problem-solving** (making novel connections between seemingly unrelated ideas)
- **Threat simulation** (rehearsing responses to potential dangers)

Your dreams are personalized messages **from you, to you**—written in symbols, metaphors, and emotional tones instead of literal language.`
      },
      {
        heading: 'How AI Dream Interpretation Works',
        content: `Rêve uses GPT-4o (OpenAI's most advanced multimodal model) to analyze your dream logs. Here's what happens behind the scenes:

**Step 1: Theme Extraction**
The AI identifies overarching themes in your dream:
- Transformation, exploration, conflict, connection, loss, achievement, etc.
- These themes often reflect what your subconscious is currently wrestling with

**Step 2: Emotion Mapping**
AI detects emotional tones: fear, joy, confusion, empowerment, sadness, curiosity, etc.
- Emotions are **more important than events**—they reveal your true subconscious state

**Step 3: Symbol Recognition**
Common symbols are interpreted based on:
- **Jungian archetypes** (universal symbols across cultures)
- **Contextual meaning** (how the symbol appeared in *your* dream)
- **Personal associations** (based on your waking life context if you provide it)

**Step 4: Narrative Synthesis**
AI weaves themes, emotions, and symbols into a coherent interpretation—a narrative that helps you understand what your subconscious is communicating.

**Important**: This isn't mystical fortune-telling. It's **pattern recognition** applied to the symbolic language of your subconscious.`
      },
      {
        heading: 'Common Dream Symbols & What They May Mean',
        content: `**⚠️ Context is Everything**
Symbols don't have fixed meanings. Water can represent emotions, cleansing, chaos, or the unconscious depending on how it appears. Use these as starting points, not rules.

**Falling**: Loss of control, anxiety about a situation, fear of failure
**Flying**: Freedom, ambition, desire to escape limitations, spiritual growth
**Being Chased**: Avoidance of a problem, fear, or emotion you're not ready to face
**Teeth Falling Out**: Anxiety about appearance, communication breakdown, loss of power
**Water**:
  - Calm: Emotional peace, clarity
  - Turbulent: Emotional overwhelm, subconscious chaos
  - Deep: The unconscious mind, hidden depths of self
**Houses/Buildings**:
  - Rooms: Different aspects of self or psyche
  - Basements: Unconscious, repressed memories
  - Attics: Memories, higher consciousness
  - Condition: State of your mental/emotional self
**Animals**: Instincts, emotions, shadow aspects
  - Predators: Fears or aggressive impulses
  - Domesticated: Controlled aspects of self
  - Wild: Untamed desires or freedom
**Death**: Transformation, end of a phase, rebirth (rarely literal death)
**Sex**: Union of opposites, creativity, desire for connection (not always literal)
**Exams/Tests**: Performance anxiety, feeling judged, self-evaluation
**Nakedness**: Vulnerability, fear of exposure, authenticity`
      },
      {
        heading: 'Recurring Dreams: What They Mean',
        content: `**If you dream the same thing repeatedly, your subconscious is shouting at you.**

Recurring dreams indicate:
1. **Unresolved issue** - Something in waking life needs attention
2. **Core fear or desire** - A fundamental emotional pattern
3. **Trauma processing** - Your mind is trying to integrate a difficult experience

**How Rêve Helps:**
After logging 10+ dreams, Rêve's AI can identify:
- Themes that repeat across different dream narratives
- Symbols that keep appearing in various contexts
- Emotional patterns that persist regardless of dream content

**What to Do:**
1. **Acknowledge the pattern** - Conscious recognition often reduces recurrence
2. **Explore via Subconscious Chat** - Ask AI to analyze the pattern across dreams
3. **Take waking action** - If the dream reflects real anxiety, address it in life
4. **Use IRT** - Rewrite the recurring dream with a positive resolution and rehearse it`
      },
      {
        heading: 'Nightmares vs. Shadow Work',
        content: `**Not all disturbing dreams are "bad."**

**Nightmares** (clinical definition): Dreams that wake you up in fear/distress and impair sleep quality. These warrant IRT treatment.

**Shadow Work Dreams**: Uncomfortable dreams that surface repressed parts of yourself (anger, shame, forbidden desires). These are **valuable**—they bring unconscious material to light so you can integrate it.

**Carl Jung's Shadow Concept:**
The "shadow" is everything about yourself you've denied or rejected. It appears in dreams as:
- Villains or threatening figures (often representing your own disowned traits)
- Shameful or taboo scenarios
- Qualities you judge in others (often projections of your shadow)

**Example**: If you dream of being selfish or cruel, it might not mean you're a bad person—it means your psyche is trying to integrate healthy assertiveness or boundary-setting that you've suppressed.

**Approach**: Don't run from disturbing dreams. Examine them with curiosity. What disowned part of you is trying to emerge?`
      },
      {
        heading: 'Dreams vs. Manifestations in Rêve',
        content: `**Dreams (Reflective)**
- Show your **current subconscious state**
- Process past experiences and emotions
- Reveal fears, patterns, and hidden desires
- **You observe** what your subconscious creates

**Manifestations (Directive)**
- Show your **desired future state**
- Create new neural pathways via IRT
- Reprogram beliefs and expectations
- **You create** what your subconscious internalizes

**The Bridge:**
1. Dreams reveal where you are (e.g., recurring theme of "feeling trapped")
2. Manifestations define where you're going (e.g., videos of your empowered, free ideal self)
3. IRT rehearsal rewires the subconscious from state 1 → state 2
4. Future dreams start reflecting new patterns

This is why Rêve tracks both. Dreams are the diagnostic. Manifestations are the treatment. Together, they transform your subconscious blueprint.`
      },
      {
        heading: 'Lucid Dreaming & Rêve',
        content: `**Lucid dreaming** = becoming conscious within a dream and gaining control over the narrative.

**Why it's relevant to Rêve:**
- Lucid dreams are **real-time IRT**—you can practice your ideal self behavior directly in the dream
- They accelerate manifestation by creating visceral experiences of your desired reality
- Research shows lucid dreamers can improve motor skills and reduce anxiety through dream rehearsal

**How to Increase Lucid Dreaming:**
1. **Dream journaling** (which you're already doing) - #1 predictor of lucid dreaming frequency
2. **Reality checks** - Ask "Am I dreaming?" during the day, creating a habit that transfers to dreams
3. **MILD technique** - Before sleep: "Next time I'm dreaming, I will remember I'm dreaming"
4. **Review dream signs** - Notice recurring impossible elements in your logs (e.g., "I never have a working phone in dreams") and use them as lucidity triggers

**Rêve Future Feature**: Pattern recognition could auto-suggest your personal dream signs to trigger lucidity.`
      },
      {
        heading: 'When to Seek Professional Help',
        content: `Dream journaling and AI interpretation are tools for **self-exploration and growth**, not medical treatment.

**Seek a therapist or sleep specialist if:**
- Nightmares severely impact sleep quality (>2x per week)
- Dreams involve re-experiencing trauma (PTSD-related)
- You experience sleep paralysis, night terrors, or sleepwalking
- Dream content is extremely violent or disturbing and causing distress
- You're using dream interpretation to avoid dealing with real-life mental health issues

**Rêve is complementary**, not a replacement for professional care. Think of it as:
- A **journal** (self-reflection tool)
- An **IRT platform** (evidence-based technique therapists use)
- A **manifestation tool** (neuroplasticity training)

If you're in therapy, share insights from Rêve with your therapist. Dream patterns can provide valuable material for clinical work.`
      }
    ]
  }
]

export function getGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug)
}

export function getAllGuides(): Guide[] {
  return guides
}
