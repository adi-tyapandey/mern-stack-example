import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
 const [form, setForm] = useState({
   description: "",
   dueDate: "",
   status: "Pending",
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();

   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };

   await fetch("http://localhost:5050/record", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ description: "", dueDate: "", status: "Pending" });
   navigate("/");
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create a new Task</h3>
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
           value="Create Task"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
