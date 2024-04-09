import { format, formatDistance } from "date-fns"
import vi from "date-fns/locale/vi"

export function formatNowDistance(date, options) {
    return formatDistance(date, new Date(), { ...options })
}

export function formatDateTime(date, options) {
    return format(date, "dd/MM/yyyy", options)
}