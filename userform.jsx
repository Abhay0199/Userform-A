import React, { useState, useEffect } from 'react';
import http from './Httpservice';

const UserForm = ({ editIndex, setEditIndex, setUsers }) => {
    console.log(editIndex)
    const [user, setUser] = useState({ name: '', age: '', addresses: [] });
    const [address, setAddress] = useState({
        city: '',
        state: '',
        houseNo: '',
        country: '',
        status: 'valid'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
       
        const fetchUserData = async () => {
            try {
                const response = await http.get(`/users/${editIndex}`);
                console.log(response.data);
                const { name, age, addresses } = response.data;

                const { city, state, houseNo, country } = addresses[0];

                setUser({ name, age, addresses: [{ city, state, houseNo, country }] });
                setAddress({ city, state, houseNo, country }); // Update address fields
            } catch (error) {
                console.error('Error fetching user data for editing:', error);
            }
        };

        if (editIndex !== null) {
            fetchUserData();
        } else {
           
            setUser({ name: '', age: '', addresses: [] });
            setAddress({
                city: '',
                state: '',
                houseNo: '',
                country: '',
                status: 'valid'
            });
        }
    }, [editIndex]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate user and address
        if (validateUser() && validateAddress()) {
            
            const updatedUser = {
                ...user,
                
                addresses: [...user.addresses, address]
            };

          
            try {
                const response = editIndex !== null
                    ? await http.put(`/user/${editIndex}`, updatedUser)
                    : await http.post('/user', updatedUser);

              
                setUsers(prevUsers => {
                    if (editIndex !== null) {
                        return prevUsers.map((usr, index) => index === editIndex ? response.data : usr);
                    } else {
                        return [...prevUsers, response.data];
                    }
                });

               
                setUser({ name: '', age: '', addresses: [] });
                setErrors({});
                setEditIndex(null);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };



    const validateUser = () => {
        const newErrors = {};
        if (!user.name) newErrors.name = 'Name is required';
        if (!user.age || isNaN(user.age) || user.age <= 0) newErrors.age = 'Valid age is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateAddress = () => {
        const newErrors = {};
        if (!address.city) newErrors.city = 'City is required';
        if (!address.state) newErrors.state = 'State is required';
        if (!address.houseNo) newErrors.houseNo = 'House No is required';
        if (!address.country) newErrors.country = 'Country is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div>
            <form className='container' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Name:</label>
                    <input className="form-control" type="text" name="name" value={user.name} onChange={handleUserChange} />
                    {errors.name && <span className="error text-danger">{errors.name}</span>}
                </div>
                <div className='form-group'>
                    <label>Age:</label>
                    <input className="form-control" type="number" name="age" value={user.age} onChange={handleUserChange} />
                    {errors.age && <span className="error text-danger">{errors.age}</span>}
                </div>
                <h4>Address</h4>
                <div className='form-group'>
                    <label>City:</label>
                    <input className="form-control" type="text" name="city" value={address.city} onChange={handleAddressChange} />
                    {errors.city && <span className="error text-danger">{errors.city}</span>}
                </div>
                <div className='form-group'>
                    <label>State:</label>
                    <input className="form-control" type="text" name="state" value={address.state} onChange={handleAddressChange} />
                    {errors.state && <span className="error text-danger">{errors.state}</span>}
                </div>
                <div className='form-group'>
                    <label>House No:</label>
                    <input className="form-control" type="text" name="houseNo" value={address.houseNo} onChange={handleAddressChange} />
                    {errors.houseNo && <span className="error text-danger">{errors.houseNo}</span>}
                </div>
                <div className='form-group'>
                    <label>Country:</label>
                    <input className="form-control" type="text" name="country" value={address.country} onChange={handleAddressChange} />
                    {errors.country && <span className="error text-danger">{errors.country}</span>}
                </div>
                <button className='mt-2 btn btn-primary' type="submit">{editIndex !== null ? 'Update' : 'Submit'}</button>
            </form>
        </div>
    );
};

export default UserForm;
