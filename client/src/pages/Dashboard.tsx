import React from 'react'
import DashboardLayout from '../Layouts/DashboardLayout'
import { Link } from 'react-router-dom'

function Dashboard() {
    return (
        <>
            <DashboardLayout />
            <Link to="/">Home</Link>
        </>
    )
}

export default Dashboard