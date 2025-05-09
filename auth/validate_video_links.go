package auth

import "regexp"

func ValidateVideoLink(videoLinks []string) bool {
	patterns := map[string]*regexp.Regexp{
		"youtube": regexp.MustCompile(`^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$`),
		"vimeo":   regexp.MustCompile(`^https:\/\/(www\.)?vimeo\.com\/.+$`),
		"loom":    regexp.MustCompile(`^https:\/\/(www\.)?loom\.com\/.+$`),
		"wistia":  regexp.MustCompile(`^https:\/\/([a-zA-Z0-9]+)\.wistia\.com\/`),
	}

	var valid bool

	for _, link := range videoLinks {
		valid = false
		for _, pattern := range patterns {
			if pattern.MatchString(link) {
				valid = true
				break
			}
		}
		if !valid {
			return false
		}
	}

	return valid
}
