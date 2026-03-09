"use client"

import React, { createContext, useState, useCallback, useMemo } from 'react'
import {
  User,
  Team,
  TeamMember,
  TeamInvitation,
  TeamPipeline,
  TeamPipelineFolder,
  ProjectFolder,
  Project,
  ResourceType,
  ActivityEntry,
  ActivityAction,
  TeamDiscussion,
} from '@/types/team'
import {
  mockUsers,
  mockTeams,
  mockPipelines,
  mockPipelineFolders,
  mockProjectFolders,
  mockProjects,
  mockActivities,
  mockTeamDiscussions,
  currentUserId,
  getUserById,
  getTeamById,
  getUserTeams,
  getUserPendingInvitations,
} from '@/lib/mockData'

interface TeamContextValue {
  // Auth
  currentUser: User

  // Teams
  teams: Team[]
  currentTeam: Team | null
  switchTeam: (teamId: string) => void
  createTeam: (name: string, description?: string) => void

  // Team management
  renameTeam: (teamId: string, name: string) => void
  deleteTeam: (teamId: string) => void

  // Members
  inviteMember: (teamId: string, email: string, role: 'PI' | 'Collaborator', message?: string) => void
  removeMember: (teamId: string, userId: string) => void

  // Invitations
  acceptInvitation: (invitationId: string) => void
  declineInvitation: (invitationId: string) => void
  cancelInvitation: (invitationId: string) => void
  resendInvitation: (invitationId: string) => void

  // Permissions
  canEdit: (resourceType: ResourceType, resourceId: string) => boolean
  canAdmin: (teamId?: string) => boolean

  // Helpers
  isPI: (teamId?: string) => boolean
  pendingInvitations: TeamInvitation[]

  // Data
  pipelines: TeamPipeline[]
  pipelineFolders: TeamPipelineFolder[]
  projectFolders: ProjectFolder[]
  projects: Project[]

  // Pipeline actions
  renamePipeline: (id: string, name: string) => void
  updatePipelineDescription: (id: string, description: { goal: string; context: string }) => void
  duplicatePipeline: (id: string) => TeamPipeline | null
  copyPipelineToProject: (id: string, projectId: string) => TeamPipeline | null

  // Filtering
  getMyPipelines: () => TeamPipeline[]
  getFavouritePipelines: () => TeamPipeline[]
  getSharedPipelines: () => TeamPipeline[]

  // Project actions
  createProject: (name: string, description?: string) => Project
  updateProject: (id: string, fields: { name?: string; description?: string }) => void
  addProjectFolder: (name: string, parentId?: string) => void

  // Project participants
  addProjectParticipant: (projectId: string, userId: string) => void
  removeProjectParticipant: (projectId: string, userId: string) => void
  getProjectParticipants: (projectId: string) => User[]

  // Activity feed
  activities: ActivityEntry[]
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'date'>) => void
  getProjectActivities: (projectId: string) => ActivityEntry[]

  // Team discussions
  discussions: TeamDiscussion[]
  getTeamDiscussions: () => TeamDiscussion[]
  createDiscussion: (discussion: Pick<TeamDiscussion, 'title' | 'body' | 'category'>) => void
  toggleDiscussionUpvote: (discussionId: string) => void
}

export const TeamContext = createContext<TeamContextValue | undefined>(undefined)

interface TeamProviderProps {
  children: React.ReactNode
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [currentUser] = useState<User>(() => getUserById(currentUserId)!)
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [currentTeamId, setCurrentTeamId] = useState<string>(() => {
    // Default to first team user belongs to
    const userTeams = getUserTeams(currentUserId)
    return userTeams.length > 0 ? userTeams[0].id : ''
  })

  const [pipelines, setPipelines] = useState<TeamPipeline[]>(mockPipelines)
  const [pipelineFolders] = useState<TeamPipelineFolder[]>(mockPipelineFolders)
  const [projectFolders, setProjectFolders] = useState<ProjectFolder[]>(mockProjectFolders)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [activities, setActivities] = useState<ActivityEntry[]>(mockActivities)
  const [discussions, setDiscussions] = useState<TeamDiscussion[]>(mockTeamDiscussions)

