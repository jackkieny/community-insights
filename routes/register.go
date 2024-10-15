package routes

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

		var user RegisterUser

		if err := c.BodyParser(&user); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Cannot parse JSON",
			})
		}

		if !auth.ValidateEmail(user.Email) {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid email",
			})
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err == nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Email already exists",
			})
		} else if err != mongo.ErrNoDocuments {
			return c.Status(500).JSON(fiber.Map{
				"error": "Cannot query database",
			})
		}

		hashedPassword, err := auth.HashPassword(user.Password)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Cannot hash password",
			})
		}

		_, err = collection.InsertOne(ctx, bson.M{
			"email":    user.Email,
			"password": hashedPassword,
		})
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Cannot insert user",
			})
		}

		return c.Status(201).JSON(fiber.Map{
			"message":  "Success",
			"email":    user.Email,
			"password": hashedPassword,
		})
	})
}
