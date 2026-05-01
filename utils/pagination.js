export const pagination = (query) => {

    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 12
    const skip = (page - 1) * limit

    return {page , limit , skip }
    
}