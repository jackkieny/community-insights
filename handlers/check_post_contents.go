package handlers

import (
	"time"

	"github.com/jackkieny/community-insights/auth"
	"github.com/rs/zerolog/log"
)

func CheckPostContents(title, content, label string, datetime time.Time, videoLinks, pollOptions []string, pollSelected bool) bool {

	if title == "" || label == "" || datetime.IsZero() {
		log.Warn().Str("handler", "CheckPostContents").Msg("Title, label, or datetime is empty")
		return false
	}

	if len(videoLinks) == 0 && content == "" {
		log.Warn().Str("handler", "CheckPostContents").Msg("Content cannot be empty if no video links are provided")
		return false
	}

	if len(videoLinks) > 0 {
		if !auth.ValidateVideoLink(videoLinks) {
			log.Warn().Str("handler", "CheckPostContents").Msg("Invalid video link")
			return false
		}
	}

	if pollSelected && len(pollOptions) <= 2 {
		for key, option := range pollOptions {
			if option == "" {
				log.Warn().Str("handler", "CheckPostContents").Msgf("Poll option %d is empty", key+1)
				return false
			}
		}
	}

	return true
}
