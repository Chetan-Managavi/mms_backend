import {prisma} from "../prisma/db.js"
import { logger } from "../utils/logger.js"

export const getAllMovies =async  (req,res) =>{
    try{
        const { rating , genre} = req.query
        const movies  = await prisma.movie.findMany({
            where:{
                AND:[{avgRating : parseFloat(rating) || undefined},{genre:{contains:genre||undefined}}]
            }
        })
        res.status(200).json({message:"Succesfully fetched.", data:movies})
    }catch(error){
        logger.error(error,"Failed to fectch movies")
        res.status(500).json({error:error})
    }
}

export const addMovie = async (req,res) =>{
    try{
        const {name,genre,userId} = req.body
        const rating = parseFloat(req.body.rating)

        var missingParam = []
        var mandFlag=true
        if(!name){
            missingParam.push("name")
            mandFlag = false
        }
        if(!genre){
            missingParam.push("genre")
            mandFlag = false
        }
        if(!req.body.rating || !rating){
            missingParam.push("rating")
            mandFlag = false
        }

        if(!mandFlag){
            logger.warning(`${missingParam.join(", ")} is/are required.`)
            res.status(400).send({error:"Bad Request", message:`${missingParam.join(", ")} is/are required.`})
            return
        }

        
        if(rating <= 0 && rating > 10){
            logger.warning("Rating should be greater than 0 and less than 10")
            res.status(400).send({error:"Bad Request",message:"Rating should be greater than 0 and less than 10"})
        }


        const movie = await prisma.movie.create({
            data:{ name:name,genre:genre,avgRating:rating }
        })

        const updatedRating = await prisma.rating.create({
            data:{
                movieId:parseInt(movie.id),
                userId:parseInt(userId),
                rating:rating
            }
        })
        res.status(201).json({message:"movie added",data:movie})
    }catch(error){
        logger.error(error,"Failed to add movie")
        res.status(500).json({message:"Failed to add movie",error:error})
    }
}

export const addRating = async (req,res) => {
    try{
        const movieId = req.params.id
        const userId = req.body.userId
        const rating = parseFloat(req.body.rating)
        if(!req.body.rating || !rating){
            logger.warning("Rating is required")
            res.status(400).send({error:"Bad Request",message:"Rating is required"})
        }
        if(rating <= 0 && rating > 10){
            logger.warning("Rating should be greater than 0 and less than 10")
            res.status(400).send({error:"Bad Request",message:"Rating should be greater than 0 and less than 10"})
        }

        const updatedRating =await prisma.rating.upsert({
            where: {
                userId_movieId: {
                  userId: parseInt(userId),
                  movieId: parseInt(movieId)
                }
              },
              update: {
                rating: rating
              },
              create: {
                userId: parseInt(userId),
                movieId: parseInt(movieId),
                rating: rating
              }
        })

        const aMoviewRatings = await prisma.rating.findMany({
            where:{
                movieId:parseInt(movieId)
            }
        })

        const avgRating = aMoviewRatings.reduce((sum,movie)=>sum + parseFloat(movie.rating),0)/aMoviewRatings.length

        const movie = await prisma.movie.update({
            where:{
                id:parseInt(movieId)
            },
            data:{
                avgRating:avgRating
            }
        })

        res.status(200).send({message:"Updated Rating",data:movie})

    }catch(error){
        logger.error(error,"Failed to add ratings")
        res.status(500).send({message:"Failed to add ratings",error:error})
    }
}
export const deleteMovie = async (req,res)=>{
    try{
        const movieId = parseInt(req.params.id)
        if(!req.params.id){
            logger.warning("movieId Required")
            res.send(400).json({error:"Bad Request",message:"Movie Id Required"})
            return
        }
        if(!movieId){
            logger.warning("Movie Id must be Integer")
            res.send(400).json({error:"Bad Request",message:"Movie Id must be Integer"})
            return
        }
        const movie = await prisma.movie.findFirst({where:{
            id:movieId
        }})
        if(!movie){
            logger.info("Movie Already deleted or doesn't exist")
            res.status(404).json({error:"Not Found",message:"Movie Already deleted or doesn't exist"})
            return
        }
        const deletedMovieReviews =  prisma.rating.deleteMany({
            where:{
                movieId:movieId
            }
        })

        const deletedMovie =  prisma.movie.delete({
            where:{
                id:movieId
            }
        })
        await prisma.$transaction([deletedMovieReviews,deletedMovie])
        res.status(201).json({message:"Question deleted successfully."})
    }catch(error){
        logger.error(error,"Failed to delete movie")
        res.status(500).json({message:"Failed to delete movie",error:error})
    }
}


