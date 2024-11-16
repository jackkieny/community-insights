package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/rs/zerolog/log"

	"github.com/jackkieny/community-insights/auth"
	"github.com/jackkieny/community-insights/handlers"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type SkoolLoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SkoolLoginRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Use("/api/skoollogin", auth.Authenticate(store))
	app.Post("/api/skoollogin", func(c *fiber.Ctx) error {

		var user SkoolLoginUser

		if err := c.BodyParser(&user); err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error parsing request body")
			return c.Status(fiber.StatusBadRequest).SendString("Server error")
		}

		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

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

		sess, err := store.Get(c)
		if err != nil {
			log.Error().Err(err).Str("route", c.Path()).Msg("Error getting session")
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		userId := sess.Get("userId")
		if userId == nil {
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

		var communities []handlers.Group
		communities, err = handlers.GetCommunities(authToken)
		if err != nil || communities == nil {
			log.Error().Err(err).Str("route", c.Path()).Msgf("Error getting communities for user %s", user.Email)
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

		log.Info().Str("email", user.Email).Msg("Skool login successful")

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Success",
		})

	})
}
