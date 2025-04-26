// src/pages/ManageGroups.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { UserGroupModel } from '../models/UserGroupModel'
import authenticationService from '../services/authenticationService'
import { UserGroupCreateUpdateModel } from '../models/UserGroupCreateUpdateModel'
import ModalGroup from './ModalGroup'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import './css/ManageUsers.css';
import { useAuth } from '../context/AuthContext'

export default function ManageGroups() {
    const { loggedUser } = useAuth()
    const [groups, setGroups] = useState<UserGroupModel[]>([])
    const [allPermissions, setAllPermissions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [groupToDelete, setGroupToDelete] = useState<number | null>(null)

    const [formOpen, setFormOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<UserGroupModel | undefined>(undefined)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        try {
            const [grs, perms] = await Promise.all([
                authenticationService.findAllGroups(),
                authenticationService.findAllPermissions()
            ])
            setGroups(grs)
            setAllPermissions(perms)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao carregar dados.')
        } finally {
            setLoading(false)
        }
    }

    function askDelete(id: number) {
        setGroupToDelete(id)
        setConfirmOpen(true)
    }

    async function handleConfirmDelete() {
        if (groupToDelete == null) return
        setConfirmOpen(false)
        setLoading(true)
        try {
            await authenticationService.deleteGroup(groupToDelete)
            setGroups(prev => prev.filter(g => g.id !== groupToDelete))
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao excluir.')
        } finally {
            setLoading(false)
            setGroupToDelete(null)
        }
    }

    function handleCancelDelete() {
        setConfirmOpen(false)
        setGroupToDelete(null)
    }

    function handleNew() {
        setEditingGroup(undefined)
        setFormOpen(true)
    }

    function handleEdit(g: UserGroupModel) {
        setEditingGroup(g)
        setFormOpen(true)
    }

    async function handleSaveGroup(data: UserGroupCreateUpdateModel) {
        setFormOpen(false)
        setLoading(true)
        try {
            if (data.groupId) {
                await authenticationService.updateGroup(data)
            } else {
                await authenticationService.createGroup(data)
            }
            await loadData()
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao salvar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="mg-header">
                <div className="d-flex align-items-center">
                    <NavLink to="/">
                        <ChevronLeftIcon fontSize="large" color="primary" />
                    </NavLink>
                    <h2 className="mb-0 ms-2">Gerenciar Grupos</h2>
                </div>
                <Button
                    onClick={handleNew}
                    title="Novo Grupo"
                    color="primary"
                    startIcon={<GroupAddIcon />}
                >
                    Novo Grupo
                </Button>
            </div>

            {loading && <div>Carregando grupos...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="mg-table-wrapper">
                    <table className="mg-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th style={{ width: 120 }} />
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(g => (
                                <tr key={g.id} className="mg-row">
                                    <td>{g.name}</td>
                                    <td className="text-end">
                                        <IconButton
                                            onClick={() => handleEdit(g)}
                                            size="small"
                                            title="Editar"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        {
                                            loggedUser?.authorities?.some(a => a.authority == "Estudante360Permissions.Group.delete")
                                            && (
                                                <IconButton title="Excluir" onClick={() => askDelete(g.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={confirmOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir o grupo <strong>
                            {groups.find(g => g.id === groupToDelete)?.name}
                        </strong>? Esta ação não poderá ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalGroup
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSave={handleSaveGroup}
                group={editingGroup}
                allPermissions={allPermissions}
                allGroups={groups.filter(g => g.id !== 1)}
            />
        </>
    )
}
