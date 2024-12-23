package skoolRoutes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/handlers"
	"github.com/rs/zerolog/log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*** PROTECTED ***/
func RefreshCommunitiesRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Get("/api/refreshcommunities", func(c *fiber.Ctx) error {

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

		// Delete the communities from the user
		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{"$unset": bson.M{"communities": "", "currentCommunity": ""}},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error deleting communities array from user document")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Get the user
		var result bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Error().Err(err).Msg("No user found")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		// Get the communities
		var communities []handlers.Group
		communities, err = handlers.GetCommunities(result["skool_auth_token"].(string))
		if err != nil || communities == nil {
			log.Error().Err(err).Str("route", c.Path()).Msgf("Error getting communities for user %s", result["skool_email"].(string))
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Insert the new communities
		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{"$set": bson.M{"communities": communities}},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error inserting communities into database")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		return c.Status(fiber.StatusOK).SendString("Communities refreshed")
	})

}
