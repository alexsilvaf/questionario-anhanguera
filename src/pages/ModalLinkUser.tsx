// src/pages/ModalLinkUser.tsx
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material'
import { UserGroupModel } from '../models/UserGroupModel'
import { UserAuthenticationModel } from '../models/UserAuthenticationModel'

export interface ModalLinkUserProps {
  open: boolean
  onClose: () => void
  onSave: (data: UserAuthenticationModel) => void
  allGroups: UserGroupModel[]
  classList: string[]
  initialClass: string
}

export default function ModalLinkUser({
  open,
  onClose,
  onSave,
  allGroups,
  classList,
  initialClass
}: ModalLinkUserProps) {
  const [email, setEmail] = useState('')
  const [groupId, setGroupId] = useState<number | ''>('')
  const [className, setClassName] = useState(initialClass)

  // sempre que abrir o modal, zera email / grupo e reseta turma para a inicial
  useEffect(() => {
    if (open) {
      setEmail('')
      setGroupId('')
      setClassName(initialClass)
    }
  }, [open, initialClass])

  const handleSave = () => {
    const selectedGroup = allGroups.find(g => g.id === groupId)!
    onSave({
      email: email.trim(),
      userGroup: selectedGroup,
      courseClassName: className
    })
  }

  const canSave =
    email.trim() !== '' &&
    groupId !== '' &&
    className.trim() !== ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Criar Link de Convite</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {/* E-mail */}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            size="small"
          />

          {/* Grupo */}
          <FormControl fullWidth size="small">
            <InputLabel>Grupo</InputLabel>
            <Select
              value={groupId}
              label="Grupo"
              onChange={e => setGroupId(e.target.value as number)}
            >
              {allGroups.map(g => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Turma: dropdown só se tiver >1 opção */}
          {classList.length > 1 ? (
            <FormControl fullWidth size="small">
              <InputLabel>Turma</InputLabel>
              <Select
                value={className}
                label="Turma"
                onChange={e => setClassName(e.target.value as string)}
              >
                {classList.map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Turma
              </Typography>
              <TextField
                value={className}
                fullWidth
                size="small"
                disabled
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
