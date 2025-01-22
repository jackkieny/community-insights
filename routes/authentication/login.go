package authenticationRoutes

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Post("/api/login", func(c *fiber.Ctx) error {

		// Parse the request body
		var user LoginUser
		if err := c.BodyParser(&user); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Validate email
		user.Email = strings.ToLower(user.Email)
		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		// Database setup
		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Find the user
		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}

		// Validate password
		if !auth.CheckPasswordHash(user.Password, result["password"].(string)) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email or password is incorrect",
			})
		}

		// Get the session
		sess, err := store.Get(c)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Convert ObjectID to string
		userId := result["_id"].(primitive.ObjectID).Hex()

		// Create the session
		sess.Set("userId", userId)
		if err := sess.Save(); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error saving session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		return c.JSON(fiber.Map{
			"message": "Success",
		})
	})
}
