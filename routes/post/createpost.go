package post

import (
	// "context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/handlers"
	"github.com/rs/zerolog/log"

	// "go.mongodb.org/mongo-driver/bson/primitive"
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
		fmt.Println(post)

		// // Convert userId to ObjectID
		// objectId, err := primitive.ObjectIDFromHex(userId.(string))
		// if err != nil {
		// 	log.Error().Err(err).Str("route", c.Path()).Msg("Error converting userId to ObjectID")
		// 	return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		// }

		// // Database setup
		// collection := client.Database("community_insights").Collection("posts")
		// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		// defer cancel()

		// // Insert post into database
		// _, err = collection.InsertOne(ctx, post)

		return c.Status(fiber.StatusCreated).SendString("Post created")
	})
}
