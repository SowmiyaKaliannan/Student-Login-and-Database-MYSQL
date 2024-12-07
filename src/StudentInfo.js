import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentInfo() {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/students'); // Corrected port and endpoint
      setStudentList(response.data);
    } catch (err) {
      console.error('Error fetching students:', err.message);
      alert('Error fetching students. Please try again later.');
    }
  };

  const resetForm = () => {
    setName('');
    setRollNumber('');
    setDepartment('');
    setPhoneNumber('');
    setAddress('');
  };

 

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/students/${id}`); // Corrected endpoint
      alert('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err.message);
      alert('Error deleting student. Please try again later.');
    }
  };
  const handleEdit = (student) => {
    setEditStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setDepartment(student.department);
    setPhoneNumber(student.phoneNumber);
    setAddress(student.address);
  };
  
  const handleSubmit = async () => {
    if (!name || !rollNumber || !department || !phoneNumber || !address) {
      alert('All fields are required.');
      return;
    }
  
    try {
      if (editStudent) {
        // Update the student
        await Axios.put(`http://localhost:3001/students/${editStudent.id}`, {
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          department: department.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
        });
        alert('Student updated successfully!');
      } else {
        // Add a new student
        await Axios.post('http://localhost:3001/students', {
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          department: department.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
        });
        alert('Student added successfully!');
      }
  
      resetForm();
      fetchStudents(); // Refresh the list of students
      setEditStudent(null); // Clear edit state
    } catch (err) {
      console.error('Error saving student:', err.message);
      alert('Error saving student. Please try again later.');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Information Management</h2>

      <div className="card p-4">
        <h4>{editStudent ? 'Edit Student' : 'Add New Student'}</h4>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rollNumber" className="form-label">Roll Number</label>
            <input
              type="text"
              className="form-control"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              className="form-control"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            {editStudent ? 'Update Student' : 'Add Student'}
          </button>
        </form>
      </div>

      <div className="mt-4">
        <h4>Students List</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.address}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentInfo;
