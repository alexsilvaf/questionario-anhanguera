// src/pages/ManagePermissions.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import Layout from '../components/Layout'

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import authenticationService from '../services/authenticationService'
import { UserPermissionModel } from '../models/UserPermissionModel'
import './css/ManagePermissions.css'
import { UserGroupCreateUpdateModel } from '../models/UserGroupCreateUpdateModel'

const ManagePermissions: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id);
  const navigate = useNavigate()

  const [treeData, setTreeData] = useState<UserPermissionModel[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      authenticationService.findAllPermissions(),
      authenticationService.findPermissionsByGroup(groupId),
    ])
      .then(([all, groupPerms]) => {
        const allowed = new Set(
          groupPerms.flatMap(p => p.userPermissionList.map(c => c.id))
        )
        setSelectedIds(allowed)
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
  }, [groupId])

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
    const hasChildren = node.userPermissionList.length > 0
    const childIds = node.userPermissionList.map(c => c.id)

    const allSelected = hasChildren
      ? childIds.every(i => selectedIds.has(i))
      : selectedIds.has(node.id)

    const someSelected =
      hasChildren &&
      childIds.some(i => selectedIds.has(i)) &&
      !allSelected

    const isParent = hasChildren

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
              fontSize={isParent ? '1.1rem' : '0.875rem'}
              fontWeight={isParent ? 'bold' : 'normal'}
            >
              {node.description}
            </Typography>
          </Box>
        }
      >
        {hasChildren &&
          node.userPermissionList.map(child => renderTree(child))
        }
      </TreeItem>
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload: UserGroupCreateUpdateModel = {
        groupId: groupId,                      
        permissionIdList: Array.from(selectedIds)
      };
      await authenticationService.updateGroupPermissions(payload)
      navigate('/grupos')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Falha ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Box className="manage-permissions-panel" p={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <div className="d-flex align-items-center">
            <NavLink to="/grupos">
              <ChevronRightIcon
                sx={{
                  transform: 'rotate(180deg)',
                  color: 'primary.main',
                  cursor: 'pointer',
                  mr: 2,
                  fontSize: '2rem',
                }}
              />
            </NavLink>
            <Typography variant="h6">Permissões do Grupo</Typography>
          </div>
        </Box>

        {loading && <Typography>Carregando permissões...</Typography>}
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <SimpleTreeView
            defaultExpandedItems={expandedItems}
            expandedItems={expandedItems}
            slots={{
              expandIcon: () => null,
              collapseIcon: () => null,
            }}
            sx={{
              maxHeight: '70vh',
              overflowY: 'auto',
              '::-webkit-scrollbar': { width: '8px' },
              '::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }
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
            disabled={loading || groupId == 1}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default ManagePermissions
