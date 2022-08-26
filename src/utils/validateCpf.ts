export default function validateCpf(
    value: string | null | undefined,
    required?: boolean
): boolean {
    let soma = 0
    let resto

    if (!required && !value) {
        return true
    }

    if (!value) {
        return false
    }

    const cpf = value.replace(/\D/g, '')

    if (cpf.length !== 11) {
        return false
    }

    const env = process.env.REACT_APP_ENV

    if (
        env !== 'development' &&
        (cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999')
    ) {
        return false
    }

    let i
    for (i = 1; i <= 9; i += 1)
        soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10), 10)) return false

    soma = 0
    for (i = 1; i <= 10; i += 1) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
    }
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11), 10)) return false
    return true
}
