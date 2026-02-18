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
} from '@/types/team'
import {
  mockUsers,
  mockTeams,
  mockPipelines,
  mockPipelineFolders,
  mockProjectFolders,
  mockProjects,
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

  // Filtering
  getMyPipelines: () => TeamPipeline[]
  getFavouritePipelines: () => TeamPipeline[]
  getSharedPipelines: () => TeamPipeline[]
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
  const [projectFolders] = useState<ProjectFolder[]>(mockProjectFolders)
  const [projects] = useState<Project[]>(mockProjects)

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
        return (project?.ownerId === currentUserId ?? false)
      }

      return false
    },
    [currentTeam, isPI, pipelineFolders, projectFolders, pipelines, projects]
  )

  const pendingInvitations = useMemo(
    () => getUserPendingInvitations(currentUser.email),
    [currentUser.email, teams] // eslint-disable-line react-hooks/exhaustive-deps
  )

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
    getMyPipelines,
    getFavouritePipelines,
    getSharedPipelines,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}
