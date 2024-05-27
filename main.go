package main

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func main() {
	// Echo instance
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	environ := "DEV"
	e := echo.New()
	if environ == "PROD" {
		logFilePath := fmt.Sprintf("/var/log/athena/%s.txt", time.Now().Format(time.RFC3339))
		logFile, err := os.Create(logFilePath)
		if err != nil {
			e.Logger.Fatalf("Could not open Log file %s, %s", logFilePath, err)
		}
		e.Logger.SetOutput(logFile)
		e.Logger.SetLevel(log.INFO)
	} else {
		e.Use(middleware.Logger())
	}
	// Middleware
	e.Use(middleware.Recover())
	e.Static("static", "static")
	e.File("/", "map/map.html")
	e.File("/map.js", "map/map.js")
	e.File("/game", "ballmover/game.html")
	e.File("/game.js", "ballmover/game.js")
	e.File("/game.js", "ballmover/game.js")
	e.File("/sleepspots.geojson", "map/sleepspots.geojson")
	// Routes
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", "8080")))
}
