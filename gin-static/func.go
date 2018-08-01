package static

import (
	"html/template"
	"os"
	"strings"
)

var funcs = template.FuncMap{
	"split": func(s string) []string {
		return strings.Split(s, ",")
	},
	"env": os.Getenv,
}
