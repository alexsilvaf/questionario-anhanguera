import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserGroupModel } from '../models/UserGroupModel';
import authenticationService from '../services/authenticationService';
import './css/ManageGroups.css';

const ManageGroups: React.FC = () => {
    const [groups, setGroups] = useState<UserGroupModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [groupToDelete, setGroupToDelete] = useState<number | null>(null)

    useEffect(() => {
        setLoading(true);
        authenticationService
            .findAllGroups()
            .then((data) => setGroups(data))
            .catch((err) => {
                console.error('Erro ao carregar grupos', err);
                setError(
                    err.response?.data?.message || err.message || 'Erro ao carregar grupos.'
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const askDeleteGroup = (id: number) => {
        setGroupToDelete(id)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        if (groupToDelete == null) return
        setConfirmOpen(false)
        setLoading(true)

        authenticationService
            .deleteGroup(groupToDelete)
            .then(() => {
                setGroups(prev => prev.filter(g => g.id !== groupToDelete))
            })
            .catch(err => {
                console.error('Erro ao deletar grupo', err)
                setError(err.response?.data?.message || err.message || 'Erro ao deletar grupo.')
            })
            .finally(() => {
                setLoading(false)
                setGroupToDelete(null)
            })
    }

    const handleCancelDelete = () => {
        setConfirmOpen(false)
        setGroupToDelete(null)
    }

    return (
        <>
            <div className="manage-groups-content">
                <div className="mg-header">
                    <h2>Grupos</h2>
                    <NavLink
                        to={'./new'}>
                        <i title="Novo Grupo" className="material-icons primary-color me-3">group_add</i>
                    </NavLink>
                </div>

                {loading && <div className="mg-loading">Carregando grupos...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && (
                    <div className="mg-table-wrapper">
                        <table className="mg-table">
                            <thead>
                                <tr>
                                    <th>Grupo</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((g) => {
                                    return (
                                        <React.Fragment key={g.id}>
                                            <tr className="mg-row">
                                                <td>{g.name}</td>
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
                                                            onClick={() => askDeleteGroup(g.id)}
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
                            groups.find(g => g.id === groupToDelete)?.name || ''
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

export default ManageGroups;