describe('env test', () => {
  it('env', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })
})
