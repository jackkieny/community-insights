package routes

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/auth"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func SkoolLoginCheckRoute(app *fiber.App, client *mongo.Client, store *session.Store) {
	app.Use("/api/skoollogincheck", auth.Authenticate(store))
	app.Get("/api/skoollogincheck", func(c *fiber.Ctx) error {
		log.Println("Checking if user has logged into Skool")

		sess, err := store.Get(c)
		if err != nil {
			log.Println("Error when retrieving the store:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when retrieving the store",
			})
		}

		userId := sess.Get("userId")
		if userId == nil {
			log.Println("Unauthorized")
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		objectId, err := primitive.ObjectIDFromHex(userId.(string))
		if err != nil {
			log.Println("Error when converting userId to ObjectID:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error when converting userId to ObjectID",
			})
		}

		collection := client.Database("community_insights").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var result bson.M
		err = collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&result)
		if err != nil {
			log.Println("Error finding user in database:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Error finding user in database",
			})
		}

		if result["skool_email"] == nil || result["skool_password"] == nil {
			log.Println("User is not logged into Skool", err, userId)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Not logged in",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message":   "Logged in already",
			"userEmail": result["skool_email"],
		})
	})
}
