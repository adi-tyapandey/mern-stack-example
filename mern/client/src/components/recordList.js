import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr>
    <td>{props.record.description}</td>
    <td>{props.record.dueDate}</td>
    <td>{props.record.status}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('None');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedReports, setGeneratedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);


  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/?sortOrder=${sortOrder}&filterStatus=${filterStatus}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return;
  }, [sortOrder, filterStatus]);

  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  async function generateReport() {
    try {
        const response = await fetch(`http://localhost:5050/record/`);
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        const records = await response.json();
        const totalTasks = records.length;
        const tasksByStatus = records.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {});
        const currentDate = new Date();
        const tasksOverdue = records.filter(record => new Date(record.dueDate) < new Date(currentDate) && record.status !== 'Completed').length;
        const tasksCompletedOnTime = records.filter(record => record.status === 'Completed' && new Date(record.dueDate) >= new Date(currentDate)).length / totalTasks * 100;

        const report = {
          totalTasks: totalTasks,
          tasksByStatus: tasksByStatus,
          tasksOverdue: tasksOverdue,
          tasksCompletedOnTime: tasksCompletedOnTime.toFixed(2)
        };

        setGeneratedReports(prevReports => [...prevReports, report]);

        const reportMessage = `Total Number of Tasks: ${totalTasks}\n\nTasks by Status:\n${JSON.stringify(tasksByStatus)}\n\nTasks Overdue: ${tasksOverdue}\n\nTasks Completed on Time: ${tasksCompletedOnTime.toFixed(2)}%`;
        window.alert(reportMessage);
    } catch (error) {
        window.alert(error.message);
    }
  }

  function recordList() {
    const filteredRecords = records.filter(record => {
      if (filterStatus === 'None') {
        return true;
      } else {
        return record.status === filterStatus;
      }
    }).filter(record => record.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return filteredRecords.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
  }

  function handleReportSelection(index) {
    setSelectedReport(generatedReports[index]);
  }

  function closeReportPopup() {
    setSelectedReport(null);
  }

  return (
    <div className="todo-container">
      <h3>To-do List</h3>
      <div className="options-container">
        <div className="sort-option">
          <label>Sort By Due Date:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Earliest Due Date</option>
            <option value="desc">Latest Due Date</option>
          </select>
        </div>
        <div className="filter-option">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="None">None</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="search-option">
          <label>Search Task:</label>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={generateReport}>Generate Report</button>
        <div className="dropdown">
          <label className="dropbtn">Generated Reports</label>
          <div className="dropdown-content">
            {generatedReports.map((report, index) => (
              <button key={index} onClick={() => handleReportSelection(index)}>Report {index + 1}</button>
            ))}
          </div>
        </div>
      </div>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Task Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
      {selectedReport && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeReportPopup}>&times;</span>
            <h2>Generated Report</h2>
            <p>Total Number of Tasks: {selectedReport.totalTasks}</p>
            <p>Tasks by Status: {JSON.stringify(selectedReport.tasksByStatus)}</p>
            <p>Tasks Overdue: {selectedReport.tasksOverdue}</p>
            <p>Tasks Completed on Time: {selectedReport.tasksCompletedOnTime}%</p>
          </div>
        </div>
      )}
    </div>
  );  
}
