import { IUserRepository } from "../core/repositories/IUserRepository";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";

/**
 * Interactor for managing User entities.
 * Handles business logic for user operations.
 */
export class UserInteractor {
  /**
   * Creates a new UserInteractor instance.
   *
   * @param {IUserRepository} userRepository - The repository
   * for user operations.
   * @param {JwtTokenService} jwtTokenService - The service
   * for JWT operations.
   */
  constructor(
    private userRepository: IUserRepository,
    private jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Logs in a user or registers a new user if they don't exist.
   *
   * @param {string} email - The user's email address.
   * @param {string} [firstName] - The user's first name.
   * @param {string} [lastName] - The user's last name.
   * @return {Promise<{ user: any; token: string; isNew: boolean }>}
   * The user, token, and whether the user is new.
   */
  async loginOrRegister(email: string, firstName?: string, lastName?: string) {
    if (!email) throw new Error("Email is required");

    let user = await this.userRepository.findByEmail(email);

    let isNew = false;
    if (!user) {
      if (!firstName || !lastName) {
        throw new Error(
          "User not found and missing registration details " +
            "(First name and Last name required)",
        );
      }
      user = await this.userRepository.create({ email, firstName, lastName });
      isNew = true;
    }

    const token = this.jwtTokenService.signToken({
      id: user.id,
      email: user.email,
    });
    return { user, token, isNew };
  }

  /**
   * Logs in a user.
   *
   * @param {string} email - The user's email address.
   * @return {Promise<{ user: User; token: string }>} The user and token.
   */
  async login(email: string) {
    if (!email) throw new Error("Email is required");
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const token = this.jwtTokenService.signToken({
      id: user.id,
      email: user.email,
    });
    return { user, token };
  }
}
