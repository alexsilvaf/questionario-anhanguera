import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ListUserModel } from '../models/ListUserModel';
import authenticationService from '../services/authenticationService';
import { useAuth } from '../context/AuthContext';
import './css/ManageUsers.css';
import ClassDropdown from '../components/ui-components/ClassDropdown';

const ManageUsers: React.FC = () => {
    const { isLoading, loggedUser } = useAuth();
    const [selectedClass, setSelectedClass] = useState<string>('');

    const [users, setUsers] = useState<ListUserModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [UserToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (!selectedClass) return;

        setLoading(true);
        authenticationService
            .findByClassName(selectedClass)
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error('Erro ao carregar grupos', err);
                setError(
                    err.response?.data?.message || err.message || 'Erro ao carregar grupos.'
                );
            })
            .finally(() => setLoading(false));
    }, [selectedClass]);

    if (isLoading) return null;

    const askDeleteUser = (id: number) => {
        setUserToDelete(id)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        if (UserToDelete == null) return
        setConfirmOpen(false)
        setLoading(true)

        authenticationService
            .deleteUser(UserToDelete)
            .then(() => {
                setUsers(prev => prev.filter(g => g.id !== UserToDelete))
            })
            .catch(err => {
                console.error('Erro ao deletar grupo', err)
                setError(err.response?.data?.message || err.message || 'Erro ao deletar grupo.')
            })
            .finally(() => {
                setLoading(false)
                setUserToDelete(null)
            })
    }

    const handleCancelDelete = () => {
        setConfirmOpen(false)
        setUserToDelete(null)
    }

    return (
        <>
            <div>
                <div className="mg-header">
                    <h2>Usuários</h2>
                    <div className="d-flex align-items-center">
                        <ClassDropdown
                            onSelectClass={setSelectedClass}
                        />
                        {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.create") && (
                            <NavLink
                                to={'./new'}>
                                <i title="Novo Grupo" className="material-icons primary-color me-3">add_link</i>
                            </NavLink>
                        )}
                        {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.Group.findAll") && (
                            <NavLink
                                to={'/grupos'}>
                                <i title="Novo Grupo" className="material-icons primary-color me-3">groups</i>
                            </NavLink>
                        )}
                    </div>
                </div>

                {loading && <div className="mg-loading">Carregando grupos...</div>}
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
                                        {users.map((u) => {
                                            return (
                                                <React.Fragment key={u.id}>
                                                    <tr className="mg-row">
                                                        <td>{u.firstName + ' ' + u.lastName}</td>
                                                        <td>{u.groupName}</td>
                                                        <td className="text-end">
                                                            {loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.update") && (
                                                                <NavLink
                                                                    to={'./edit/' + u.id}>
                                                                    <i title="Editar" className="material-icons primary-color me-3">edit</i>
                                                                </NavLink>
                                                            )}
                                                            {u.canDelete && (
                                                                loggedUser?.authorities?.some(a => a.authority === "Estudante360Permissions.User.delete") && (
                                                                    <i
                                                                        className="material-icons text-danger"
                                                                        style={{ cursor: 'pointer' }}
                                                                        title="Excluir"
                                                                        onClick={() => askDeleteUser(u.id)}
                                                                    >
                                                                        delete
                                                                    </i>
                                                                )
                                                            )}
                                                            {!u.canDelete && (
                                                                <i
                                                                    className="material-icons text-muted"
                                                                    style={{ cursor: 'not-allowed' }}
                                                                    title="Grupo padrão não pode ser excluído"
                                                                >
                                                                    delete
                                                                </i>
                                                            )}
                                                        </td>

                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Dialog
                open={confirmOpen}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o grupo{" "}
                        <strong>{
                            users.find(g => g.id === UserToDelete)?.firstName || ''
                        }</strong>?
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageUsers;