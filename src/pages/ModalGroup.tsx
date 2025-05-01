
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Checkbox,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { UserGroupCreateUpdateModel } from '../models/UserGroupCreateUpdateModel'
import { UserGroupModel } from '../models/UserGroupModel'
import { UserPermissionModel } from '../models/UserPermissionModel'
import authenticationService from '../services/authenticationService'

export interface ModalGroupProps {
  open: boolean
  onClose: () => void
  onSave: (data: UserGroupCreateUpdateModel) => void
  group?: UserGroupModel
  allPermissions: UserPermissionModel[]
  allGroups: UserGroupModel[]
}

export default function ModalGroup({
  open,
  onClose,
  onSave,
  group,
  allPermissions,
  allGroups
}: ModalGroupProps) {
  const isEdit = Boolean(group?.id)
  const [name, setName] = useState(group?.name || '')
  const [selPerms, setSelPerms] = useState<Set<number>>(new Set())
  const [selGroups, setSelGroups] = useState<Set<number>>(new Set())


  const [permExpanded, setPermExpanded] = useState<string[]>([])

  const treeSx = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': { width: '6px' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)' },
    '& .MuiTreeItem-iconContainer': {
      display: 'none',
    },
    '& .MuiTreeItem-content': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      pl: 0,
    },
    '& .MuiTreeItem-group': {
      ml: 0,
      listStyle: 'none'
    }
  }

  useEffect(() => {
    async function fetchGroupDetails() {
      if (group?.id) {
        try {
          const freshGroup = await authenticationService.findGroupById(group.id)
          setName(freshGroup.name)
          setSelPerms(new Set(freshGroup.permissionList?.map(p => p.id)))
          setSelGroups(new Set(freshGroup.managedGroupList.map(g => g.id)))
        } catch (error) {
          console.error('Erro ao buscar dados do grupo:', error)
        }
      } else {
        setName('')
        setSelPerms(new Set())
        setSelGroups(new Set())
      }
    }
  
    if (open) {
      fetchGroupDetails()
    }
  
    setPermExpanded(
      allPermissions
        .filter(n => n.userPermissionList.length > 0)
        .map(n => String(n.id))
    )
  }, [group, open, allPermissions, allGroups])

  const togglePerm = (leafId: number, checked: boolean) => {
    const next = new Set(selPerms)
    checked ? next.add(leafId) : next.delete(leafId)
    setSelPerms(next)
  }

  const toggleCategory = (node: UserPermissionModel, checked: boolean) => {
    const next = new Set(selPerms)
    node.userPermissionList.forEach(c =>
      checked ? next.add(c.id) : next.delete(c.id)
    )
    setSelPerms(next)
  }

  const toggleGroup = (id: number, checked: boolean) => {
    const next = new Set(selGroups)
    checked ? next.add(id) : next.delete(id)
    setSelGroups(next)
  }

  const handleSave = () => {
    onSave({
      groupId: group?.id,
      name: name.trim(),
      permissionIdList: Array.from(selPerms),
      managedGroupIdList: Array.from(selGroups)
    })
  }

  const renderPermTree = (node: UserPermissionModel) => {
    const kids = node.userPermissionList
    const hasChildren = kids.length > 0
    const childIds = kids.map(c => c.id)
    const allSelected = hasChildren
      ? childIds.every(i => selPerms.has(i))
      : selPerms.has(node.id)
    const someSelected = hasChildren
      && childIds.some(i => selPerms.has(i))
      && !allSelected

    return (
      <TreeItem
        key={node.id}
        itemId={String(node.id)}
        label={
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(_, checked) =>
                hasChildren
                  ? toggleCategory(node, checked)
                  : togglePerm(node.id, checked)
              }
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography
              variant="body2"
              fontSize={hasChildren ? '1rem' : '0.875rem'}
              fontWeight={hasChildren ? 'bold' : 'normal'}
            >
              {node.description}
            </Typography>
          </Box>
        }
      >
        {hasChildren && kids.map(child => renderPermTree(child))}
      </TreeItem>
    )
  }

  const delegableGroups = allGroups.filter(g => g.id !== group?.id)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
    slotProps={{
      paper: {
        sx: (theme) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#000' : 'white',
        }),
      }
    }}>
      <DialogTitle>
        {isEdit ? 'Editar' : 'Criar'} Grupo
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
        <Box display="flex" gap={2}
        justifyContent="flex-start"
        alignItems="flex-start"
        >
          <Box
            flex={2}
            sx={{ maxHeight: 200,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 3,
              },
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Permissões
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <SimpleTreeView
              expandedItems={permExpanded}
              slots={{
                expandIcon: () => null,
                collapseIcon: () => null,
              }}
              sx={treeSx}
            >
              {allPermissions.map(node => renderPermTree(node))}
            </SimpleTreeView>
          </Box>

          <Box flex={1} sx={{ maxHeight: 200, ...treeSx }}>
            <Typography variant="subtitle2" gutterBottom>
              Grupos Delegáveis
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {delegableGroups.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  '::-webkit-scrollbar': { width: '6px' },
                  '::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)' }
                }}
              >
                <Table
                  stickyHeader
                  size="small"
                  aria-label="Grupos Delegáveis"
                >
                  <TableBody>
                    {delegableGroups.map(node => (
                      <TableRow key={node.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={selGroups.has(node.id)}
                            onChange={(_, checked) => toggleGroup(node.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          {node.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum grupo disponível
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!name.trim()}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
