import { format } from 'date-fns'

const formatDate = (date: string | number | Date): string => {
    if (date) {
        if (typeof date !== 'string') {
            return 'erro'
        }

        if (date.length === 10) {
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        }

        return format(new Date(date), 'dd/MM/yyyy')
    }

    return 'erro'
}

export default formatDate
