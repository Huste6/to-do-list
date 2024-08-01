const md5 = require('md5');
const User = require('../model/user.model')
const generateHelper = require("../../../helper/generate")
const ForgotPassword = require("../model/forgot-password.model")
const sendMailHelper = require("../../../helper/sendMail")

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
//[POST] /api/v1/user/login
module.exports.login = async (req,res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        res.json({
            code:400,
            message: "Email không tồn tại!"
        })
        return;
    }
    if(user.password != password){
        res.json({
            code:400,
            message: "Sai mật khẩu!"
        })
        return;
    }

    const token = user.token;
    res.cookie("token",token);

    res.json({
        code:200,
        message: "Đăng nhập thành công!",
        token: token
    })
}
//[POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req,res) => {
    const email = req.body.email; 
    const user = await User.findOne({
        email:email,
        deleted:false
    });
    if(!user){
        res.json({
            code:400,
            message: "Email không tồn tại!"
        })
        return;
    }
    const otp = generateHelper.generateRandomNumber(8);
    const timeExpire = 5;
    const objectForgotPassword = {
        email:email,
        otp:otp,
        expireAt: Date.now() + timeExpire*60
    };
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    //gui otp qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu: "
    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b> Thời hạn sử dụng 3 phút
    `
    sendMailHelper.sendMail(email,subject,html);
    res.json({
        code:200,
        message: "Đã gửi mã otp qua email!"
    })
}
//[POST] /api/v1/user/password/otp
module.exports.otpForgotPassword = async (req,res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if(!result){
        res.json({
            code:400,
            message: "OTP khong hop le!"
        })
        return;
    }
    const user = await User.findOne({
        email: email
    })
    
    const token = user.token;
    res.cookie("token",token);

    res.json({
        code:200,
        message: "Xác thực thành công!",
        token: token
    })
}