import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await handleRegister({ username, email, password })
        if (success) {
            navigate("/")
        }
    }

    if (loading) {
        return (
            <main className='auth-main'>
                <div className='loading-spinner' />
            </main>
        )
    }

    return (
        <main className='auth-main'>
            <div className="form-container">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join PrepForge to start practicing</p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>

                    <button className='button primary-button' style={{ marginTop: '0.5rem' }}>Register</button>

                </form>

                <div className="form-footer">
                    <p>Already have an account? <Link to={"/login"} >Login</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register