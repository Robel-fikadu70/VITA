/**
 * Screening Registry — single source of truth for all wellness assessments.
 *
 * To add a new screening in the future:
 *   1. Add a new ScreeningDefinition object to the SCREENINGS array.
 *   2. That's it. All UI is data-driven.
 */

export type ScreeningQuestion = {
  key: string;
  question: string;
  options: readonly string[];
};

export type ScreeningDefinition = {
  id: string;
  title: string;
  tagline: string;          // short line for the hub card
  description: string;      // one-sentence detail
  icon: string;             // Ionicons name
  color: string;            // primary accent
  gradientColors: readonly [string, string, string];
  questions: ScreeningQuestion[];
  /** Converts a filled-in answers map to an AI prompt */
  promptTemplate: (answers: Record<string, string>) => string;
};

/* ─────────────────── Screening Definitions ─────────────────── */

const PCOS_SCREENING: ScreeningDefinition = {
  id: 'pcos-risk',
  title: 'PCOS Risk Insight',
  tagline: 'Hormonal wellness screening',
  description:
    'Evaluate symptoms commonly associated with polycystic ovary syndrome through a short questionnaire.',
  icon: 'rose-outline',
  color: '#FAD2E1',
  gradientColors: ['#1A0A12', '#2D1520', '#1A0A12'],
  questions: [
    {
      key: 'cycle',
      question: 'How regular is your menstrual cycle?',
      options: ['Regular', 'Irregular', 'Not Sure'] as const,
    },
    {
      key: 'fatigue',
      question: 'Have you experienced unusual or persistent fatigue recently?',
      options: ['Yes', 'Sometimes', 'No'] as const,
    },
    {
      key: 'acne',
      question: 'Have you experienced severe or sudden-onset acne?',
      options: ['Yes', 'No'] as const,
    },
    {
      key: 'hair',
      question: 'Have you noticed unusual hair growth (face, body) or hair thinning?',
      options: ['Yes', 'No'] as const,
    },
    {
      key: 'weight',
      question: 'Do you struggle with unexpected or difficult-to-explain weight changes?',
      options: ['Yes', 'Sometimes', 'No'] as const,
    },
  ],
  promptTemplate: (answers) =>
    `You are a professional wellness advisor providing educational insights. Analyze the following PCOS Risk screening responses and provide a structured wellness insight.

Screening responses:
- Menstrual cycle regularity: ${answers.cycle ?? 'Not answered'}
- Unusual fatigue: ${answers.fatigue ?? 'Not answered'}
- Severe acne: ${answers.acne ?? 'Not answered'}
- Unusual hair growth or thinning: ${answers.hair ?? 'Not answered'}
- Unexpected weight changes: ${answers.weight ?? 'Not answered'}

Please structure your response with exactly these four sections, each starting with its heading on a new line:

WELLNESS INSIGHT:
[A 2-3 sentence summary of the overall findings based on the responses]

POTENTIAL AREAS TO MONITOR:
[Key observations and patterns from the responses, as bullet points]

RECOMMENDED ACTIONS:
[3-4 practical lifestyle recommendations]

SUGGESTED WELLNESS SUPPORT:
[Relevant wellness programs, professionals to consult, or resources]

Important: Always end with a reminder that this is educational information only and not a medical diagnosis.`,
};

