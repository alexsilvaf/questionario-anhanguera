// src/pages/ManageUsers.tsx
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import { ListUserModel } from '../models/ListUserModel'
import authenticationService from '../services/authenticationService'
import { useAuth } from '../context/AuthContext'
import ClassDropdown from '../components/ui-components/ClassDropdown'
import { UserDataModel } from '../models/UserDataModel'
import { UserGroupModel } from '../models/UserGroupModel'
import ModalUserData from './ModalUserData'
import AddLinkIcon from '@mui/icons-material/AddLink'
import GroupsIcon from '@mui/icons-material/Groups'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import './css/ManageUsers.css'
import ModalLinkUser from './ModalLinkUser'

const ManageUsers: React.FC = () => {
    const { isLoading, loggedUser } = useAuth()
    const [selectedClass, setSelectedClass] = useState<string>('')

    const [users, setUsers] = useState<ListUserModel[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false)
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState('')

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<number | null>(null)

    const [linkModalOpen, setLinkModalOpen] = useState(false)
    const [userModalOpen, setUserModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserDataModel | undefined>(undefined)
    const [allGroups, setAllGroups] = useState<UserGroupModel[]>([])

    useEffect(() => {
        if (!selectedClass) return

        setLoading(true)
        authenticationService
            .findByClassName(selectedClass)
            .then(data => {
                setUsers(data)
                setError(null)
            })
            .catch(err => {
                console.error('Erro ao carregar usuários', err)
                setError(err.response?.data?.message || err.message || 'Erro ao carregar usuários.')
            })
            .finally(() => setLoading(false))
    }, [selectedClass])

    useEffect(() => {
        authenticationService
            .findAllGroups()
            .then(grs => {
                setAllGroups(grs)
            })
            .catch(err => {
                console.error('Erro ao carregar grupos para modal', err)
            })
    }, [])

    if (isLoading) return null

    const askDeleteUser = (id: number) => {
        setUserToDelete(id)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        if (userToDelete == null) return
        setConfirmOpen(false)
        setLoading(true)

        authenticationService
            .deleteUser(userToDelete)
            .then(() => {
                setUsers(prev => prev.filter(u => u.id !== userToDelete))
            })
            .catch(err => {
                console.error(err)
                const msg = err.response?.data?.message || err.message || 'Erro ao excluir.'
                setSnackbarMsg(msg)
                setSnackbarErrorOpen(true)
            })
            .finally(() => {
                setLoading(false)
                setUserToDelete(null)
            })
    }

    const handleNewUser = () => {
        setEditingUser(undefined)
        setLinkModalOpen(true)
    }

    const handleEditUser = (id: number) => {
        setLoading(true)
        authenticationService
            .findUserById(id)
            .then(user => {
                setEditingUser(user)
                setUserModalOpen(true)
            })
            .catch(err => {
                console.error('Erro ao buscar usuário para edição', err)
                const msg = err.response?.data?.message || err.message || 'Erro ao carregar usuário.'
                setSnackbarMsg(msg)
                setSnackbarErrorOpen(true)
            })
            .finally(() => setLoading(false))
    }

    const handleSaveUser = (data: any, isUpdate: boolean) => {
        setLoading(true)

        let action;
        if (isUpdate) {
            action = authenticationService.updateUser(data)
        } else {
            action = authenticationService.createInvitation(data)
        }

        action
            .then(() => {
                if (isUpdate) {
                    setSnackbarMsg('Usuário atualizado com sucesso!')
                } else {
                    setSnackbarMsg('Convite enviado com sucesso!')
                }
                setSnackbarSuccessOpen(true)
                return authenticationService.findByClassName(selectedClass)
            })
            .then(fresh => setUsers(fresh))
            .catch(err => {
                console.error('Erro ao salvar usuário', err)
                const msg = err.response?.data?.message || err.message || 'Erro ao salvar usuário.'
                setSnackbarMsg(msg)
                setSnackbarErrorOpen(true)
            })
            .finally(() => {
                setLoading(false)
                setUserModalOpen(false)
                setLinkModalOpen(false)
            })
    }

    return (
        <>
            <div className="mg-header">
                <h2>Usuários</h2>
                <div className="d-flex align-items-center">
                    <ClassDropdown onSelectClass={setSelectedClass} />
                    {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.create") && (
                        <IconButton title="Novo Usuário" className="mx-1" onClick={() => handleNewUser()}>
                            <AddLinkIcon color="primary" />
                        </IconButton>
                    )}
                    {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.Group.findAll") && (
                        <NavLink to="/grupos">
                            <IconButton title="Novo Usuário" onClick={() => handleNewUser()}>
                                <GroupsIcon color="primary" />
                            </IconButton>
                        </NavLink>
                    )}
                </div>
            </div>

            {loading && <div className="mg-loading">Carregando usuários...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <>
                    {users.length === 0 ? (
                        <p>Nenhum usuário encontrado para “{selectedClass}”.</p>
                    ) : (
                        <div className="mg-table-wrapper">
                            <table className="mg-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Grupo</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="mg-row">
                                            <td>{u.firstName} {u.lastName}</td>
                                            <td>{u.groupName}</td>
                                            <td className="text-end">
                                                {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.update") ? (
                                                    <>
                                                        {u.canModify ? (
                                                            <IconButton title="Editar" onClick={() => handleEditUser(u.id)}>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton style={{ cursor: 'not-allowed' }} className="text-muted" title="Não pode editar este usuário">
                                                                <EditIcon color="disabled" />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                ) : <></>}
                                                {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.delete") ? (
                                                    <>
                                                        {u.canModify ? (
                                                            <IconButton title="Excluir" onClick={() => askDeleteUser(u.id)}>
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton style={{ cursor: 'not-allowed' }} className="text-muted" title="Não pode excluir este usuário">
                                                                <DeleteIcon color="disabled" />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                ) : <></>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <Snackbar
                open={snackbarErrorOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarErrorOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarErrorOpen(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={snackbarSuccessOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o usuário <strong>
                            {users.find(u => u.id === userToDelete)?.firstName || ''}
                        </strong>? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalLinkUser
                open={linkModalOpen}
                onClose={() => { setLinkModalOpen(false) }}
                onSave={data => handleSaveUser(data, false)}
                allGroups={allGroups}
                classList={loggedUser?.classList ?? []}
                initialClass={selectedClass}
            />

            <ModalUserData
                open={userModalOpen}
                onClose={() => { setUserModalOpen(false) }}
                onSave={data => handleSaveUser(data, true)}
                userData={editingUser}
                allGroups={allGroups}
            />
        </>
    )
}

export default ManageUsers
