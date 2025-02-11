import { useAuthContext } from "./useAuthContext";
import { useEntryStore } from "@/store/entry";

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { clearEntries } = useEntryStore();

    const logout = () => {
        // remove user from local storage
        localStorage.removeItem('user')

        // clear global entries on logout
        clearEntries();

        // dispatch logout action
        dispatch({ type: 'LOGOUT' })
    }

    return { logout }
}