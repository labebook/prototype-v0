// Mock data for team collaboration prototype

import { User, Team, TeamInvitation, TeamPipeline, TeamPipelineFolder, ProjectFolder, Project } from '@/types/team'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Jane Doe', email: 'jane@example.com' },
  { id: 'u2', name: 'John Smith', email: 'john@example.com' },
  { id: 'u3', name: 'Dr. Williams', email: 'williams@example.com' },
  { id: 'u4', name: 'Sarah Chen', email: 'sarah@example.com' },
  { id: 'u5', name: 'Michael Brown', email: 'michael@example.com' },
]

export const currentUserId = 'u1' // Jane Doe for prototype

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'Team Alpha',
    description: 'Main research team for protein analysis',
    createdBy: 'u1',
    createdDate: '2025-01-15',
    members: [
      { userId: 'u1', role: 'PI', joinedDate: '2025-01-15' },
      { userId: 'u2', role: 'Collaborator', joinedDate: '2025-02-01' },
      { userId: 'u3', role: 'Collaborator', joinedDate: '2025-02-03' },
    ],
    invitations: [
      {
        id: 'i1',
        teamId: 't1',
        invitedEmail: 'new@example.com',
        invitedBy: 'u1',
        role: 'Collaborator',
        status: 'pending',
        createdDate: '2025-02-05',
        message: 'Join our protein analysis team!',
      },
    ],
  },
  {
    id: 't2',
    name: 'Lab Research',
    description: 'General laboratory research group',
    createdBy: 'u3',
    createdDate: '2024-11-20',
    members: [
      { userId: 'u3', role: 'PI', joinedDate: '2024-11-20' },
      { userId: 'u1', role: 'Collaborator', joinedDate: '2024-12-01' },
      { userId: 'u4', role: 'Collaborator', joinedDate: '2024-12-15' },
      { userId: 'u5', role: 'Collaborator', joinedDate: '2025-01-10' },
    ],
    invitations: [
      {
        id: 'i2',
        teamId: 't2',
        invitedEmail: 'collaborator@example.com',
        invitedBy: 'u3',
        role: 'Collaborator',
        status: 'pending',
        createdDate: '2025-02-06',
      },
    ],
  },
  {
    id: 't3',
    name: 'Cell Biology',
    description: 'Cell culture and microscopy studies',
    createdBy: 'u4',
    createdDate: '2025-01-05',
    members: [
      { userId: 'u4', role: 'PI', joinedDate: '2025-01-05' },
      { userId: 'u1', role: 'Collaborator', joinedDate: '2025-01-20' },
    ],
    invitations: [],
  },
]

export const mockPipelineFolders: TeamPipelineFolder[] = [
  {
    id: 'f1',
    name: 'Western Blot',
    createdDate: '2024-01-15',
    createdBy: 'u1',
    pipelineCount: 2,
    teamId: 't1',
    editPermissions: ['u1', 'u2'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-01',
  },
  {
    id: 'f2',
    name: 'Antibody Isolation',
    createdDate: '2024-02-20',
    createdBy: 'u2',
    pipelineCount: 1,
    teamId: 't1',
    editPermissions: ['u1', 'u2'],
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-01-25',
  },
  {
    id: 'f3',
    name: 'Cell Culture',
    createdDate: '2024-12-10',
    createdBy: 'u3',
    pipelineCount: 3,
    teamId: 't2',
    editPermissions: ['u3', 'u1', 'u4'],
    lastModifiedBy: 'u4',
    lastModifiedDate: '2025-02-05',
  },
]

export const mockPipelines: TeamPipeline[] = [
  {
    id: 'p1',
    name: 'Western Blot Analysis',
    description: {
      goal: 'Detect specific proteins in tissue samples',
      context: 'Standard protocol for protein detection',
    },
    isReady: true,
    lastModified: '2025-02-01',
    shared: true,
    shareCount: 3,
    attachments: 2,
    folderId: 'f1',
    teamId: 't1',
    ownerId: 'u1',
    sharedWith: ['u1', 'u2', 'u3'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-01',
  },
  {
    id: 'p2',
    name: 'Antibody Purification',
    description: {
      goal: 'Purify antibodies from serum',
      context: 'Protein A/G affinity chromatography',
    },
    isReady: true,
    lastModified: '2025-01-25',
    shared: true,
    shareCount: 2,
    attachments: 1,
    folderId: 'f2',
    teamId: 't1',
    ownerId: 'u2',
    sharedWith: ['u1', 'u2'],
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-01-25',
  },
  {
    id: 'p3',
    name: 'Cell Viability Assay',
    description: {
      goal: 'Measure cell viability using MTT assay',
      context: 'Cytotoxicity testing',
    },
    isReady: false,
    lastModified: '2025-02-05',
    shared: true,
    shareCount: 4,
    attachments: 0,
    folderId: 'f3',
    teamId: 't2',
    ownerId: 'u3',
    sharedWith: ['u1', 'u3', 'u4', 'u5'],
    lastModifiedBy: 'u4',
    lastModifiedDate: '2025-02-05',
  },
]

export const mockProjectFolders: ProjectFolder[] = [
  {
    id: 'pf1',
    name: 'Active Projects',
    teamId: 't1',
    createdBy: 'u1',
    createdDate: '2025-01-15',
    editPermissions: ['u1', 'u2'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-01',
  },
  {
    id: 'pf2',
    name: 'Archives',
    teamId: 't1',
    createdBy: 'u1',
    createdDate: '2025-01-15',
    editPermissions: ['u1'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-01-20',
  },
  {
    id: 'pf3',
    name: 'Protein Studies',
    parentId: 'pf1',
    teamId: 't1',
    createdBy: 'u1',
    createdDate: '2025-01-20',
    editPermissions: ['u1', 'u2', 'u3'],
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-02-01',
  },
]

export const mockProjects: Project[] = [
  {
    id: 'pr1',
    name: 'EGFR Signaling Study',
    description: 'Investigation of EGFR pathway activation',
    folderId: 'pf3',
    teamId: 't1',
    ownerId: 'u1',
    createdDate: '2025-01-20',
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-01',
  },
  {
    id: 'pr2',
    name: 'Antibody Validation',
    description: 'Testing specificity of custom antibodies',
    folderId: 'pf3',
    teamId: 't1',
    ownerId: 'u2',
    createdDate: '2025-01-25',
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-01-30',
  },
]

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId)
}

// Helper function to get team by ID
export function getTeamById(teamId: string): Team | undefined {
  return mockTeams.find(t => t.id === teamId)
}

// Helper function to get user's teams
export function getUserTeams(userId: string): Team[] {
  return mockTeams.filter(team =>
    team.members.some(member => member.userId === userId)
  )
}

// Helper function to get user's pending invitations
export function getUserPendingInvitations(userEmail: string): TeamInvitation[] {
  const invitations: TeamInvitation[] = []
  mockTeams.forEach(team => {
    team.invitations.forEach(inv => {
      if (inv.invitedEmail === userEmail && inv.status === 'pending') {
        invitations.push(inv)
      }
    })
  })
  return invitations
}
