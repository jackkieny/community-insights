package skoolRoutes

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

type SkoolLoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

/*** PROTECTED ***/
func SkoolLoginRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Post("/api/skoollogin", func(c *fiber.Ctx) error {

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
		var user SkoolLoginUser
		if err := c.BodyParser(&user); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		// Validate email
		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		// Login to Skool
		authToken, err := handlers.LoginToSkool(user.Email, user.Password)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error logging into Skool")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Incorrect email or password",
			})
		}

		if authToken == "" {
			log.Warn().Str("route", c.Path()).Msg("Skool login returned empty auth token")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Incorrect email or password",
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
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Update the user's Skool auth token
		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{
				"$set": bson.M{
					"skool_email":      user.Email,
					"skool_password":   user.Password,
					"skool_auth_token": authToken,
				},
			},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error updating user's Skool auth token")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Use the auth token to get the user's communities
		var communities []handlers.Group
		communities, err = handlers.GetCommunities(authToken)
		if err != nil || communities == nil {
			log.Error().Err(err).Str("route", c.Path()).Msgf("Error getting communities for user %s", user.Email)
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Insert the communities
		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{"$set": bson.M{"communities": communities}},
		)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error inserting communities into database")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// Log the user logged into Skool
		log.Info().Str("email", user.Email).Msg("Skool login successful")

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Success",
		})

	})
}
