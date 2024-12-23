package skoolRoutes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*** PROTECTED ***/
func SkoolLoginCheckRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Get("/api/skoollogincheck", func(c *fiber.Ctx) error {

		// Get the session
		sess, err := store.Get(c)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Check user is logged in
		userId := sess.Get("userId")
		if userId == nil {
			log.Warn().Str("route", c.Path()).Str("IP", c.IP()).Msg("Unauthorized access attempt")
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		// Convert userId to ObjectID
		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error converting userId to ObjectID")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Database setup
		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Get the user
		var result bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error finding user in database")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		// Check if user is logged into Skool
		if result["skool_email"] == nil || result["skool_password"] == nil || result["skool_auth_token"] == nil {
			log.Warn().Str("route", c.Path()).Msg("User not logged into Skool")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Not logged in",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message":   "Logged in already",
			"userEmail": result["skool_email"],
		})
	})
}
