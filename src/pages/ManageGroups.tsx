import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import authenticationService from '../services/authenticationService';
import './css/ManageGroups.css';
import { UserGroupModel } from '../models/UserGroupModel';
import { NavLink } from 'react-router-dom';

const ManageGroups: React.FC = () => {
    const [groups, setGroups] = useState<UserGroupModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <Layout>
            <div className="manage-groups-content">
                <div className="mg-header">
                    <h2>Grupos</h2>
                    <button className="mg-new-btn">Novo Grupo</button>
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
                                                        <i className="material-icons primary-color me-3">edit</i>
                                                    </NavLink>
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
        </Layout>
    );
};

export default ManageGroups;