import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "../prisma/db.js"
import { logger } from "../utils/logger.js"


export const signIn =  async function(req,res){

    try{
        const { userName, password } = req.body

        if(!userName){
            logger.warning("Required userName")
            return res.status(400).send("Required userName")
        }
        if(!password){
            logger.warning("Required password")
           return res.status(400).send("Required password")
        }
        const hashedPasword = await bcrypt.hash(password,10)
        const User = await prisma.user.findFirst({
            where:{
                userName: userName,
            }
        })
        if(!User){
            logger.error("User Not Found")
           return res.status(404).send({"message":"User Not Found!"})
        }
        const isPasswordValid = await bcrypt.compare(password,User.password)
        if(!isPasswordValid){
           return res.status(401).json({"message":"Invalid Credentials"})
        }
        const token =  jwt.sign(User,process.env.JWT_SECRET)
        res.json({"message" : "Login Successful","token":token})
         

    }catch(error){
        logger.error(error,"Login Unsuccesful")
        res.status(500).send({message: "Login Unsuccesful",error:error})
    }
}

export const signUp = async function(req,res){

    try{
        const { userName,password } = req.body
        const hashedPasword = await bcrypt.hash(password,10)

        if(!userName){
            logger.warning("Required userName")
            return res.status(400).send("Required userName")
        }
        if(!password){
            logger.warning("Required password")
           return res.status(400).send("Required password")
        }

        const checkuser = await prisma.user.findFirst({
            where:{
                userName: userName
            }
        })
        if(checkuser){
            logger.info("User already exists.")
            res.status(409).json({"message":"User already exists."})
            return
        }
        const User = await prisma.user.create({
                                data:{
                                    userName:userName,
                                    password:hashedPasword
                                }
                            })
        res.status(201).json({"userId":User.id,"message":"User Sign-up Succesfull"})
    }catch(error){
        logger.error(error,"signup unsuccessful")
        res.status(500).send(error) 
    }
  
}