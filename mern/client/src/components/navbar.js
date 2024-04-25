import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
       <NavLink className="navbar-brand" to="/">
          <img alt="MongoDB logo" style={{"width" : 25 + '%'}} src="https://media.istockphoto.com/vectors/list-icon-vector-sign-and-symbol-isolated-on-white-background-list-vector-id1001213860?k=6&m=1001213860&s=170667a&w=0&h=No8z-I2A0roHvR2B_geoqYP_jWyzWluUfgE8xO96Gd8="></img>
       </NavLink>
       <button
         className="navbar-toggler"
         type="button"
         data-toggle="collapse"
         data-target="#navbarSupportedContent"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span className="navbar-toggler-icon"></span>
       </button>

       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav ml-auto">
           <li className="nav-item">
             <NavLink className="nav-link" to="/create">
               Create a new Task
             </NavLink>
           </li>
         </ul>
       </div>
     </nav>
   </div>
 );
}
