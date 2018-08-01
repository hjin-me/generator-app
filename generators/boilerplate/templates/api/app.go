package main

import (
	"github.com/gin-gonic/gin"
	"github.com/hjin-me/generator-app/gin-static"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	static.ServerStatics(r)
	r.Run(":8787") // listen and serve on 0.0.0.0:8787
}