  const currentTeam = useMemo(
    () => teams.find(t => t.id === currentTeamId) || null,
    [teams, currentTeamId]
  )

  const switchTeam = useCallback((teamId: string) => {
    setCurrentTeamId(teamId)
  }, [])

  const renameTeam = useCallback((teamId: string, name: string) => {
    setTeams(prev =>
      prev.map(team => team.id === teamId ? { ...team, name } : team)
    )
  }, [])

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId))
    setCurrentTeamId(prev => {
      if (prev !== teamId) return prev
      const remaining = getUserTeams(currentUserId).filter(t => t.id !== teamId)
      return remaining.length > 0 ? remaining[0].id : ''
    })
  }, [])

  const createTeam = useCallback((name: string, description?: string) => {
    const newTeam: Team = {
      id: `t${Date.now()}`,
      name,
      description,
      createdBy: currentUserId,
      createdDate: new Date().toISOString().split('T')[0],
      members: [
        {
          userId: currentUserId,
          role: 'PI',
          joinedDate: new Date().toISOString().split('T')[0],
        },
      ],
      invitations: [],
    }
    setTeams(prev => [...prev, newTeam])
    setCurrentTeamId(newTeam.id)
  }, [])

  const inviteMember = useCallback(
    (teamId: string, email: string, role: 'PI' | 'Collaborator', message?: string) => {
      const invitation: TeamInvitation = {
        id: `i${Date.now()}`,
        teamId,
        invitedEmail: email,
        invitedBy: currentUserId,
        role,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0],
        message,
      }

      setTeams(prev =>
        prev.map(team =>
          team.id === teamId
            ? { ...team, invitations: [...team.invitations, invitation] }
            : team
        )
      )
    },
    []
  )

  const removeMember = useCallback((teamId: string, userId: string) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? { ...team, members: team.members.filter(m => m.userId !== userId) }
          : team
      )
    )
  }, [])

  const acceptInvitation = useCallback((invitationId: string) => {
    setTeams(prev =>
      prev.map(team => {
        const invitation = team.invitations.find(inv => inv.id === invitationId)
        if (!invitation) return team

        // Add member
        const newMember: TeamMember = {
          userId: currentUserId,
          role: invitation.role,
          joinedDate: new Date().toISOString().split('T')[0],
        }

        return {
          ...team,
          members: [...team.members, newMember],
          invitations: team.invitations.map(inv =>
            inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
          ),
        }
      })
    )
  }, [])

  const declineInvitation = useCallback((invitationId: string) => {
    setTeams(prev =>
      prev.map(team => ({
        ...team,
        invitations: team.invitations.map(inv =>
          inv.id === invitationId ? { ...inv, status: 'declined' as const } : inv
        ),
      }))
    )
  }, [])

  const cancelInvitation = useCallback((invitationId: string) => {
    setTeams(prev =>
      prev.map(team => ({
        ...team,
        invitations: team.invitations.filter(inv => inv.id !== invitationId),
      }))
    )
  }, [])

  const resendInvitation = useCallback((invitationId: string) => {
    // In real implementation, this would trigger an email resend
    console.log('Resending invitation:', invitationId)
  }, [])

  const isPI = useCallback(
    (teamId?: string) => {
      const team = teamId ? getTeamById(teamId) : currentTeam
      if (!team) return false
      const member = team.members.find(m => m.userId === currentUserId)
      return member?.role === 'PI'
    },
    [currentTeam]
  )

  const canAdmin = useCallback(
    (teamId?: string) => {
      return isPI(teamId)
    },
    [isPI]
  )

  const canEdit = useCallback(
    (resourceType: ResourceType, resourceId: string) => {
      if (!currentTeam) return false

      // PIs can edit everything in their team
      if (isPI(currentTeam.id)) return true

      // Check specific resource permissions
      if (resourceType === 'folder') {
        const folder = pipelineFolders.find(f => f.id === resourceId)
        return (folder?.editPermissions.includes(currentUserId) ?? false)
      }

      if (resourceType === 'projectFolder') {
        const folder = projectFolders.find(f => f.id === resourceId)
        return (folder?.editPermissions.includes(currentUserId) ?? false)
      }

      if (resourceType === 'pipeline') {
        const pipeline = pipelines.find(p => p.id === resourceId)
        return pipeline?.ownerId === currentUserId ||
               (pipeline?.sharedWith?.includes(currentUserId) ?? false)
      }

      if (resourceType === 'project') {
        const project = projects.find(p => p.id === resourceId)
        return project?.ownerId === currentUserId ||
               (project?.participants?.includes(currentUserId) ?? false)
      }

      return false
    },
    [currentTeam, isPI, pipelineFolders, projectFolders, pipelines, projects]
  )

  // ── Activity feed ────────────────────────────────────────────────────────
  const addActivity = useCallback((entry: Omit<ActivityEntry, 'id' | 'date'>) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: `act${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    }
    setActivities(prev => [newEntry, ...prev])
  }, [])

  const getProjectActivities = useCallback((projectId: string): ActivityEntry[] => {
    return activities.filter(a => a.projectId === projectId)
  }, [activities])

  // ── Project actions ──────────────────────────────────────────────────────
  const createProject = useCallback((name: string, description?: string): Project => {
    const project: Project = {
      id: `pr${Date.now()}`,
      name,
      description: description ?? '',
      folderId: '',
      teamId: currentTeamId ?? '',
      ownerId: currentUserId,
      createdDate: new Date().toISOString().split('T')[0],
      participants: [],
    }
    setProjects(prev => [...prev, project])
    return project
  }, [currentTeamId])

  const updateProject = useCallback((id: string, fields: { name?: string; description?: string }) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...fields, lastModifiedBy: currentUserId, lastModifiedDate: new Date().toISOString().split('T')[0] }
          : p
      )
    )
  }, [])

  const addProjectFolder = useCallback((name: string, parentId?: string) => {
    if (!currentTeamId) return
    const folder: ProjectFolder = {
      id: `pf${Date.now()}`,
      name,
      parentId,
      teamId: currentTeamId,
      createdBy: currentUserId,
      createdDate: new Date().toISOString().split('T')[0],
      editPermissions: [currentUserId],
    }
    setProjectFolders(prev => [...prev, folder])
  }, [currentTeamId])

  // ── Project participants ─────────────────────────────────────────────────
  const addProjectParticipant = useCallback((projectId: string, userId: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId && !p.participants.includes(userId)
          ? { ...p, participants: [...p.participants, userId], lastModifiedBy: currentUserId, lastModifiedDate: new Date().toISOString().split('T')[0] }
          : p
      )
    )
    const user = getUserById(userId)
    if (user) {
      addActivity({ projectId, userId: currentUserId, action: 'added_participant', detail: user.name })
    }
  }, [addActivity])

  const removeProjectParticipant = useCallback((projectId: string, userId: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, participants: p.participants.filter(id => id !== userId) }
          : p
      )
    )
    const user = getUserById(userId)
    if (user) {
      addActivity({ projectId, userId: currentUserId, action: 'removed_participant', detail: user.name })
    }
  }, [addActivity])

  const getProjectParticipants = useCallback((projectId: string): User[] => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return []
    const allIds = [project.ownerId, ...project.participants]
    return allIds.map(id => getUserById(id)).filter(Boolean) as User[]
  }, [projects])

  // ── Team discussions ─────────────────────────────────────────────────────
  const getTeamDiscussions = useCallback((): TeamDiscussion[] => {
    if (!currentTeam) return []
    return discussions.filter(d => d.teamId === currentTeam.id)
  }, [discussions, currentTeam])

  const createDiscussion = useCallback((discussion: Pick<TeamDiscussion, 'title' | 'body' | 'category'>) => {
    if (!currentTeam) return
    const newDiscussion: TeamDiscussion = {
      ...discussion,
      id: `td${Date.now()}`,
      teamId: currentTeam.id,
      authorId: currentUserId,
      replies: 0,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setDiscussions(prev => [newDiscussion, ...prev])
  }, [currentTeam])

  const toggleDiscussionUpvote = useCallback((discussionId: string) => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id !== discussionId) return d
        const hasUpvoted = d.upvotedBy.includes(currentUserId)
        return {
          ...d,
          upvotes: hasUpvoted ? d.upvotes - 1 : d.upvotes + 1,
          upvotedBy: hasUpvoted
            ? d.upvotedBy.filter(id => id !== currentUserId)
            : [...d.upvotedBy, currentUserId],
        }
      })
    )
  }, [])

  const pendingInvitations = useMemo(
    () => getUserPendingInvitations(currentUser.email),
    [currentUser.email, teams] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // ── Pipeline actions ─────────────────────────────────────────────────────
  const renamePipeline = useCallback((id: string, name: string) => {
    setPipelines(prev =>
      prev.map(p => p.id === id ? { ...p, name, lastModified: new Date().toISOString().split('T')[0] } : p)
    )
  }, [])

  const updatePipelineDescription = useCallback((id: string, description: { goal: string; context: string }) => {
    setPipelines(prev =>
      prev.map(p => p.id === id ? { ...p, description, lastModified: new Date().toISOString().split('T')[0] } : p)
    )
  }, [])

  const duplicatePipeline = useCallback((id: string): TeamPipeline | null => {
    const source = pipelines.find(p => p.id === id)
    if (!source) return null
    const copy: TeamPipeline = {
      ...source,
      id: `p${Date.now()}`,
      name: `${source.name} (Copy)`,
      lastModified: new Date().toISOString().split('T')[0],
      ownerId: currentUserId,
    }
    setPipelines(prev => [...prev, copy])
    return copy
  }, [pipelines])

  const copyPipelineToProject = useCallback((id: string, projectId: string): TeamPipeline | null => {
    const source = pipelines.find(p => p.id === id)
    if (!source) return null
    const copy: TeamPipeline = {
      ...source,
      id: `p${Date.now()}`,
      name: source.name,
      projectId,
      lastModified: new Date().toISOString().split('T')[0],
      ownerId: currentUserId,
    }
    setPipelines(prev => [...prev, copy])
    return copy
  }, [pipelines])

  // Filter pipelines by category
  const getMyPipelines = useCallback(() => {
    if (!currentTeam) return []
    return pipelines.filter(
      p => p.teamId === currentTeam.id && p.ownerId === currentUserId
    )
  }, [currentTeam, pipelines])

  const getFavouritePipelines = useCallback(() => {
    // For prototype, return empty array (would be implemented with favorites feature)
    return []
  }, [])

  const getSharedPipelines = useCallback(() => {
    if (!currentTeam) return []
    return pipelines.filter(
      p =>
        p.teamId === currentTeam.id &&
        p.ownerId !== currentUserId &&
        p.sharedWith?.includes(currentUserId)
    )
  }, [currentTeam, pipelines])

  const value: TeamContextValue = {
    currentUser,
    teams,
    currentTeam,
    switchTeam,
    createTeam,
    renameTeam,
    deleteTeam,
    inviteMember,
    removeMember,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
    resendInvitation,
    canEdit,
    canAdmin,
    isPI,
    pendingInvitations,
    pipelines,
    pipelineFolders,
    projectFolders,
    projects,
    renamePipeline,
    updatePipelineDescription,
    duplicatePipeline,
    copyPipelineToProject,
    getMyPipelines,
    getFavouritePipelines,
    getSharedPipelines,
    createProject,
    updateProject,
    addProjectFolder,
    addProjectParticipant,
    removeProjectParticipant,
    getProjectParticipants,
    activities,
    addActivity,
    getProjectActivities,
    discussions,
    getTeamDiscussions,
    createDiscussion,
    toggleDiscussionUpvote,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}