const BURNOUT_SCREENING: ScreeningDefinition = {
  id: 'burnout-risk',
  title: 'Burnout Risk Assessment',
  tagline: 'Work & energy wellness check',
  description:
    'Identify early signs of occupational burnout and emotional exhaustion before they impact your health.',
  icon: 'flame-outline',
  color: '#F4A261',
  gradientColors: ['#1A0E05', '#2D1A08', '#1A0E05'],
  questions: [
    {
      key: 'exhaustion',
      question: 'How often do you feel emotionally or physically drained at the end of the workday?',
      options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'] as const,
    },
    {
      key: 'motivation',
      question: 'How would you describe your current motivation for your work or daily responsibilities?',
      options: ['High', 'Moderate', 'Low', 'None'] as const,
    },
    {
      key: 'sleep',
      question: 'Is stress affecting the quality of your sleep?',
      options: ['Not at all', 'Mildly', 'Moderately', 'Significantly'] as const,
    },
    {
      key: 'overwhelm',
      question: 'Do you frequently feel overwhelmed by your responsibilities?',
      options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'] as const,
    },
    {
      key: 'withdrawal',
      question: 'Have you been withdrawing from social activities or hobbies you used to enjoy?',
      options: ['No', 'Slightly', 'Noticeably', 'Significantly'] as const,
    },
  ],
  promptTemplate: (answers) =>
    `You are a professional wellness advisor providing educational insights. Analyze the following Burnout Risk screening responses and provide a structured wellness insight.

Screening responses:
- End-of-day emotional/physical exhaustion frequency: ${answers.exhaustion ?? 'Not answered'}
- Current motivation level: ${answers.motivation ?? 'Not answered'}
- Stress impact on sleep: ${answers.sleep ?? 'Not answered'}
- Feeling overwhelmed frequency: ${answers.overwhelm ?? 'Not answered'}
- Withdrawal from social activities/hobbies: ${answers.withdrawal ?? 'Not answered'}

Please structure your response with exactly these four sections, each starting with its heading on a new line:

WELLNESS INSIGHT:
[A 2-3 sentence summary of the burnout risk level and overall findings]

POTENTIAL AREAS TO MONITOR:
[Key stress and energy patterns identified from responses, as bullet points]

RECOMMENDED ACTIONS:
[3-4 practical lifestyle and recovery recommendations to reduce burnout risk]

SUGGESTED WELLNESS SUPPORT:
[Relevant wellness programs, mental health resources, or professionals to consult]

Important: Always end with a reminder that this is educational information only and not a medical diagnosis.`,
};

const DIGITAL_FATIGUE_SCREENING: ScreeningDefinition = {
  id: 'digital-fatigue',
  title: 'Digital Fatigue Assessment',
  tagline: 'Screen health & digital wellness',
  description:
    'Assess how your daily screen exposure is affecting your eyes, sleep, and mental clarity.',
  icon: 'phone-portrait-outline',
  color: '#ADB5BD',
  gradientColors: ['#080F18', '#0D1A2B', '#080F18'],
  questions: [
    {
      key: 'screenTime',
      question: 'On average, how many hours per day do you spend looking at screens (phone, computer, TV)?',
      options: ['< 2 hrs', '2-4 hrs', '4-6 hrs', '6-8 hrs', '8+ hrs'] as const,
    },
    {
      key: 'eyeStrain',
      question: 'Do you regularly experience eye strain, dryness, or blurred vision after screen use?',
      options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'] as const,
    },
    {
      key: 'headaches',
      question: 'Do you experience headaches that seem related to screen use?',
      options: ['Never', 'Occasionally', 'Frequently', 'Daily'] as const,
    },
    {
      key: 'sleepDisruption',
      question: 'Do you use screens within 1 hour of going to bed, and does it affect your sleep?',
      options: ['No screen use before bed', 'Use screens but sleep fine', 'Use screens and sleep is disrupted'] as const,
    },
    {
      key: 'breaks',
      question: 'How often do you take breaks from screens during the day?',
      options: ['Every 30-60 min', 'Every 2-3 hours', 'Rarely', 'Almost Never'] as const,
    },
  ],
  promptTemplate: (answers) =>
    `You are a professional wellness advisor providing educational insights. Analyze the following Digital Fatigue screening responses and provide a structured wellness insight.

Screening responses:
- Average daily screen time: ${answers.screenTime ?? 'Not answered'}
- Eye strain/dryness/blurred vision frequency: ${answers.eyeStrain ?? 'Not answered'}
- Screen-related headache frequency: ${answers.headaches ?? 'Not answered'}
- Pre-bedtime screen use and sleep impact: ${answers.sleepDisruption ?? 'Not answered'}
- Frequency of screen breaks: ${answers.breaks ?? 'Not answered'}

Please structure your response with exactly these four sections, each starting with its heading on a new line:

WELLNESS INSIGHT:
[A 2-3 sentence summary of the digital fatigue level and overall screen health findings]

POTENTIAL AREAS TO MONITOR:
[Key digital wellness patterns and risks identified from responses, as bullet points]

RECOMMENDED ACTIONS:
[3-4 practical recommendations including screen hygiene tips, the 20-20-20 rule, and sleep hygiene]

SUGGESTED WELLNESS SUPPORT:
[Relevant resources, apps, or professionals that could help improve digital wellness]

Important: Always end with a reminder that this is educational information only and not a medical diagnosis.`,
};

/* ─────────────────── Registry Export ─────────────────── */

export const SCREENINGS: ScreeningDefinition[] = [
  PCOS_SCREENING,
  BURNOUT_SCREENING,
  DIGITAL_FATIGUE_SCREENING,
];

export function getScreeningById(id: string): ScreeningDefinition | undefined {
  return SCREENINGS.find((s) => s.id === id);
}
