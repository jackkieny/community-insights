package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackkieny/community-insights/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginRoute(app *fiber.App, client *mongo.Client) {
	app.Post("/api/login", func(c *fiber.Ctx) error {

		var user LoginUser

		if err := c.BodyParser(&user); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Cannot parse JSON",
			})
		}

		if !auth.ValidateEmail(user.Email) {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// TODO: If email is not found or password doesn't match, return the same error
		// "Email or password is incorrect"
		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Email not found",
			})
		}

		if !auth.CheckPasswordHash(user.Password, result["password"].(string)) {
			return c.Status(400).JSON(fiber.Map{
				"error": "Passowrd doesn't match",
			})
		}

		// TODO: Generate JWT token or session token
		// research on how to generate JWT token or create a sesson in Go

		return c.JSON(fiber.Map{
			"message": "Success",
		})

	})

}
