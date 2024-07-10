

export const formateDate = (dateString) => {
    const date = new Date(dateString)
    const options = { month: 'long', day: 'numeric'}
    return date.toLocaleDateString(undefined, options)
}