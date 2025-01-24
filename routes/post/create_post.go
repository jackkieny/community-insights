package post

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

type Post struct {
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	Label        string    `json:"label"`
	Datetime     time.Time `json:"datetime"`
	Action       bool      `json:"action"`
	VideoLinks   []string  `json:"video_links"`
	PollSelected bool      `json:"poll_selected"`
	PollOptions  []string  `json:"poll_options"`
}

func CreatePostRoute(app *fiber.App, store *session.Store, client *mongo.Client) {
	app.Post("/api/createpost", func(c *fiber.Ctx) error {

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

		// Parse the request body
		var post Post
		if err := c.BodyParser(&post); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Check post contents
		if !handlers.CheckPostContents(post.Title, post.Content, post.Label, post.Datetime, post.VideoLinks, post.PollOptions, post.PollSelected) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid post",
			})
		}

		// Convert userId to ObjectID
		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error converting userId to ObjectID")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Database setup
		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.TODO(), 10*time.Second)
		defer cancel()

		// Get the currentCommunity
		var result bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error finding user")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Check if the user has a currentCommunity
		var currentCommunity, authToken string
		if result["currentCommunity"] == nil {
			log.Warn().Str("route", c.Path()).Msg("User has not selected a community")
			return c.Status(fiber.StatusBadRequest).SendString("No community selected")
		} else {
			currentCommunity = result["currentCommunity"].(string)
			authToken = result["skool_auth_token"].(string)
		}

		// Create the poll (if exists)
		var pollId string
		if post.PollSelected {
			pollId, err = handlers.CreatePoll(post.PollOptions, currentCommunity, authToken)
			if err != nil {
				log.Error().Err(err).Str("route", c.Path()).Msg("Error creating poll")
				return c.Status(fiber.StatusBadRequest).SendString("Error creating poll")
			}
			log.Info().Str("route", c.Path()).Msgf("Poll created with id %s", pollId)
		}

		// Create the post
		collection = client.Database("community_insights").Collection("posts")
		ctx, cancel = context.WithTimeout(context.TODO(), 10*time.Second)
		defer cancel()

		postData := bson.M{
			"community": currentCommunity,
			"title":     post.Title,
			"content":   post.Content,
			"label":     post.Label,
			"datetime":  post.Datetime,
			"action":    post.Action,
		}
		if len(post.VideoLinks) != 0 {
			postData["video_links"] = post.VideoLinks
		}
		if post.PollSelected {
			postData["poll_id"] = pollId
		}

		_, err = collection.InsertOne(ctx, postData)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error inserting post")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Queue the post via RabbitMQ

		return c.Status(fiber.StatusCreated).SendString("Post created")
	})
}
