// +build !development

package static

import (
	"os"
	"path"

	"github.com/gin-gonic/gin"
	"io/ioutil"
	"html/template"
	"git.avlyun.org/inf/go-pkg/logex"
	"net/http"
)

func serveIndex( c *gin.Context){
	c.HTML(http.StatusOK, "index", nil)
}

func ServerStatics(r *gin.Engine) {
	r.SetHTMLTemplate(templateEngine())
	r.GET("/", serveIndex)
	r.HEAD("/", serveIndex)
	r.Static("/static", "/var/www/static")
	r.NoRoute(serveIndex)
}

func templateEngine() *template.Template {
	projectName := os.Getenv("PROJECT_NAME")
	b, err := ioutil.ReadFile(path.Join("/var/www/static/", projectName, "index.html"))
	if err != nil {
		logex.Fatal("read index.html failed", err)
		panic(err)
	}
	t, err := template.New("index").Funcs(funcs).Parse(string(b))
	if err != nil {
		logex.Fatal("parse html failed", err)
		panic(err)
	}
	return t
}
