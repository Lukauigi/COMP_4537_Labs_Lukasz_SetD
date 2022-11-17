// const asyncWrapper = (fn) => {
//     return async (req, res, next) => {
//       try {
//         await fn(req, res, next)
//       } catch (error) {
//         if (error.pokeErrorCode) res.status(error.pokeErrorCode)
//         else res.status(500)
//         next(res.json({ Error: error.name, ErrorMsg: error.message }))
//       }
//     }
//   }

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
 
module.exports = { asyncWrapper }