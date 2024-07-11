

export const formateDate = (dateString:string):string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric'}
    return date.toLocaleDateString(undefined, options)
}