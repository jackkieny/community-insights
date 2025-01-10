package main

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	// "github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/db"
	"github.com/jackkieny/community-insights/routes"
	authenticationRoutes "github.com/jackkieny/community-insights/routes/authentication"
	skoolRoutes "github.com/jackkieny/community-insights/routes/skool"
    posts "github.com/jackkieny/community-insights/routes/post"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.ANSIC})

	client := db.Init()

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

	routes.SessionRoute(app, store)
	routes.Setup(app)

	if err := app.Listen(":5000"); err != nil {
		log.Fatal().Msgf("Error starting server: %s", err)
	}
}
