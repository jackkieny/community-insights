package authenticationRoutes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackkieny/community-insights/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RegisterUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func RegisterRoute(app *fiber.App, client *mongo.Client) {
	app.Post("/api/register", func(c *fiber.Ctx) error {

		// Parse the request body
		var user RegisterUser
		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Cannot parse JSON",
			})
		}

		// Validate Email
		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email",
			})
		}

		// Database setup
		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Check if email already exists
		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err == nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email already exists",
			})
		} else if err != mongo.ErrNoDocuments {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot query database",
			})
		}

		// Validate password
		if !auth.ValidatePassword(user.Password) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Password does not meet requirements",
			})
		}

		hashedPassword, err := auth.HashPassword(user.Password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot hash password",
			})
		}

		// Insert new user
		_, err = collection.InsertOne(ctx, bson.M{
			"email":    user.Email,
			"password": hashedPassword,
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when iserting new user",
			})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Success. New user created.",
		})
	})
}
