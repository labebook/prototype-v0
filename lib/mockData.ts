// Mock data for team collaboration prototype

import { User, Team, TeamInvitation, TeamPipeline, TeamPipelineFolder, ProjectFolder, Project, ActivityEntry, TeamDiscussion } from '@/types/team'

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
    projectId: 'pr2',
    teamId: 't1',
    ownerId: 'u1',
    sharedWith: ['u1', 'u2', 'u3'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-01',
    status: 'running',
  },
  {
    id: 'p1-rep-a',
    name: 'Western Blot Replicate A',
    description: {
      goal: 'Detect specific proteins in tissue samples',
      context: 'Replicate A - Planning phase',
    },
    isReady: false,
    lastModified: '2025-02-08',
    shared: true,
    shareCount: 2,
    attachments: 0,
    folderId: 'f1',
    projectId: 'pr2',
    teamId: 't1',
    ownerId: 'u1',
    sharedWith: ['u1', 'u2'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-08',
    status: 'planning',
  },
  {
    id: 'p1-rep-b',
    name: 'Western Blot Replicate B',
    description: {
      goal: 'Detect specific proteins in tissue samples',
      context: 'Replicate B - Completed run',
    },
    isReady: true,
    lastModified: '2025-02-05',
    shared: true,
    shareCount: 2,
    attachments: 1,
    folderId: 'f1',
    projectId: 'pr2',
    teamId: 't1',
    ownerId: 'u1',
    sharedWith: ['u1', 'u2'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-05',
    status: 'completed',
  },
  {
    id: 'p1-rep-c',
    name: 'Western Blot Replicate C',
    description: {
      goal: 'Detect specific proteins in tissue samples',
      context: 'Replicate C - Completed run',
    },
    isReady: true,
    lastModified: '2025-02-03',
    shared: true,
    shareCount: 2,
    attachments: 1,
    folderId: 'f1',
    projectId: 'pr2',
    teamId: 't1',
    ownerId: 'u1',
    sharedWith: ['u1', 'u2'],
    lastModifiedBy: 'u1',
    lastModifiedDate: '2025-02-03',
    status: 'completed',
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
    participants: ['u2', 'u3'],
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-02-01',
  },
  {
    id: 'pr2',
    name: 'Drug Response in Breast Cancer Cells',
    description: 'Assessing signaling and gene expression changes after targeted treatment',
    folderId: 'pf3',
    teamId: 't1',
    ownerId: 'u2',
    createdDate: '2025-01-25',
    participants: ['u1'],
    lastModifiedBy: 'u2',
    lastModifiedDate: '2025-01-30',
  },
]

export const mockActivities: ActivityEntry[] = [
  {
    id: 'act1',
    projectId: 'pr1',
    userId: 'u1',
    action: 'created_project',
    detail: 'EGFR Signaling Study',
    date: '2025-01-20',
  },
  {
    id: 'act2',
    projectId: 'pr1',
    pipelineId: 'p1',
    userId: 'u1',
    action: 'created_pipeline',
    detail: 'Western Blot Analysis',
    date: '2025-01-22',
  },
  {
    id: 'act3',
    projectId: 'pr1',
    userId: 'u1',
    action: 'added_participant',
    detail: 'John Smith',
    date: '2025-01-23',
  },
  {
    id: 'act4',
    projectId: 'pr1',
    userId: 'u1',
    action: 'added_participant',
    detail: 'Dr. Williams',
    date: '2025-01-23',
  },
  {
    id: 'act5',
    projectId: 'pr1',
    pipelineId: 'p1',
    userId: 'u2',
    action: 'edited_pipeline',
    detail: 'Western Blot Analysis',
    date: '2025-02-01',
  },
  {
    id: 'act6',
    projectId: 'pr1',
    pipelineId: 'p1',
    userId: 'u3',
    action: 'ran_pipeline',
    detail: 'Western Blot Analysis',
    date: '2025-02-03',
  },
  {
    id: 'act7',
    projectId: 'pr2',
    userId: 'u2',
    action: 'created_project',
    detail: 'Antibody Validation',
    date: '2025-01-25',
  },
  {
    id: 'act8',
    projectId: 'pr2',
    pipelineId: 'p2',
    userId: 'u2',
    action: 'created_pipeline',
    detail: 'Antibody Purification',
    date: '2025-01-26',
  },
  {
    id: 'act9',
    projectId: 'pr2',
    userId: 'u2',
    action: 'added_participant',
    detail: 'Jane Doe',
    date: '2025-01-27',
  },
  {
    id: 'act10',
    projectId: 'pr2',
    pipelineId: 'p2',
    userId: 'u1',
    action: 'edited_pipeline',
    detail: 'Antibody Purification',
    date: '2025-01-30',
  },
]

export const mockTeamDiscussions: TeamDiscussion[] = [
  {
    id: 'td1',
    teamId: 't1',
    title: 'Best approach for western blot normalization?',
    body: 'We\'ve been running the EGFR pipeline and getting inconsistent band intensities between runs. Has anyone found a reliable loading control for these conditions?',
    authorId: 'u2',
    category: 'Methods',
    replies: 3,
    upvotes: 4,
    upvotedBy: ['u1', 'u3'],
    createdAt: '2025-02-01',
  },
  {
    id: 'td2',
    teamId: 't1',
    title: 'New antibody validation protocol ready for review',
    body: 'I\'ve finished drafting the validation pipeline for our custom antibodies. Please review the steps and let me know if anything needs adjustment before we run it.',
    authorId: 'u1',
    category: 'Announcements',
    replies: 2,
    upvotes: 3,
    upvotedBy: ['u2', 'u3'],
    createdAt: '2025-02-03',
  },
  {
    id: 'td3',
    teamId: 't1',
    title: 'Storage conditions for antibody samples',
    body: 'Quick question — should we store the purified antibodies at -20°C or -80°C for long-term stability? Current protocol says -20°C but I\'ve seen conflicting literature.',
    authorId: 'u3',
    category: 'Help',
    replies: 5,
    upvotes: 2,
    upvotedBy: ['u1'],
    createdAt: '2025-02-05',
  },
  {
    id: 'td4',
    teamId: 't2',
    title: 'Cell culture contamination issue',
    body: 'We\'ve had two contamination events in the last month. Can we discuss our decontamination protocol and see if there are any gaps?',
    authorId: 'u3',
    category: 'Help',
    replies: 7,
    upvotes: 5,
    upvotedBy: ['u1', 'u4', 'u5'],
    createdAt: '2025-02-02',
  },
  {
    id: 'td5',
    teamId: 't2',
    title: 'New MTT assay reagents arrived',
    body: 'The new batch of MTT reagent is in the freezer. Please update the Cell Viability Assay pipeline to reflect the new lot numbers.',
    authorId: 'u4',
    category: 'Announcements',
    replies: 1,
    upvotes: 2,
    upvotedBy: ['u3'],
    createdAt: '2025-02-06',
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

// Helper function to get activities for a project
export function getProjectActivities(projectId: string): ActivityEntry[] {
  return mockActivities.filter(a => a.projectId === projectId)
}

// Helper function to get discussions for a team
export function getTeamDiscussions(teamId: string): TeamDiscussion[] {
  return mockTeamDiscussions.filter(d => d.teamId === teamId)
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
