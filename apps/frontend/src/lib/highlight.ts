import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import css from "highlight.js/lib/languages/css"
import bash from "highlight.js/lib/languages/bash"
import xml from "highlight.js/lib/languages/xml"

hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("css", css)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("html", xml)

export default hljs