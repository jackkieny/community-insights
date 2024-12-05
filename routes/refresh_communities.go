package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
	"github.com/jackkieny/community-insights/handlers"
	"github.com/rs/zerolog/log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RefreshCommunitiesRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Use("/api/refreshcommunities", auth.Authenticate(store))
	app.Get("/api/refreshcommunities", func(c *fiber.Ctx) error {

		sess, err := store.Get(c)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		userId := sess.Get("userId")
		if userId == nil {
			log.Warn().Str("route", c.Path()).Msg("Unauthorized access attempt")
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error converting userId to ObjectID")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{"$unset": bson.M{"communities": "", "currentCommunity": ""}},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error deleting communities array from user document")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		var result bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Error().Err(err).Msg("No user found")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		var communities []handlers.Group
		communities, err = handlers.GetCommunities(result["skool_auth_token"].(string))
		if err != nil || communities == nil {
			log.Error().Err(err).Str("route", c.Path()).Msgf("Error getting communities for user %s", result["skool_email"].(string))
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

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
