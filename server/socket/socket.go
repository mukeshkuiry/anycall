package socket

import (
	"fmt"
	"io"
	"net/http"

	"github.com/rs/cors"
	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) AddConn(conn *websocket.Conn) {
	fmt.Println("No of Connections: ", len(s.conns))
	fmt.Println("New Incoming connection: ", conn.RemoteAddr(), conn.Config().Location.User.Username())
	s.conns[conn] = true
	s.ReadLoop(conn)
	// fmt.Println("Connection closed: ", conn.RemoteAddr())
	// delete(s.conns, conn)
}

func (s *Server) ReadLoop(conn *websocket.Conn) {
	buf := make([]byte, 1024)
	for {
		// get id of the sender
		id := conn.RemoteAddr().String()
		data := conn.Config().Origin
		fmt.Println("Data: ", data)
		// read message from the sender
		fmt.Println("Id: ", id)

		n, err := conn.Read(buf)
		if err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println("Error reading: ", err)
			continue
		}

		msg := buf[:n]
		fmt.Println("Read: ", string(msg))
		s.BroadcastAll(string(msg))
		// conn.Write([]byte("Reply from Server :)"))
	}
}

func (s *Server) BroadcastAll(mssg string) {
	for conn := range s.conns {
		conn.Write([]byte(mssg))
	}
}

func main() {
	server := NewServer()
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	http.Handle("/chat", c.Handler(websocket.Handler(server.AddConn)))

	fmt.Println("Server started at :2003")
	http.ListenAndServe(":2003", nil)
}
