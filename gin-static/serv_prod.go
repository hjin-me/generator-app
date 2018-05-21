// +build !development

package static

import (
	"github.com/gin-gonic/gin"
	"os"
	"path"
	"io/ioutil"
	"html/template"
	"log"
)

func ServerStatics(r *gin.Engine) {
	projectName := os.Getenv("PROJECT_NAME")
	r.StaticFile("/", path.Join("/var/www/static/", projectName, "index.html"))
	r.Static("/static", "/var/www/static")
}

func TemplateEngine() *template.Template {
	projectName := os.Getenv("PROJECT_NAME")
	b, err := ioutil.ReadFile(path.Join("/var/www/static/", projectName, "index.html"))
	if err != nil {
		log.Fatalln("read index.html failed", err)
		panic(err)
	}
	t, err := template.New("main").Parse(string(b))
	if err != nil {
		log.Fatalln("parse html failed", err)
		panic(err)
	}
	return t
}
