import { format, formatDistance } from "date-fns"

export function formatNowDistance(date, options) {
    return formatDistance(date, new Date(), { ...options })
}

export function formatDateTime(date, options) {
    return format(date, "dd/MM/yyyy", options)
}