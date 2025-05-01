// src/pages/ManageGroups.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
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
    
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState('')
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success')

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
                authenticationService.findManagedGroups(),
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
            setSnackbarMsg('Grupo excluído com sucesso.')
            setSnackbarType('success')
            setSnackbarOpen(true)
        } catch (err: any) {
            console.error(err)
            const msg =
                err.response?.data?.message
                || err.message
                || 'Erro ao excluir.'
            setSnackbarMsg(msg)
            setSnackbarType('error')
            setSnackbarOpen(true)
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
            setSnackbarMsg('Grupo salvo com sucesso.')
            setSnackbarType('success')
            setSnackbarOpen(true)
        } catch (err: any) {
            console.error(err)
            const msg = err.response?.data?.message || err.message || 'Erro ao salvar.'
            setSnackbarMsg(msg)
            setSnackbarType('error')
            setSnackbarOpen(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="mg-header">
                <div className="d-flex align-items-center">
                    <NavLink to="/usuarios">
                        <ChevronLeftIcon fontSize="large" color="primary" />
                    </NavLink>
                    <h2 className="mb-0 ms-2">Gerenciar Grupos</h2>
                </div>
                {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.Group.create") && (
                    <Button
                        onClick={handleNew}
                        title="Novo Grupo"
                        color="primary"
                        startIcon={<GroupAddIcon />}
                    >
                        Novo Grupo
                    </Button>
                )}
            </div>

            {loading && <div>Carregando grupos...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && (
                <div className="mg-table-wrapper">
                    <table className="mg-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th style={{ width: 120 }} />
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length > 0 ? (
                                groups.map(g => (
                                    <tr key={g.id} className="mg-row">
                                        <td>{g.name}</td>
                                        <td className="text-end">
                                            {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.Group.update") && (
                                                <IconButton
                                                    onClick={() => handleEdit(g)}
                                                    size="small"
                                                    title="Editar"
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                            )}
                                            {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.Group.delete") && (
                                                <IconButton title="Excluir" onClick={() => askDelete(g.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center">
                                        Nenhum grupo encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarType}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            <Dialog open={confirmOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {groups.length > 0 && groupToDelete != null ? (
                            <>
                                Deseja realmente excluir o grupo <strong>
                                    {groups.find(g => g.id === groupToDelete)?.name || '(Grupo não encontrado)'}
                                </strong>? Esta ação não poderá ser desfeita.
                            </>
                        ) : (
                            "Nenhum grupo selecionado para exclusão."
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={!groupToDelete}
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
                allGroups={groups.length > 0 ? groups.filter(g => g.id !== 1) : []}
            />
        </>
    )
}
