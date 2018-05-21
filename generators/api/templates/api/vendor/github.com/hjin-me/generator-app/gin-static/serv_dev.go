// +build development

package static

import (
	"github.com/gin-gonic/gin"
	"net/http/httputil"
	"net/url"
	"log"
	"html/template"
	"net/http"
	"io/ioutil"
)

var target = "http://127.0.0.1:8765/"

func ServerStatics(r *gin.Engine) {
	proxyHandler := handleRequest(target)
	r.GET("/", proxyHandler)
	r.HEAD("/", proxyHandler)
	r.OPTIONS("/", proxyHandler)
	r.GET("/static/*filepath", proxyHandler)
}

func handleRequest(target string) gin.HandlerFunc {
	u, err := url.Parse(target)
	if err != nil {
		log.Fatalln(err)
	}
	handler := httputil.NewSingleHostReverseProxy(u)
	return func(c *gin.Context) {

		handler.ServeHTTP(c.Writer, c.Request)
	}
}

func TemplateEngine() *template.Template {
	client := &http.Client{
	}

	req, err := http.NewRequest("GET", target, nil)
	req.Header.Set("Accept", "text/html")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln("webpack dev server not ok.", err)
		panic(err)
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln("webpack dev server request failed", err)
		panic(err)
	}
	//log.Println(string(b), resp.Header, target)
	t, err := template.New("main").Parse(string(b))
	if err != nil {
		log.Fatalln("parse html failed", err)
		panic(err)
	}
	return t
}
