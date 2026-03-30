import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/AuthContext'
import { API_URL } from '../config'
import './Admin.css'

function Admin() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [resetModal, setResetModal] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`,
  }), [user])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, { headers: headers() })
      if (!res.ok) throw new Error('Failed to load users')
      setUsers(await res.json())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [headers])

  useEffect(() => {
    if (user?.role === 'Admin') fetchUsers()
  }, [user, fetchUsers])

  if (!user || user.role !== 'Admin') {
    return (
      <div className="admin-forbidden">
        <h2>Access Denied</h2>
        <p>You must be logged in as an Admin to view this page.</p>
      </div>
    )
  }

  const updateRole = async (userId, role) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error('Failed to update role')
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteUser = async (userId, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: headers(),
      })
      if (!res.ok) throw new Error('Failed to delete user')
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const resetPassword = async () => {
    if (!newPassword.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/users/${resetModal.userId}/reset-password`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ newPassword }),
      })
      if (!res.ok) throw new Error('Failed to reset password')
      setResetModal(null)
      setNewPassword('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <h2>User Management</h2>
      {error && <p className="admin-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.username}</td>
              <td>
                <select
                  className="admin-role-select"
                  value={u.role}
                  onChange={(e) => updateRole(u.userId, e.target.value)}
                >
                  <option value="Guest">Guest</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <div className="admin-actions">
                  <button
                    className="admin-btn"
                    onClick={() => { setResetModal(u); setNewPassword('') }}
                  >
                    Reset Password
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => deleteUser(u.userId, u.username)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resetModal && (
        <div className="admin-modal-overlay" onClick={() => setResetModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset password for {resetModal.username}</h3>
            <input
              autoFocus
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && resetPassword()}
            />
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={() => setResetModal(null)}>Cancel</button>
              <button className="admin-btn" onClick={resetPassword}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
