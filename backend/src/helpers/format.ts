export const format = {
  formatToReal(value: number | string) {
    return Number(value).toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  },
  insertLineBreaks: (text: string, maxLength: number = 35): string => {
    let result = ''
    let lastBreak = 0
    for (let i = 0; i < text.length; i++) {
      if (i - lastBreak >= maxLength && text[i] === ' ') {
        result += text.slice(lastBreak, i) + ' \n'
        lastBreak = i + 1
      }
    }
    result += text.slice(lastBreak)
    return result
  },
}
