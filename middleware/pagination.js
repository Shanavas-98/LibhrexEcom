const paginatedResults = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        results.current = {page:page,start:startIndex,limit:limit}
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            res.pagination = results
            next()
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    }
}

module.exports = {paginatedResults}