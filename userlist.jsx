import React, { useState, useEffect } from 'react';
import http from './Httpservice';

const UserList = ({ toggleStatus, deleteAddress, editAddress }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await http.get('/user');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message || 'Error fetching users');
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await http.del(`/user/${userId}`);
            const updatedUsers = users.filter(user => user._id !== userId);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.message || 'Error deleting user');
        }
    };

    const handleEditAddress = (userId, addressIndex) => {
        console.log(userId)
        editAddress(userId, addressIndex);
    };

    const toggleAddressStatus = async (userId, addressIndex) => {
        try {
            const updatedUsers = [...users];
            const userIndex = updatedUsers.findIndex(user => user._id === userId);

            if (userIndex !== -1) {
                const user = updatedUsers[userIndex];

             
                if (user.addresses && user.addresses[addressIndex]) {
                    const address = user.addresses[addressIndex];
                    address.status = address.status === 'valid' ? 'invalid' : 'valid';

                    await http.put(`/user/${userId}`, user);
                    setUsers(updatedUsers);
                } else {
                    console.error('Address not found:', userId, addressIndex);
                    setError('Address not found');
                }
            } else {
                console.error('User not found:', userId);
                setError('User not found');
            }
        } catch (error) {
            console.error('Error toggling address status:', error);
            setError(error.message || 'Error toggling address status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-4'>
                    <h3 className='text-secondary'>List of Users</h3>
                </div>
                <div className='col-8'>
                    <h3 className='text-secondary'>List of Addresses</h3>
                </div>
            </div>

            {users.map((user, userIndex) => (
                <div className='row mb-3' key={userIndex}>
                    <div className='col-4'>
                        <h6>{user.name} (Age: {user.age})</h6>
                    </div>
                    <div className='col-8'>
                        <ul>
                            {user.addresses.map((address, addressIndex) => (
                                <li key={addressIndex} className={`mb-2 ${address.status}`}>
                                    {address.city}, {address.state}, {address.houseNo}, {address.country} - {address.status}
                                    <button className='mx-2 btn btn-secondary' onClick={() => toggleAddressStatus(user._id, addressIndex)}>
                                        {address.status === 'valid' ? 'Mark Invalid' : 'Mark Valid'}
                                    </button>
                                    <button className='mx-2 btn btn-warning ' onClick={() => handleEditAddress(user._id, addressIndex)}>Edit</button>
                                    <button className='mx-2 btn btn-danger ' onClick={() => deleteUser(user._id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
