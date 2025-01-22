package post

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

type SmallPost struct {
	Title    string    `bson:"title"`
	Datetime time.Time `bson:"datetime"`
}

func GetPostsRoute(app *fiber.App, store *session.Store, client *mongo.Client) {
	app.Get("/api/getposts", func(c *fiber.Ctx) error {

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

		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error converting userId to ObjectID")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.TODO(), 10*time.Second)
		defer cancel()

		var user bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&user)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error finding user")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		if user["currentCommunity"] == nil {
			log.Warn().Str("route", c.Path()).Msg("User has not selected a community")
			return c.Status(fiber.StatusBadRequest).SendString("No community selected")
		}

		currentCommunity := user["currentCommunity"].(string)

		collection = client.Database("community_insights").Collection("posts")
		ctx, cancel = context.WithTimeout(context.TODO(), 10*time.Second)
		defer cancel()

		cursor, err := collection.Find(ctx, bson.M{"community": currentCommunity})
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error while finding posts")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		var posts []SmallPost
		if err = cursor.All(ctx, &posts); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error while iterating over posts")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		return c.JSON(fiber.Map{
			"posts": posts,
		})

	})

}
