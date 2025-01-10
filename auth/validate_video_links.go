package auth

import "regexp"

func ValidateVideoLink(videoLinks []string) bool {
	patterns := map[string]*regexp.Regexp{
		"youtube": regexp.MustCompile(`^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$`),
		"vimeo":   regexp.MustCompile(`^https:\/\/(www\.)?vimeo\.com\/.+$`),
		"loom":    regexp.MustCompile(`^https:\/\/(www\.)?loom\.com\/.+$`),
		"wistia":  regexp.MustCompile(`^https:\/\/([a-zA-Z0-9]+)\.wistia\.com\/`),
	}

	for _, videoLink := range videoLinks {
		for _, pattern := range patterns {
			if pattern.MatchString(videoLink) {
				return true
			}
		}
	}
	return false
}
