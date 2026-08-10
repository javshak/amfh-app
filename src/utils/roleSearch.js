import { ROLES } from '../data/roles'

// Keyword → slug mapping for fuzzy matching
const KEYWORD_MAP = {
  // Public safety
  police: 'police', cop: 'police', officer: 'police', constable: 'police', detective: 'police', opp: 'police', rcmp: 'police',
  fire: 'fire', firefighter: 'fire', fireperson: 'fire', 'fire services': 'fire',
  ems: 'ems', paramedic: 'ems', ambulance: 'ems', medic: 'ems', 'first responder': 'ems',
  corrections: 'corrections', correctional: 'corrections', guard: 'corrections', 'correctional officer': 'corrections',
  dispatch: 'dispatch', dispatcher: 'dispatch', '911': 'dispatch', communications: 'dispatch', 'call centre': 'dispatch',
  'search and rescue': 'search-rescue', sar: 'search-rescue', rescue: 'search-rescue',
  military: 'military-veterans', veteran: 'military-veterans', army: 'military-veterans', navy: 'military-veterans', airforce: 'military-veterans', forces: 'military-veterans',
  // Health & social
  nurse: 'healthcare', nursing: 'healthcare', doctor: 'healthcare', physician: 'healthcare', surgeon: 'healthcare',
  healthcare: 'healthcare', hospital: 'healthcare', clinical: 'healthcare', therapist: 'mental-health-social',
  'social worker': 'mental-health-social', 'mental health': 'mental-health-social', counsellor: 'mental-health-social',
  counselor: 'mental-health-social', psychologist: 'mental-health-social', psychiatrist: 'mental-health-social',
  'child welfare': 'child-welfare', 'child protection': 'child-welfare', cas: 'child-welfare', cps: 'child-welfare',
  // Education & gov
  teacher: 'education', educator: 'education', principal: 'education', school: 'education', professor: 'education',
  'municipal government': 'municipal-government', municipal: 'municipal-government', city: 'municipal-government', town: 'municipal-government',
  government: 'provincial-federal', provincial: 'provincial-federal', federal: 'provincial-federal', ministry: 'provincial-federal', civil: 'provincial-federal',
  nonprofit: 'community-nonprofit', 'non-profit': 'community-nonprofit', community: 'community-nonprofit', charity: 'community-nonprofit', ngo: 'community-nonprofit',
  lawyer: 'justice-system', judge: 'justice-system', court: 'justice-system', legal: 'justice-system', justice: 'justice-system', crown: 'justice-system',
  // Customer service & entrepreneurship
  retail: 'retail', sales: 'retail', salesperson: 'retail', clerk: 'retail', cashier: 'retail', 'customer service': 'retail', shop: 'retail', store: 'retail',
  entrepreneur: 'entrepreneur', founder: 'entrepreneur', 'business owner': 'entrepreneur', startup: 'entrepreneur', businessman: 'entrepreneur', merchant: 'entrepreneur', trader: 'entrepreneur', marketer: 'entrepreneur', owner: 'entrepreneur', 'self employed': 'entrepreneur', freelance: 'entrepreneur',
  // Leadership
  manager: 'leadership', director: 'leadership', hr: 'leadership', 'human resources': 'leadership', supervisor: 'leadership',
  leadership: 'leadership', leader: 'leadership', executive: 'leadership', ohs: 'leadership', 'occupational health': 'leadership',
}

export function searchRoles(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase().trim()

  // Direct keyword match first
  for (const [keyword, slug] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(keyword) || keyword.includes(q)) {
      const role = ROLES.find(r => r.slug === slug)
      if (role) return [role]
    }
  }

  // Fallback: match against roleName
  return ROLES.filter(r =>
    r.roleName.toLowerCase().includes(q) ||
    q.includes(r.roleName.toLowerCase())
  )
}

export function getRolesByCategory(categoryId) {
  return ROLES.filter(r => r.category === categoryId)
}
