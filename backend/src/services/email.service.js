import resend from "../config/resend.config.js";



const sendEmail = async function({email , subject , html , text}){
    const  {data , error} = await resend.emails.send({
        from : "Acme <onboarding@resend.dev>",
        to : email ,
        subject : subject || "hey first msg",
        html : html ||" <p>it works!</p>",
        
    })

    return {data , error}

    
}

export default sendEmail