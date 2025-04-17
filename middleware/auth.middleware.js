import jwt from "jsonwebtoken"

export const authMiddleware = function(req,res,next){
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : ""
    if(!token){
        return res.send(401)
    }
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.body = req.body ? req.body : {}
        req.body.userId = user.id
        next()
    }catch(error){
        res.status(401).send("Invalid Token")
    }

}