package routes

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"

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
			log.Println("/api/skoollogin: Error parsing JSON:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"serverError": "Cannot parse JSON",
			})
		}

		if !auth.ValidateEmail(user.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		authToken, err := handlers.LoginToSkool(user.Email, user.Password)
		if err != nil {
			log.Println("Error in skool login request:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"serverError": "Error in skool login request. See logs.",
				"error":       "Incorrect email or password",
			})
		}

		if authToken == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Incorrect email or password",
			})
		}

		sess, err := store.Get(c)
		if err != nil {
			log.Println("/api/skoollogin: Error when retrieving the store:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when retrieving the store",
			})
		}

		userId := sess.Get("userId")
		if userId == nil {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Println("/api/skoollogin: Error when converting userId to ObjectID:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when converting userId to ObjectID",
			})
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
				}},
		)
		if err != nil {
			log.Println("/api/skoollogin: Error when updating the user's skool auth token:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when updating the user's skool auth token",
			})
		}

		var communities []handlers.Group
		communities, err = handlers.GetCommunities(authToken)
		if err != nil || communities == nil {
			log.Println("comms:", communities)
			log.Println("error:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when getting communities",
			})
		}

		_, err = collection.UpdateOne(
			ctx,
			bson.M{"_id": objectId},
			bson.M{"$set": bson.M{"communities": communities}},
		)
		if err != nil {
			log.Println("/api/skoollogin: Error when inserting communities to db:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when inserting communities to db",
			})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Success",
		})

	})
}
