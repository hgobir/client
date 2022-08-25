import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function UserList({ match }) {
    const { path } = match;
    const [users, setUsers] = useState(null);

    useEffect(() => {
        accountService.getUsers()
            .then(response => response.json())
            .then(usersFromServer => {
            // const usersFromServer = response.json()
            console.log(`this is response from getAll ${JSON.stringify(usersFromServer)}`)
            setUsers(usersFromServer)
        });
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; console.log(`this is user in list ${x}`)}
            return x;
        }));
        accountService.deleteUser(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Users</h1>
            <p>All users from secure (admin only) api end point:</p>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th style={{ width: '23%' }}>Username</th>
                    <th style={{ width: '23%' }}>Name</th>
                    <th style={{ width: '23%' }}>Email</th>
                    <th style={{ width: '23%' }}>Role</th>
                    <th style={{ width: '8%' }}></th>
                </tr>
                </thead>
                <tbody>
                {users && users.map(user =>
                    <tr key={user.applicationUserId}>
                        <td>{user.username}</td>
                        <td>{user.title} {user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <Link to={`${path}/edit/${user.applicationUserId}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                            <button onClick={() => deleteUser(user.applicationUserId)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={user.isDeleting}>
                                {user.isDeleting
                                    ? <span className="spinner-border spinner-border-sm"></span>
                                    : <span>Delete</span>
                                }
                            </button>
                        </td>
                    </tr>
                )}
                {!users &&
                <tr>
                    <td colSpan="4" className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </td>
                </tr>
                }
                </tbody>
            </table>
        </div>
    );
}

export { UserList };