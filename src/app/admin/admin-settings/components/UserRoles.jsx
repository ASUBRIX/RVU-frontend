import { useState } from 'react'
import { Button, Card, Form, Modal, Table } from 'react-bootstrap'
import { FaEdit, FaKey, FaTrash } from 'react-icons/fa'

const UserRoles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', members: 1 },
    { id: 2, name: 'Customer', members: 1 },
    { id: 3, name: 'Manager', members: 0 },
    { id: 4, name: 'POS Operator', members: 0 },
    { id: 5, name: 'Staff', members: 0 },
    { id: 6, name: 'Admin', members: 1 },
    { id: 7, name: 'Teacher', members: 0 },
  ])

  const [showPermissions, setShowPermissions] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [showEditRole, setShowEditRole] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [editedRoleName, setEditedRoleName] = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [roleToDelete, setRoleToDelete] = useState(null)

  const [permissions, setPermissions] = useState({
    dashboard: { view: true },
    courses: { create: true, update: true, delete: true, view: true },
    students: { create: true, update: true, delete: true, view: true },
    faculty: { create: true, update: true, delete: true, view: true },
    content: { create: true, update: true, delete: true, view: true },
  })

  const handleEditClick = (role) => {
    setSelectedRole(role)
    setEditedRoleName(role.name)
    setShowEditRole(true)
  }

  const handleSaveEdit = () => {
    setRoles(roles.map((role) => (role.id === selectedRole.id ? { ...role, name: editedRoleName } : role)))
    setShowEditRole(false)
  }

  const handleShowPermissions = (role) => {
    setSelectedRole(role)
    setShowPermissions(true)
  }

  const handleSavePermissions = () => {
    console.log('Saving permissions for', selectedRole.name, permissions);
    setShowPermissions(false);
  }

  const handlePermissionChange = (module, action, value) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }))
  }

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        name: newRoleName,
        members: 0
      }
      setRoles([...roles, newRole])
      setNewRoleName('')
      setShowAddRole(false)
    }
  }

  const handleDeleteConfirmation = (role) => {
    setRoleToDelete(role)
    setShowDeleteConfirm(true)
  }

  const handleDeleteRole = () => {
    if (roleToDelete && roleToDelete.name !== 'Super Admin') {
      setRoles(roles.filter(role => role.id !== roleToDelete.id))
      setShowDeleteConfirm(false)
      setRoleToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">Role & Permissions</h4>
          <Button variant="primary" onClick={() => setShowAddRole(true)}>
            Add Role
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table className="table-hover">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Members</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>({role.members}) Members</td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowPermissions(role)}>
                        <FaKey /> Permissions
                      </Button>
                      <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEditClick(role)}>
                        <FaEdit /> Edit
                      </Button>
                      {role.name !== 'Super Admin' && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteConfirmation(role)}>
                          <FaTrash /> Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Permissions Modal */}
      <Modal centered show={showPermissions} onHide={() => setShowPermissions(false)} size="lg" className="permissions-modal">
        <Modal.Header closeButton>
          <Modal.Title>Role & Permissions ({selectedRole?.name})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="permissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>MODULE</th>
                <th>CREATE</th>
                <th>UPDATE</th>
                <th>DELETE</th>
                <th>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissions).map(([page, perms], idx) => (
                <tr key={page}>
                  <td>{idx + 1}</td>
                  <td className="module-name text-capitalize">{page}</td>
                  <td>
                    {perms.create !== undefined && (
                      <Form.Check
                        type="checkbox"
                        checked={perms.create}
                        onChange={(e) => handlePermissionChange(page, 'create', e.target.checked)}
                      />
                    )}
                  </td>
                  <td>
                    {perms.update !== undefined && (
                      <Form.Check
                        type="checkbox"
                        checked={perms.update}
                        onChange={(e) => handlePermissionChange(page, 'update', e.target.checked)}
                      />
                    )}
                  </td>
                  <td>
                    {perms.delete !== undefined && (
                      <Form.Check
                        type="checkbox"
                        checked={perms.delete}
                        onChange={(e) => handlePermissionChange(page, 'delete', e.target.checked)}
                      />
                    )}
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={perms.view}
                      onChange={(e) => handlePermissionChange(page, 'view', e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermissions(false)}>
            Cancel
          </Button>
          <Button className="bg-primary border-0" onClick={handleSavePermissions}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit role modal */}
      <Modal centered show={showEditRole} onHide={() => setShowEditRole(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Role Name</Form.Label>
            <Form.Control type="text" value={editedRoleName} onChange={(e) => setEditedRoleName(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditRole(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Role Modal */}
      <Modal centered show={showAddRole} onHide={() => setShowAddRole(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Role Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter role name" 
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddRole(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRole}>Add Role</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal centered show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>?
          <p className="text-muted mt-2">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteRole}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserRoles
