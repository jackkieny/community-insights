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

type Label struct {
	ID          string `bson:"id"`
	DisplayName string `bson:"displayname"`
}

type Community struct {
	ID     string  `bson:"id"`
	Labels []Label `bson:"labels"`
}

type User struct {
	Communities      []Community `bson:"communities"`
	CurrentCommunity string      `bson:"currentCommunity"`
}

/*** PROTECTED ***/
func GetLabelsRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Get("/api/getlabels", func(c *fiber.Ctx) error {

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
		var result User
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Error().Err(err).Msg("No communities found")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		// Check if the user has selected a community
		if result.CurrentCommunity == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "No current community found",
			})
		}

		// Get the labels
		var labels []Label
		for _, community := range result.Communities {
			if community.ID == result.CurrentCommunity {
				labels = community.Labels
				break
			}
		}

		// Return the labels
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"labels": labels,
		})

	})

}
