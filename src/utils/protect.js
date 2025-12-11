import { redirect } from "react-router-dom";

export const requireAuth  = async (request, requiredRole = null) => {
    const pathname = new URL(request.url).pathname;
    const activeUser = JSON.parse(localStorage.getItem("user"));

    if (!activeUser) {
        const response = redirect(`/login?message=You must login first&redirectTo=${pathname}`);
        return response;
    }
    
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(activeUser.role)) {
            return redirect(`/not-found`);
        }
    }
    
    return { user: activeUser };
}