const asyncWrapper = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next)
      } catch (error) {
        next(res.json({ Error: error.name, ErrorMsg: error.message }))
      }
    }
  }
 
 module.exports = { asyncWrapper }