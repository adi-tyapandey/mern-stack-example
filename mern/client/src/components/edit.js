import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
 const [form, setForm] = useState({
   description: "",
   dueDate: "",
   status: "",
   records: [],
 });
 const params = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5050/record/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }

     setForm(record);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 async function onSubmit(e) {
   e.preventDefault();
   const editedPerson = {
     description: form.description,
     dueDate: form.dueDate,
     status: form.status,
   };

   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5050/record/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });

   navigate("/");
 }

 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Task</h3>
     <form onSubmit={onSubmit}>
     <div className="form-group">
         <label htmlFor="description">Task Description</label>
         <textarea
           type="text"
           className="form-control"
           id="description"
           value={form.description}
           onChange={(e) => updateForm({ description: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="dueDate">Due Date</label>
         <input
           type="date"
           className="form-control"
           id="dueDate"
           value={form.dueDate}
           onChange={(e) => updateForm({ dueDate: e.target.value })}
         />
       </div>
       <div className="form-group">
       <label>Status:</label>
          <select
            className="form-control"
            value={form.status}
            onChange={(e) => updateForm({ status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Update Task"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
