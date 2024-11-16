package db

import (
	"context"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Init() *mongo.Client {
	start := time.Now()

	if err := godotenv.Load(); err != nil {
		log.Fatal().Err(err).Msg("Error loading .env file")
	}

	MONGO_URI := os.Getenv("MONGO_URI")

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(MONGO_URI).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatal().Err(err).Msg("Error connecting to MongoDB")
	}

	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
		log.Fatal().Err(err).Msg("Error when trying to ping MongoDB")
	}

	elapsed := time.Since(start)

	log.Info().Msgf("Connected to MongoDB! (took %s)", elapsed)

	return client
}
