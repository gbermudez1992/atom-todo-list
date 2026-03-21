import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";
import { db } from "../config/firebase";

/**
 * Repository implementation for managing User entities in Firestore.
 * Implements the IUserRepository interface.
 */
export class FirestoreUserRepository implements IUserRepository {
  private collection = db.collection("users");

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address to search for.
   * @return {Promise<User | null>} The user if found, or null.
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where("email", "==", email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Creates a new user in the database.
   *
   * @param {User} user - The user object to create.
   * @return {Promise<User>} The created user with its generated ID.
   */
  async create(user: User): Promise<User> {
    const { id: _, ...data } = user;
    const docRef = await this.collection.add(data);
    return { id: docRef.id, ...data } as User;
  }
}
