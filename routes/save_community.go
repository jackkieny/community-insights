package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CommunityId struct {
	CommunityId string `json:"communityId"`
}

func SaveCommunityRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Use("/api/savecommunity", auth.Authenticate(store))
	app.Post("/api/savecommunity", func(c *fiber.Ctx) error {

		var communityId CommunityId

		if err := c.BodyParser(&communityId); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

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
			bson.M{
				"$set": bson.M{
					"currentCommunity": communityId.CommunityId,
				},
			},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error saving community selection")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Success! Community seleciton saved",
		})

	})
}
