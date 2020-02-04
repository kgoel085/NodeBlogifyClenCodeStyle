module.exports = (req, res, nxt) => {
  const { method } = req
  const finalData = { ...req.body, ...req.query, ...req.params }
  const methodArr = ['put', 'post', 'delete', 'patch']
  if (Object.keys(finalData).length === 0 && methodArr.includes(method.toLowerCase())) {
    const err = new Error('Please provide some input to continue !')
    err.statusCode = 406
    nxt(err)
  }
  nxt()
}
