package main

import (
	"git.avlyun.org/inf/go-pkg/statics"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"os"
)

func main() {
	r := gin.Default()
	r.Use(gzip.Gzip(gzip.BestCompression))
	statics.ServerStatics(r)
	if os.Getenv("GIN_MODE") == "release" {
		r.Run(":8080") // listen and serve on 0.0.0.0:8443
	} else {
		r.Run("127.0.0.1:8080") // listen and serve on 0.0.0.0:8443
	}
}
