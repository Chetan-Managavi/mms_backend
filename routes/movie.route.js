import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getAllMovies , addMovie, deleteMovie, addRating } from "../controller/movie.controller.js";

const movieRouter = new Router()

movieRouter.get("/",getAllMovies)
movieRouter.post("/",authMiddleware,addMovie)
movieRouter.post("/:id",authMiddleware,addRating)
movieRouter.delete("/:id",authMiddleware,deleteMovie)

export {movieRouter}