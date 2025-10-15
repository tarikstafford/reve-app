import { Analyst } from '@/lib/db/types'

export const analysts: Record<string, Analyst> = {
  jung: {
    id: 'jung',
    name: 'Carl Jung',
    title: 'Analytical Psychologist',
    era: '1875-1961',
    specialty: 'Collective Unconscious & Archetypes',
    approach: 'Jungian dream analysis explores the collective unconscious, archetypes, and individuation. Dreams are seen as messages from the unconscious mind, revealing Shadow aspects, Anima/Animus, and the journey toward Self-realization.',
    bio: `Carl Gustav Jung was a Swiss psychiatrist and psychoanalyst who founded analytical psychology. Jung's work has been influential in psychiatry and in the study of religion, literature, and related fields.

**Key Concepts:**
- **Collective Unconscious**: Shared reservoir of experiences inherited from our ancestors
- **Archetypes**: Universal, primordial symbols and images (Self, Shadow, Anima/Animus, Persona)
- **Individuation**: The process of integrating the conscious and unconscious mind
- **Synchronicity**: Meaningful coincidences between inner and outer events

**Dream Analysis Approach:**
Jung believed dreams compensate for deficiencies in the conscious attitude and reveal aspects of the psyche seeking integration. He looked for archetypal symbols, recurring motifs, and the dreamer's personal associations. Dreams guide us toward wholeness and self-understanding.`
  },
  freud: {
    id: 'freud',
    name: 'Sigmund Freud',
    title: 'Father of Psychoanalysis',
    era: '1856-1939',
    specialty: 'Unconscious Desires & Dream Symbolism',
    approach: 'Freudian analysis views dreams as the "royal road to the unconscious," revealing repressed wishes and desires. Through latent content beneath manifest symbols, dreams fulfill forbidden impulses in disguised form.',
    bio: `Sigmund Freud was an Austrian neurologist and the founder of psychoanalysis. His work transformed our understanding of the human mind and the nature of psychological treatment.

**Key Concepts:**
- **Id, Ego, Superego**: The three-part structure of personality
- **Repression**: Pushing unacceptable thoughts into the unconscious
- **Wish Fulfillment**: Dreams represent disguised fulfillment of repressed wishes
- **Dream Work**: Processes that transform latent dream thoughts into manifest content

**Dream Analysis Approach:**
Freud called dreams "the royal road to the unconscious." He distinguished between:
- **Manifest Content**: The literal storyline and imagery you remember
- **Latent Content**: The hidden, symbolic meaning representing repressed desires

Through free association and symbol interpretation, Freud uncovered sexual and aggressive impulses, childhood conflicts, and unresolved desires. Dreams protect sleep by satisfying unconscious wishes in disguised, acceptable forms.`
  }
}

export function getAnalyst(id: string): Analyst | undefined {
  return analysts[id]
}

export function getAllAnalysts(): Analyst[] {
  return Object.values(analysts)
}
