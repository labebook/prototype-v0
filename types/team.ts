// Team collaboration types

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface TeamMember {
  userId: string
  role: 'PI' | 'Collaborator'
  joinedDate: string
}

export interface TeamInvitation {
  id: string
  teamId: string
  invitedEmail: string
  invitedBy: string
  role: 'PI' | 'Collaborator'
  status: 'pending' | 'accepted' | 'declined'
  createdDate: string
  message?: string
}

export interface Team {
  id: string
  name: string
  description?: string
  createdBy: string  // PI user ID
  createdDate: string
  members: TeamMember[]
  invitations: TeamInvitation[]
}

// Extended Pipeline type with team fields
export interface TeamPipeline {
  id: string
  name: string
  description: { goal: string; context: string }
  isReady: boolean
  lastModified: string
  shared: boolean
  shareCount: number
  attachments: number
  folderId: string | null
  projectId?: string
  // Team-specific fields
  teamId: string
  ownerId: string
  sharedWith?: string[]
  lastModifiedBy?: string
  lastModifiedDate?: string
  // Pipeline status: running (green), planning (blue), completed (greyed out)
  status?: 'running' | 'planning' | 'completed'
}

// Extended PipelineFolder type with team fields
export interface TeamPipelineFolder {
  id: string
  name: string
  createdDate: string
  createdBy: string
  pipelineCount: number
  // Team-specific fields
  teamId: string
  editPermissions: string[]
  viewPermissions?: string[]
  lastModifiedBy?: string
  lastModifiedDate?: string
}

export interface ProjectFolder {
  id: string
  name: string
  parentId?: string
  teamId: string
  createdBy: string
  createdDate: string
  editPermissions: string[]
  lastModifiedBy?: string
  lastModifiedDate?: string
}

export interface Project {
  id: string
  name: string
  description: string
  folderId: string
  teamId: string
  ownerId: string
  createdDate: string
  participants: string[]   // user IDs with edit access (beyond owner)
  lastModifiedBy?: string
  lastModifiedDate?: string
}

export type ActivityAction =
  | 'created_project'
  | 'created_pipeline'
  | 'edited_pipeline'
  | 'ran_pipeline'
  | 'completed_pipeline'
  | 'added_participant'
  | 'removed_participant'
  | 'uploaded_file'

export interface ActivityEntry {
  id: string
  projectId?: string
  pipelineId?: string
  userId: string
  action: ActivityAction
  detail?: string
  date: string
}

export interface TeamDiscussion {
  id: string
  teamId: string
  title: string
  body: string
  authorId: string
  category: string
  replies: number
  upvotes: number
  upvotedBy: string[]
  createdAt: string
}

export type ResourceType = 'pipeline' | 'folder' | 'project' | 'projectFolder'

export interface Permission {
  resourceType: ResourceType
  resourceId: string
  userId: string
  level: 'view' | 'edit' | 'admin'
}
