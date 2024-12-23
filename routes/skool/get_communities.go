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
func GetCommunitiesRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Get("/api/getcommunities", func(c *fiber.Ctx) error {

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
			log.Error().Err(err).Msg("No communities found")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		// Return the communities and current community
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"communities":      result["communities"],
			"currentCommunity": result["currentCommunity"],
		})

	})

}
