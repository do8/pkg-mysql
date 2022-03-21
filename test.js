global.poolmysqlconfig = {}
const pool = require('./index')

console.log(pool.format("UPDATE posts SET title = ?", "a' or 1=1"))

async function test() {

    let d = await pool.query('SET @v=?;select @v v', 'hello')
    console.log(d[1])

    let o = {
        openid: '2'
    }
    // let tran=await pool.tran()
    // let d=await tran.query('insert into qm_auser_wx_mini SET ?',o)
    // console.log(d)
    // d=await tran.query('select * from qm_auser_wx_mini',o)
    // await tran.commit()
    // console.log(d)

}
test()