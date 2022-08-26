import isValid from 'date-fns/isValid'

const parseDate = (date: string): string | null => {
    if (typeof date !== 'string') {
        return null
    }

    const [day, month, year] = date.split('/')
    if (day.length === 2 && month.length === 2 && year.length === 4) {
        try {
            if (isValid(new Date(`${year}-${month}-${day}`))) {
                return `${year}-${month}-${day}`
            }
            return 'erro'
        } catch (error) {
            return 'erro'
        }
    }

    return null
}

export default parseDate
