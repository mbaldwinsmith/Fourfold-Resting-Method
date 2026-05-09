export const PRACTICE = {
  title: 'The Fourfold Resting',
  subtitle: 'A science-based relaxation and presence practice',
  tagline: 'Integrating breathwork, somatic grounding, and guided visualisation',

  overview: 'The Fourfold Resting is a structured relaxation method comprising four movements — Settling, Grounding, Receiving, and Returning — designed to shift the nervous system toward parasympathetic tone and open a state of calm, receptive attention. The method draws on three converging bodies of evidence: polyvagal theory (Porges), heart rate variability research (Lehrer & Gevirtz), and interoceptive awareness studies (Craig, Damasio). Two adaptations are provided: a brief daily form requiring 4–5 minutes, and a fuller pre-event preparation of 12–15 minutes. Both draw from the same four movements, adjusted in depth and duration.',

  science: {
    polyvagal: {
      title: 'Polyvagal theory',
      body: 'Polyvagal theory (Porges 1994, 2011) proposes that the autonomic nervous system operates in three hierarchical states: dorsal vagal shutdown, sympathetic mobilisation, and ventral vagal social engagement. The practice is designed to move from sympathetic or shutdown states toward ventral vagal regulation — the state associated with calm alertness, social openness, and cognitive flexibility.'
    },
    hrv: {
      title: 'Heart rate variability',
      body: 'Heart rate variability research (Lehrer & Gevirtz 2014) demonstrates that slow, diaphragmatic breathing with an extended exhale reliably increases HRV — a marker of autonomic flexibility and resilience. Higher HRV is associated with better emotional regulation, reduced anxiety, and improved performance under pressure.'
    },
    interoception: {
      title: 'Interoceptive awareness',
      body: 'Interoceptive awareness (Craig 2009; Farb et al. 2013) shows that deliberate body-directed attention reduces amygdala reactivity and increases prefrontal regulatory capacity. The body scan is not merely a relaxation technique; it is an active recalibration of the brain\'s threat-detection circuitry. Together, these frameworks describe a convergent pathway: the body, given appropriate conditions of breath, attention, and sensory grounding, moves naturally toward regulation.'
    }
  },

  modes: [
    {
      id: 'brief',
      title: 'Brief daily practice',
      duration: '4–5 minutes',
      posture: 'Seated, feet flat on the floor',
      description: 'To establish a reliable daily threshold signal — a brief, repeatable practice that conditions the nervous system to associate a specific sequence of actions with the shift from alert, task-oriented processing to calm, receptive attention. Used consistently, the sequence becomes a conditioned response: beginning the practice is sufficient to begin the shift.'
    },
    {
      id: 'full',
      title: 'Fuller pre-event preparation',
      duration: '12–15 minutes',
      posture: 'Seated, quiet space if possible',
      description: 'To prepare the whole person — body, attention, and inner life — to engage fully with a significant activity: a difficult conversation, a performance, a ceremony, a creative session, or any event that benefits from arriving as a whole and settled person rather than as the residue of whatever came before. This adaptation uses all four movements in their fuller form.'
    }
  ],

  phases: [
    {
      id: 'settling',
      number: 'I',
      title: 'Settling',
      subtitle: 'The breath',
      durationBrief: 180,
      durationFull: 300,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 528,
      steps: [
        {
          id: 's1',
          text: 'Sit with weight evenly distributed. Feel the contact of feet with floor and sitting bones with chair. Let the spine lengthen without rigidity — upright but not braced.'
        },
        {
          id: 's2',
          text: 'Place one hand on the chest and one on the belly. Breathe in for a count of 4 through the nose, hold gently for 1, then exhale for a count of 6 through a gently open mouth. Encourage the lower hand to lead — diaphragmatic breathing produces stronger effects. Complete the full number of cycles for your chosen practice.'
        },
        {
          id: 's3',
          text: 'After the final cycle, release the counting. Let breath settle to its own slower rhythm. The technique has done its work; what remains is simply allowing the body to land.'
        }
      ],
      science: 'Diaphragmatic breathing increases HRV through baroreceptor stimulation and reduces salivary cortisol (Ma et al. 2017). The extended exhale (2:3 inhale-to-exhale ratio) activates the vagal brake via stimulation of the nucleus ambiguus, increasing parasympathetic tone. The 4:1:6 ratio further stimulates the Hering-Breuer reflex, deepening the relaxation response (Lehrer & Gevirtz 2014; Zaccaro et al. 2018).',
      breathPattern: {
        inDuration: 4,
        holdDuration: 1,
        outDuration: 6,
        cycles: 6
      },
      breathPatternBrief: {
        inDuration: 4,
        holdDuration: 0,
        outDuration: 6,
        cycles: 3
      }
    },

    {
      id: 'grounding',
      number: 'II',
      title: 'Grounding',
      subtitle: 'The body',
      durationBrief: 120,
      durationFull: 240,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 432,
      steps: [
        {
          id: 'g1',
          text: 'Draw a slow, continuous upward attention through the body — feet, legs, sitting bones, spine, hands, shoulders, face. Think of it as a tide of awareness moving upward rather than a checklist. The intention is recognition, not analysis: the body is here, present, and held.'
        },
        {
          id: 'g2',
          text: 'Name three sensory anchors: something you can feel, something you can hear, something you can smell. Let each one pull attention into the present moment and the specific place you occupy.'
        },
        {
          id: 'g3',
          text: 'Soften the gaze. Let peripheral vision widen slightly rather than fixing on any point. This is the bodily cue that you are transitioning from alertness to receptivity — from scanning for threat to resting in safety.'
        },
        {
          id: 'g4',
          text: 'Speak or think one word that names where you are arriving from — not an aspiration, but an honest reading of your current interior state. This brief act of affect labelling is both an orientation and a mild amygdala down-regulator.'
        }
      ],
      science: 'Interoceptive body scanning reduces amygdala reactivity and increases prefrontal regulation (Craig 2009; Farb et al. 2013). Widened peripheral vision activates the superior colliculus safety signal, reducing autonomic threat response (Porges 2011). Single-word affect labelling reduces amygdala activation compared to unexpressed emotional states (Lieberman et al. 2007). Sensory grounding interrupts dissociative drift by activating interoceptive and exteroceptive processing simultaneously.',
      breathPattern: null
    },

    {
      id: 'receiving',
      number: 'III',
      title: 'Receiving',
      subtitle: 'Guided visualisation',
      durationBrief: null,
      durationFull: 240,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 396,
      steps: [
        {
          id: 'r1',
          text: 'Bring to mind a specific remembered place where you have felt genuinely safe, calm, and at ease. Not an imagined ideal, but a real memory — a room, a landscape, a moment. Let the image be as sensory and specific as possible: light, texture, temperature, sound. Remain with it as a receiver rather than a constructor.'
        },
        {
          id: 'r2',
          text: 'Allow the quality of that safety to deepen. If a sense of warmth, a person, or a benevolent presence arises within the image, do not analyse or evaluate it — simply remain near it. If the image remains purely environmental, that is sufficient. If the image is dry or absent, rest in the emptiness — that quality of honest waiting is itself a form of open attention.'
        },
        {
          id: 'r3',
          text: 'Let go of the image gradually. Without constructing a narrative, allow the body to carry a simple, quiet anticipation of what lies ahead — not excitement or pressure, but the interior posture of one who is ready to engage. This is receptive preparation: the self oriented toward what comes next without being seized by it.'
        }
      ],
      science: 'Guided imagery activates the default mode network in ways associated with self-referential processing and meaning integration (Buckner et al. 2008). Positive anticipatory states — distinguished from anxious anticipation by their quality of openness rather than vigilance — reduce cortisol and prime approach motivation (Fredrickson 2001; Phan et al. 2002).',
      breathPattern: null,
      stages: [
        {
          id: 'r-stage-1',
          title: 'A place of safety',
          duration: 60,
          text: 'Bring to mind a specific remembered place where you have felt genuinely safe, calm, and at ease. Let the image be as sensory and specific as possible. You are not building this image; you are entering it.'
        },
        {
          id: 'r-stage-2',
          title: 'Presence',
          duration: 120,
          text: 'Allow the quality of that safety to deepen. Receive rather than generate. If the image is dry or absent, rest in the emptiness without forcing it — that quality of honest waiting is itself a form of open attention.'
        },
        {
          id: 'r-stage-3',
          title: 'Anticipation',
          duration: 60,
          text: 'Let go of the image gradually. Allow the body to carry a simple, quiet anticipation of what lies ahead — not excitement or pressure, but the interior posture of one who is ready to engage.'
        }
      ]
    },

    {
      id: 'returning',
      number: 'IV',
      title: 'Returning',
      subtitle: 'Integration',
      durationBrief: null,
      durationFull: 180,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 639,
      steps: [
        {
          id: 'ret1',
          text: 'Return attention to breath. Two natural cycles, witnessing only — no technique, no count.'
        },
        {
          id: 'ret2',
          text: 'Name one word for what you are bringing to the activity ahead. Not what you hope to achieve, but what you are actually carrying: readiness, uncertainty, care, focus, openness. Honest naming completes the arc of self-awareness the practice has opened.'
        },
        {
          id: 'ret3',
          text: 'Speak or think a brief closing phrase — something simple that marks the end of the practice and the beginning of movement toward what follows. The content matters less than the function: this phrase is a threshold signal.'
        },
        {
          id: 'ret4',
          text: 'Re-enter the sensory environment around you: sound, light, the physical reality of the space. Move gently — unhurried re-entry preserves the autonomic gains of the practice. Abrupt return to high alertness produces a sympathetic rebound that can cancel the parasympathetic benefit.'
        }
      ],
      science: 'Abrupt termination of relaxation practice produces sympathetic rebound, reducing or reversing HRV gain (Ley 1999). Slow, deliberate re-entry with sensory anchoring maintains the regulatory benefit into the period immediately following the practice — which is precisely when it is most needed.',
      breathPattern: null
    }
  ],

  references: [
    'Porges, S.W. (1994, 2011). The Polyvagal Theory. Norton.',
    'Lehrer, P. & Gevirtz, R. (2014). Heart rate variability biofeedback. Frontiers in Psychology.',
    'Zaccaro, A. et al. (2018). How breath-control can change your life. Frontiers in Human Neuroscience.',
    'Craig, A.D. (2009). How do you feel — now? Nature Reviews Neuroscience.',
    'Farb, N. et al. (2013). Interoception, contemplative practice, and health. Frontiers in Psychology.',
    'Lieberman, M.D. et al. (2007). Putting feelings into words. Psychological Science.',
    'Ma, X. et al. (2017). The effect of diaphragmatic breathing. Frontiers in Psychology.',
    'Buckner, R.L. et al. (2008). The brain\'s default network. Annals of the New York Academy of Sciences.',
    'Fredrickson, B.L. (2001). The role of positive emotions. American Psychologist.',
    'Phan, K.L. et al. (2002). Functional neuroanatomy of emotion. NeuroImage.',
    'Ley, R. (1999). The modification of breathing behavior. Behavior Modification.'
  ]
}
