module.exports={
    userLogin:(req,res,next)=>{
        if(req.session.userLogin){
            next()
        }else{
            next()
            // res.redirect('/login')
        }
    },

    adminLogin:(req,res,next)=>{
        if(req.session.adminLogin){
            next()
        }else{
            next()
            // res.redirect('/admin/login')
        }
    }
}