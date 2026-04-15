import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserInteractor } from "../../use-cases/UserInteractor";
import {
  FirestoreUserRepository,
} from "../../infrastructure/database/FirestoreUserRepository";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";

// eslint-disable-next-line new-cap
const router = Router();

const userRepository = new FirestoreUserRepository();
const jwtTokenService = new JwtTokenService();
const userInteractor = new UserInteractor(userRepository, jwtTokenService);
const userController = new UserController(userInteractor);

router.post("/users/login", (req, res) => userController.login(req, res));
router.post("/users", (req, res) => userController.register(req, res));

export default router;
