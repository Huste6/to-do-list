const md5 = require('md5');
const User = require('../model/user.model')

//[POST] /api/v1/user/register
module.exports.register = async(req,res) => {
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email:req.body.email,
        deleted:false
    });
    if(existEmail){
        res.json({
            code:400,
            message: "Email exist!"
        })
    }else{
        const user = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        })
        await user.save();
        
        const token = user.token;
        
        res.cookie("token",token);

        res.json({
            code:200,
            message: "Tao tai khoan thanh cong",
            token: token
        })
    }
}