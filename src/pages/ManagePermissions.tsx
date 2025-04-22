// src/pages/ManagePermissions.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import authenticationService from '../services/authenticationService'
import { UserPermissionModel } from '../models/UserPermissionModel'
import { UserGroupCreateUpdateModel } from '../models/UserGroupCreateUpdateModel'
import './css/ManageUsers.css';

export default function ManagePermissions() {
  const { id } = useParams<{ id: string }>()
  const isNew = isNaN(Number(id))
  const groupId = isNew ? undefined : Number(id)
  const navigate = useNavigate()

  const [treeData, setTreeData] = useState<UserPermissionModel[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [groupName, setGroupName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    const p1 = authenticationService.findAllPermissions()
    const p2 = isNew
      ? Promise.resolve([] as UserPermissionModel[])
      : authenticationService.findPermissionsByGroup(groupId!)
    Promise.all([p1, p2])
      .then(([all, groupPerms]) => {
        if (!isNew && groupPerms) {
          const allowed = new Set(
            groupPerms.flatMap(p => p.userPermissionList.map(c => c.id))
          )
          setSelectedIds(allowed)
        }
        setTreeData(all)
        const parentsWithChildren = all
          .filter(n => n.userPermissionList.length > 0)
          .map(n => String(n.id))
        setExpandedItems(parentsWithChildren)
      })
      .catch(err => {
        console.error(err)
        setError(err.message || 'Erro ao carregar permissões')
      })
      .finally(() => setLoading(false))
  }, [groupId, isNew])

  const toggleLeaf = (leafId: number, checked: boolean) => {
    const next = new Set(selectedIds)
    checked ? next.add(leafId) : next.delete(leafId)
    setSelectedIds(next)
  }
  const toggleCategory = (node: UserPermissionModel, checked: boolean) => {
    const next = new Set(selectedIds)
    node.userPermissionList.forEach(c => {
      checked ? next.add(c.id) : next.delete(c.id)
    })
    setSelectedIds(next)
  }

  const renderTree = (node: UserPermissionModel) => {
    const kids = node.userPermissionList
    const hasChildren = kids.length > 0
    const childIds = kids.map(c => c.id)
    const allSelected = hasChildren
      ? childIds.every(i => selectedIds.has(i))
      : selectedIds.has(node.id)
    const someSelected = hasChildren
      && childIds.some(i => selectedIds.has(i))
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
              onChange={(_, checked) => {
                hasChildren
                  ? toggleCategory(node, checked)
                  : toggleLeaf(node.id, checked)
              }}
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography
              variant="body2"
              fontSize={hasChildren ? '1.1rem' : '0.875rem'}
              fontWeight={hasChildren ? 'bold' : 'normal'}
            >
              {node.description}
            </Typography>
          </Box>
        }
      >
        {hasChildren && kids.map(child => renderTree(child))}
      </TreeItem>
    )
  }

  const handleSave = async () => {
    setLoading(true)
    const payload: UserGroupCreateUpdateModel = {
      groupId: groupId ?? 0,
      name: groupName,
      permissionIdList: Array.from(selectedIds)
    }
    try {
      if (isNew) {
        await authenticationService.createGroup(payload)
      } else {
        await authenticationService.updateGroupPermissions(payload)
      }
      navigate('/grupos')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Falha ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="manage-permissions-panel" p={3}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <div className="d-flex align-items-center">
          <NavLink to="/grupos">
            <ChevronLeftIcon fontSize="large" className='me-2' color="primary" />
          </NavLink>
          <Typography variant="h6">
            {isNew ? 'Criar Grupo' : 'Editar Permissões do Grupo'}
          </Typography>
        </div>
      </Box>

      {isNew && (
        <Box mb={2}>
          <TextField
            fullWidth
            label="Nome do Grupo"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </Box>
      )}

      {loading && <Typography>Carregando permissões...</Typography>}
      {error &&
        <Typography color="error" mb={2}>{error}</Typography>
      }

      {!loading && !error && (
        <SimpleTreeView
          defaultExpandedItems={expandedItems}
          expandedItems={expandedItems}
          slots={{
            expandIcon: () => null,
            collapseIcon: () => null,
          }}
          sx={{
            maxHeight: isNew ? '60vh' : '70vh',
            overflowY: 'auto',
            width: '100%',
            '::-webkit-scrollbar': { width: '8px' },
            '::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 1 }
          }}
        >
          {treeData.map(node => renderTree(node))}
        </SimpleTreeView>
      )}

      <Box textAlign="right" mt={2}>
        <Button
          variant="contained"
          color="primary"
          className="text-white"
          onClick={handleSave}
          disabled={loading || (isNew && !groupName.trim()) || groupId == 1}
        >
          {isNew ? 'Criar' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  )
}
