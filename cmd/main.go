package main

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jackkieny/community-insights/db"
	"github.com/jackkieny/community-insights/routes"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.ANSIC})

	client := db.Init()

	app := fiber.New()
	store := session.New()

	routes.SessionRoute(app, store)
	routes.LoginRoute(app, client, store)
	routes.RegisterRoute(app, client)
	routes.LogoutRoute(app, store)
	routes.RequestAccessRoute(app, client)
	routes.SkoolLoginRoute(app, client, store)
	routes.SkoolLoginCheckRoute(app, client, store)
	routes.Setup(app)

	if err := app.Listen(":5000"); err != nil {
		log.Fatal().Msgf("Error starting server: %s", err)
	}
}
