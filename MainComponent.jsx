import React, { useState } from 'react';
import UserForm from './userform';
import UserList from './userlist';

const MainComponent = () => {
    const [users, setUsers] = useState([]);
    const [newuser, setNewUser] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    const addUser = (user) => {
        setUsers([...users, user]);
    };

    const editAddress = (userId, addressIndex) => {
        console.log(userId)
        setEditIndex(userId);

    };

    return (
        <div className='container'>
            <h1>User and Address Management</h1>
            <UserForm editIndex={editIndex} setEditIndex={setEditIndex} setUsers={setUsers} />

            <UserList users={users} editAddress={editAddress} />

        </div>
    );
};

export default MainComponent;
