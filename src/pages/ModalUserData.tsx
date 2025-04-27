// src/pages/ModalUserData.tsx
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
} from '@mui/material'
import { UserDataModel } from '../models/UserDataModel'
import { UserGroupModel } from '../models/UserGroupModel'

export interface ModalUserDataProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  userData?: UserDataModel
  allGroups: UserGroupModel[]
}

export default function ModalUserData({
  open,
  onClose,
  onSave,
  userData,
  allGroups
}: ModalUserDataProps) {

  const [firstName, setFirstName] = useState(userData?.firstName || '')
  const [lastName, setLastName] = useState(userData?.lastName || '')
  const [email, setEmail] = useState(userData?.email || '')
  const [groupId, setGroupId] = useState<number | ''>(userData?.userGroup?.id || '')

  useEffect(() => {
    if (open) {
      setFirstName(userData?.firstName || '')
      setLastName(userData?.lastName || '')
      setEmail(userData?.email || '')
      setGroupId(userData?.userGroup?.id || '')
    }
  }, [open, userData])

  const handleSave = () => {
    const selectedGroup = allGroups.find(g => g.id === groupId)
    const result: UserDataModel = {
        ...userData,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        userGroup: selectedGroup!,
      }
    onSave(result)
  }

  const canSave =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    groupId !== ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Editar Usuário
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          <TextField
            label="Nome"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Sobrenome"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
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
