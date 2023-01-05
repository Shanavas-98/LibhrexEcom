module.exports={
    userLogin:(req,res,next)=>{
        if(req.session.userLogin){
            next()
        }else{
            res.redirect('/login')
        }
    },

    adminLogin:(req,res,next)=>{
        if(req.session.adminLogin){
            next()
        }else{
            res.redirect('/admin/login')
        }
    }
}