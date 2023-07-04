import React, { useState } from 'react'
import style from '../assets/css/home.module.css'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_LIST } from '../Graphql/Queries';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '../Graphql/Mutation';

export default function Home() {
    const { register, handleSubmit, setValue } = useForm()
    const [showForm, setShowForm] = useState(false);
    const { data } = useQuery(GET_USER_LIST)
    const [createUser] = useMutation(CREATE_USER)
    const [deleteUser] = useMutation(DELETE_USER)
    const [updateUser] = useMutation(UPDATE_USER)
    let [filteredData, setFilteredData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [id, setId] = useState();
    const onSubmit = data => {
        if (id) {
            console.log('data for update', data.name);
            updateUser({
                variables: {
                    id: id,
                    name: data.name,
                    email: data.email,
                    gender: data.gender,
                    status: data.status
                }
            })
        } else {
            console.log('data for create user', data)
            setShowForm(!showForm)
            createUser({ variables: data })
        }

    }
    function deleteUserById(id) {
        deleteUser({ variables: { id: id } })
    }
    function updateUserData(id) {
        setShowForm(true)
        setIsUpdate(true)
        setId(id)
        filteredData = data.userList.filter((list) => { return list.id === id })
        setFilteredData(filteredData)
        setValue("name", filteredData[0].name)
        setValue("email", filteredData[0].email)
        setValue("status", filteredData[0].status)

    }
    return (
        <div className={style.wrapper}>
            <div className={style.headerContent}>
                <div className={style.addUserContainer}>
                    <span>User List</span>
                    <button onClick={() => { setShowForm(!showForm) }}>Add User</button>
                </div>
                <div className={style.showForm}>
                    {showForm ?
                        <form onSubmit={handleSubmit(onSubmit)} className={style.formContent}>
                            <input type='text' {...register('name')} placeholder='Enter Name' />
                            <input type='email' {...register('email')} placeholder='Enter Email' />
                            <input type='text' {...register('status')} placeholder='Enter Status' />
                            <div className={style.gender}>
                                <label>
                                    <input type='radio' name='gender' value='male' {...register('gender')} />Male
                                </label>
                                <label>
                                    <input type='radio' name='gender' value='female' {...register('gender')} />Female
                                </label>
                            </div>
                            {isUpdate ? <input type='submit' value='Update' /> :
                                <input type='submit' value='Add' />
                            }
                        </form> : ""
                    }
                </div>
            </div>
            <div className={style.listTable}>
                <table className='table-auto'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.userList.map((item, key) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => { updateUserData(item.id) }}>Edit</button>
                                        <button onClick={() => { deleteUserById(item.id) }}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
