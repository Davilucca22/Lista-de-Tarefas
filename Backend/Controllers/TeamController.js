import { Userr, Team, TeamInvite, List } from '../model/models.js'
import { createAuthToken, findUserByEmail, normalizeEmail } from '../services/auth.js'

async function requireManagerTeam(user) {
  if (user.ROLE !== 'manager' || !user.TEAM) return null
  return Team.findOne({ _id: user.TEAM, MANAGER: user.id })
}

export async function GetTeam(req, res) {
  if (!req.user.TEAM) return res.json({ team: null, members: [] })
  const team = await Team.findById(req.user.TEAM)
  if (!team) return res.status(404).json({ msg: 'Equipe não encontrada.' })

  const members = await Userr.find({ TEAM: team._id }).select('NAME EMAIL ROLE')
  return res.json({ team, members })
}

export async function CreateTeam(req, res) {
  if (req.user.ROLE !== 'manager') return res.status(403).json({ msg: 'Apenas gestores podem criar equipes.' })
  if (req.user.TEAM) return res.status(409).json({ msg: 'Sua conta já pertence a uma equipe.' })
  const name = req.body?.form?.name?.trim()
  if (!name) return res.status(400).json({ msg: 'Informe o nome da equipe.' })

  const manager = await Userr.findById(req.user.id)
  if (!manager) return res.status(404).json({ msg: 'Conta não encontrada.' })
  const team = await Team.create({ NAME: name, MANAGER: manager._id })
  manager.TEAM = team._id
  await manager.save()

  return res.status(201).json({ msg: 'Equipe criada.', team, token: createAuthToken(manager) })
}

export async function TeamInvites(req, res) {
  if (req.method === 'GET') {
    const invites = await TeamInvite.find({ USER: req.user.id, STATUS: 'pending' })
      .populate('TEAM', 'NAME')
      .populate('INVITED_BY', 'NAME EMAIL')
      .sort({ createdAt: -1 })
    return res.json({ invites })
  }

  if (req.method !== 'POST') return res.status(405).json({ msg: 'Método não permitido.' })
  const team = await requireManagerTeam(req.user)
  if (!team) return res.status(403).json({ msg: 'Apenas o gestor da equipe pode convidar membros.' })

  const email = normalizeEmail(req.body?.form?.email)
  if (!email) return res.status(400).json({ msg: 'Informe o e-mail da conta existente.' })
  const member = await findUserByEmail(email)
  if (!member) return res.status(404).json({ msg: 'Não existe uma conta cadastrada com esse e-mail.' })
  if (member._id.toString() === req.user.id) return res.status(400).json({ msg: 'Você já é o gestor desta equipe.' })
  if (member.TEAM) return res.status(409).json({ msg: 'Essa conta já pertence a uma equipe.' })

  const pending = await TeamInvite.findOne({ TEAM: team._id, USER: member._id, STATUS: 'pending' })
  if (pending) return res.status(409).json({ msg: 'Já existe um convite pendente para essa conta.' })
  const invite = await TeamInvite.create({
    TEAM: team._id,
    USER: member._id,
    INVITED_BY: req.user.id,
  })
  return res.status(201).json({ msg: 'Convite enviado para a caixa de entrada do usuário no TaskFlow.', invite })
}

export async function RespondToInvite(req, res) {
  const { inviteId, accept } = req.body?.form ?? {}
  if (!inviteId || typeof accept !== 'boolean') {
    return res.status(400).json({ msg: 'Informe o convite e se deseja aceitá-lo.' })
  }

  const invite = await TeamInvite.findOne({
    _id: inviteId,
    USER: req.user.id,
    STATUS: 'pending',
  })
  if (!invite) return res.status(404).json({ msg: 'Convite pendente não encontrado.' })

  if (accept) {
    const member = await Userr.findById(req.user.id)
    if (!member) return res.status(404).json({ msg: 'Conta não encontrada.' })
    if (member.TEAM) return res.status(409).json({ msg: 'Sua conta já pertence a uma equipe.' })
    member.TEAM = invite.TEAM
    await member.save()
    invite.STATUS = 'accepted'
    await invite.save()
    return res.json({
      msg: 'Convite aceito.',
      token: createAuthToken(member),
    })
  }

  invite.STATUS = 'declined'
  await invite.save()
  return res.json({ msg: 'Convite recusado.' })
}

export async function TeamDashboard(req, res) {
  const team = await requireManagerTeam(req.user)
  if (!team) return res.status(403).json({ msg: 'Apenas o gestor da equipe pode visualizar os indicadores.' })
  const members = await Userr.find({ TEAM: team._id, ROLE: 'member' }).select('NAME EMAIL')
  const currentDate = new Date().toISOString().slice(0, 10)

  const dashboard = await Promise.all(members.map(async (member) => {
    const tasks = await List.find({ TEAM: team._id, ASSIGNED_TO: member._id })
      .select('STATUS DATA_VENCIMENTO DUE_DATE')
      .lean()
    const dueDate = (task) => task.DATA_VENCIMENTO
      ? new Date(task.DATA_VENCIMENTO).toISOString().slice(0, 10)
      : task.DUE_DATE
    return {
      id: member._id,
      name: member.NAME,
      email: member.EMAIL,
      completed: tasks.filter((task) => task.STATUS === 'Concluida' || task.STATUS === 'Concluída').length,
      pending: tasks.filter((task) => task.STATUS !== 'Concluida' && task.STATUS !== 'Concluída').length,
      overdue: tasks.filter((task) => task.STATUS !== 'Concluida' && task.STATUS !== 'Concluída' && dueDate(task) && dueDate(task) < currentDate).length,
    }
  }))

  return res.json({ dashboard })
}
