package auth

func ValidatePassword(password string) bool {
    if len(password) < 8 {
        return false
    }

    hasLower := false
    hasUpper := false
    hasNumber := false
    hasSpecial := false

    for _, char := range password {
        if char >= 'a' && char <= 'z' {
            hasLower = true
        } else if char >= 'A' && char <= 'Z' {
            hasUpper = true
        } else if char >= '0' && char <= '9' {
            hasNumber = true
        } else {
            hasSpecial = true
        }
    }

    return hasLower && hasUpper && hasNumber && hasSpecial

}
