package main

import (
	"context"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	// "github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/session"
	mq "github.com/jackkieny/community-insights/broker"
	"github.com/jackkieny/community-insights/db"
	"github.com/jackkieny/community-insights/routes"
	authenticationRoutes "github.com/jackkieny/community-insights/routes/authentication"
	posts "github.com/jackkieny/community-insights/routes/post"
	skoolRoutes "github.com/jackkieny/community-insights/routes/skool"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.ANSIC})

	client := db.Init()
	broker := mq.Init()

	// createQueue, err := mq.SetupQueue(broker, "createQueue")
	// if err != nil {
	// 	log.Fatal().Msgf("Failed to setup the \"create\" queue: %s", err)
	// }

	// deleteQueue, err := mq.SetupQueue(broker, "deleteQueue")
	// if err != nil {
	// 	log.Fatal().Msgf("Failed to setup the \"delete\" queue: %s", err)
	// }

	app := fiber.New()
	store := session.New()

	// rateLimitConfig := limiter.Config{
	// 	Max:        10,
	// 	Expiration: 1 * time.Minute,
	// }

	// app.Use(limiter.New(rateLimitConfig))

	authenticationRoutes.LoginRoute(app, client, store)
	authenticationRoutes.RegisterRoute(app, client)
	authenticationRoutes.LogoutRoute(app, store)
	authenticationRoutes.RequestAccessRoute(app, client)

	skoolRoutes.SkoolLoginRoute(app, client, store)
	skoolRoutes.SkoolLoginCheckRoute(app, client, store)
	skoolRoutes.GetCommunitiesRoute(app, client, store)
	skoolRoutes.SaveCommunityRoute(app, client, store)
	skoolRoutes.GetLabelsRoute(app, client, store)
	skoolRoutes.RefreshCommunitiesRoute(app, client, store)

	posts.CreatePostRoute(app, store, client)
	posts.GetPostsRoute(app, store, client)

	routes.SessionRoute(app, store)
	routes.Setup(app)

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatal().Msgf("Error disconnecting from MongoDB: %s", err)
		}
		if err := broker.Close(); err != nil {
			log.Fatal().Msgf("Error disconnecting from RabbitMQ: %s", err)
		}
	}()

	if err := app.Listen(":5000"); err != nil {
		log.Fatal().Msgf("Error starting server: %s", err)
	}
}
