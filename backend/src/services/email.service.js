import config from "../config/config.js";
import resend from "../config/resend.config.js";
import nodemailer from "nodemailer"


const sendEmail = async function({email , subject , html , text}){
    const  {data , error} = await resend.emails.send({
        from : "Acme <onboarding@resend.dev>",
        to : email ,
        subject : subject || "hey first msg",
        html : html ||" <p>it works!</p>",
        
    })

    return {data , error}

    
}


const transporter =  nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : config.EMAIL_USER,
        pass : config.EMAIL_PASSWORD
    }
})

const sendEmailwithGmail = async function({email , subject , html , text}){
    try {
        const data = await transporter.sendMail({
            from : config.EMAIL_USER,
            to : email ,
            subject : subject || "hey first msg",
            html : html ||" <p>! !</p>",

        })

        return {data , error : null}
    } catch (error) {
        return {data : null , error}
    }
    }


export {
   sendEmailwithGmail
}

export default sendEmail 