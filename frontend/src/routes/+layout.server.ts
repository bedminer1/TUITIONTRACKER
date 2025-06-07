import { validateSessionToken } from '$lib/auth'
import { redirect } from '@sveltejs/kit'

export const load = async ({ cookies, url }) => {
    const unprotectedRoutes = ["/", "/login"]
    const token = cookies.get("session")
    if (token === undefined) {
        if (!unprotectedRoutes.includes(url.pathname)) {
            redirect(307, "/")
        }
        return {
            loggedIn: false,
            userID: 0
        }
    }

    const { session, user } = await validateSessionToken(token)
    if (user === null) {
        if (!unprotectedRoutes.includes(url.pathname)) {
            redirect(307, "/")
        }
        return {
            loggedIn: false,
            userID: 0
        }
    }
    return {
        loggedIn: true,
        userID: user.id

    }
}