import { toast } from "react-toastify";

export function cellToAxiosParamsToggleAdmin(cell){
    return{
        url: "/api/admin/users/toggleAdmin",
        method: "POST",
        params:{
            id: cell.row.values.id
        }
    }
}

export function cellToAxiosParamsToggleInstructor(cell){
    return{
        url: "/api/admin/users/toggleInstructor",
        method: "POST",
        params: {
            id: cell.row.values.id
        }
    }
}

export function toggleAdminSuccess(message) {
    console.log(message);
    toast(message);
}

export function toggleInstructorSuccess(message) {
    console.log(message);
    toast(message);
}
