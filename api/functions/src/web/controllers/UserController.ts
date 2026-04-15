import express from "express";
import { UserInteractor } from "../../use-cases/UserInteractor";

/**
 * Controller for handling User-related HTTP requests.
 * Acts as an interface between the web layer and the business logic.
 */
export class UserController {
  /**
   * Creates a new UserController instance.
   *
   * @param {UserInteractor} userInteractor - The interactor
   * for user operations.
   */
  constructor(private userInteractor: UserInteractor) {}

  /**
   * Logs in a user.
   *
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async login(req: express.Request, res: express.Response) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res
          .status(400)
          .json({ error: "Email is required" });
      }

      const { user, token } = await this.userInteractor.login(email);
      return res.status(200).json({ ...user, token });
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  /**
   * Registers a new user.
   *
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async register(req: express.Request, res: express.Response) {
    try {
      const { firstName, lastName, email } = req.body;
      const { user, token, isNew } = await this.userInteractor.loginOrRegister(
        email,
        firstName,
        lastName,
      );

      const status = isNew ? 201 : 200;
      const payload = { ...user, token };

      return res.status(status).json(payload);
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json({ error: error.message });
    }
  }
}
