// Maps quiz "support" activity names to either an in-app route or an awareness article slug

export const ACTIVITY_MAP = {
  'Breathing exercises':        { type: 'route', target: '/reset' },
  'Grounding exercises':        { type: 'route', target: '/reset' },
  'Emotional check-ins':        { type: 'route', target: '/reflect' },
  'Journaling prompts':         { type: 'route', target: '/reflect' },

  'Nervous system regulation':  { type: 'article', target: 'nervous-system-regulation' },
  'Sensory regulation':         { type: 'article', target: 'sensory-regulation' },
  'Self-compassion prompts':    { type: 'article', target: 'self-compassion' },
  'Burnout education':          { type: 'article', target: 'burnout-education' },
  'Reset planning':             { type: 'article', target: 'reset-planning' },
  'Recovery / rest reminders':  { type: 'article', target: 'recovery-rest' },
}
