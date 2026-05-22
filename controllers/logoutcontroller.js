module.exports
.logoutuser=(req,res)=>{
    res.clearCookie('token');
    return res.status(200).redirect('/');}