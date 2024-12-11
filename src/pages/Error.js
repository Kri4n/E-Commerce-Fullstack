import { NavLink } from "react-router-dom";

export default function Error(){
    return(
        <div className="mt-5 mb-5 pb-5 text-center">
            <h1 className="not-found">404</h1>
            <p className="h1 mb-5">Page Not Found</p>
            <NavLink className="btn btn-dark mb-5" to="/">Back to Home</NavLink>
        </div>
    )
}