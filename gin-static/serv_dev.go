// +build development

package static

import (
	"html/template"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"net/url"

	"bytes"
	"fmt"
	"git.avlyun.org/inf/go-pkg/logex"
	"github.com/gin-gonic/gin"
	"strings"
)

var target = "http://127.0.0.1:8765/"

func ServerStatics(r *gin.Engine) {
	proxyHandler := handleRequest(target)
	r.GET("/", proxyHandler)
	r.HEAD("/", proxyHandler)
	r.OPTIONS("/", proxyHandler)
	r.GET("/static/*filepath", proxyHandler)
	r.NoRoute(proxyHandler)
}

func handleRequest(target string) gin.HandlerFunc {
	u, err := url.Parse(target)
	if err != nil {
		logex.Fatal(err)
	}
	handler := httputil.NewSingleHostReverseProxy(u)
	handler.ModifyResponse = func(r *http.Response) error {
		cType := r.Header.Get("content-type")
		if strings.Index(cType, "text/html") == 0 {
			logex.Debug(cType, "this is html")
			b, err := ioutil.ReadAll(r.Body)
			if err != nil {
				logex.Warningf("read backend html failed. [%v]", err)
				return err
			}

			t, err := template.New("main").Funcs(funcs).Parse(string(b))
			if err != nil {
				logex.Warningf("html parse failed. [%v]", err)
				return err
			}

			var w bytes.Buffer
			err = t.Execute(&w, nil)
			if err != nil {
				logex.Warningf("exec template failed. [%v]", err)
				return err
			}

			rc := ioutil.NopCloser(&w)
			r.Body = rc
			r.Header.Set("content-length", fmt.Sprintf("%d", w.Len()))

		}
		return nil
	}
	return func(c *gin.Context) {

		handler.ServeHTTP(c.Writer, c.Request)
	}
}
