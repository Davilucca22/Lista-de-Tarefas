import { useCallback, useEffect, useState } from 'react'
import {
  createTeam as createTeamRequest,
  fetchInvites,
  fetchTeam,
  fetchTeamDashboard,
  inviteMember as inviteMemberRequest,
  respondToInvite as respondToInviteRequest,
} from '../services/teamService.js'

export function useTeam(token, isManager, onTokenChange) {
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [dashboard, setDashboard] = useState([])
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    const [teamData, inviteData] = await Promise.all([fetchTeam(token), fetchInvites(token)])
    setTeam(teamData.team)
    setMembers(teamData.members ?? [])
    setInvites(inviteData.invites ?? [])
    if (isManager && teamData.team) {
      const dashboardData = await fetchTeamDashboard(token)
      setDashboard(dashboardData.dashboard ?? [])
    } else {
      setDashboard([])
    }
    setError('')
  }, [token, isManager])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh().catch((loadError) => setError(loadError.message || 'Não foi possível carregar a equipe.'))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  async function createTeam(name) {
    const data = await createTeamRequest(token, name)
    if (data.token) onTokenChange(data.token)
    await refresh()
    return data
  }

  async function inviteMember(email) {
    const data = await inviteMemberRequest(token, email)
    await refresh()
    return data
  }

  async function respondToInvite(inviteId, accept) {
    const data = await respondToInviteRequest(token, inviteId, accept)
    if (data.token) onTokenChange(data.token)
    await refresh()
    return data
  }

  return { team, members, invites, dashboard, error, createTeam, inviteMember, respondToInvite }
}
