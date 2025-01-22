package broker

import (
	"context"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func SetupQueue(conn *amqp.Connection, queueName string) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	_, err = ch.QueueDeclare(
		"ping", // name
		false,  // durable
		false,  // delete when unused
		false,  // exclusive
		false,  // no-wait
		nil,    // arguments
	)
	if err != nil {
		return nil, err
	}
	return ch, nil
}

func Init() *amqp.Connection {
	start := time.Now()

	// Connect to RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal().Msgf("Failed to connect to RabbitMQ: %s", err)
	}
	defer conn.Close()

	// Create a ping queue channel
	pingQueue, err := SetupQueue(conn, "ping")
	if err != nil {
		log.Fatal().Msgf("Failed to setup the ping queue: %s", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Use the ping queue to send a message to the new ping queue
	err = pingQueue.PublishWithContext(ctx,
		"",     // exchange
		"ping", // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte("ping"),
		},
	)
	if err != nil {
		log.Fatal().Msgf("Failed to publish a message: %s", err)
	}

	// Setup a consumer to listen for messages on the ping queue
	msgs, err := pingQueue.Consume(
		"ping", // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatal().Msgf("Failed to register a consumer: %s", err)
	}

	for msg := range msgs {
		log.Info().Msgf("Message received: %s", msg.Body)
		break
	}

	// Delete the ping queue
	_, err = pingQueue.QueueDelete("ping", false, false, false)
	if err != nil {
		log.Fatal().Msgf("Failed to delete the ping queue: %s", err)
	}

	elapsed := time.Since(start)

	log.Info().Msgf("Connected to RabbitMQ! (took %.3fs)", elapsed.Seconds())
	return conn
}
