from BaseHTTPServer import HTTPServer
from BaseHTTPServer import BaseHTTPRequestHandler
import json

class MyReqHandler(BaseHTTPRequestHandler):
    fields = {}
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers(  ) 
        if (self.path == '/tetris.html' or
            self.path == '/tetris' or
            self.path == '/tetris.js' or
            self.path == '/tetris.css' or
            self.path == '/ajax.html' or
            self.path == '/json2.js' or
            self.path == '/ajax.js'):
            f = open('.'+self.path)
            content = f.read()
            self.wfile.write(content)
        elif (self.path == '/ajaxresponse'):
            self.wfile.write("This is an ajax response")
        else:
            self.wfile.write("<html><body>")
            self.wfile.write("<b>Hello</b>")
            self.wfile.write(self.path)
            self.wfile.write("</html></body>")

    def do_POST(self):        
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers(  ) 
        if (self.path == '/tetrisupdate'):
            if self.headers.dict.has_key("content-length"):
                content_length = int(self.headers.dict["content-length"])
                raw_post_data = self.rfile.read(content_length)
                data = json.loads(raw_post_data)
                self.wfile.write(data["update"]["field"])
               

        else:
        
            self.wfile.write("<html><body>")
            self.wfile.write("<b>Post Data:</b><br>")

            if self.headers.dict.has_key("content-length"):
                content_length = int(self.headers.dict["content-length"])
                raw_post_data = self.rfile.read(content_length)
                self.wfile.write(raw_post_data)

httpd = HTTPServer(('', 8000), MyReqHandler)
while True:
    httpd.handle_request();
