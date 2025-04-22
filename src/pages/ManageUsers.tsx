import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ListUserModel } from '../models/ListUserModel';
import authenticationService from '../services/authenticationService';
import { useAuth } from '../context/AuthContext';
import './css/ManageUsers.css';

const ManageUsers: React.FC = () => {
    const { loggedUser, isLoading } = useAuth();
    const classes = loggedUser?.classList ?? [];

    const [selectedClass, setSelectedClass] = useState<string>('');
    const [users, setUsers] = useState<ListUserModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [UserToDelete, setUserToDelete] = useState<number | null>(null);


    useEffect(() => {
        if (classes.length > 0 && !selectedClass) {
            setSelectedClass(classes[0]);
        }
    }, [classes, selectedClass]);

    useEffect(() => {
        setLoading(true);
        authenticationService
            .findAllUsers()
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error('Erro ao carregar grupos', err);
                setError(
                    err.response?.data?.message || err.message || 'Erro ao carregar grupos.'
                );
            })
            .finally(() => setLoading(false));
    }, []);

    if (isLoading) return null;

    // monta a lista filtrada
    const filteredUsers = useMemo(
        () =>
            selectedClass
                ? users.filter(u => u.classList.includes(selectedClass))
                : users,
        [users, selectedClass]
    );

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
                        {classes.length > 1 ? (
                            <select
                                className="class-select me-3 mb-1"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                {classes.map(c => (
                                    <option className='cursor-pointer' key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="me-3 mb-1">{classes[0] || '–'}</span>
                        )}
                        <NavLink
                            to={'./new'}>
                            <i title="Novo Grupo" className="material-icons primary-color me-3">add_link</i>
                        </NavLink>
                        <NavLink
                            to={'/grupos'}>
                            <i title="Novo Grupo" className="material-icons primary-color me-3">groups</i>
                        </NavLink>
                    </div>
                </div>

                {loading && <div className="mg-loading">Carregando grupos...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && (
                    <>
                        {filteredUsers.length === 0 ? (
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
                                        {filteredUsers.map((g) => {
                                            return (
                                                <React.Fragment key={g.id}>
                                                    <tr className="mg-row">
                                                        <td>{g.firstName + ' ' + g.lastName}</td>
                                                        <td>{g.groupName}</td>
                                                        <td className="text-end">
                                                            <NavLink
                                                                to={'./edit/' + g.id}>
                                                                <i title="Editar" className="material-icons primary-color me-3">edit</i>
                                                            </NavLink>
                                                            {g.id !== 1 && (
                                                                <i
                                                                    className="material-icons text-danger"
                                                                    style={{ cursor: 'pointer' }}
                                                                    title="Excluir"
                                                                    onClick={() => askDeleteUser(g.id)}
                                                                >
                                                                    delete
                                                                </i>
                                                            )}
                                                            {g.id == 1 && (
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