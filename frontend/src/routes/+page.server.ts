import { invalidateAllSessions } from '$lib/auth'
import { redirect } from '@sveltejs/kit'

export const actions = {
    logout: async ({ request, cookies }) => {
        const data = await request.formData()
        const userIDStr = data.get("userID")
        if (userIDStr === null) return

        const userID = Number(userIDStr)
        if (isNaN(userID)) return

        cookies.delete("sessions", { path: "/", httpOnly: true, sameSite: "lax"})

        invalidateAllSessions(Number(userID))
        redirect(307, "/")
    }
}