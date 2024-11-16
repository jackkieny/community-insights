package routes

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackkieny/community-insights/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
    "github.com/rs/zerolog/log"
)

type RequestAccessUser struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	WhatsappNumber string `json:"whatsappNumber"`
	CommunityLink  string `json:"communityLink"`
	Revenue        string `json:"revenue"`
}

func RequestAccessRoute(app *fiber.App, client *mongo.Client) {
	app.Post("/api/requestaccess", func(c *fiber.Ctx) error {

		var user RequestAccessUser

		if err := c.BodyParser(&user); err != nil {
            log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
        }

		if user.Name == "" || user.Email == "" || user.CommunityLink == "" || user.Revenue == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Missing required fields",
			})
		}

		user.Email = strings.ToLower(user.Email)

		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		collection := client.Database("community_insights").Collection("requestAccess")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var result bson.M
		err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&result)
		if err == nil {
            log.Warn().Str("route", c.Path()).Str("email", user.Email).Msg("User already requested access")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "User already requested access",
			})
		}

		_, err = collection.InsertOne(ctx, bson.M{
			"name":           user.Name,
			"email":          user.Email,
			"whatsappNumber": user.WhatsappNumber,
			"communityLink":  user.CommunityLink,
			"revenue":        user.Revenue,
		})
		if err != nil {
            log.Error().Err(err).Str("route", c.Path()).Msg("Error inserting user into database")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
        }

        log.Info().Str("email", user.Email).Msg("Request created")

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Request created",
		})
	})
}
